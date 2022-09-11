import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ServiceCard from "../components/reusable/ServiceCard";
import { allServices } from "../data/services";
import { useMeQuery } from "../graphql/generated/graphql";

const Services = () => {
  const router = useRouter();
  const {
    mainCategory: mainCategoryRoute,
    subCategory: subCategoryRoute,
    serviceName: serviceNameRoute,
  } = router.query;

  const { data, loading, error } = useMeQuery();

  const [selectedMainCategory, setSelectedMainCategory] = useState<string>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>();
  const [selectedService, setSelectedService] = useState<string>();
  const [selectedSubService, setSelectedSubService] = useState<string | null>();

  useEffect(() => {
    if (mainCategoryRoute) {
      setSelectedMainCategory(mainCategoryRoute.toString());
    }

    if (subCategoryRoute) {
      setSelectedSubCategory(subCategoryRoute.toString());
    }

    if (serviceNameRoute) {
      setSelectedService(serviceNameRoute.toString());
    }
  }, [mainCategoryRoute, subCategoryRoute, serviceNameRoute, router.query]);

  const finalPageHandler = () => { };

  return (
    <div>
      <Navbar name={data?.me.name} email={data?.me.email} />
      <div className="-z-50 absolute top-0 left-0 right-0 bottom-0 bg-darkBlue min-h-screen" />
      <div
        style={{ height: "calc(100vh - 9rem)" }}
        className="bg-transparent z-0 mt-36 flex relative flex-col justify-center items-center max-w-7-xl mx-auto text-white"
      >

        <div className='absolute animation-delay-4000 top-[40%] right-[22%] w-36 md:w-96 h-56 bg-primary opacity-50 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden' />
        <div className='absolute animation-delay-2000 top-[38%] right-[40%] w-36 md:w-96 h-56 bg-blueGradient-0 opacity-70 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden' />
        <div className='absolute top-[42%] right-[58%] w-36 md:w-96 h-56 bg-pink-700 opacity-60 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden' />
        <div className="flex flex-col gap-8">
          {!selectedMainCategory ? (
            <>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                <p className="text-3xl font-bold">Select Main Category</p>
              </div>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                {allServices.map((a) => {
                  return (
                    <ServiceCard
                      key={a.mainCategory}
                      onClick={() => {
                        setSelectedMainCategory(a.mainCategory);
                        router.push(
                          `/services?mainCategory=${encodeURIComponent(
                            a.mainCategory
                          )}`
                        );
                      }}
                      title={a.mainCategory}
                    />
                    // <button
                    //   data-aos="fade-up"
                    //   key={a.mainCategory}
                    //   onClick={() => {
                    //     setSelectedMainCategory(a.mainCategory);
                    //     router.push(
                    //       `/services?mainCategory=${encodeURIComponent(
                    //         a.mainCategory
                    //       )}`
                    //     );
                    //   }}
                    //   className="h-40 w-40 p-2 bg-gradient3/20 hover:bg-gradient3/50 transition-all duration-300 rounded-2xl font-bold text-md filter backdrop-blur-lg"
                    // >
                    //   {a.mainCategory}
                    // </button>
                  );
                })}
              </div>
            </>
          ) : !selectedSubCategory ? (
            <>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                <p className="text-3xl font-bold">{selectedMainCategory}</p>
              </div>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                {allServices
                  .filter(
                    (elem) => elem.mainCategory === selectedMainCategory
                  )[0]
                  .subCategories.map((a) => {
                    return (
                      <ServiceCard
                        key={a.subCategory}
                        onClick={() => {
                          setSelectedSubCategory(a.subCategory);
                          router.push(
                            `/services?mainCategory=${encodeURIComponent(
                              selectedMainCategory
                            )}&subCategory=${encodeURIComponent(a.subCategory)}`
                          );
                        }}
                        title={a.subCategory}
                      />
                      // <button
                      //   data-aos="fade-up"
                      //   key={a.subCategory}
                      //   onClick={() => {
                      //     setSelectedSubCategory(a.subCategory);
                      //     router.push(
                      //       `/services?mainCategory=${encodeURIComponent(
                      //         selectedMainCategory
                      //       )}&subCategory=${encodeURIComponent(a.subCategory)}`
                      //     );
                      //   }}
                      //   className="h-40 w-40 p-2 bg-gradient3/20 hover:bg-gradient3/50 transition-all duration-300 rounded-2xl font-bold text-md filter backdrop-blur-lg"
                      // >
                      //   {a.subCategory}
                      // </button>
                    );
                  })}
              </div>
            </>
          ) : !selectedService ? (
            <>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                <p className="text-3xl font-bold">{selectedSubCategory}</p>
              </div>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                {allServices
                  .filter(
                    (elem) => elem.mainCategory === selectedMainCategory
                  )[0]
                  .subCategories.filter(
                    (ele) => ele.subCategory === selectedSubCategory
                  )[0]
                  .services.map((a) => {
                    return (
                      <ServiceCard
                        key={a.serviceName}
                        onClick={() => {
                          if (a.subServices) {
                            setSelectedService(a.serviceName);
                            router.push(
                              `/services?mainCategory=${encodeURIComponent(
                                selectedMainCategory
                              )}&subCategory=${encodeURIComponent(
                                selectedSubCategory
                              )}&serviceName=${encodeURIComponent(
                                a.serviceName
                              )}`
                            );
                          } else {
                            const data = {
                              mainCategory: selectedMainCategory,
                              subCategory: selectedSubCategory,
                              serviceName: a.serviceName,
                            };
                            localStorage.setItem(
                              "userService",
                              JSON.stringify(data)
                            );
                            router.push("/pricing");
                          }
                        }}
                        title={a.serviceName}
                      />
                      // <button
                      //   data-aos="fade-up"
                      //   key={a.serviceName}
                      //   onClick={() => {
                      //     if (a.subServices) {
                      //       setSelectedService(a.serviceName);
                      //       router.push(
                      //         `/services?mainCategory=${encodeURIComponent(
                      //           selectedMainCategory
                      //         )}&subCategory=${encodeURIComponent(
                      //           selectedSubCategory
                      //         )}&serviceName=${encodeURIComponent(
                      //           a.serviceName
                      //         )}`
                      //       );
                      //     } else {
                      //       console.log("final page");
                      //     }
                      //   }}
                      //   className="h-40 w-40 p-2 bg-gradient3/20 hover:bg-gradient3/50 transition-all duration-300 rounded-2xl font-bold text-md filter backdrop-blur-lg"
                      // >
                      //   {a.serviceName}
                      // </button>
                    );
                  })}
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                <p className="text-3xl font-bold">{selectedService}</p>
              </div>
              <div className="flex justify-center items-center gap-8 flex-wrap">
                {allServices
                  .filter(
                    (elem) => elem.mainCategory === selectedMainCategory
                  )[0]
                  .subCategories.filter(
                    (ele) => ele.subCategory === selectedSubCategory
                  )[0]
                  .services.filter(
                    (eleme) => eleme.serviceName === selectedService
                  )[0]
                  .subServices?.map((a) => {
                    return (
                      <ServiceCard
                        key={a.subService}
                        onClick={() => {
                          setSelectedSubService(a.subService);
                          const data = {
                            mainCategory: selectedMainCategory,
                            subCategory: selectedSubCategory,
                            serviceName: selectedService,
                            subService: a.subService,
                          };
                          localStorage.setItem(
                            "userService",
                            JSON.stringify(data)
                          );
                          router.push("/pricing");
                        }}
                        title={a.subService}
                      />
                      // <button
                      //   data-aos="fade-up"
                      //   key={a.subService}
                      //   onClick={() => {
                      //     setSelectedSubService(a.subService);
                      //   }}
                      //   className="h-40 w-40 p-2 bg-gradient3/20 hover:bg-gradient3/50 transition-all duration-300 rounded-2xl font-bold text-md filter backdrop-blur-lg"
                      // >
                      //   {a.subService}
                      // </button>
                    );
                  })}
              </div>
            </>
          )}
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

export default Services;
