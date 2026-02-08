import homePage from './homePage'
import aboutPage from './aboutPage'
import contactPage from './contactPage'

import productCategory from './productCategory'
import product from './product'

import partner from './partner'
import teamMember from './teamMember'

import realization from './realization'
import realizationTagKey from './realizationTagKey'

import faqItem from './faqItem'

import {localizedString, localizedText, localizedBlockContent, blockContent} from './l10n'
import article from './article'
import articleTag from './articleTag'
import articlesPage from './articlesPage'

export const schemaTypes = [
  // localized field types
  localizedString,
  localizedText,
  blockContent,
  localizedBlockContent,

  // object types
  faqItem,

  // documents
  homePage,
  aboutPage,
  contactPage,
  productCategory,
  product,
  partner,
  teamMember,
  realizationTagKey,
  articleTag,
  articlesPage,
  realization,
  article
]
