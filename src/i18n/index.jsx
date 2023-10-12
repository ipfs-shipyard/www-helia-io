import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { /*addLocaleData, */ IntlProvider } from 'react-intl'
import langmap from 'langmap'
import arMessages from './messages/ar.json'
import caMessages from './messages/ca.json'
import csMessages from './messages/cs.json'
import daMessages from './messages/da.json'
import deMessages from './messages/de.json'
import enMessages from './messages/en.json'
import frMessages from './messages/fr.json'
import idMessages from './messages/id.json'
import itMessages from './messages/it.json'
import jaJPMessages from './messages/ja-JP.json'
import koKRMessages from './messages/ko-KR.json'
import nlMessages from './messages/nl.json'
import plMessages from './messages/pl.json'
import ptBRMessages from './messages/pt-BR.json'
import ptMessages from './messages/pt.json'
import ruMessages from './messages/ru.json'
import trMessages from './messages/tr.json'
import zhCNMessages from './messages/zh-CN.json'

const locales = [{
  code: 'ar',
  message: arMessages
}, {
  code: 'ca',
  message: caMessages
}, {
  code: 'cs',
  message: csMessages
}, {
  code: 'da',
  message: daMessages
}, {
  code: 'de',
  message: deMessages
}, {
  code: 'en',
  message: enMessages
}, {
  code: 'fr',
  message: frMessages
}, {
  code: 'id',
  message: idMessages
}, {
  code: 'it',
  message: itMessages
}, {
  code: 'ja-JP',
  message: jaJPMessages
}, {
  code: 'ko-KR',
  message: koKRMessages
}, {
  code: 'nl',
  message: nlMessages
}, {
  code: 'pl',
  message: plMessages
}, {
  code: 'pt',
  message: ptMessages
}, {
  code: 'pt-BR',
  message: ptBRMessages
}, {
  code: 'ru',
  message: ruMessages
}, {
  code: 'tr',
  message: trMessages
}, {
  code: 'zh-CN',
  message: zhCNMessages
}]

export const defaultLocale = 'en'
export const availableLocales = locales.map(l => {
  return {
    acronym: l.code,
    fullForm: langmap[l.code].nativeName
  }
})

export class I18n extends Component {
  render () {
    const intl = {
      acronym: 'en',
      messages: enMessages
    }

    return (
      <IntlProvider locale={ intl.acronym } messages={ intl.messages }>
        {this.props.children}
      </IntlProvider>
    )
  }
}
