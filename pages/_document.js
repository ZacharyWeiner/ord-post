import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=UnifrakturCook:wght@700&display=swap" rel="stylesheet" /> 
      <Script src="https://unpkg.com/@runonbitcoin/nimble" strategy='beforeInteractive'></Script>
    </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
