import React, { useEffect } from "react";
import DashNav from "../components/DashNav";
import Image from "next/image";
import PromoImg from "../public/dash1.jpg";
import Link from "next/link";
import Accordion from "../components/reusable/Accordion";
import Modal from "../components/reusable/Modal";

/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { GetServerSideProps } from "next";
import { addApolloState, initializeApollo } from "../lib/apolloClient";
import { MeDocument, MeQuery, useMeQuery } from "../graphql/generated/graphql";
import toast from "react-hot-toast";
import Loader from "../components/reusable/Loader";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const dummyServ = [
  {
    projName: null,
    name: "Mix & Master (Pro Mix)",
    // Submitted / Under Review / Work In Progress / Delivered / Revision Request Under Review / Revision Delivered
    status: [
      { name: "Submitted", href: "#", status: "upcoming" },
      { name: "Under Review", href: "#", status: "upcoming" },
      { name: "Work In Progress", href: "#", status: "upcoming" },
      { name: "Delivered", href: "#", status: "upcoming" },
      { name: "Revision Request", href: "#", status: "upcoming" },
      { name: "Revision Delivered", href: "#", status: "upcoming" },
    ],
    isExpanded: false,
    serviceDetails: {
      estimatedTime: "16 Hours",
      inputTrackLimit: 30,
      refFile: 3,
      deliveryFormat: "48/24 .wav mix file + Instrument bus stems",
      deliveryDays: 7,
      revisionDays: 3,
    },
  },
  {
    projName: "Dream",
    name: "Mix & Master (Pro Mix)",
    status: [
      { name: "Submitted", href: "#", status: "complete" },
      { name: "Under Review", href: "#", status: "complete" },
      { name: "Work In Progress", href: "#", status: "current" },
      { name: "Delivered", href: "#", status: "upcoming" },
      { name: "Revision Request", href: "#", status: "upcoming" },
      { name: "Revision Delivered", href: "#", status: "upcoming" },
    ],
    // Submitted / Under Review / Work In Progress / Delivered / Revision Request Under Review / Revision Delivered
    serviceDetails: {
      estimatedTime: "16 Hours",
      inputTrackLimit: 30,
      refFile: 3,
      deliveryFormat: "48/24 .wav mix file + Instrument bus stems",
      deliveryDays: 7,
      revisionDays: 3,
    },
  },
  {
    projName: "Stream",
    name: "Mix & Master (Pro Mix)",
    // Submitted / Under Review / Work In Progress / Delivered / Revision Request Under Review / Revision Delivered
    status: [
      { name: "Submitted", href: "#", status: "complete" },
      { name: "Under Review", href: "#", status: "complete" },
      { name: "Work In Progress", href: "#", status: "complete" },
      { name: "Delivered", href: "#", status: "complete" },
      { name: "Revision Request", href: "#", status: "complete" },
      { name: "Revision Delivered", href: "#", status: "complete" },
    ],
    isExpanded: false,
    serviceDetails: {
      estimatedTime: "16 Hours",
      inputTrackLimit: 30,
      refFile: 3,
      deliveryFormat: "48/24 .wav mix file + Instrument bus stems",
      deliveryDays: 7,
      revisionDays: 3,
    },
  },
];

function Dashboard() {
  const date = new Date();
  const hours = date.getHours();
  const [open, setOpen] = useState(false);

  const { data, loading, error } = useMeQuery();

  return (
    <div className="bg-darkBlue text-white flex">
      <DashNav name={data?.me.name} email={data?.me.email} />
      <div className="px-8 relative">
        <div className="absolute animation-delay-2000 top-[55%] left-[20%] w-36 md:w-96 h-56 bg-blueGradient-0 opacity-60 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        <div className="absolute animation-delay-4000 top-[60%] right-[35%] w-36 md:w-96 h-56 bg-blueGradient-2 opacity-80 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        <div className="mt-28">
          <Image
            objectFit="cover"
            height={900}
            className="rounded-xl"
            src={PromoImg}
          />
        </div>
        {/* Modal Start */}
        <Modal open={open} setOpen={setOpen}>
          <div className="space-y-4 text-center">
            <p className="text-center font-bold">Name your Project</p>
            <input
              className="w-full rounded-xl bg-white/20"
              type="text"
              name=""
              id=""
            />
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary/80 text-base font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm"
              onClick={() => setOpen(false)}
            >
              Proceed to upload
            </button>
          </div>
        </Modal>
        {/* Modal End */}
        <div className="py-4 space-y-3">
          <span className="text-2xl md:text-4xl font-bold">
            Good{" "}
            {hours < 12
              ? "Morning"
              : hours >= 12 && hours < 17
              ? "Afternoon"
              : "Evening"}
            , {"John"}.
          </span>
          <div className="text-lg md:text-xl">
            You have the following paid subscriptions in your account.
          </div>
        </div>

        {/* Paid Subscriptions */}

        <div className="py-6 md:px-4 space-y-10 z-50">
          {dummyServ.map((service, index) => (
            <Accordion
              modalTrigger={setOpen}
              service={service}
              key={service.name}
            />
          ))}
        </div>

        {/* Add */}

        <div className="text-center space-y-3">
          <Link href={"/services"}>
            <div className="h-24 w-24 bg-white/10 hover:bg-white/20 transition-colors duration-100 rounded-full cursor-pointer mx-auto grid place-items-center z-10">
              <svg
                className="z-0 fill-primary"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
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
            <Link href={"/services"}>
              <span className="group cursor-pointer">Add a service</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      props: {},
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
