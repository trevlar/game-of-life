import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@mantine/core';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Web site created using create-react-app" />
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="manifest" href="/manifest.json" />
          <title>Conway's Game of Life</title>
          <ColorSchemeScript defaultColorScheme="auto" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
