import React, { useState } from "react";
import { CheckIcon } from "@heroicons/react/solid";
import down from "../../public/down.svg";
import Button from "../../components/reusable/Button";
import Image from "next/image";
import { UserServiceFinal } from "../../pages/dashboard";
import {
  ServiceStatusObjectState,
  UserServiceStatus,
} from "../../graphql/generated/graphql";
import { useRouter } from "next/router";
import useMediaQuery from "../../hooks/useMediaQuery";

interface Props {
  service: UserServiceFinal;
  handleAccordionClick?: (id: string) => void;
}

const getButtonText = (service: UserServiceFinal): string => {
  let btnText = "";
  if (
    service.statusType === UserServiceStatus.Pendingupload &&
    !service.projectName
  ) {
    btnText = "Get Started";
  } else if (
    service.statusType === UserServiceStatus.Pendingupload &&
    service.projectName
  ) {
    if (service.reupload) {
      btnText = "Reupload Files";
    } else {
      btnText = "Upload Files";
    }
  } else if (service.statusType === UserServiceStatus.Underreview) {
    if (service.reupload) {
      btnText = "Under Review For Reupload";
    } else {
      btnText = "Under Review";
    }
  } else if (
    service.statusType === UserServiceStatus.Workinprogress ||
    service.statusType === UserServiceStatus.Underreviewinternal
  ) {
    btnText = "Work In Progress";
  } else if (service.statusType === UserServiceStatus.Delivered) {
    btnText = "Delivered";
  } else if (service.statusType === UserServiceStatus.Revisionrequest) {
    btnText = "Revision Requested";
  } else if (service.statusType === UserServiceStatus.Revisiondelivered) {
    btnText = "Revision Delivered";
  } else if (service.statusType === UserServiceStatus.Completed) {
    btnText = "Completed";
  }
  return btnText;
};

export const getStatusNames = (s: UserServiceStatus): string => {
  let txt = "";
  if (s === UserServiceStatus.Pendingupload) {
    txt = "Pending Upload";
  } else if (s === UserServiceStatus.Underreview) {
    txt = "Under Review";
  } else if (
    s === UserServiceStatus.Workinprogress ||
    s === UserServiceStatus.Underreviewinternal
  ) {
    txt = "Work In Progress";
  } else if (s === UserServiceStatus.Delivered) {
    txt = "Delivered";
  } else if (s === UserServiceStatus.Revisionrequest) {
    txt = "Revision Requested";
  } else if (s === UserServiceStatus.Revisiondelivered) {
    txt = "Revision Delivered";
  } else if (s === UserServiceStatus.Completed) {
    txt = "Completed";
  }
  return txt;
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

function Accordion({ service, handleAccordionClick }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="bg-white/5 rounded-lg p-4 xl:p-6" key={service._id}>
      <div className="flex gap-4 items-center justify-between z-50">
        <div
          className="gap-4 flex flex-1 w-full items-center cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Image
            className={`inline duration-300 transition-transform ${
              isOpen ? "rotate-180" : null
            }`}
            height={isDesktop ? 30 : 15}
            width={isDesktop ? 30 : 15}
            src={down}
          />
          <span className="text-lg md:text-2xl">
            {(service.projectName ? service.projectName : "Untitled Project") +
              " - " +
              `${
                service.subService ? service.subService : service.serviceName
              }`}
          </span>
        </div>

        <span
          onClick={() => {
            if (
              service.statusType === UserServiceStatus.Pendingupload &&
              !service.projectName
            ) {
              if (handleAccordionClick) {
                handleAccordionClick(service._id);
              }
            } else if (
              service.statusType === UserServiceStatus.Pendingupload &&
              service.projectName
            ) {
              router.push(`/upload?serviceId=${service._id}`);
            }
          }}
          className={"hidden md:block"}
        >
          <Button>
            <>{getButtonText(service)}</>
          </Button>
        </span>
      </div>

      {/* Expanded */}

      <div
        className={`filter rounded-lg top-14 w-full transition-all duration-300 overflow-hidden
         ${
           isOpen
             ? "max-h-[100rem] duration-500 transition-all ease-in"
             : "max-h-0 duration-300 transition-all ease-out"
         }`}
      >
        <div className="px-6 py-10">
          <hr className="border-1 drop-shadow-xl py-4" />
          {/* Plan Details */}
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="rounded-lg text-center py-5 md:px-10 bg-white/20 inline">
              Input Track Limit
              <span className="block md:text-xl">
                {service.inputTrackLimit}
              </span>
            </div>
            <div className="rounded-lg text-center py-5 md:px-10 bg-white/20 inline">
              Delivery Format
              <span className="block md:text-xl">
                {service.deliveryFileFormat.join(", ")}
              </span>
            </div>
            <div className="rounded-lg text-center py-5 md:px-10 bg-white/20 inline">
              Revision Delivery Days
              <span className="block md:text-xl">
                {service.revisionsDelivery}
              </span>
            </div>
          </div>

          {/* Progress tracker till sm - smaller screens  */}
          <nav
            aria-label="Progress"
            className="sm:hidden py-10 w-fit mx-auto text-center"
          >
            <span className="font-bold">Current Status:</span>
            <ol role="list" className="overflow-hidden">
              {service.status.map((step, stepIdx) => (
                <li
                  key={step.name}
                  className={classNames(
                    stepIdx !== service.status.length - 1 ? "" : "",
                    "relative mt-4"
                  )}
                >
                  {step.state === ServiceStatusObjectState.Completed ? (
                    <>
                      {stepIdx !== service.status.length - 1 ? (
                        <div
                          className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 bg-primary"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start group">
                        <span className="h-9 flex items-center">
                          <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-primary rounded-full group-hover:bg-primary">
                            <CheckIcon
                              className="w-5 h-5 text-white"
                              aria-hidden="true"
                            />
                          </span>
                        </span>
                        <span className="ml-4 min-w-0 flex flex-col">
                          <span className="text-xs font-semibold tracking-wide ">
                            {getStatusNames(step.name!)}
                          </span>
                        </span>
                      </div>
                    </>
                  ) : step.state === ServiceStatusObjectState.Current ? (
                    <>
                      {stepIdx !== service.status.length - 1 ? (
                        <div
                          className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 bg-gray-300"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div
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
                        <span className="ml-4 min-w-0 flex flex-col self-center">
                          <span className="text-xs font-semibold text-primary">
                            {getStatusNames(step.name!)}
                          </span>
                        </span>
                      </div>
                    </>
                  ) : null}
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
              {service.status.map((step, stepIdx) => (
                <li
                  key={step.name}
                  className={classNames(
                    stepIdx !== service.status.length - 1
                      ? "pr-8 sm:pr-20"
                      : "",
                    "relative"
                  )}
                >
                  {step.state === ServiceStatusObjectState.Completed ? (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-primary" />
                      </div>
                      <div className="relative w-8 h-8 flex flex-col items-center justify-center bg-primary rounded-full hover:bg-primary">
                        <CheckIcon
                          className="w-5 h-5 text-white fill-white"
                          aria-hidden="true"
                        />
                        <span className="absolute top-10 text-sm">
                          {getStatusNames(step.name!)}
                        </span>
                      </div>
                    </>
                  ) : step.state === ServiceStatusObjectState.Current ? (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <div
                        className="relative w-8 h-8 flex items-center justify-center bg-white border-4 border-primary rounded-full"
                        aria-current="step"
                      >
                        <span
                          className="h-2.5 w-2.5 bg-primary rounded-full"
                          aria-hidden="true"
                        />
                        <span className="mt-24 text-sm">
                          {getStatusNames(step.name!)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="h-0.5 w-full bg-gray-200" />
                      </div>
                      <div className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400">
                        <span
                          className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
                          aria-hidden="true"
                        />
                        <span className="mt-24 text-sm">
                          {getStatusNames(step.name!)}
                        </span>
                      </div>
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
