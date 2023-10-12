/* global localStorage */

import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'
import Observer from '../intersection-observer/index.js'
import ReactMarkdown from 'react-markdown'

import withMobileSizeDetection from '../with-mobile-size-detection/index.jsx'
import NavBar from '../nav-bar/index.jsx'
import LocalesBar from '../locales-bar/index.jsx'
import Svg from '../svg/index.jsx'
import AnimationToggle from './helpers/animation-toggle/index.jsx'
import outsideRingSvg from './images/outside-ring.svg'
import middleRingSvg from './images/middle-ring.svg'
import insideRingSvg from './images/inside-ring.svg'
import cubeSvg from './images/cube.svg'
import styles from './index.module.css'

class Hero extends Component {
  state = {
    info: undefined,
    inView: true,
    animationOn: true
  }

  /* We are using backgroundImage as parts of the animated images were being damage by firefox due to browser optimizations */
  outsideRingStyle = { backgroundImage: `url(${outsideRingSvg})` }
  middleRingStyle = { backgroundImage: `url(${middleRingSvg})` }
  insideRingStyle = { backgroundImage: `url(${insideRingSvg})` }

  componentDidMount () {
    fetch('https://api.npms.io/v2/package/helia')
      .then(res => res.json())
      .then(this.handleResponse)
      .catch(this.handleError)
    this.checkLocalStorage()
  }

  render () {
    const { intl: { messages } } = this.props
    const { info, inView, animationOn } = this.state
    const containerClasses = classNames(styles.container, { [styles.animationOff]: !inView || !animationOn })
    const infoContainerClasses = classNames(styles.infoContainer, { [styles.show]: Boolean(info) })
    const animationToggleText = animationOn ? 'disable' : 'enable'

    return (
      <Observer onChange={ this.handleObserverChange }>
        <div className={ containerClasses }>
          <NavBar />
          <LocalesBar className={ styles.localesBar } />
          <div className={ styles.orbitContainer }>
            <div className={ styles.orbits }>
              <div className={ styles.outsideRing } style={ this.outsideRingStyle } />
              <div className={ styles.middleRing } style={ this.middleRingStyle } />
              <div className={ styles.insideRing } style={ this.insideRingStyle } />
            </div>
          </div>
          <div className={ styles.content }>
            <div className={ styles.cubeWrapper }>
              <div className={ styles.cubeContainer }>
                <Svg svg={ cubeSvg } className={ styles.cube } />
              </div>
            </div>
            <h1 className={ styles.long }>{ messages.hero.welcomeMessage.long }</h1>
            <h1 className={ styles.short }>{ messages.hero.welcomeMessage.short }</h1>
            <ReactMarkdown className={ classNames(styles.textDesc, styles.long) }>{ messages.hero.textDescription.long }</ReactMarkdown>
            <ReactMarkdown className={ classNames(styles.textDesc, styles.short) }>{ messages.hero.textDescription.short }</ReactMarkdown>
            <div className={ infoContainerClasses }>
              { info && this.renderPkgInfo(info) }
            </div>
          </div>
          <AnimationToggle className={ styles.animationToggle }
            title={ messages.hero.animationButton[animationToggleText] }
            onToggleClick={ this.handleAnimationToggleClick }/>
        </div>
      </Observer>
    )
  }

  renderPkgInfo = (info) => {
    const { isMobile } = this.props
    const pkgInfoArr = Object.values(isMobile ? info.short : info.long)

    return <div>{ pkgInfoArr.map((infoElement, index) => <span key={ `pkgInfo-${index}` }>{ infoElement }</span>) }</div>
  }

  handleObserverChange = ({ isIntersecting }) => this.setState({ inView: isIntersecting })

  handleResponse = (body) => {
    const data = body.collected
    const { intl } = this.props
    const { messages } = intl

    const currentVersionStr = intl.formatMessage(
      { id: '_dummy', defaultMessage: messages.hero.currentVersion.long },
      { version: data.metadata.version }
    )
    const latestUpdateDateStr = intl.formatMessage(
      { id: '_dummy', defaultMessage: messages.hero.latestUpdate.long },
      { date: intl.formatRelative(new Date(data.metadata.date)) }
    )
    const shortCurrentVersionStr = intl.formatMessage(
      { id: '_dummy', defaultMessage: messages.hero.currentVersion.short },
      { version: data.metadata.version }
    )
    const shortLatestUpdateDateStr = intl.formatMessage(
      { id: '_dummy', defaultMessage: messages.hero.latestUpdate.short },
      { date: intl.formatRelative(new Date(data.metadata.date)) }
    )

    const downloads = this.calculateDownloads(data.npm.downloads, { lastMonth: true })
    const formattedDownloads = downloads.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    const downloadsStr = intl.formatMessage(
      { id: '_dummy', defaultMessage: messages.hero.downloadsLastMonth },
      { count: formattedDownloads }
    )

    const info = {
      short: {
        versionAndDateStr: `${shortCurrentVersionStr} | ${shortLatestUpdateDateStr}`,
        downloadsStr
      },
      long: { currentVersionStr, latestUpdateDateStr, downloadsStr }
    }

    this.setState({ info })
  }

  handleError = (error) => {
    console.error(error)

    const { messages } = this.props.intl

    toast.error(messages.hero.errorPckMessage)
  }

  handleAnimationToggleClick = () => {
    const newAnimationState = !this.state.animationOn

    localStorage.setItem('animation', newAnimationState)
    this.setState({ animationOn: newAnimationState })
  }

  checkLocalStorage = () => (
    localStorage.getItem('animation') === null
      ? localStorage.setItem('animation', this.state.animationOn)
      : this.setState({ animationOn: (localStorage.getItem('animation') === 'true') })
  )

  calculateDownloads = (downloadsArr, options = { lastMonth: false }) => {
    const { lastMonth } = options
    const arrLength = downloadsArr.length
    let downloadsNumber = downloadsArr[arrLength - 1].count

    if (lastMonth) {
      downloadsArr.every((elem) => {
        if (this.compareDates(elem)) {
          downloadsNumber = elem.count
          return true
        }
        return false
      })
    }

    return downloadsNumber
  }

  compareDates = (object) => {
    const fromDate = new Date(object.from)
    const toDate = new Date(object.to)
    const fromYearNumber = fromDate.getFullYear()
    const toYearNumber = toDate.getFullYear()

    if (fromYearNumber === toYearNumber) {
      const fromMonthNumber = fromDate.getMonth()
      const toMonthNumber = toDate.getMonth()
      const monthsDiff = Math.abs(fromMonthNumber - toMonthNumber)

      return monthsDiff <= 1
    }

    return false
  }
}

Hero.propTypes = {
  intl: PropTypes.object.isRequired
}

export default withMobileSizeDetection(injectIntl(Hero))
