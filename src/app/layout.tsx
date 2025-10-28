'use client'

import { ReactToastifyProvider } from "@/context/ReactToastifyProvider";
import "./globals.css";
import { ReactQueryProvider } from "@/context/ReactQueryProvider";
import { Provider } from 'react-redux';
import { store, persistor } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="mdl-js">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ReactToastifyProvider>
              <ReactQueryProvider>
                {children}
              </ReactQueryProvider>
            </ReactToastifyProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
