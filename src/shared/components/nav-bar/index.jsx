import React, { PureComponent } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'
import Observer from '../intersection-observer/index.js'

import DesktopNavBar from './desktop/index.jsx'
import MobileNavBar from './mobile/index.jsx'
import styles from './index.module.css'

//const scrollToComponent = typeof window !== 'undefined' && require('react-scroll-to-component')
// TODO: replace scroll-to-component
const scrollToComponent = undefined
const defaultScrollOptions = { offset: -66, align: 'top', duration: 800 }

class NavBar extends PureComponent {
  state = {
    isSticky: false,
    gettingStartedElement: undefined
  }

  componentDidMount () {
    this.gettingStartedElement = document.getElementById('gsContainer')
  }

  render () {
    const { className } = this.props
    const { isSticky } = this.state

    return (
      <nav className={ classNames(styles.navBar, className) }>
        <Observer onChange={ this.handleObserverChange }>
          <span className={ styles.target } />
        </Observer>
        <DesktopNavBar isSticky={ isSticky } onGoToGettingStarted={ this.handleGoToGettingStarted } />
        <MobileNavBar onGoToGettingStarted={ this.handleGoToGettingStarted } />
      </nav>
    )
  }

  handleObserverChange = (entry) => {
    // Ignore if going up in lower vertical resolutions by checking `boundingClientRect.y`
    this.setState({ isSticky: entry.boundingClientRect.y < 60 && !entry.isIntersecting })
  }

  handleGoToGettingStarted = () => {
    scrollToComponent(this.gettingStartedElement, defaultScrollOptions)
  }
}

NavBar.propTypes = {
  className: PropTypes.string
}

export default NavBar
