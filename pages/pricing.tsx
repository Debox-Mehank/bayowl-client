import axios from "axios";
import useElementSize from "../hooks/useElementSize";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import Button from "../components/reusable/Button";
import {
  AddOn,
  Services,
  useGetServiceDetailsLazyQuery,
  useInitiatePaymentLazyQuery,
} from "../graphql/generated/graphql";
import Modal from "../components/reusable/Modal";
import secondsToTime from "../utils/secsToTime";
import _ from "lodash";
import Loader from "../components/reusable/Loader";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface PricingServices extends Services {
  pricingArr: { name: string; price: number; id: string }[];
}

const Pricing = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<PricingServices[]>();
  const [selectedServiceFinal, setSelectedServiceFinal] =
    useState<PricingServices>();
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);
  const [email, setEmail] = useState<string>("");
  const [getServiceDetailsQuery] = useGetServiceDetailsLazyQuery();
  const [initiatePaymentQuery] = useInitiatePaymentLazyQuery();
  const [bottomBarEl, { width, height: bottomBarHeight }] = useElementSize();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [types, setTypes] = useState<
    { name: string; price: number; id: string }[]
  >([]);
  const [selectedServiceForType, setSelectedServiceForType] =
    useState<PricingServices>();

  useEffect(() => {
    const userServiceLS = localStorage.getItem("userService");

    const fetchFunc = async () => {
      const userService = JSON.parse(userServiceLS!);

      setLoading(true);
      const { data, error } = await getServiceDetailsQuery({
        variables: {
          input: {
            mainCategory: userService.mainCategory,
            subCategory: userService.subCategory,
            serviceName: userService.serviceName,
          },
        },
      });

      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }

      if (!data || !data.getServiceDetails) {
        setLoading(false);
        toast.error("Something went wrong, try again later.");
        return;
      }

      let arr: PricingServices[] = [];
      let priceArr: {
        id: string;
        name: string;
        price: number;
      }[] = [];

      data.getServiceDetails.forEach((elem: Services) => {
        const check = arr.findIndex(
          (el) =>
            el.mainCategory === elem.mainCategory &&
            el.subCategory === elem.subCategory &&
            el.serviceName === elem.serviceName &&
            el.subService === elem.subService
        );
        priceArr.push({
          id:
            elem.mainCategory +
            "-" +
            elem.subCategory +
            "-" +
            elem.serviceName +
            "-" +
            elem.subService,
          name: elem.subService2 ? elem.subService2 : elem.serviceName,
          price: elem.price,
        });
        if (check < 0) {
          arr.push({
            ...elem,
            pricingArr: [
              {
                id: elem._id,
                name: elem.subService2 ? elem.subService2 : elem.serviceName,
                price: elem.price,
              },
            ],
          });
        } else {
          arr[check].pricingArr.push({
            id: elem._id,
            name: elem.subService2 ? elem.subService2 : elem.serviceName,
            price: elem.price,
          });
        }
      });

      setTypes(priceArr);

      // console.log(_.uniqBy(priceArr, (el) => el.name));

      setSelectedService(arr);
    };

    if (userServiceLS) {
      fetchFunc();
    }
  }, []);

  const handleProceed = async () => {
    if (selectedServiceFinal) {
      if (!localStorage.getItem("loggedIn") && email === "") {
        toast.error("Please provide your email before proceeding");
        return;
      }
      const total =
        selectedServiceFinal.price +
        selectedAddons.reduce((acc, o) => acc + o.value! * o.qty!, 0);

      const finalService = { ...selectedServiceFinal };

      const clone = (({
        __typename,
        _id,
        createdAt,
        updatedAt,
        pricingArr,
        ...o
      }) => o)(finalService);

      setLoading(true);
      const { data, error } = await initiatePaymentQuery({
        variables: {
          service: {
            ...clone,
            addOn: selectedAddons.map((el) => ({
              type: el.type,
              value: el.value,
            })),
            price: total,
          },
          email: email === "" ? null : email,
        },
        fetchPolicy: "network-only",
      });

      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }

      if (!data || !data.initiatePayment) {
        setLoading(false);
        toast.error("Something went wrong, try again later.");
        return;
      }

      setLoading(false);
      if (email === "") {
        const order = JSON.parse(data.initiatePayment);

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Bay Owl Studios",
          order_id: order.id,
          redirect: true,
          callback_url: process.env.NEXT_PUBLIC_RAZORPAY_CALLBACK,
          prefill: {
            email: email,
          },
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
      }

      toast.success(
        `Verification mail has been sent to your mail id, once your verification is done you will receive a payment link to complete the payment`,
        { duration: 3000 }
      );
      localStorage.clear();
      router.replace("/");
    }
  };

  return (
    <div className="">
      <Modal open={isPlanModalOpen} setOpen={setIsPlanModalOpen}>
        <div className="relative text-center">
          <svg
            onClick={() => setIsPlanModalOpen(false)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 absolute hover:text-primary cursor-pointer -top-3 -right-3 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p className="font-bold">
            Please select how you would like to proceed.
          </p>

          <div className="flex pt-8 gap-4">
            {/*  setSelectedPlan(true);
            setIsPlanModalOpen(true)
            setSelectedServiceFinal(tier); */}
            <Button
              onClick={() => {
                if (!selectedServiceForType) {
                  return;
                }

                if (
                  selectedServiceForType?.subService &&
                  selectedServiceForType.subService2
                ) {
                  const pricArr = [...types];
                  console.log(pricArr);
                  const findPrice = pricArr.find(
                    (el) =>
                      el.id ===
                      `${selectedServiceForType.mainCategory}-${selectedServiceForType.subCategory}-${selectedServiceForType.serviceName}-${selectedServiceForType.subService}` &&
                      el.name === "Commercial Rate"
                  );
                  if (!findPrice) {
                    return;
                  }
                  setIsPlanModalOpen(false);
                  setSelectedServiceFinal({
                    ...selectedServiceForType,
                    subService2: "Commercial Rate",
                    price: findPrice.price,
                  });
                } else {
                  setIsPlanModalOpen(false);
                  setSelectedServiceFinal(selectedServiceForType);
                }
              }}
            >
              <>Commercial Rate</>
            </Button>
            <Button
              onClick={() => {
                if (!selectedServiceForType) {
                  return;
                }

                if (
                  selectedServiceForType?.subService &&
                  selectedServiceForType.subService2
                ) {
                  const pricArr = [...types];
                  console.log(pricArr);
                  const findPrice = pricArr.find(
                    (el) =>
                      el.id ===
                      `${selectedServiceForType.mainCategory}-${selectedServiceForType.subCategory}-${selectedServiceForType.serviceName}-${selectedServiceForType.subService}` &&
                      el.name === "Independent Artist Rate"
                  );
                  if (!findPrice) {
                    return;
                  }
                  setIsPlanModalOpen(false);
                  setSelectedServiceFinal({
                    ...selectedServiceForType,
                    subService2: "Independent Artist Rate",
                    price: findPrice.price,
                  });
                } else {
                  setIsPlanModalOpen(false);
                  setSelectedServiceFinal(selectedServiceForType);
                }
              }}
            >
              <>Independent Artist Rate</>
            </Button>
          </div>
          <div className="pt-4 space-y-2 text-sm">
            <hr className="my-1 mb-4 h-px bg-gray-200 border-0 dark:bg-gray-700" />
            <p>
              <span className="font-bold"> Commercial Rate </span> - If backed
              by a label or management or using the file for commercial
              purposes.
            </p>
            <p>
              <span className="font-bold">Independent Rate</span> - For
              independent musicians and artists releasing their own music
              without an existing agreement to sell the song commercially
            </p>
          </div>
        </div>
      </Modal>
      {<div className="text-white relative">
        <div className="absolute animation-delay-2000 top-[35%] left-[35%] w-36 md:w-96 h-56 bg-blueGradient-0 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        <div className="absolute top-[42%] right-[34%] w-36 md:w-80 h-72 bg-orange3 opacity-60 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        <div className="max-w-7xl mx-auto lg:py-8 relative">
          <svg
            onClick={() => {
              !selectedServiceFinal && router.back();
              selectedServiceFinal && setSelectedServiceFinal(undefined);
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="30"
            className="fill-white hover:fill-primary duration-300 transition-colors cursor-pointer absolute left-4 top-4 z-10 lg:top-10 xl:-left-8"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
          {/* Title */}
          {!selectedServiceFinal && (
            <div className=" mt-6 text-center font-bold text-xl mb-8 mx-auto space-y-2 md:bg-darkBlue/30 md:backdrop-blur-xl z-20 px-4 pb-3">

              {selectedService && selectedService[0].subService ? selectedService[0].serviceName : selectedService && selectedService[0].subCategory}

            </div>
          )}
          {selectedService &&
            selectedService[0].subService2 &&
            !selectedServiceFinal ? (
            // For 4 level nesting
            <>
              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto ">
                <table className="w-full table-fixed">
                  <caption className="sr-only">Pricing plan comparison</caption>
                  <thead className=" top-0  left-0 z-20 backdrop-blur-xl bg-darkBlue/30 divide-y divide-blueGradient-2">
                    <tr>
                      <th
                        className="pb-4 px-6 text-md font-medium text-left w-60"
                        scope="col"
                      >
                        <span>Services</span>
                      </th>
                      {selectedService.map((tier, idx) => (
                        <th
                          key={idx}
                          className="w-1/4 pb-4 px-6 text-lg leading-6 font-medium text-center"
                          scope="col"
                        >
                          {tier.subService}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="border-t border-gray-200 divide-y divide-blueGradient-2">
                    <tr>
                      <th
                        className="py-8 px-6 text-sm font-medium text-left align-top"
                        scope="row"
                      ></th>
                      {selectedService.map((tier, idx) => (
                        <td key={idx} className="h-full py-2 px-6 align-top">
                          <div className="relative h-full table text-center text-sm mx-auto">
                            <p className="pt-4 text-white h-44 py-8 whitespace-pre-wrap ">
                              {tier.description}
                            </p>
                            {/* <p className="text-2xl">
                              ₹{tier.price.toLocaleString("en-IN")}
                            </p> */}
                            <button
                              onClick={() => {
                                //   setSelectedPlan(true);
                                setIsPlanModalOpen(true);
                                setSelectedServiceForType(tier);
                              }}
                              className="mt-6 mb-4 text-lg bg-blueGradient-3/60 hover:bg-gradient1 transition-colors duration-300 font-bold py-2 px-5 rounded-lg"
                            >
                              Buy now
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                    {selectedService.every(
                      (tier) => tier.subService && tier.subService2
                    ) && (
                        <>
                          {_.uniqBy(types, (el) => el.name).map((el, elIdx) => {
                            return (
                              <tr key={el.id} className="text-center">
                                <th
                                  className="py-5 px-6 text-sm font-normal text-white text-left"
                                  scope="row"
                                >
                                  {el.name}
                                </th>
                                {selectedService.map((tier, tierIdx) => (
                                  <td key={tierIdx} className="py-5 px-6">
                                    <span className="block text-sm text-white">
                                      ₹{" "}
                                      {tier.pricingArr
                                        .find((e) => e.name === el.name)
                                        ?.price.toLocaleString("en-IN")}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </>
                      )}

                    {selectedService.every(
                      (tier) => tier.estimatedTime != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Estimated Time On Project"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.estimatedTime}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.inputTrackLimit != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Track Count Limit"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.inputTrackLimit}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.uploadFileFormat != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Upload File Format"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.uploadFileFormat.join(", ")}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.deliveryFileFormat != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Delivery Format"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.deliveryFileFormat.join(", ")}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.deliveryDays != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Delivery Days"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.deliveryDays}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.maxFileDuration != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"File(s) Duration Limit"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {secondsToTime(tier.maxFileDuration!)}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.numberOfReferenceFileUploads != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Additional Reference Files"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.numberOfReferenceFileUploads}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.setOfRevisions != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Revisions"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.setOfRevisions}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.revisionsDelivery != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Revision Delivery Days"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.revisionsDelivery}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}

                    {selectedService.every(
                      (tier) => tier.mixVocalTuningBasic != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Mix Processing: Basic Vocal Tuning"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.mixVocalTuningBasic}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.mixVocalTuningAdvanced != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Mix Processing: Advanced Vocal Tuning"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.mixVocalTuningAdvanced}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.mixProcessingReverbs != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Mix Processing: Reverbs"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.mixProcessingReverbs}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.mixProcessingDelays != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Mix Processing: Delays"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.mixProcessingDelays}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.mixProcessingOtherFx != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Mix Processing: Other Fx"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.mixProcessingOtherFx}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
              {/* Mobile View */}
              <div className="max-w-2xl mx-auto lg:hidden ">
                {selectedService.map((tier, tierIdx) => (
                  <section key={tierIdx}>
                    <div className="px-4 mb-8">
                      <div className="sticky top-0 left-0 backdrop-blur-sm pt-4 pb-2">
                        <h2 className="text-lg leading-6 font-medium">
                          {tier.subService ?? tier.serviceName}
                        </h2>
                        <p className="mt-4 text-sm text-white">
                          {tier.description}
                        </p>
                        <div className="text-center">
                          <button
                            onClick={() => {
                              //   setSelectedPlan(true);
                              setIsPlanModalOpen(true);
                              setSelectedServiceForType(tier);
                            }}
                            className="mt-6 mb-4 text-lg bg-blueGradient-3/60 hover:bg-gradient1 transition-colors duration-300 font-bold py-2 px-5 rounded-lg"
                          >
                            Buy now
                          </button>
                        </div>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="sr-only" scope="col">
                              Feature
                            </th>
                            <th className="sr-only" scope="col">
                              Included
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blueGradient-2">
                          {tier.subService && tier.subService2 && (
                            <>
                              {_.uniqBy(types, (el) => el.name).map(
                                (el, elIdx) => {
                                  return (
                                    <tr key={elIdx} className="text-center">
                                      <th
                                        className="py-5 px-6 text-sm font-normal text-white text-left"
                                        scope="row"
                                      >
                                        {el.name}
                                      </th>
                                      <td key={tierIdx} className="py-5 px-6">
                                        <span className="block text-sm text-white">
                                          ₹{" "}
                                          {tier.pricingArr
                                            .find((e) => e.name === el.name)
                                            ?.price.toLocaleString("en-IN")}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </>
                          )}

                          {tier.estimatedTime && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Estimated Time On Project"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.estimatedTime}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.inputTrackLimit && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Track Count Limit"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.inputTrackLimit}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.uploadFileFormat && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Upload File Format"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.uploadFileFormat}
                                </span>
                              </td>
                            </tr>
                          )}

                          {tier.deliveryFileFormat && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Delivery Format"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.deliveryFileFormat}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.deliveryDays && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Delivery Days"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.deliveryDays}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.maxFileDuration && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"File Duration Limit"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {secondsToTime(tier.maxFileDuration)}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.numberOfReferenceFileUploads && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Additional Reference Files"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.numberOfReferenceFileUploads}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.setOfRevisions && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Revisions"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.setOfRevisions}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.revisionsDelivery && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Revision Delivery Days"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.revisionsDelivery}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.mixVocalTuningBasic && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Mix Processing: Basic Vocal Tuning"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.mixVocalTuningBasic}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.mixVocalTuningAdvanced && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Mix Processing: Advanced Vocal Tuning"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.mixVocalTuningAdvanced}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.mixProcessingReverbs && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Mix Processing: Reverbs"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.mixProcessingReverbs}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.mixProcessingDelays && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Mix Processing: Delays"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.mixProcessingDelays}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.mixProcessingOtherFx && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Mix Processing: Other Fx"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.mixProcessingOtherFx}
                                </span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* {sections.map((section) => (
                      <table key={section.features[0].name} className="w-full">
                        <caption className="border-t border-gray-200 py-3 px-4 text-sm font-bold text-primary text-left">
                          {section.name}
                        </caption>
                        <thead>
                          <tr>
                            <th className="sr-only" scope="col">
                              Feature
                            </th>
                            <th className="sr-only" scope="col">
                              Included
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gradient1">
                          {section.features.map((feature) => (
                            <tr key={feature.name} className="border-t border-gray-200">
                              <th className="py-5 px-4 text-sm font-normal text-white text-left" scope="row">
                                {feature.name}
                              </th>
                              <td className="py-5 pr-4">

                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ))} */}
                  </section>
                ))}
              </div>
            </>
          ) : selectedService && !selectedServiceFinal ? (
            // For 3 level nesting
            <>
              {/* Desktop View */}
              <div className="hidden lg:block">
                <table className="w-full table-fixed">
                  <caption className="sr-only">Pricing plan comparison</caption>
                  <thead className="left-0 z-20 backdrop-blur-xl bg-darkBlue/30 divide-y divide-blueGradient-2">
                    <tr>
                      <th
                        className="pb-4 px-6 text-md font-medium text-left w-1/4"
                        scope="col"
                      >
                        <span>Services</span>
                      </th>
                      {selectedService.map((tier) => (
                        <th
                          key={tier.serviceName}
                          className="w-1/4 pb-4 px-6 text-lg leading-6 font-medium text-center"
                          scope="col"
                        >
                          {tier.serviceName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="border-t border-gray-200 divide-y divide-blueGradient-2">
                    <tr>
                      <th
                        className="py-8 px-6 text-sm font-medium text-left align-top"
                        scope="row"
                      >
                        { }
                      </th>
                      {selectedService.map((tier) => (
                        <td
                          key={tier.serviceName}
                          className="h-full py-2 px-6 align-top"
                        >
                          <div className="relative table text-center text-sm mx-auto">
                            <p className="pt-4 text-white h-48">
                              {tier.description}
                            </p>
                            <p className="text-2xl">
                              ₹{tier.price.toLocaleString("en-IN")}
                            </p>
                            <button
                              onClick={() => {
                                setSelectedServiceForType(tier);
                                if (
                                  selectedServiceForType?.subService &&
                                  selectedServiceForType.subService2
                                ) {
                                  const pricArr = [...types];
                                  console.log(pricArr);
                                  const findPrice = pricArr.find(
                                    (el) =>
                                      el.id ===
                                      `${selectedServiceForType.mainCategory}-${selectedServiceForType.subCategory}-${selectedServiceForType.serviceName}-${selectedServiceForType.subService}` &&
                                      el.name === "Commercial Rate"
                                  );
                                  if (!findPrice) {
                                    return;
                                  }
                                  setSelectedServiceFinal({
                                    ...selectedServiceForType,
                                    subService2: "Commercial Rate",
                                    price: findPrice.price,
                                  });
                                } else {
                                  setSelectedServiceFinal(selectedServiceForType);
                                }
                              }}
                              className="mt-6 mb-4 text-lg bg-blueGradient-3/60 hover:bg-gradient1 transition-colors duration-300 font-bold py-2 px-5 rounded-lg"
                            >
                              Buy now
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                    {selectedService.every(
                      (tier) => tier.subService && tier.subService2
                    ) && (
                        <>
                          {_.uniqBy(types, (el) => el.name).map((el, elIdx) => {
                            return (
                              <tr key={el.id} className="text-center">
                                <th
                                  className="py-5 px-6 text-sm font-normal text-white text-left"
                                  scope="row"
                                >
                                  {el.name}
                                </th>
                                {selectedService.map((tier, tierIdx) => (
                                  <td key={tierIdx} className="py-5 px-6">
                                    <span className="block text-sm text-white">
                                      ₹{" "}
                                      {tier.pricingArr
                                        .find((e) => e.name === el.name)
                                        ?.price.toLocaleString("en-IN")}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </>
                      )}

                    {selectedService.every(
                      (tier) => tier.estimatedTime != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Estimated Time On Project"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.estimatedTime}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.inputTrackLimit != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Track Count Limit"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.inputTrackLimit}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.uploadFileFormat != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Upload File Format"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.uploadFileFormat.join(", ")}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.deliveryFileFormat != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Delivery Format"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.deliveryFileFormat.join(", ")}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.deliveryDays != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Delivery Days"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.deliveryDays}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.maxFileDuration != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"File(s) Duration Limit"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {secondsToTime(tier.maxFileDuration!)}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.numberOfReferenceFileUploads != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Additional Reference Files"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.numberOfReferenceFileUploads}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.setOfRevisions != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Revisions"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.setOfRevisions}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.revisionsDelivery != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Revision Delivery Days"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.revisionsDelivery}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}

                    {selectedService.every(
                      (tier) => tier.mixVocalTuningBasic != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Mix Processing: Basic Vocal Tuning"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.mixVocalTuningBasic}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.mixVocalTuningAdvanced != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Mix Processing: Advanced Vocal Tuning"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.mixVocalTuningAdvanced}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.mixProcessingReverbs != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Mix Processing: Reverbs"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.mixProcessingReverbs}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.mixProcessingDelays != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Mix Processing: Delays"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.mixProcessingDelays}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                    {selectedService.every(
                      (tier) => tier.mixProcessingOtherFx != null
                    ) && (
                        <tr className="text-center">
                          <th
                            className="py-5 px-6 text-sm font-normal text-white text-left"
                            scope="row"
                          >
                            {"Mix Processing: Other Fx"}
                          </th>
                          {selectedService.map((tier, tierIdx) => (
                            <td key={tierIdx} className="py-5 px-6">
                              <span className="block text-sm text-white">
                                {tier.mixProcessingOtherFx}
                              </span>
                            </td>
                          ))}
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
              {/* Mobile View */}
              <div className="max-w-2xl mx-auto lg:hidden ">
                {selectedService.map((tier, tierIdx) => (
                  <section key={tierIdx}>
                    <div className="px-4 mb-8">
                      <div className="sticky top-0 left-0 backdrop-blur-sm pt-4 pb-2">
                        <h2 className="text-lg leading-6 font-medium">
                          {tier.subService ?? tier.serviceName}
                        </h2>
                        <p className="mt-4 text-sm text-white">
                          {tier.description}
                        </p>
                        <div className="text-center">
                          <button
                            onClick={() => {
                              setSelectedServiceForType(tier);
                              if (
                                selectedServiceForType?.subService &&
                                selectedServiceForType.subService2
                              ) {
                                const pricArr = [...types];
                                console.log(pricArr);
                                const findPrice = pricArr.find(
                                  (el) =>
                                    el.id ===
                                    `${selectedServiceForType.mainCategory}-${selectedServiceForType.subCategory}-${selectedServiceForType.serviceName}-${selectedServiceForType.subService}` &&
                                    el.name === "Commercial Rate"
                                );
                                if (!findPrice) {
                                  return;
                                }
                                setSelectedServiceFinal({
                                  ...selectedServiceForType,
                                  subService2: "Commercial Rate",
                                  price: findPrice.price,
                                });
                              } else {
                                setSelectedServiceFinal(selectedServiceForType);
                              }

                            }}
                            className="mt-6 mb-4 text-lg bg-blueGradient-3/60 hover:bg-gradient1 transition-colors duration-300 font-bold py-2 px-5 rounded-lg"
                          >
                            Buy now
                          </button>
                        </div>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="sr-only" scope="col">
                              Feature
                            </th>
                            <th className="sr-only" scope="col">
                              Included
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blueGradient-2">
                          {tier.subService && tier.subService2 && (
                            <>
                              {_.uniqBy(types, (el) => el.name).map(
                                (el, elIdx) => {
                                  return (
                                    <tr key={elIdx} className="text-center">
                                      <th
                                        className="py-5 px-6 text-sm font-normal text-white text-left"
                                        scope="row"
                                      >
                                        {el.name}
                                      </th>
                                      <td key={tierIdx} className="py-5 px-6">
                                        <span className="block text-sm text-white">
                                          ₹{" "}
                                          {tier.pricingArr
                                            .find((e) => e.name === el.name)
                                            ?.price.toLocaleString("en-IN")}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </>
                          )}

                          {tier.estimatedTime && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Estimated Time On Project"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.estimatedTime}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.inputTrackLimit && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Track Count Limit"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.inputTrackLimit}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.uploadFileFormat && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Upload File Format"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.uploadFileFormat}
                                </span>
                              </td>
                            </tr>
                          )}

                          {tier.deliveryFileFormat && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Delivery Format"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.deliveryFileFormat}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.deliveryDays && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Delivery Days"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.deliveryDays}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.maxFileDuration && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"File Duration Limit"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {secondsToTime(tier.maxFileDuration)}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.numberOfReferenceFileUploads && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Additional Reference Files"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.numberOfReferenceFileUploads}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.setOfRevisions && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Revisions"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.setOfRevisions}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.revisionsDelivery && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Revision Delivery Days"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.revisionsDelivery}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.mixVocalTuningBasic && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Mix Processing: Basic Vocal Tuning"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.mixVocalTuningBasic}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.mixVocalTuningAdvanced && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Mix Processing: Advanced Vocal Tuning"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.mixVocalTuningAdvanced}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.mixProcessingReverbs && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Mix Processing: Reverbs"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.mixProcessingReverbs}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.mixProcessingDelays && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Mix Processing: Delays"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.mixProcessingDelays}
                                </span>
                              </td>
                            </tr>
                          )}
                          {tier.mixProcessingOtherFx && (
                            <tr className="text-center">
                              <th
                                className="py-5 px-6 text-sm font-normal text-white text-left"
                                scope="row"
                              >
                                {"Mix Processing: Other Fx"}
                              </th>
                              <td key={tierIdx} className="py-5 px-6">
                                <span className="block text-sm text-white">
                                  {tier.mixProcessingOtherFx}
                                </span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* {sections.map((section) => (
                      <table key={section.features[0].name} className="w-full">
                        <caption className="border-t border-gray-200 py-3 px-4 text-sm font-bold text-primary text-left">
                          {section.name}
                        </caption>
                        <thead>
                          <tr>
                            <th className="sr-only" scope="col">
                              Feature
                            </th>
                            <th className="sr-only" scope="col">
                              Included
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gradient1">
                          {section.features.map((feature) => (
                            <tr key={feature.name} className="border-t border-gray-200">
                              <th className="py-5 px-4 text-sm font-normal text-white text-left" scope="row">
                                {feature.name}
                              </th>
                              <td className="py-5 pr-4">

                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ))} */}
                  </section>
                ))}
              </div>
            </>
          ) : null}
          {/* Add On / Summary Screen */}
          {selectedServiceFinal && (
            <div
              style={{ minHeight: `calc(100vh - ${bottomBarHeight}px)` }}
              className={`relative text-center grid place-items-center`}
            >

              <div
                className={`flex w-full h-full justify-center items-center flex-col md:flex-row gap-10 md:gap-20 md:py-20 mb-40 md:mb-0`}
              >
                <div className="mx-auto w-full space-y-8 rounded-lg py-12 bg-blueGradient-2/30 backdrop-blur-lg relative">
                  <div className="text-2xl space-y-3">
                    <span className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r py-5 from-pink-600 to-primary">
                      {selectedServiceFinal.subService
                        ? selectedServiceFinal.subService
                        : selectedServiceFinal.serviceName}
                    </span>
                    {selectedServiceFinal.subService && (
                      <span className="block space-x-2">
                        <span>{selectedServiceFinal.subService2}</span>
                        <svg
                          onClick={() => setIsModalOpen(true)}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 inline hover:stroke-primary cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                          />
                        </svg>
                        <Modal open={isModalOpen} setOpen={setIsModalOpen}>
                          <div className="text-center relative ">
                            <svg
                              onClick={() => setIsModalOpen(false)}
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 absolute right-0 -top-3 hover:text-primary cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <h3 className="">
                              {selectedServiceFinal.subService2 ||
                                selectedServiceFinal.serviceName}
                            </h3>
                            <p>
                              {(
                                selectedServiceFinal.subService2 ||
                                selectedServiceFinal.serviceName
                              ).includes("Commercial")
                                ? "If backed by a label or management or using the file for commercial purposes"
                                : "For independent musicians and artists releasing their own music without an existing agreement to sell the song commercially"}
                            </p>
                          </div>
                        </Modal>
                      </span>
                    )}
                  </div>
                  <div className="text-xl space-y-3">
                    <div>
                      Hours Allocated : {selectedServiceFinal.estimatedTime}
                    </div>
                    <div>
                      Track Count Limit : {selectedServiceFinal.inputTrackLimit}
                    </div>
                    <div>
                      Upload File Format:{" "}
                      {selectedServiceFinal.uploadFileFormat.join(", ")}
                    </div>
                    <div>
                      Delivery Format:{" "}
                      {selectedServiceFinal.deliveryFileFormat.join(", ")}
                    </div>
                    <div>
                      Delivery Days: {selectedServiceFinal.deliveryDays}
                    </div>
                    <div>
                      File(s) Duration Limit:{" "}
                      {secondsToTime(selectedServiceFinal.maxFileDuration!)}
                    </div>
                  </div>
                </div>
                <div className="mx-auto w-full md:text-left space-y-6 px-10 md:px-0">
                  <span className="text-xl md:text-3xl font-extrabold text-white">
                    Add Ons
                  </span>
                  <fieldset className="">
                    <div className="">
                      <div className="space-y-3 md:max-h-96 overflow-auto border-none  mx-auto md:pr-3">
                        {/* Mapping Through Categories */}
                        {selectedServiceFinal.addOn
                          .filter((el) => el.value)
                          .map((addOn, i) => (
                            <div key={i}>
                              <label
                                htmlFor={addOn.type}
                                className=" font-medium text-white "
                              >
                                <div
                                  className={`border-2 rounded-lg relative flex-1 flex items-start gap-4 py-4 px-3 justify-center 
                              ${selectedAddons.find(
                                    (el) => el.type === addOn.type
                                  )
                                      ? "border-primary"
                                      : "border-gray-400/60"
                                    }`}
                                >
                                  <div className="min-w-0 flex-1 text-md">
                                    <p
                                      id="comments-description"
                                      className="text-gray-200"
                                    >
                                      <span className="font-bold">
                                        {addOn.type}
                                      </span>{" "}
                                      - ₹{addOn.value?.toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                  <div className="flex gap-2 justify-center items-center my-auto">
                                    <div className="bg-white/10 p-[3px] rounded-full cursor-pointer">
                                      {/* Subtract */}
                                      <svg
                                        onClick={() => {
                                          let arr: AddOn[] = [
                                            ...selectedAddons,
                                          ];
                                          const objIndex = arr.findIndex(
                                            (el) => el.type === addOn.type
                                          );
                                          if (objIndex < 0) {
                                          } else {
                                            const qt = arr[objIndex].qty!;
                                            if (qt === 1) {
                                              if (
                                                arr[objIndex].type.includes(
                                                  "10 Tracks"
                                                ) || arr[objIndex].type.includes(
                                                  "30s"
                                                )
                                              ) {
                                                // @ts-ignore
                                                setSelectedServiceFinal(
                                                  (prev) => ({
                                                    ...prev!,
                                                    deliveryDays:
                                                      (prev?.deliveryDays ?? 0) -
                                                      1,
                                                  })
                                                );

                                                if (arr[objIndex].type.includes("30s")) {
                                                  setSelectedServiceFinal(
                                                    (prev) => ({
                                                      ...prev!,
                                                      maxFileDuration: (prev?.maxFileDuration ?? 0) - 30,
                                                    })
                                                  );
                                                }
                                                if (arr[objIndex].type.includes("10 Tracks")) {
                                                  setSelectedServiceFinal(
                                                    (prev) => ({
                                                      ...prev!,
                                                      inputTrackLimit: (prev?.inputTrackLimit ?? 0) - 10,
                                                    })
                                                  );
                                                }
                                              }

                                              arr = arr.filter(
                                                (el) => el.type !== addOn.type
                                              );

                                            } else {
                                              arr[objIndex].qty! -= 1;
                                              if (
                                                arr[objIndex].type.includes(
                                                  "10 Tracks"
                                                ) || arr[objIndex].type.includes(
                                                  "30s"
                                                )
                                              ) {
                                                setSelectedServiceFinal(
                                                  (prev) => ({
                                                    ...prev!,
                                                    deliveryDays:
                                                      (prev?.deliveryDays ??
                                                        0) - 1,
                                                  })
                                                );
                                              }
                                              if (arr[objIndex].type.includes("10 Tracks")) {
                                                setSelectedServiceFinal(
                                                  (prev) => ({
                                                    ...prev!,
                                                    inputTrackLimit: (prev?.inputTrackLimit ?? 0) - 10,
                                                  })
                                                );
                                              }
                                              if (arr[objIndex].type.includes("30s")) {
                                                setSelectedServiceFinal(
                                                  (prev) => ({
                                                    ...prev!,
                                                    maxFileDuration: (prev?.maxFileDuration ?? 0) - 30,
                                                  })
                                                );
                                              }
                                            }
                                          }
                                          setSelectedAddons(arr);
                                        }}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M19.5 12h-15"
                                        />
                                      </svg>
                                    </div>
                                    <span>
                                      {selectedAddons.find(
                                        (el) => el.type === addOn.type
                                      )
                                        ? selectedAddons.find(
                                          (el) => el.type === addOn.type
                                        )?.qty
                                        : 0}
                                    </span>
                                    <div className="bg-white/10 p-[3px] rounded-full cursor-pointer">
                                      {/* Add */}
                                      <svg
                                        onClick={() => {
                                          const arr: AddOn[] = [
                                            ...selectedAddons,
                                          ];
                                          const objIndex = arr.findIndex(
                                            (el) => el.type === addOn.type
                                          );
                                          if (objIndex < 0) {
                                            arr.push({ ...addOn, qty: 1 });
                                            // @ts-ignore
                                            const objIndex = arr.findIndex(
                                              (el) => el.type === addOn.type
                                            );
                                            if (
                                              arr[objIndex].type.includes(
                                                "10 Tracks"
                                              ) || arr[objIndex].type.includes(
                                                "30s"
                                              )
                                            ) {
                                              // @ts-ignore
                                              setSelectedServiceFinal(
                                                (prev) => ({
                                                  ...prev!,
                                                  deliveryDays:
                                                    (prev?.deliveryDays ?? 0) +
                                                    1,
                                                })
                                              );
                                            }

                                            if (arr[objIndex].type.includes("30s")) {
                                              setSelectedServiceFinal(
                                                (prev) => ({
                                                  ...prev!,
                                                  maxFileDuration: (prev?.maxFileDuration ?? 0) + 30,
                                                })
                                              );
                                            }
                                            if (arr[objIndex].type.includes("Tracks")) {
                                              setSelectedServiceFinal(
                                                (prev) => ({
                                                  ...prev!,
                                                  inputTrackLimit: (prev?.inputTrackLimit ?? 0) + 10,
                                                })
                                              );
                                            }

                                          } else {
                                            arr[objIndex].qty! += 1;
                                            if (
                                              arr[objIndex].type.includes(
                                                "10 Tracks"
                                              ) || arr[objIndex].type.includes(
                                                "30s"
                                              )
                                            ) {
                                              // @ts-ignore
                                              setSelectedServiceFinal(
                                                (prev) => ({
                                                  ...prev!,
                                                  deliveryDays:
                                                    (prev?.deliveryDays ?? 0) +
                                                    1,
                                                })
                                              );
                                            }
                                            if (arr[objIndex].type.includes("30s")) {
                                              setSelectedServiceFinal(
                                                (prev) => ({
                                                  ...prev!,
                                                  maxFileDuration: (prev?.maxFileDuration ?? 0) + 30,
                                                })
                                              );
                                            }
                                            if (arr[objIndex].type.includes("10 Tracks")) {
                                              setSelectedServiceFinal(
                                                (prev) => ({
                                                  ...prev!,
                                                  inputTrackLimit: (prev?.inputTrackLimit ?? 0) + 10,
                                                })
                                              );
                                            }

                                          }
                                          // console.log(arr);
                                          setSelectedAddons(arr);
                                        }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
              {/* Bottom Bar */}
              <div
                ref={bottomBarEl}
                className="fixed z-50 bottom-0 p-4 left-0 filter flex flex-col gap-4 md:flex-row w-screen md:items-center backdrop-blur-xl"
              >
                {/* <div className="absolute animation-delay-4000 top-2 right-[20%] w-36 md:w-96 h-20 bg-primary opacity-40 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden" />
                <div className="absolute animation-delay-2000  left-[10%] w-36 md:w-96 h-20 bg-blueGradient-0 opacity-20 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden" />
                <div className="absolute right-[5%] w-36 md:w-96 h-10 bg-pink-700 opacity-30 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden" /> */}
                <div className="md:w-1/2 text-md md:text-xl">
                  Estimated Delivery: {selectedServiceFinal.deliveryDays} days
                </div>
                <div className="md:w-1/2 text-left space-x-3">
                  <div className="md:flex items-center justify-center gap-8">
                    {localStorage.getItem("loggedIn") ? (
                      // Add price here.
                      <div className="font-bold flex items-center justify-between text-xl md:text-2xl">
                        <span>
                          ₹{" "}
                          {(
                            selectedServiceFinal.price +
                            selectedAddons.reduce(
                              (acc, o) => acc + o.value! * (o.qty ?? 0),
                              0
                            )
                          ).toLocaleString("en-IN")}
                        </span>
                        <div className="md:hidden">
                          <Button>
                            <div>Proceed to Payment</div>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <input
                        className="rounded-lg bg-white/10 h-9 w-60 placeholder:text-white/40"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name=""
                        id=""
                      />
                    )}
                    <div className="hidden md:block">
                      <Button onClick={handleProceed}>
                        <div>Proceed to Payment</div>
                      </Button>
                    </div>
                  </div>
                  {!localStorage.getItem("loggedIn") && (
                    <div className="font-bold flex items-center justify-between text-xl md:text-2xl pt-3">
                      <span>
                        ₹{" "}
                        {(
                          selectedServiceFinal.price +
                          selectedAddons.reduce((acc, o) => acc + o.value!, 0)
                        ).toLocaleString("en-IN")}
                      </span>
                      <div className="md:hidden">
                        <Button>
                          <div>Proceed to Payment</div>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>}
    </div>
  );
};

export default Pricing;
