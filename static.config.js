import React from 'react'
import { ServerStyleSheet } from 'styled-components'

export default {
  renderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet()
    const html = render(sheet.collectStyles(<Comp />))
    meta.styleTags = sheet.getStyleElement()
    return html
  },
  Document: ({ Html, Head, Body, children, renderMeta }) => (
    <Html>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        {renderMeta.styleTags}
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" />
        <script src="https://www.gstatic.com/firebasejs/4.9.1/firebase.js" />
      </Head>
      <Body>{children}</Body>
    </Html>
  ),
}
