import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'

class Link extends Component {
  render () {
    const { to, href, prefixLocale, ...rest } = this.props

    if (to) {
      return <a { ...rest } href={ this.buildTo() } />
    }

    return (
      <a { ...rest } href={ href } target="_blank" rel="noopener noreferrer" />
    )
  }

  buildTo () {
    const { to, prefixLocale, intl } = this.props

    let finalTo = ''

    if (prefixLocale && intl.defaultLocale !== intl.locale) {
      finalTo += `/${intl.locale}`
    }

    // Ensure trailing slash to avoid gateway redirects
    // The IPFS gateway automatically redirects to <url>/ if there's trailing /
    finalTo += to.replace(/\/+$/, '')
    finalTo += '/'

    return finalTo
  }
}

Link.defaultProps = {
  prefixLocale: true
}

Link.propTpes = {
  to: PropTypes.string,
  href: PropTypes.string,
  prefixLocale: PropTypes.bool,
  intl: PropTypes.object.isRequired
}

export default injectIntl(Link)
