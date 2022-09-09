import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import type { AppProps } from "next/app";
import "aos/dist/aos.css";
import Aos from "aos";
import { useEffect } from "react";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../lib/apolloClient";
import { GoogleOAuthProvider } from "@react-oauth/google";

// For Context
// const selectedServices = {
//   category: null,
//   service: null,
//   subService: null,
// }

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <>
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
