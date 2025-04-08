import { SessionProvider } from "next-auth/react";
import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css"; // Import global styles if needed

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
