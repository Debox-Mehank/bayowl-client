import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import Navbar from '../components/Navbar'

const onlineServicesData = [
  {
    category: "Song",
    hasServices: true,
    services: [
      {
        hasSubServices: false,
        name: "Mix & Master",
        route: "/mix-master,",
      },
      {
        hasSubServices: false,
        name: "Vocals (Singing)",
        route: "/vocals,",
      },
      {
        hasSubServices: true,
        name: "Instrument Processing",
        subServices: [
          {
            name: "Guitars",
            route: "/instrument-processing-guitars"
          },
          {
            name: "Drums",
            route: "/instrument-processing-guitars"
          },
          {
            name: "All Instruments",
            route: "/instrument-processing-guitars"
          }
        ]
      },
    ]
  },
  {
    category: "Voice Overs & Dialogue",
    route: "voice-overs-dialogue",
    hasServices: false,
    services: null,
  },
  {
    category: "Film Audio Post",
    hasServices: true,
    services: [
      {
        hasSubServices: false,
        name: "Commercials",
        route: "/commercials,",
      },
      {
        hasSubServices: false,
        name: "Short Films, Episodes & Features",
        route: "/short-films-episodes-features,",
      },
      {
        hasSubServices: true,
        name: "Instrument Processing",
        subServices: [
          {
            name: "Guitars",
            route: "/instrument-processing-guitars"
          },
          {
            name: "Drums",
            route: "/instrument-processing-guitars"
          },
          {
            name: "All Instruments",
            route: "/instrument-processing-guitars"
          }
        ]
      },
    ]
  },
  {
    category: "Session Artists",
    route: "/session-artists",
    hasServices: false,
    services: null,
  },

]

const Home: NextPage = () => {

  const [activeCat, setactiveCat] = useState<string | null>("Song")

  return (
    <div className='bg-darkBlue pt-40 min-h-screen h-full text-white'>
      <Navbar />
      {/* @ts-ignore */}
      <div className='h-screen flex justify-center flex-wrap gap-8'>

        {onlineServicesData.map(service => (
          <button
            key={service.category}
            onClick={() => {
              setactiveCat(service.category)
            }}
            className='h-52 w-52 bg-gradient3/20 hover:bg-gradient3/50 transition-all duration-300 rounded-2xl'>
            {service.category}
          </button>
        ))}

        {
          onlineServicesData.filter(service => service.category === activeCat)[0].services?.map(service => (
            <>
              {service.name}
            </>
          )
          )
        }
      </div>
    </div>
  )
}

export default Home
