import homePage from './homePage'
import aboutPage from './aboutPage'
import contactPage from './contactPage'

import productCategory from './productCategory'
import product from './product'

import partner from './partner'
import teamMember from './teamMember'

import tag from './tag'
import realization from './realization'

import {localizedString, localizedText, localizedBlockContent, blockContent} from './l10n'

export const schemaTypes = [
  // localized field types
  localizedString,
  localizedText,
  blockContent,
  localizedBlockContent,

  // documents
  homePage,
  aboutPage,
  contactPage,
  productCategory,
  product,
  partner,
  teamMember,
  tag,
  realization,
]
