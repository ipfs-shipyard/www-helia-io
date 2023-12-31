import React, { PureComponent } from 'react'
import { PropTypes } from 'prop-types'
import ScreenSizeContext from '../screen-size-context/index.js'

const withMobileSizeDetection = (WrappedComponent) => {
  class WithMobileSizeDetection extends PureComponent {
    render () {
      return (
        <ScreenSizeContext.Consumer>
          { (context) => (
            <WrappedComponent
              isMobile={ context.state.isMobile }
              { ...this.props } />
          ) }
        </ScreenSizeContext.Consumer>
      )
    }
  }

  WithMobileSizeDetection.contextTypes = {
    isMobile: PropTypes.bool
  }

  return WithMobileSizeDetection
}

export default withMobileSizeDetection
