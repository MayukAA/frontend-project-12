import React from 'react';
import { Provider } from 'react-redux';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import i18next from 'i18next';
import leoProfanity from 'leo-profanity';

import './index.css';
import App from './App';
import store from './slices/index';
import resources from './locales/index';
import reportWebVitals from './reportWebVitals';

const Init = async () => {
  const i18n = i18next.createInstance();
  const currentLanguage = localStorage.getItem('currentLanguage');
  const defaultLanguage = currentLanguage || 'ru';
  const leoProfanityFilter = leoProfanity;

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    payload: {
      environment: 'production',
    },
    captureUncaught: true,
    captureUnhandledRejections: true,
  };

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLanguage,
      fallbackLng: ['en', 'ru'],
      interpolation: {
        escapeValue: false,
      },
    });

  leoProfanityFilter
    .add(leoProfanityFilter.getDictionary('en'))
    .add(leoProfanityFilter.getDictionary('ru'));

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <React.StrictMode>
          <I18nextProvider i18n={i18n}>
            <Provider store={store}>
              <App />
            </Provider>
          </I18nextProvider>
        </React.StrictMode>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

reportWebVitals();

export default Init;
