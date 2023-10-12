import React from 'react'
import { injectIntl } from 'react-intl'
import ScreenSizeProvider from '../../shared/components/screen-size-provider/index.jsx'
import Hero from '../../shared/components/hero-section/index.jsx'
import Features from '../../shared/components/features-section/index.jsx'
import GettingStarted from '../../shared/components/getting-started-section/index.jsx'
import WhatYouCanBuild from '../../shared/components/what-you-can-build-section/index.jsx'
import WhatArePeopleBuilding from '../../shared/components/what-are-people-building-section/index.jsx'
import Gateway from '../../shared/components/gateway-section/index.jsx'
import PublicationsAndTalks from '../../shared/components/publications-and-talks-section/index.jsx'
import Community from '../../shared/components/community-section/index.jsx'

const HomePage = () => (
  <div>
    <ScreenSizeProvider>
      <Hero />
      <Features />
      <GettingStarted />
      { /* <Gateway /> */ }
      <WhatArePeopleBuilding />
      <WhatYouCanBuild />
      <PublicationsAndTalks />
      <Community />
    </ScreenSizeProvider>
  </div>
)

export default injectIntl(HomePage)
