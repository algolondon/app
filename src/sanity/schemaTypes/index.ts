import { type SchemaTypeDefinition } from 'sanity'
import { homePageType } from './homePage'
import { indicatorType } from './indicator'
import { courseType } from './course'
import { legalPageType } from './legalPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePageType, indicatorType, courseType, legalPageType],
}

