import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {SessionProvider} from 'next-auth/react';
import {Session} from 'next-auth';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/style.css';
import NextNProgress from 'nextjs-progressbar';

export default function App({
  Component,
  pageProps: {session, ...pageProps},
}: AppProps<{session: Session}>) {
  return (
    <SessionProvider session={session}>
      <NextNProgress />
      <Component {...pageProps} />
      <ToastContainer />
    </SessionProvider>
  );
}
