import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { PropTypes } from 'prop-types'
import ReactMarkdown from 'react-markdown'
import Observer from '../intersection-observer/index.js'

import Svg from '../svg/index.jsx'
import hexagonsSvg from '../../media/images/hexagons.sprite.svg'
import data from '../../data/community/index.js'
import Button from '../button/index.jsx'
import styles from './index.module.css'

class Community extends Component {
  state = {
    showContributors: false
  }

  render () {
    const { intl: { messages } } = this.props
    const { showContributors } = this.state

    return (
      <Observer onChange={ this.handleObserverChange }>
        <div className={ styles.container }>
          <div className={ styles.backgroundSvg }>
            <div className={ styles.hex1 }><Svg svg={ hexagonsSvg } /></div>
            <div className={ styles.hex2 }><Svg svg={ hexagonsSvg } /></div>
          </div>
          <div className={ styles.content }>
            <h1>{ messages.community.sectionTitle }</h1>
            <ReactMarkdown className={ styles.sectionDescription }>{ messages.community.sectionDesc }</ReactMarkdown>
            <div className={ styles.socialLinksContainer }>
              <p>{ messages.community.socialNetworksText }</p>
              <div className={ styles.socialLinks }>
                <Button translationId="buttonCommunity" href="https://docs.ipfs.tech/community/" />
                <Button translationId="buttonGithub" href="https://github.com/ipfs/helia" modifier="github" />
              </div>
            </div>
          </div>
          { showContributors && <iframe title="contributors" frameBorder="0" src={ data.contributorsLink } /> }
        </div>
      </Observer>
    )
  }

  handleObserverChange = ({ isIntersecting }) => {
    // Lazy render the contributors pictures to avoid downloading a lot of images at page load
    if (!this.state.showContributors && isIntersecting) {
      // TODO: fix contributor list
      //this.setState({ showContributors: true })
    }
  }
}

Community.propTypes = {
  intl: PropTypes.object.isRequired
}

export default injectIntl(Community)
