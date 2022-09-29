import React, { useEffect } from "react";
import DashNav from "../components/DashNav";
import Button from "../components/reusable/Button";
import {
  AddOn,
  MeDocument,
  MeQuery,
  ServiceStatusObjectState,
  useGetServiceDetailsLazyQuery,
  useInitiateAddOnPaymentLazyQuery,
  useMarkCompletedLazyQuery,
  useMeQuery,
  useRequestRevisionLazyQuery,
  UserServices,
  UserServiceStatus,
} from "../graphql/generated/graphql";
import { useState } from "react";
import { UserServiceFinal } from "./dashboard";
import { getStatusNames } from "../components/reusable/Accordion";
import Link from "next/link";
import moment from "moment";
import toast from "react-hot-toast";
import Modal from "../components/reusable/Modal";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { type } from "os";
import { GetServerSideProps } from "next";
import { addApolloState, initializeApollo } from "../lib/apolloClient";
import Loader from "../components/reusable/Loader";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const TABLE_HEADERS = [
  "Service Name",
  "Note to Engineer",
  "Date of Submission",
  "Current Status",
  "Est. Delivery Date",
  "Reupload Notes",
  "Reupload Date",
  "Completed Date",
  "Upload",
  "Download",
  "Request Revision",
  "Mark Completed",
  "Additional Exports",
];

export interface UserServiceFinalTracking extends UserServiceFinal {
  additionalAddons: {
    main: boolean;
    type: string;
    price: number;
    qty: number;
  }[];
}

interface ITrackingProps {
  meServices: UserServices[];
  name: string;
  email: string;
}

const ServiceTracking = ({ meServices, name, email }: ITrackingProps) => {
  // const {
  //   data,
  //   loading: meQueryLoading,
  //   error,
  // } = useMeQuery({
  //   fetchPolicy: "network-only",
  // });

  const [getServiceDetailsQuery] = useGetServiceDetailsLazyQuery();
  const [initiatePaymentQuery] = useInitiateAddOnPaymentLazyQuery();
  const [markCompleteQuery] = useMarkCompletedLazyQuery();
  const [requestRevisionQuery] = useRequestRevisionLazyQuery();
  const [loading, setLoading] = useState<boolean>(false);

  const [services, setServices] = useState<UserServiceFinal[]>([]);
  const [selectedService, setSelectedService] = useState<UserServiceFinal>();
  const [filteredServices, setFilteredServices] = useState<UserServiceFinal[]>(
    []
  );
  const [tableHeaders, setTableHeaders] = useState<string[]>(TABLE_HEADERS);
  const [isRevModalOpen, setIsRevModalOpen] = useState<boolean>(false);
  const [isMarkCompletedOpen, setisMarkCompletedOpen] =
    useState<boolean>(false);
  const [revNotes, setRevNotes] = useState<string>("");
  const [revFor, setRevFor] = useState<number>(0);
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);

  const [isAddOnModalOpen, setIsAddOnModalOpen] = useState<boolean>(false);

  const [markCompleteVer, setMarkCompleteVer] = useState<number>(0);

  useEffect(() => {
    if (meServices.length > 0) {
      const servicesArr = meServices.filter((el) => el.projectName);
      const sortedArr = servicesArr.sort(
        (a, b) => moment(b.paidAt).valueOf() - moment(a.paidAt).valueOf()
      );
      setServices(sortedArr);
      setFilteredServices(sortedArr);
    }
  }, [meServices]);

  const handleMarkComplete = async (serviceId: string) => {
    try {
      const { data, error } = await markCompleteQuery({
        variables: {
          serviceId: serviceId,
          completedFor: markCompleteVer,
        },
      });

      // Handling Errors
      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }
      if (!data || !data.markCompleted) {
        setLoading(false);
        toast.error("Something went wrong, try again later.");
        return;
      }

      setLoading(false);
      toast.success("Project Marked As Completed");
      let arr = [...services];
      arr = arr.map((el) => ({
        ...el,
        statusType:
          el._id === serviceId ? UserServiceStatus.Completed : el.statusType,
      }));
      setServices(arr);
      setFilteredServices(arr);
      setisMarkCompletedOpen(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.toString());
    }
  };

  const handleAddonPaymentRevision = async () => {
    if (!selectedService) {
      toast.error("Something went wrong, please try again later.");
      return;
    }

    console.log(selectedService.allAddOns);

    setLoading(true);
    const { data, error } = await initiatePaymentQuery({
      variables: {
        amount:
          selectedService.allAddOns?.find((el) => el.type === "Extra Revision")
            ?.value ?? 0,
        serviceId: selectedService._id,
      },
      fetchPolicy: "network-only",
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (!data || !data.initiateAddOnPayment) {
      setLoading(false);
      toast.error("Something went wrong, try again later.");
      return;
    }

    setLoading(false);
    const order = JSON.parse(data.initiateAddOnPayment);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Bay Owl Studios",
      order_id: order.id,
      redirect: true,
      callback_url: process.env.NEXT_PUBLIC_RAZORPAY_CALLBACK_REVISION,
      theme: {
        color: "#f07202",
      },
      modal: {
        confirm_close: true,
      },
    };
    const razor = new (window as any).Razorpay(options);
    razor.open();

    return;
  };

  const handleAddonPaymentMultitrack = async () => {
    if (!selectedService) {
      toast.error("Something went wrong, please try again later.");
      return;
    }

    setLoading(true);
    const { data, error } = await initiatePaymentQuery({
      variables: {
        amount:
          selectedService.allAddOns?.find(
            (el) => el.type === "Additional Exports: Multitracks"
          )?.value ?? 0,
        serviceId: selectedService._id,
      },
      fetchPolicy: "network-only",
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (!data || !data.initiateAddOnPayment) {
      setLoading(false);
      toast.error("Something went wrong, try again later.");
      return;
    }

    setLoading(false);
    const order = JSON.parse(data.initiateAddOnPayment);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Bay Owl Studios",
      order_id: order.id,
      redirect: true,
      callback_url: process.env.NEXT_PUBLIC_RAZORPAY_CALLBACK_MULTITRACK,
      theme: {
        color: "#f07202",
      },
      modal: {
        confirm_close: true,
      },
    };
    const razor = new (window as any).Razorpay(options);
    razor.open();

    return;
  };

  const handleAddonPaymentStems = async () => {
    if (!selectedService) {
      toast.error("Something went wrong, please try again later.");
      return;
    }

    setLoading(true);
    const { data, error } = await initiatePaymentQuery({
      variables: {
        amount:
          selectedService.allAddOns?.find(
            (el) => el.type === "Additional Exports: Bus Stems"
          )?.value ?? 0,
        serviceId: selectedService._id,
      },
      fetchPolicy: "network-only",
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (!data || !data.initiateAddOnPayment) {
      setLoading(false);
      toast.error("Something went wrong, try again later.");
      return;
    }

    setLoading(false);
    const order = JSON.parse(data.initiateAddOnPayment);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Bay Owl Studios",
      order_id: order.id,
      redirect: true,
      callback_url: process.env.NEXT_PUBLIC_RAZORPAY_CALLBACK_STEMS,
      theme: {
        color: "#f07202",
      },
      modal: {
        confirm_close: true,
      },
    };
    const razor = new (window as any).Razorpay(options);
    razor.open();

    return;
  };

  const handleAddonPaymentsBoth = async (price: number) => {
    if (!selectedService) {
      toast.error("Something went wrong, please try again later.");
      return;
    }

    setLoading(true);
    const { data, error } = await initiatePaymentQuery({
      variables: {
        amount: price,
        serviceId: selectedService._id,
      },
      fetchPolicy: "network-only",
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (!data || !data.initiateAddOnPayment) {
      setLoading(false);
      toast.error("Something went wrong, try again later.");
      return;
    }

    setLoading(false);
    const order = JSON.parse(data.initiateAddOnPayment);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Bay Owl Studios",
      order_id: order.id,
      redirect: true,
      callback_url: process.env.NEXT_PUBLIC_RAZORPAY_CALLBACK_ADDONBOTH,
      theme: {
        color: "#f07202",
      },
      modal: {
        confirm_close: true,
      },
    };
    const razor = new (window as any).Razorpay(options);
    razor.open();

    return;
  };

  const handleRequestRevision = async (service: UserServiceFinal) => {
    let revs = [...service.revisionFiles];
    revs.sort((a, b) => b.revision - a.revision);
    let lastRevisionNumber: number = revs.length > 0 ? revs[0].revision + 1 : 1;
    let revisionForNumber: number = revFor;

    try {
      const { data, error } = await requestRevisionQuery({
        variables: {
          description: revNotes,
          revisionNumber: lastRevisionNumber,
          serviceId: service._id,
          revisionForNumber: revisionForNumber,
        },
      });

      // Handling Errors
      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }
      if (!data || !data.requestRevision) {
        setLoading(false);
        toast.error("Something went wrong, try again later.");
        return;
      }

      setLoading(false);
      setIsRevModalOpen(false);
      toast.success("Revision requested successfully");
      let arr = [...services];
      arr = arr.map((el) => ({
        ...el,
        statusType:
          el._id === service._id
            ? UserServiceStatus.Revisionrequest
            : el.statusType,
      }));
      setServices(arr);
      setFilteredServices(arr);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.toString());
    }
  };

  return (
    <div className="min-h-screen bg-darkBlue text-white flex relative ">
      <div className="absolute animation-delay-2000 top-[35%] left-[55%] w-36 md:w-96 h-56 bg-primary opacity-60 rounded-full mix-blend-screen filter blur-[75px] animate-blob overflow-hidden" />
      <div className="absolute animation-delay-4000 top-[60%] right-[35%] w-36 md:w-96 h-56 bg-blueGradient-2 opacity-80 rounded-full mix-blend-screen filter blur-[70px] animate-blob overflow-hidden" />
      <div className="absolute top-[60%] right-[15%] w-36 md:w-96 h-56 bg-blueGradient-1 opacity-80 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
      <DashNav name={name} email={email} />
      {/* Add On Modal */}
      <Modal open={isAddOnModalOpen} setOpen={setIsAddOnModalOpen}>
        <>
          <div className="relative text-center">
            <h4 className="font-bold pb-4  text-primary text-lg">
              Buy an add-on
            </h4>
            <svg
              onClick={() => {
                setIsAddOnModalOpen(false);
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute right-0 -top-3 w-6 h-6 hover:text-primary cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

            <div className="flex flex-col gap-3">
              {/* To also filter if the services are not already added. */}
              {selectedService?.allAddOns
                ?.filter((el) => !el.main && !el.type.includes("Revision"))
                .map((addOn) =>
                  (selectedService.multitrackFile &&
                    addOn.type.includes("Multitracks")) ||
                  (selectedService.stemsFiles &&
                    addOn.type.includes("Stems")) ? null : (
                    <div key={addOn.type}>
                      <label
                        htmlFor={addOn.type}
                        className="font-medium text-white "
                      >
                        <div className="border-2 border-gray-600 rounded-lg relative flex items-start py-4 px-3 justify-center">
                          <div className="min-w-0 flex-1 text-md">
                            <p
                              id="comments-description"
                              className="text-gray-200"
                            >
                              <span className="font-bold">{addOn.type}</span> -
                              ₹{addOn.value?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="flex justify-center items-center my-auto">
                            <input
                              id={addOn.type}
                              aria-describedby="comments-description"
                              name={addOn.type}
                              type="checkbox"
                              className="h-4 w-4 text-primary border-gray-300 rounded"
                              onChange={(e) => {
                                let arr = [...selectedAddons];
                                let elemFound = arr.find(
                                  (el) => el.type === addOn.type
                                );
                                if (elemFound) {
                                  arr = arr.filter(
                                    (el) => el.type !== addOn.type
                                  );
                                } else {
                                  arr.push(addOn);
                                }
                                setSelectedAddons(arr);
                              }}
                            />
                          </div>
                        </div>
                      </label>
                    </div>
                  )
                )}
            </div>
            <div className="w-fit mx-auto mt-5">
              <Button
                onClick={() => {
                  if (selectedAddons.length === 2) {
                    // Handle Both in one
                    handleAddonPaymentsBoth(
                      selectedAddons.reduce((accum, obj) => {
                        return accum + (obj.value ?? 0);
                      }, 0)
                    );
                  } else {
                    selectedAddons.map((el) => {
                      if (el.type === "Additional Exports: Multitracks") {
                        handleAddonPaymentMultitrack();
                      }
                      if (el.type === "Additional Exports: Bus Stems") {
                        handleAddonPaymentStems();
                      }
                    });
                  }
                }}
              >
                <div className=" mx-auto inline-block">Proceed</div>
              </Button>
            </div>
          </div>
        </>
      </Modal>

      {/* Revision Modal */}
      <Modal open={isRevModalOpen} setOpen={setIsRevModalOpen}>
        <>
          {selectedService && (
            <div className="relative text-center">
              <h4 className="font-bold pb-4  text-primary text-lg">
                Request a revision
              </h4>
              <svg
                onClick={() => {
                  setIsRevModalOpen(false);
                  setRevNotes("");
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="absolute right-0 -top-3 w-6 h-6 hover:text-primary cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>

              {selectedService && (
                <>
                  {selectedService?.setOfRevisions! >
                  selectedService.revisionFiles.length ? (
                    <div className="">
                      <p className="font-bold">
                        {" "}
                        {selectedService.revisionFiles.length} /{" "}
                        {selectedService.setOfRevisions} Revisions used.
                      </p>
                      <p className="mb-4 pb-2">
                        Which version are you requesting the revision for?
                      </p>
                      <div className="relative inline-flex mb-4 w-full max-w-sm">
                        <select
                          value={revFor}
                          onChange={(e) => setRevFor(parseInt(e.target.value))}
                          className="border block w-full bg-gray-800 border-gray-300 rounded-lg text-white h-10 pl-5 pr-10  hover:border-gray-800/10 outline-none border-none focus:outline-none appearance-none"
                        >
                          <option value={0}>Original Delivery</option>
                          {selectedService.revisionFiles.map(
                            (version, index) => (
                              <option key={version.revision} value={index + 1}>
                                Revision {index + 1}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <textarea
                        className="bg-gray-800 rounded-xl w-full h-[60%] my-2 placeholder:text-center max-w-sm outline-none border-none focus:outline-none"
                        name="Remarks"
                        id="remarks"
                        placeholder="Please enter notes for the engineer here."
                        value={revNotes}
                        onChange={(e) => setRevNotes(e.target.value)}
                      />
                      <div className="w-fit mx-auto">
                        <Button
                          onClick={() => {
                            handleRequestRevision(selectedService);
                            // setIsRevModalOpen(false);
                            // send revNotes to server
                          }}
                        >
                          <div className=" mx-auto inline-block">Proceed</div>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="pt-2 pb-4">
                        <div>
                          {
                            "You don't have any more revisions for this service."
                          }
                          <div className="w-fit mx-auto mt-4">
                            <Button
                              onClick={() => {
                                handleAddonPaymentRevision();
                                // setIsRevModalOpen(false);
                                // send revNotes to server
                              }}
                            >
                              <div className=" mx-auto inline-block">
                                Buy an extra revision
                              </div>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </>
      </Modal>

      {/* Mark Completed Modal */}
      <Modal open={isMarkCompletedOpen} setOpen={setisMarkCompletedOpen}>
        <>
          {selectedService && (
            <>
              <div className="relative text-center">
                <h4 className="font-bold pb-4  text-primary text-lg">
                  Project Completed
                </h4>
                <svg
                  onClick={() => {
                    setisMarkCompletedOpen(false);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute right-0 -top-3 w-6 h-6 hover:text-primary cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="mb-2">Which version did you finalize?</p>
                <p className="pt-2 pb-4">
                  Please note that you will only be able to request/purchase bus
                  and multitrack exports on the version that you mark as
                  completed.
                </p>
                <div className="relative inline-flex mb-4 w-full max-w-sm">
                  <select
                    value={markCompleteVer}
                    onChange={(e) =>
                      setMarkCompleteVer(parseInt(e.target.value))
                    }
                    className="border block w-full bg-gray-800 border-gray-300 rounded-lg text-white h-10 pl-5 pr-10  hover:border-gray-800/10 outline-none border-none focus:outline-none appearance-none"
                  >
                    <option value={0}>Original Delivery</option>
                    {selectedService?.revisionFiles &&
                      selectedService?.revisionFiles.map((version, index) => (
                        <option key={version.revision} value={index + 1}>
                          Revision {index + 1}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="w-fit mx-auto">
                  <Button
                    onClick={() => {
                      if (
                        getStatusNames(selectedService.statusType) ===
                          "Delivered" ||
                        getStatusNames(selectedService.statusType) ===
                          "Revision Delivered"
                      ) {
                        handleMarkComplete(selectedService._id);
                      }
                    }}
                  >
                    <div className=" mx-auto inline-block">Proceed</div>
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      </Modal>

      {loading ? (
        <Loader />
      ) : (
        <div className="mt-16 md:mt-0 md:py-10 relative w-full flex justify-center gap-3 md:overflow-hidden">
          {/* Scrollable Div Below, issue */}
          <div className="px-2 sm:px-3 lg:px-4 md:w-screen overflow-x-auto whitespace-nowrap relative z-[49]">
            <div className="w-full max-w-sm text-center text-xl sm:max-w-md text-white bg-white/10 rounded-md py-1 md:py-2 pl-2 pr-3 md:px-2 flex items-center gap-2 fixed">
              <input
                onChange={(e) => {
                  const input = e.target.value.toString().toLowerCase().trim();
                  if (input) {
                    const arr = [...services];
                    setFilteredServices(
                      arr.filter(
                        (el) =>
                          el.projectName
                            ?.toLocaleLowerCase()
                            .trim()
                            .includes(input.toLowerCase()) ||
                          el.statusType
                            .toLowerCase()
                            .includes(input.toLowerCase())
                      )
                    );
                  } else {
                    setFilteredServices(services);
                  }
                }}
                name="search"
                id="search"
                type={"search"}
                placeholder="Search by Project Name"
                className="w-full py-1 px-2 rounded-md border-none bg-transparent"
              />
              <div className="inline group">
                <span className=" flex gap-2 items-center md:mr-3 text-sm md:text-md">
                  <label className="" htmlFor="search">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="fill-gray-500 inline mb-1"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </label>
                </span>
              </div>
            </div>
            {/* <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto space-y-3">
                            <h1 className="text-xl font-semibold text-white">Service Tracking</h1>
                            <input className='bg-white/20 w-[60rem] rounded-md px-2 py-2' type="search" placeholder='Search by Brief ID, Project Name, Service Name or Date' name="" id="" />
                        </div>
                    </div> */}

            <div className="mt-16 flex flex-col md:pt-8">
              <div className="-my-2 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className=" shadow ring-1 ring-black ring-opacity-5 md:rounded-lg block">
                    <table className="w-full">
                      <thead className="bg-white/10">
                        <tr>
                          <th
                            scope="col"
                            className="whitespace-nowrap py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-white sm:pl-6 sticky -left-4 bg-black/40 z-[100] backdrop-blur-[6px] flicker-fix backface-hidden"
                          >
                            Project Name
                          </th>
                          {tableHeaders.map((el, idx) => (
                            <th
                              key={idx}
                              scope="col"
                              className="whitespace-nowrap px-2 py-3.5 text-center text-sm font-semibold text-white"
                            >
                              {el}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className=" ">
                        {filteredServices.map((transaction) => {
                          return (
                            <tr key={transaction._id}>
                              <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-white sticky -left-4 bg-black/60 z-50 backdrop-blur-[6px] flicker-fix backface-hidden">
                                {transaction.projectName}
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                                {transaction.serviceName}
                              </td>
                              <td className="whitespace-pre-wrap px-2 py-2 text-sm text-white">
                                {transaction.notes === "" || !transaction.notes
                                  ? "--"
                                  : transaction.notes}
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                                {transaction.submissionDate
                                  ? moment(transaction.submissionDate).format(
                                      "MMM Do YY, h:mm a"
                                    )
                                  : "--"}
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-white text-center">
                                <div className="flex items-center justify-center gap-2 h-full">
                                  <span className="relative z-10 w-4 h-4 flex items-center justify-center bg-white border-2 border-primary rounded-full">
                                    <span className="h-1 w-1 bg-primary rounded-full" />
                                  </span>
                                  <span>
                                    {getStatusNames(transaction.statusType)}
                                  </span>
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-white text-center">
                                {transaction.estDeliveryDate
                                  ? moment(transaction.estDeliveryDate).format(
                                      "MMM Do, YYYY"
                                    )
                                  : "--"}
                              </td>
                              <td className="whitespace-pre-wrap px-2 py-2 text-sm text-white">
                                {transaction.reupload
                                  ? transaction.reuploadNote
                                  : "--"}
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-white text-center">
                                {transaction.reupload
                                  ? moment(transaction.reupload).format(
                                      "MMM Do YY, h:mm a"
                                    )
                                  : "--"}
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-white text-center">
                                {transaction.completionDate
                                  ? moment(transaction.completionDate).format(
                                      "MMM Do YY, h:mm a"
                                    )
                                  : "--"}
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                                <Button
                                  disabled={
                                    getStatusNames(transaction.statusType) ===
                                    "Pending Upload"
                                      ? false
                                      : true
                                  }
                                >
                                  <div className="text-xs">
                                    {getStatusNames(transaction.statusType) ===
                                      "Pending Upload" &&
                                    transaction.reupload === null ? (
                                      <Link
                                        href={
                                          "/upload?serviceId=" + transaction._id
                                        }
                                      >
                                        Upload
                                      </Link>
                                    ) : getStatusNames(
                                        transaction.statusType
                                      ) === "Pending Upload" &&
                                      transaction.reupload !== null ? (
                                      <Link
                                        href={
                                          "/upload?serviceId=" +
                                          transaction._id +
                                          "&reupload=true"
                                        }
                                      >
                                        Reupload all files
                                      </Link>
                                    ) : (
                                      "Upload"
                                    )}
                                  </div>
                                </Button>
                              </td>
                              <td
                                className={`whitespace-nowrap px-2 py-2 text-sm text-white relative`}
                              >
                                {/* DIsabled unless delivered / revision delivered / completed */}

                                {transaction.revisionFiles.filter(
                                  (el) => el.file
                                ).length > 0 ||
                                transaction.stemsFiles ||
                                transaction.multitrackFile ? (
                                  <Menu
                                    as="div"
                                    className="relative inline-block text-left"
                                  >
                                    <div>
                                      <Menu.Button className="inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white/5 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-gray-50/10 gradient-border-2 border-gradient-btn">
                                        <span>Downloads</span>
                                        <ChevronDownIcon
                                          className="-mr-1 ml-2 h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </Menu.Button>
                                    </div>

                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-100"
                                      enterFrom="transform opacity-0 scale-95"
                                      enterTo="transform opacity-100 scale-100"
                                      leave="transition ease-in duration-75"
                                      leaveFrom="transform opacity-100 scale-100"
                                      leaveTo="transform opacity-0 scale-95"
                                    >
                                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-darkBlue/70 backdrop-blur-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                          <Menu.Item>
                                            {({ active }) => (
                                              <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={
                                                  transaction.deliveredFiles
                                                    ? transaction
                                                        .deliveredFiles[0]
                                                    : ""
                                                }
                                                className={classNames(
                                                  active
                                                    ? "bg-gray-100/20 text-white/80"
                                                    : "text-white",
                                                  "block px-4 py-2 text-sm"
                                                )}
                                              >
                                                Original Delivery
                                              </a>
                                            )}
                                          </Menu.Item>
                                          {transaction.stemsFiles && (
                                            <Menu.Item>
                                              {({ active }) => (
                                                <a
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  href={
                                                    transaction.stemsFiles ?? ""
                                                  }
                                                  className={classNames(
                                                    active
                                                      ? "bg-gray-100/20 text-white/80"
                                                      : "text-white",
                                                    "block px-4 py-2 text-sm"
                                                  )}
                                                >
                                                  Bus Stems Export
                                                </a>
                                              )}
                                            </Menu.Item>
                                          )}
                                          {transaction.multitrackFile && (
                                            <Menu.Item>
                                              {({ active }) => (
                                                <a
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  href={
                                                    transaction.multitrackFile ??
                                                    ""
                                                  }
                                                  className={classNames(
                                                    active
                                                      ? "bg-gray-100/20 text-white/80"
                                                      : "text-white",
                                                    "block px-4 py-2 text-sm"
                                                  )}
                                                >
                                                  Multitrack Exports
                                                </a>
                                              )}
                                            </Menu.Item>
                                          )}
                                          {transaction.revisionFiles
                                            .filter(
                                              (el) => el.file !== undefined
                                            )
                                            .map((version, index) => (
                                              <Menu.Item key={version.revision}>
                                                {({ active }) => (
                                                  <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={
                                                      version.file
                                                        ? version.file
                                                        : ""
                                                    }
                                                    className={classNames(
                                                      active
                                                        ? "bg-gray-100/20 text-white/80"
                                                        : "text-white",
                                                      "block px-4 py-2 text-sm"
                                                    )}
                                                  >
                                                    Revision {index + 1}
                                                  </a>
                                                )}
                                              </Menu.Item>
                                              // <option key={version.revision}>Revision {index + 1}</option>
                                            ))}
                                        </div>
                                      </Menu.Items>
                                    </Transition>
                                  </Menu>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      if (
                                        getStatusNames(
                                          transaction.statusType
                                        ) === "Delivered" ||
                                        getStatusNames(
                                          transaction.statusType
                                        ) === "Revision Delivered" ||
                                        getStatusNames(
                                          transaction.statusType
                                        ) === "Completed" ||
                                        getStatusNames(
                                          transaction.statusType
                                        ) === "Revision Requested"
                                      ) {
                                        const downloadA =
                                          document.createElement("a");
                                        (downloadA.href =
                                          transaction.deliveredFiles
                                            ? transaction.deliveredFiles[0]
                                            : ""),
                                          (downloadA.download = "true");
                                        downloadA.click();
                                      }
                                    }}
                                    disabled={
                                      !(
                                        getStatusNames(
                                          transaction.statusType
                                        ) === "Delivered" ||
                                        getStatusNames(
                                          transaction.statusType
                                        ) === "Revision Delivered" ||
                                        getStatusNames(
                                          transaction.statusType
                                        ) === "Completed"
                                      )
                                    }
                                  >
                                    <div className="text-xs">Download</div>
                                  </Button>
                                )}
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                                {/* Disabled unless Delivered, Revision Delivered, or if there are revisions left. */}
                                <Button
                                  onClick={() => {
                                    setIsRevModalOpen(true);
                                    setSelectedService(transaction);
                                  }}
                                  disabled={
                                    !(
                                      getStatusNames(transaction.statusType) ===
                                        "Delivered" ||
                                      getStatusNames(transaction.statusType) ===
                                        "Revision Delivered"
                                    )
                                    //|| !(
                                    //   transaction.setOfRevisions &&
                                    //   transaction.setOfRevisions >
                                    //   transaction.revisionFiles.length
                                    // )
                                  }
                                >
                                  <div className="text-xs">
                                    Request Revision
                                  </div>
                                </Button>
                              </td>

                              <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                                {/* Mark Completed Modal*/}

                                <Button
                                  onClick={() => {
                                    if (
                                      transaction?.revisionFiles.length! > 0
                                    ) {
                                      setSelectedService(transaction);
                                      setisMarkCompletedOpen(true);
                                    } else handleMarkComplete(transaction._id);
                                    // if (
                                    //   (transaction.revisionFiles.length! == 0 &&
                                    //     getStatusNames(
                                    //       transaction.statusType
                                    //     ) === "Delivered") ||
                                    //   getStatusNames(transaction.statusType) ===
                                    //     "Revision Delivered"
                                    // ) {
                                    //   handleMarkComplete(transaction._id);
                                    // }
                                  }}
                                  disabled={
                                    !(
                                      getStatusNames(transaction.statusType) ===
                                        "Delivered" ||
                                      getStatusNames(transaction.statusType) ===
                                        "Revision Delivered"
                                    )
                                  }
                                >
                                  <div className="text-xs">Mark Completed</div>
                                </Button>
                              </td>
                              <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                                <Button
                                  onClick={() => {
                                    setSelectedService(transaction);
                                    setIsAddOnModalOpen(true);
                                  }}
                                  disabled={
                                    getStatusNames(transaction.statusType) ===
                                      "Completed" &&
                                    (!transaction.addOnExportsBusStems ||
                                      !transaction.addOnExportsMultitrack)
                                      ? false
                                      : true
                                  }
                                >
                                  <div className="text-xs">Add Service</div>
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTracking;

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
