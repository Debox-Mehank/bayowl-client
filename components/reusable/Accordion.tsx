import React, { useState } from "react";
import { CheckIcon } from "@heroicons/react/solid";
import down from "../../public/down.svg";
import Button from "../../components/reusable/Button";
import Image from "next/image";
import { UserServiceStatus } from "../../graphql/generated/graphql";

interface Props {
  service: service;
  handleAccordionClick?: (id: string) => void;
}

interface service {
  id: string;
  projName?: string | null;
  name: string;
  status?: UserServiceStatus | null;
  serviceDetails: serviceDetails;
}

interface status {
  name: string;
  href: string;
  status: string;
}

interface serviceDetails {
  estimatedTime?: number | null;
  inputTrackLimit?: number | null;
  refFile?: number | null;
  deliveryFormat?: string | null;
  deliveryDays?: number | null;
  revisionDays?: number | null;
}

const status = [
  { name: "Submitted", href: "#", status: "upcoming" },
  { name: "Under Review", href: "#", status: "upcoming" },
  { name: "Work In Progress", href: "#", status: "upcoming" },
  { name: "Delivered", href: "#", status: "upcoming" },
  { name: "Revision Request", href: "#", status: "upcoming" },
  {
    name: "Revision Delivered",
    href: "#",
    status: "upcoming",
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

function Accordion({ service, handleAccordionClick }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className=" bg-white/5 rounded-lg p-2 sm:p-3 lg:p-4 xl:p-6"
      key={service.projName}
    >
      <div className="flex gap-4 items-center justify-between z-50">
        <div
          className="gap-4 flex flex-1 w-full items-center cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Image
            className={`inline duration-300 transition-transform ${
              isOpen ? "rotate-180" : null
            }`}
            height={30}
            width={30}
            src={down}
          />
          <span className="text-md md:text-2xl">
            {(service.projName ? service.projName : "Untitled Project") +
              " - " +
              service.name}
          </span>
        </div>

        <span
          onClick={() => {
            if (handleAccordionClick) {
              handleAccordionClick(service.id);
            }
          }}
          className={`${isOpen ? "hidden md:block" : null}`}
        >
          <Button>
            <>
              {service.status === UserServiceStatus.Pendingupload &&
              !service.projName
                ? "Get Started"
                : service.status === UserServiceStatus.Pendingupload &&
                  service.projName
                ? "Upload Files"
                : "Work in Progress"}
              {/* {service.status.find((service) => service.status === "current")
                ?.name
                ? service.status.find((service) => service.status === "current")
                    ?.name
                : service.status.every(
                    (service) => service.status === "complete"
                  )
                ? "Completed"
                : "Get Started"} */}
            </>
          </Button>
        </span>
      </div>

      {/* Expanded */}

      <div
        className={`filter backdrop-blur-lg rounded-lg top-14 w-full transition-all duration-300 overflow-hidden
         ${
           isOpen
             ? "max-h-[32rem] duration-500 transition-all ease-in"
             : "max-h-0 duration-300 transition-all ease-out"
         }`}
      >
        <div className="px-6 py-10">
          <hr className="border-1 drop-shadow-xl py-4" />
          {/* Plan Details */}
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="rounded-lg text-center py-5 md:px-10 bg-white/20 inline">
              Estimated Time
              <span className="block md:text-xl">
                {service.serviceDetails.estimatedTime}
              </span>
            </div>
            <div className="rounded-lg text-center py-5 md:px-10 bg-white/20 inline">
              Input Track Limit
              <span className="block md:text-xl">
                {service.serviceDetails.inputTrackLimit}
              </span>
            </div>
            <div className="rounded-lg text-center py-5 md:px-10 bg-white/20 inline">
              No. of Reference Files
              <span className="block md:text-xl">
                {service.serviceDetails.refFile}
              </span>
            </div>
            <div className="rounded-lg text-center py-5 md:px-10 bg-white/20 inline">
              Delivery Format
              <span className="block md:text-xl">
                {service.serviceDetails.deliveryFormat}
              </span>
            </div>
            <div className="rounded-lg text-center py-5 md:px-10 bg-white/20 inline">
              Revision Delivery Days
              <span className="block md:text-xl">
                {service.serviceDetails.deliveryDays}
              </span>
            </div>
          </div>

          {/* Progress tracker till sm - smaller screens  */}

          <nav
            aria-label="Progress"
            className="sm:hidden py-10 w-fit mx-auto text-center"
          >
            <ol role="list" className="overflow-hidden">
              {status.map((step: any, stepIdx: any) => (
                <li
                  key={step.name}
                  className={classNames(
                    stepIdx !== status.length - 1 ? "pb-10" : "",
                    "relative"
                  )}
                >
                  {step.status === "complete" ? (
                    <>
                      {stepIdx !== status.length - 1 ? (
                        <div
                          className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 bg-primary"
                          aria-hidden="true"
                        />
                      ) : null}
                      <a
                        href={step.href}
                        className="relative flex items-start group"
                      >
                        <span className="h-9 flex items-center">
                          <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-primary rounded-full group-hover:bg-primary">
                            <CheckIcon
                              className="w-5 h-5 text-white"
                              aria-hidden="true"
                            />
                          </span>
                        </span>
                        <span className="ml-4 min-w-0 flex flex-col">
                          <span className="text-xs font-semibold tracking-wide uppercase">
                            {step.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {step.description}
                          </span>
                        </span>
                      </a>
                    </>
                  ) : step.status === "current" ? (
                    <>
                      {stepIdx !== status.length - 1 ? (
                        <div
                          className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 bg-gray-300"
                          aria-hidden="true"
                        />
                      ) : null}
                      <a
                        href={step.href}
                        className="relative flex items-start group"
                        aria-current="step"
                      >
                        <span
                          className="h-9 flex items-center"
                          aria-hidden="true"
                        >
                          <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-primary rounded-full">
                            <span className="h-2.5 w-2.5 bg-primary rounded-full" />
                          </span>
                        </span>
                        <span className="ml-4 min-w-0 flex flex-col">
                          <span className="text-xs font-semibold tracking-wide uppercase text-primary">
                            {step.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {step.description}
                          </span>
                        </span>
                      </a>
                    </>
                  ) : (
                    <>
                      {stepIdx !== status.length - 1 ? (
                        <div
                          className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 bg-gray-300"
                          aria-hidden="true"
                        />
                      ) : null}
                      <a
                        href={step.href}
                        className="relative flex items-start group"
                      >
                        <span
                          className="h-9 flex items-center"
                          aria-hidden="true"
                        >
                          <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                            <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
                          </span>
                        </span>
                        <span className="ml-4 min-w-0 flex flex-col">
                          <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">
                            {step.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {step.description}
                          </span>
                        </span>
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {/* Progress Tracker for sm+ - bigger screens */}

          <nav aria-label="Progress" className="hidden sm:block">
            <ol
              role="list"
              className="flex items-center justify-center pt-8 pb-8 text-center"
            >
              {status.map((step, stepIdx) => (
                <li
                  key={step.name}
                  className={classNames(
                    stepIdx !== status.length - 1 ? "pr-8 sm:pr-20" : "",
                    "relative"
                  )}
                >
                  {step.status === "complete" ? (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-primary" />
                      </div>
                      <a
                        href="#"
                        className="relative w-8 h-8 flex flex-col items-center justify-center bg-primary rounded-full hover:bg-primary"
                      >
                        <CheckIcon
                          className="w-5 h-5 text-white fill-white"
                          aria-hidden="true"
                        />
                        <span className="absolute top-10">{step.name}</span>
                      </a>
                    </>
                  ) : step.status === "current" ? (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <a
                        href="#"
                        className="relative w-8 h-8 flex items-center justify-center bg-white border-4 border-primary rounded-full"
                        aria-current="step"
                      >
                        <span
                          className="h-2.5 w-2.5 bg-primary rounded-full"
                          aria-hidden="true"
                        />
                        <span className="mt-24">{step.name}</span>
                      </a>
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <a
                        href="#"
                        className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400"
                      >
                        <span
                          className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
                          aria-hidden="true"
                        />
                        <span className="mt-24">{step.name}</span>
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      {/* Expanded End */}
    </div>
  );
}

export default Accordion;

// ${isOpen ? "opacity-100 translate-0 max-h-full" : "opacity-0 invisible -translate-y-8 max-h-0"}
