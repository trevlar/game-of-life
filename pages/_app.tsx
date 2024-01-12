import Head from 'next/head';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles/global.css';
import '@mantine/core/styles.css';
import '../components/index.css';

import { store } from '../components/app/store';

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Conway's Game of Life</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Provider store={store}>
        <MantineProvider>
          <Component {...pageProps} />
        </MantineProvider>
      </Provider>
    </div>
  );
}
