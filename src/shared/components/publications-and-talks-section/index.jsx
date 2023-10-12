import React from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'

import Svg from '../svg/index.jsx'
import hexagonsSvg from '../../media/images/hexagons.sprite.svg'
import videosArr from '../../data/publications-and-talks/index.js'
import VideosList from './videos-list/index.jsx'
import styles from './index.module.css'

const PublicationsAndTalks = ({ intl: { messages } }) => (
  <div className={ styles.container }>
    <div className={ styles.backgroundSvg }>
      <div className={ styles.hex1 }><Svg svg={ hexagonsSvg } /></div>
      <div className={ styles.hex2 }><Svg svg={ hexagonsSvg } /></div>
    </div>
    <div className={ styles.content } >
      <h1>{ messages.publicationsAndTalks.sectionTitle }</h1>
      <ReactMarkdown className={ styles.sectionDescription }>{ messages.publicationsAndTalks.sectionDesc }</ReactMarkdown>
      <VideosList list={ videosArr } />
    </div>
  </div>
)

PublicationsAndTalks.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(PublicationsAndTalks)
