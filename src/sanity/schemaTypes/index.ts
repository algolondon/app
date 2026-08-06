import { type SchemaTypeDefinition } from 'sanity'
import { homePageType } from './homePage'
import { indicatorType } from './indicator'
import { courseType } from './course'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePageType, indicatorType, courseType],
}
