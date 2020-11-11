import { IQueryFilters } from '../../../../shared/decorators'

export interface IPaginationInterface {
  limit: number
  page: number
  sortField: string
  sort: string
  skip: number
  searchString?: string
  searchableFields: string[]
  filters: IQueryFilters
}

export interface IPaginationResult<I> {
  count: number
  items: I[]
}
