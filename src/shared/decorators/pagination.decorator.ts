import { createParamDecorator } from "@nestjs/common"
import { IPaginationInterface } from "../../core/interfaces"

export interface IQueryFilters {
  [key: string]: any
  like: {}
  not: {}
  lt: {}
  lte: {}
  gt: {}
  gte: {}
}

export const Pagination = createParamDecorator<string[]>(
  (data, req): IPaginationInterface => {
    const reqQuery = req.args[0].query
    const query = {
      ...(reqQuery as any),
      page: reqQuery.page ? reqQuery.page : 1,
      limit: reqQuery.limit ? reqQuery.limit : 20,
    }

    const filters = reqQuery.filter

    return {
      limit: query.limit,
      page: query.page,
      sortField: query.sortField,
      sort: query.sort,
      skip: query.limit * (query.page - 1),
      searchString: query.searchString,
      searchableFields: data,
      filters,
    } as IPaginationInterface
  },
)
