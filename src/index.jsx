import React from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './layouts/index.jsx'
import { HomePage } from './pages/index.js'
import { I18n } from './i18n/index.jsx'

const root = document.getElementById('app')

if (process.env.NODE_ENV === 'production') {
  createRoot(root).render(
    <I18n>
      <Layout>
        <HomePage />
      </Layout>
    </I18n>
  )
} else {
  //const RedBox = await import('redbox-react')

  try {
    createRoot(root).render(
      <I18n>
        <Layout>
          <HomePage />
        </Layout>
      </I18n>
    )
  } catch (e) {
    console.error(e)
    //render(<RedBox error={e} />, root)
  }
}
