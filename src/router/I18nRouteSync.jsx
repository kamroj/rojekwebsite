import React, {useEffect} from 'react'
import {Outlet, useLocation, useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import {DEFAULT_LANGUAGE} from '../constants'
import { normalizeLang } from '../lib/i18n/routing'

/**
 * Synchronizes i18next language with the current route.
 * - For root routes (`/`...), language is default (pl).
 * - For `/en/...` and `/de/...`, language comes from route param.
 */
export default function I18nRouteSync({lang, defaultLang = DEFAULT_LANGUAGE}) {
  const {i18n} = useTranslation()
  const params = useParams()
  const location = useLocation()

  useEffect(() => {
    // When used under `/:lang`, params.lang exists.
    const routeLang = lang ? normalizeLang(lang) : params?.lang ? normalizeLang(params.lang) : defaultLang
    const current = normalizeLang(i18n.language)
    if (routeLang !== current) {
      i18n.changeLanguage(routeLang)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, params?.lang, defaultLang, location.pathname])

  return <Outlet />
}
