import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Carousel from '../../carousel/index.jsx'
import Youtube from '../../youtube/index.jsx'

import styles from './index.module.css'

// TODO: replace scroll-to-component
//const scrollToComponent = typeof window !== 'undefined' && require('react-scroll-to-component')
const scrollToComponent = undefined
const defaultScrollOptions = { offset: 0, align: 'center', duration: 600 }

class VideosList extends Component {
  constructor (props) {
    super(props)

    const { list } = props
    const activeIndex = list.findIndex((video) => video.active)

    this.state = { activeIndex }
  }

  render () {
    return (
      <div className={ styles.talksContainer }>
        { this.renderActiveVideo() }
        <div className={ styles.remainingVideosContainer }>
          { this.renderVideosCarousel() }
        </div>
      </div>
    )
  }

    renderActiveVideo = () => {
      const { activeIndex } = this.state
      const { list } = this.props
      const activeVideo = list[activeIndex]
      return (
        <div className={ styles.selectedVideo } ref={ this.handleAtiveVideoRef }>
          <Youtube link={ activeVideo.link }/>
        </div>
      )
    }

    renderVideosCarousel = () => {
      const { list } = this.props
      const { activeIndex } = this.state
      return <Carousel itemsList={ list }
        modifier="videos"
        size={ 3 }
        onVideoClick={ this.handleRemainingVideoClick }
        activeIndex={ activeIndex } />
    }

    handleRemainingVideoClick = (activeIndex, isMobile) => {
      this.setState({ activeIndex })
      !isMobile && scrollToComponent(this.activeVideoRef, defaultScrollOptions)
    }

    handleAtiveVideoRef = (element) => {
      this.activeVideoRef = element
    }
}

VideosList.propTypes = {
  list: PropTypes.array.isRequired
}

export default VideosList
