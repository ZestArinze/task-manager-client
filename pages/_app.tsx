import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css'; // import Font Awesome CSS

import '../styles/globals.css';

import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

import type { AppProps } from 'next/app';

import { Provider } from 'react-redux';

import { store } from '../src/redux';
import { RouteGuard } from '../src/components/Layout/RouteGuard';
import { NextComponentType } from 'next';

type CustomAppProps = AppProps & {
  Component: NextComponentType & {
    requireGuest?: boolean;
  };
};

function MyApp({ Component, pageProps, router }: CustomAppProps): JSX.Element {
  return (
    <Provider store={store}>
      <RouteGuard router={router} requireGuest={Component.requireGuest}>
        <Component {...pageProps} />
      </RouteGuard>
    </Provider>
  );
}

export default MyApp;
