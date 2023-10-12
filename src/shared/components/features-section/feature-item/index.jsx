import React from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'
import ReactMarkdown from 'react-markdown'

import styles from './index.module.css'

const FeatureItem = ({ image, title, description, className }) => (
  <div className={ classNames(styles.featureItem, className) }>
    <div className={ styles.image }>
      { image }
    </div>
    <ReactMarkdown className={ styles.title }>{ title }</ReactMarkdown>
    <ReactMarkdown className={ styles.description }>{ description }</ReactMarkdown>
  </div>
)

FeatureItem.propTypes = {
  image: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default FeatureItem
