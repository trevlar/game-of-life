import { MantineProvider } from '@mantine/core';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import '@mantine/core/styles/global.css';
import '@mantine/core/styles.css';
import '../styles/index.css';

import { store } from '../store/store';

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Conway&apos;s Game of Life</title>
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
