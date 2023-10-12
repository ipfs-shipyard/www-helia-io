/* eslint-disable import/first, no-new-func */
/* global ReactIntlLocaleData:false */
import '../shared/styles/index.css'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import Helmet from 'react-helmet'
import Footer from '../shared/components/footer/index.jsx'
import styles from './index.module.css'

class Layout extends Component {
  render () {
    const { children } = this.props

    return (
      <div className={ styles.app }>
        <Helmet
          defaultTitle="Helia"
          meta={ [
            { name: 'description', content: 'JS IPFS website' },
            { name: 'msapplication-TileColor', content: '#2f3951' },
            { name: 'theme-color', content: '#ffffff' }
          ] }
          link={ [
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
            { rel: 'icon', sizes: '32x32', href: '/favicon/favicon-32x32.png', type: 'image/png' },
            { rel: 'icon', sizes: '16x16', href: '/favicon/favicon-16x16.png', type: 'image/png' },
            { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#0a1732' }
          ] }
          script={ [
            { src: 'https://camp.ipfs.io/ribbon.min.js', async: true }
          ] } >
        </Helmet>

        <main className={ styles.children }>
          { children }
        </main>
        <Footer className={ styles.footer } />
      </div>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.object
}

export default injectIntl(Layout)
