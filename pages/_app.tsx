import '../styles/globals.css'
import type { AppProps } from 'next/app'
import "aos/dist/aos.css"
import Aos from "aos"
import { useEffect } from 'react'

// For Context
// const selectedServices = {
//   category: null,
//   service: null,
//   subService: null,
// }



function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    Aos.init()
  }, []);

  return <Component {...pageProps} />
}

export default MyApp
