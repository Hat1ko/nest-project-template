import { HttpException } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { ClassType } from 'class-transformer/ClassTransformer'
import {
    Brackets,
    DeepPartial,
    DeleteResult,
    EntityManager,
    FindConditions,
    FindManyOptions,
    FindOneOptions,
    In,
    ObjectID,
    QueryFailedError,
    Repository,
    SelectQueryBuilder,
} from 'typeorm'
import { notFoundException } from '../core/constants'
import { IPaginationInterface, IPaginationResult } from '../core/interfaces'
import { IQueryFilters } from '../shared/decorators'
import { removeNulls } from '../shared/helpers'
import { objMap } from '../shared/helpers'

export class ExtendedRepository<E> extends Repository<E> {
    async isAlreadyExist(conditions: FindConditions<E> | Array<FindConditions<E>>) {
        const existingCount = await this.count({
            where: conditions,
        })
        return existingCount > 0
    }

    async isAlreadyExistOrError(conditions: FindConditions<E> | Array<FindConditions<E>>) {
        if (await this.isAlreadyExist(conditions))
            throw new HttpException(
                `Similar object of '${this.metadata.tableName}' is already exist`,
                409,
            )
    }

    async is(id: string, conditions: FindConditions<E>): Promise<boolean> {
        return (await this.count({ id, ...conditions })) > 0
    }

    async safeCreate(dto: DeepPartial<E>, entityManager?: EntityManager): Promise<E> {
        if (entityManager) {
            const insertResult = await entityManager.insert<E>(
                this.metadata.targetName,
                this.merge(this.create(), dto),
            )
            return await entityManager.findOne(this.metadata.targetName, insertResult.identifiers[0].id)
        } else {
            return this.save(this.merge(this.create(), dto))
        }
    }

    async store(dto: E | DeepPartial<E>, entityManager?: EntityManager): Promise<E> {
        if (entityManager) {
            const insertResult = await entityManager.insert<E>(this.metadata.targetName, dto)
            return await entityManager.findOne<E>(
                this.metadata.targetName,
                insertResult.identifiers[0].id,
            )
        } else {
            // @ts-ignore
            return await super.save(dto)
        }
    }

    async storeMany(dto: E | DeepPartial<E> | E[], entityManager: EntityManager): Promise<E[]> {
        if (entityManager) {
            const insertResult = await entityManager.insert<E>(this.metadata.targetName, dto)
            return await entityManager.find<E>(this.metadata.targetName, {
                where: {
                    id: In(insertResult.identifiers.map(identifier => identifier.id as number)),
                },
            })
        } else {
            // @ts-ignore
            return await super.save(dto)
        }
    }

    async safeUpdate(entity: DeepPartial<E> | E, updatingData: DeepPartial<E>) {
        return await this.save(this.merge(entity as E, removeNulls(updatingData)))
    }

    async findOneOrError(
        conditions: string | number | ObjectID | FindConditions<E>,
        options?: FindOneOptions<E>,
    ): Promise<E> {
        try {
            return await super.findOneOrFail(conditions as any, options)
        } catch (e) {
            if (e.name === 'EntityNotFound') throw notFoundException(this.metadata.targetName)
            else throw e
        }
    }

    async delete(
        criteria:
            | string
            | string[]
            | number
            | number[]
            | Date
            | Date[]
            | ObjectID
            | ObjectID[]
            | FindConditions<E>,
        entityManager?: EntityManager,
    ): Promise<DeleteResult> {
        if (entityManager) {
            return await entityManager.delete<E>(this.metadata.targetName, criteria)
        } else {
            return await super.delete(criteria)
        }
    }

    async find(options?: FindManyOptions<E>, entityManager?: EntityManager): Promise<E[]> {
        if (entityManager) {
            return await entityManager.find<E>(this.metadata.targetName, options)
        } else {
            return await super.find(options)
        }
    }

    /** Pagination START */

    private addFilters(query: SelectQueryBuilder<E>, filters: IQueryFilters) {
        const operators = {
            like: {},
            not: {},
            lt: {},
            lte: {},
            gt: {},
            gte: {},
        }

        const merge = (target, trnasform?: (value: any) => any) => {
            const result = {}
            // tslint:disable-next-line: forin
            for (let key in target) {
                const isOperator = Object.keys(operators).some(operatorKey => operatorKey === key)
                if (target[key] && !isOperator) {
                    if (typeof target[key] === 'object') result[key] = merge(target[key], trnasform)
                    else result[key] = trnasform ? trnasform(target[key]) : target[key]
                }
            }
            return result
        }

        objMap(
            merge(filters),
            (key, value) => (query = query.andWhere(`${this.metadata.tableName}.${key} = ${value}`)),
        )

        return query
    }

    private addSearch(
        query: SelectQueryBuilder<E>,
        searchString: string,
        fieldsPairs: string[],
    ): SelectQueryBuilder<E> {
        if (searchString && fieldsPairs && fieldsPairs.length > 0) {
            const keyword = `%${searchString}%`
            query = query.andWhere(
                new Brackets(qb => {
                    qb.where(`${fieldsPairs[0]} ILIKE :keyword`, { keyword })
                    for (let i = 1; i < fieldsPairs.length; i++)
                        qb.orWhere(`${fieldsPairs[i]} ILIKE :keyword`, { keyword })
                }),
            )
        }
        return query
    }

    private async getManyAndPaginate(
        oldQuery: SelectQueryBuilder<E>,
        pagination: IPaginationInterface,
    ): Promise<[E[], number]> {
        let query = oldQuery.skip(pagination.skip).take(pagination.limit)

        if (pagination.sortField) {
            const sort: 'ASC' | 'DESC' = pagination.sort === 'ASC' ? 'ASC' : 'DESC'
            query = query.orderBy(pagination.sortField, sort)
        }

        query = this.addFilters(query, pagination.filters)

        query = this.addSearch(query, pagination.searchString, pagination.searchableFields)

        const [items, count] = await query.getManyAndCount()
        return [items, count]
    }

    public async paginate(
        query: SelectQueryBuilder<E>,
        pagination: IPaginationInterface,
    ): Promise<IPaginationResult<E>> {
        try {
            const [items, count] = await this.getManyAndPaginate(query, pagination)
            return {
                count,
                items,
            } as IPaginationResult<E>
        } catch (e) {
            if (e instanceof QueryFailedError) return { count: 0, items: [] } as IPaginationResult<E>
            else throw e
        }
    }

    public async paginateAndTransform<T>(
        query: SelectQueryBuilder<E>,
        pagination: IPaginationInterface,
        transformClass: ClassType<T>,
    ): Promise<IPaginationResult<T>> {
        try {
            const [items, count] = await this.getManyAndPaginate(query, pagination)
            return {
                count,
                items: items.map(el => plainToClass(transformClass, el)),
            } as IPaginationResult<T>
        } catch (e) {
            if (e instanceof QueryFailedError) return { count: 0, items: [] } as IPaginationResult<T>
            else throw e
        }
    }

    /** Pagination END */
}
