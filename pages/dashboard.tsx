import React, { useEffect } from "react";
import DashNav from "../components/DashNav";
import Image from "next/image";
import Link from "next/link";
import Accordion from "../components/reusable/Accordion";
import Modal from "../components/reusable/Modal";

/* This example requires Tailwind CSS v2.0+ */
import { useState } from "react";
import { GetServerSideProps } from "next";
import { addApolloState, initializeApollo } from "../lib/apolloClient";
import {
  MeDocument,
  MeQuery,
  useActiveDashboardContentQuery,
  UserServices,
  UserServiceStatus,
  useUpdatePorjectNameLazyQuery,
} from "../graphql/generated/graphql";
import toast from "react-hot-toast";
import Loader from "../components/reusable/Loader";
import { useRouter } from "next/router";
import moment from "moment";

export type UserServiceFinal = UserServices;

interface IDashboardProps {
  meServices: UserServices[];
  name: string;
  email: string;
}

export const Dashboard = ({ meServices, name, email }: IDashboardProps) => {
  const router = useRouter();
  const date = new Date();
  const hours = date.getHours();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [services, setServices] = useState<UserServiceFinal[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [currentContent, setCurrentContent] = useState<number>(0);

  const [updateProjectName] = useUpdatePorjectNameLazyQuery();

  const handleAccordionClick = (id: string) => {
    setOpen(true);
    setServiceId(id);
  };

  const handleSubmit = async () => {
    if (!projectName) {
      toast.error("Please provide a project name to proceed");
      return;
    }

    if (!serviceId) {
      toast.error("Something went wrong please try again later");
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await updateProjectName({
        variables: { projectName: projectName, serviceId: serviceId },
      });

      if (error) {
        setIsLoading(false);
        toast.error(error.message);
        return;
      }

      if (!data || !data.updatePorjectName) {
        setIsLoading(false);
        toast.error("Something went wrong, try again later.");
        return;
      }

      const copyServices = [...services];
      const foundServiceIdx = copyServices.findIndex(
        (el) => el._id === serviceId
      );
      if (foundServiceIdx >= 0) {
        copyServices[foundServiceIdx].projectName = projectName;
      }
      setServices(copyServices);
      router.push(`/upload?serviceId=${copyServices[foundServiceIdx]._id}`);
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong please try again later");
      return;
    }
  };

  const {
    data: dashboardContents,
    loading: dashboardContentLoading,
    error: dashboardContentError,
  } = useActiveDashboardContentQuery({ fetchPolicy: "cache-and-network" });

  useEffect(() => {
    if (meServices.length > 0) {
      setIsLoading(true);
      const filteredArr = meServices.filter(
        (el) => el.statusType !== UserServiceStatus.Completed
      );
      const sortedArr = filteredArr.sort(
        (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
      );
      setIsLoading(false);
      setServices(sortedArr);
    }
  }, [meServices]);

  useEffect(() => {
    var contentInterval: NodeJS.Timeout;
    // Slider
    if ((dashboardContents?.activeDashboardContent.length ?? 0) > 1) {
      contentInterval = setInterval(() => {
        setCurrentContent((prev) =>
          (dashboardContents?.activeDashboardContent.length ?? 0) - 1 === prev
            ? 0
            : prev + 1
        );
      }, 10000);
    }

    return () => clearInterval(contentInterval);
  }, [dashboardContents?.activeDashboardContent]);

  return (
    <div className="bg-darkBlue text-white flex">
      <DashNav name={name} email={email} />
      <div className="px-8 relative z-0 w-full">
        <div className="absolute animation-delay-2000 top-[55%] left-[20%] w-36 md:w-96 h-56 bg-blueGradient-0 opacity-60 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden pointer-events-none" />
        <div className="absolute animation-delay-4000 top-[60%] right-[35%] w-36 md:w-96 h-56 bg-blueGradient-2 opacity-80 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden pointer-events-none" />
        {isLoading || dashboardContentLoading ? (
          <Loader />
        ) : (
          dashboardContents?.activeDashboardContent.map((el, idx) => {
            if (currentContent === idx) {
              return (
                <div
                  data-aos="fade-in"
                  data-aos-duration="500"
                  data-aos-easing="ease-in-out"
                  data-aos-mirror="true"
                  className="mt-28 w-full h-32 lg:h-40 relative"
                  key={idx}
                >
                  <Image
                    objectFit="cover"
                    layout="fill"
                    className="rounded-xl"
                    priority
                    src={
                      dashboardContents?.activeDashboardContent[idx].image ?? ""
                    }
                  />
                </div>
              );
            } else {
              return null;
            }
          })
        )}
        {/* Modal Start */}
        <Modal open={open} setOpen={setOpen}>
          <div className="space-y-4 text-center">
            <svg
              onClick={() => setOpen(false)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute right-2 top-2 w-6 h-6 hover:text-primary cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

            <p className="text-center font-bold">Name your Project</p>
            <input
              className="w-full rounded-xl bg-white/20"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary/80 text-base font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
              onClick={handleSubmit}
            >
              Proceed to upload
            </button>
          </div>
        </Modal>
        {/* Modal End */}
        <div className="py-4 space-y-3">
          <span className="text-xl md:text-3xl font-bold">
            Good{" "}
            {hours < 12 && hours > 4
              ? "Morning"
              : hours >= 12 && hours < 17
              ? "Afternoon"
              : "Evening"}
            , {name}.
          </span>
          <div className="text-sm md:text-lg">
            {(meServices.length ?? 0) > 0
              ? "You have the following paid subscriptions in your account."
              : "You don't have any paid services, click below to start with a new service."}
          </div>
        </div>

        {/* Paid Subscriptions */}

        <div className="py-6 space-y-10">
          {services
            .filter((el) => el.paid)
            .map((service, index) => (
              <Accordion
                handleAccordionClick={handleAccordionClick}
                service={service}
                key={index}
              />
            ))}
        </div>

        {/* Add */}

        <div className="text-center space-y-3 pb-8">
          <Link href={"/services"} passHref>
            <div className="h-14 w-14 md:h-24 md:w-24 bg-white/10 hover:bg-white/20 transition-colors duration-100 rounded-full cursor-pointer mx-auto grid place-items-center">
              <svg
                className="z-0 fill-primary h-7 w-7 md:w-10 md:h-10"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                />
              </svg>
            </div>
          </Link>

          <div className="">
            <Link href={"/services"} passHref>
              <span className="group cursor-pointer">Add a service</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  try {
    const meQueryData = await apolloClient.query<MeQuery>({
      query: MeDocument,
    });

    if (meQueryData.error || meQueryData.errors) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return addApolloState(apolloClient, {
      props: {
        meServices: meQueryData.data.me.services,
        name: meQueryData.data.me.name ?? "",
        email: meQueryData.data.me.email,
      },
    });
  } catch (error: any) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
