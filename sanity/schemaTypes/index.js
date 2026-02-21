import homePage from './homePage'
import aboutPage from './aboutPage'
import contactPage from './contactPage'

import productCategory from './productCategory'
import product from './product'

import partner from './partner'
import teamMember from './teamMember'

import realization from './realization'
import realizationTagKey from './realizationTagKey'
import realizationTag from './realizationTag'

import faqItem from './faqItem'
import slidingCommonProfile from './slidingCommonProfile'
import slidingCommonThreshold from './slidingCommonThreshold'
import slidingCommonUsage from './slidingCommonUsage'
import slidingSpecialHighlight from './slidingSpecialHighlight'

import {localizedString, localizedText, localizedBlockContent, blockContent, localizedSlug} from './l10n'
import article from './article'
import articleTag from './articleTag'
import articlesPage from './articlesPage'
import productsPage from './productsPage'

export const schemaTypes = [
  // localized field types
  localizedString,
  localizedText,
  localizedSlug,
  blockContent,
  localizedBlockContent,

  // object types
  faqItem,
  slidingCommonProfile,
  slidingCommonThreshold,
  slidingCommonUsage,
  slidingSpecialHighlight,

  // documents
  homePage,
  aboutPage,
  contactPage,
  productCategory,
  product,
  partner,
  teamMember,
  realizationTagKey,
  realizationTag,
  articleTag,
  articlesPage,
  productsPage,
  realization,
  article
]
