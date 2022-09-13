import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import "aos/dist/aos.css";
import Aos from "aos";
import { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Router } from "next/router";
import NextNProgress from "nextjs-progressbar";

// For Context
// const selectedServices = {
//   category: null,
//   service: null,
//   subService: null,
// }

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  const [loading, setLoading] = useState(false);

  Router.events.on("routeChangeStart", () => {
    setLoading(true);
  });

  Router.events.on("routeChangeComplete", () => {
    setLoading(false);
  });

  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <>
      <NextNProgress color="#f07202" />
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOGGLE_CLIENT_ID!}>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </GoogleOAuthProvider>
      <Toaster />
    </>
  );
}

export default MyApp;
