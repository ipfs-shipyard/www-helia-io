import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Youtube from '../../youtube/index.jsx'

import styles from './index.module.css'

class VideosItem extends Component {
  render () {
    const { link, title, isMobile } = this.props

    return (
      <div className={ styles.videoItemContainer } onClick={ this.handleRemainingVideoClick }>
        <Youtube link={ link } blockPlay={ !isMobile } />
        <p className={ styles.videoTitle }>{ title }</p>
      </div>
    )
  }

  handleRemainingVideoClick = () => {
    const { index, onClick, isMobile } = this.props

    return onClick(index, isMobile)
  }
}

VideosItem.propTypes = {
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
}

export default VideosItem
