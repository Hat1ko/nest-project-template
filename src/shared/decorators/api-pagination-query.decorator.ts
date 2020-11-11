import { applyDecorators } from './'
import { ApiQuery } from '@nestjs/swagger'

export function DocPagination(
  sortingFields?: string[],
  searchingFields?: string[],
): MethodDecorator {
  const searchingFieldsDescription = `Searching by: ${
    searchingFields ? searchingFields.join(', ') : null
  }`
  return applyDecorators(
    ApiQuery({ name: 'limit', type: Number, required: false }),
    ApiQuery({ name: 'page', type: Number, required: false }),
    ApiQuery({ name: 'sortField', type: String, required: false, enum: sortingFields }),
    ApiQuery({ name: 'sort', type: String, description: 'ASC | DESC', required: false }),
    ApiQuery({
      name: 'searchString',
      type: String,
      description: searchingFieldsDescription,
      required: false,
    }),
  )
}

// export const ApiImplictPagination = applyDecorators(
// 	ApiImplicitQuery({ name: 'limit', type: Number, required: false }),
// 	ApiImplicitQuery({ name: 'page', type: Number, required: false }),
// 	ApiImplicitQuery({ name: 'sortField', type: String, required: false }),
// 	ApiImplicitQuery({ name: 'sort', type: String, description: 'ASC | DESC', required: false }),
// )
