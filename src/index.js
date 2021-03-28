import React, { useRef } from 'react';
import 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import theme from './assets/theme';
import Loading from './components/Loading';
import store, { persistor } from './containers/store';
import AppRoute from './screens';

export default function Main() {
    return (
      <StoreProvider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <PaperProvider theme={theme}>
            <AppRoute />
          </PaperProvider>
        </PersistGate>
      </StoreProvider>
    );
  }