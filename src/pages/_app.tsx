import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { ToastContainer } from 'react-toastify';
import { Provider } from "react-redux";
import NextNProgress from 'nextjs-progressbar';

import { store } from "@/store/index";

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/style.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <NextNProgress />
        <Component {...pageProps} />
        <ToastContainer />
      </SessionProvider>
    </Provider>
  );
}
