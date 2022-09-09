import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import onlineServicesData from "../data/data";
import { MainCategory } from "../data/services";
import { addApolloState, initializeApollo } from "../lib/apolloClient";
import { MeDocument, MeQuery } from "../graphql/generated/graphql";

const Home: NextPage = () => {
  const [activeService, setactiveService] = useState<string | null>(null);
  const [activeCat, setactiveCat] = useState<string | null>(null);

  return (
    <div>
      <Navbar />
      <div className="-z-50 absolute top-0 left-0 right-0 bottom-0 bg-darkBlue min-h-screen" />
      <div
        style={{ height: "calc(100vh - 9rem)" }}
        className="bg-transparent z-0 mt-36 flex relative flex-col justify-center items-center max-w-7-xl mx-auto text-white"
      >
        <div className="absolute animation-delay-2000 top-[35%] left-[26%] w-36 md:w-96 h-56 bg-blueGradient-0 opacity-60 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        <div className="absolute animation-delay-4000 top-[35%] right-[30%] w-36 md:w-96 h-56 bg-primary opacity-40 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        <div className="flex flex-col gap-8">
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {Object.values(MainCategory).map((el) => {
              return (
                <button
                  data-aos="fade-up"
                  key={el}
                  onClick={() => {
                    // setactiveService(service.category);
                    // setactiveCat(null);
                  }}
                  className="h-40 w-40 p-2 bg-gradient3/20 hover:bg-gradient3/50 transition-all duration-300 rounded-2xl font-bold text-md filter backdrop-blur-lg"
                >
                  {el}
                </button>
              );
            })}
          </div>
          {/* Core Services (4 buttons) */}
          {/* <div className='flex justify-center items-center gap-8 flex-wrap'>
            {onlineServicesData.map(service => (

              <Link key={service.category} href={service.route}>
                <button
                  data-aos="fade-up"
                  key={service.category}
                  onClick={() => {
                    setactiveService(service.category)
                    setactiveCat(null)
                  }}
                  className='h-40 w-40 bg-gradient3/20 hover:bg-gradient3/50 transition-all duration-300 rounded-2xl font-bold text-md filter backdrop-blur-lg'>
                  {service.category}
                </button>
              </Link>

            ))}
          </div> */}
          {/* Categories */}
          {/* <div className='flex justify-center items-center gap-8'>

            {
              activeService && onlineServicesData.filter(service => service.category === activeService)[0].services?.map(category => (
                <div
                  data-aos="fade-up"
                  key={category.name}
                  className="h-40 w-40 cursor-pointer bg-gradient3/20 hover:bg-gradient3/50 transition-all duration-300 rounded-2xl font-bold text-md grid place-items-center p-4 text-center filter backdrop-blur-lg"
                  onClick={() => {
                    setactiveCat(category.name)
                  }}
                >
                  {category.subCategories ?
                    <div>
                      {category.name}
                    </div>
                    : <Link href={category.route}>
                      {category.name}
                    </Link>}
                </div>
              ))}
          </div> */}
          {/* Sub-Categories (if they exist) */}
          {/* <div className='flex justify-center items-center gap-8'>
            {
              activeService && activeCat && onlineServicesData.filter(service => service.category === activeService)[0].services?.filter(service => service.name === activeCat).map(subCat => (
                <>
                  {subCat.subCategories?.map(subCategory => (
                    <div className='h-auto w-auto cursor-pointer' data-aos="fade-up">
                      <Link href={subCategory.route}>
                        <div className='h-40 w-40 bg-gradient3/20 hover:bg-gradient3/50 transition-all duration-300 rounded-2xl font-bold text-md grid place-items-center text-center p-4 filter backdrop-blur-lg'>
                          {subCategory.name}
                        </div>
                      </Link>
                    </div>
                  ))}
                </>
              ))
            }
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  try {
    const meQueryData = await apolloClient.query<MeQuery>({
      query: MeDocument,
    });

    if (meQueryData.error || meQueryData.errors) {
      return {
        redirect: {
          destination: "/services",
          permanent: false,
        },
      };
    }

    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } catch (error: any) {
    return {
      redirect: {
        destination: "/services",
        permanent: false,
      },
    };
  }
};
