import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { join } from 'path';
import { ChunkExtractor } from '@loadable/server';
import { Helmet } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';
import Application from './Application';
import router from './router';
import {
  HOMEPAGE_ROUTE,
  SIGNUP_ROUTE,
  EDIT_PAGE_ROUTE,
} from './routes';
import getHomepageInitialProps from './initialProps/getHomepageInitialProps';
import getSignupInitialProps from './initialProps/getSignupInitialProps';
import getEditPageInitialProps from './initialProps/getEditPageInitialProps';

const getInitialPropsMap = {
  [HOMEPAGE_ROUTE]: getHomepageInitialProps,
  [SIGNUP_ROUTE]: getSignupInitialProps,
  [EDIT_PAGE_ROUTE]: getEditPageInitialProps,
};

export default async function ssr(path, ssrHelpers, preRender, cleanup) {
  const [routeMatch, route, PageComponent] = router(path);

  let initialProps = {};
  const getProps = getInitialPropsMap[route];

  if (typeof getProps === 'function') {
    try {
      initialProps = await getProps({
        ...ssrHelpers,
        routeMatch,
      });

      if (initialProps instanceof Error) {
        return initialProps;
      }
    } catch (error) {
      return error;
    }
  }

  const data = {
    ...initialProps,
    routeMatch,
    PageComponent,
  };

  const statsFile = join(process.cwd(), '/public/dist/loadable-stats.json');
  const extractor = new ChunkExtractor({ statsFile });

  const sheet = new ServerStyleSheet();

  let html = null;
  let headElements = null;
  let styleElements = null;
  let scriptElements = null;

  try {
    preRender();

    html = ReactDOMServer.renderToString(
      extractor.collectChunks(
        sheet.collectStyles(<Application {...data} />)
      )
    );

    cleanup();

    styleElements = sheet.getStyleTags();

    const helmet = Helmet.renderStatic();
    headElements = `${helmet.title.toString()}\n${helmet.meta.toString()}`;

    scriptElements = extractor.getScriptTags();
  } catch (error) {
    return error;
  } finally {
    sheet.seal();
  }

  return {
    html,
    styleElements,
    headElements,
    scriptElements,
    initialProps: {
      ...initialProps,
      routeMatch,
    },
  };
}
