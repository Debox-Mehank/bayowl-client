import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/reusable/Button";
import {
  AddOn,
  Services,
  useGetServiceDetailsLazyQuery,
  useInitiatePaymentLazyQuery,
} from "../graphql/generated/graphql";
import secondsToTime from "../utils/secsToTime";

const Pricing = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Services[]>();
  const [selectedServiceFinal, setSelectedServiceFinal] = useState<Services>();
  const [selectedAddons, setSelectedAddons] = useState<AddOn[]>([]);
  const [email, setEmail] = useState<string>("");

  const [getServiceDetailsQuery] = useGetServiceDetailsLazyQuery();
  const [initiatePaymentQuery] = useInitiatePaymentLazyQuery();

  useEffect(() => {
    const userServiceLS = localStorage.getItem("userService");

    const fetchFunc = async () => {
      const userService = JSON.parse(userServiceLS!);

      setLoading(true);
      const { data, error } = await getServiceDetailsQuery({
        variables: {
          input: {
            mainCategory: userService.mainCategory,
            serviceName: userService.serviceName,
            subCategory: userService.subCategory,
            subService: userService.subService,
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

      setSelectedService(data.getServiceDetails);
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
        selectedAddons.reduce((acc, o) => acc + o.value!, 0);

      const finalService = { ...selectedServiceFinal };

      const clone = (({ __typename, _id, createdAt, updatedAt, ...o }) => o)(
        finalService
      );

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
      <div className="text-white relative">
        <div className="absolute animation-delay-2000 top-[35%] left-[35%] w-36 md:w-96 h-56 bg-blueGradient-0 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        <div className="absolute top-[42%] right-[34%] w-36 md:w-80 h-72 bg-orange3 opacity-60 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          {!selectedServiceFinal && (
            <div className="mt-8 mb-16 text-xl mx-auto space-y-2 md:sticky md:top-0 md:bg-darkBlue/30 md:backdrop-blur-xl z-20 px-4 pb-2 py-3">
              <svg
                onClick={() => {
                  router.back();
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="27"
                height="30"
                className="fill-white hover:fill-primary duration-300 transition-colors cursor-pointer"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <h1 className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r py-5 from-pink-600 to-primary">
                {selectedService && selectedService[0].subService2
                  ? selectedService[0].subService
                  : selectedService
                  ? selectedService[0].serviceName
                  : ""}
              </h1>
              <p>{selectedService && selectedService[0].for}</p>
              <p>{selectedService && selectedService[0].description}</p>
            </div>
          )}
          {selectedService &&
          selectedService[0].subService2 &&
          !selectedServiceFinal ? (
            <div className="hidden lg:block">
              <table className="w-full table-fixed">
                <caption className="sr-only">Pricing plan comparison</caption>
                <thead className="sticky top-[14.6rem] left-0 z-20 backdrop-blur-xl bg-darkBlue/30 divide-y divide-blueGradient-2">
                  <tr>
                    <th
                      className="pb-4 px-6 text-md font-medium text-left"
                      scope="col"
                    >
                      <span>Plans</span>
                    </th>
                    {selectedService.map((tier) => (
                      <th
                        key={tier.subService2}
                        className="w-1/4 pb-4 px-6 text-lg leading-6 font-medium text-center"
                        scope="col"
                      >
                        {tier.subService2}
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
                    {selectedService.map((tier) => (
                      <td
                        key={tier.subService2}
                        className="h-full py-2 px-6 align-top"
                      >
                        <div className="relative h-full table text-center text-sm">
                          <p className="pt-4 text-white h-36">
                            {tier.description}
                          </p>
                          <p className="text-2xl">
                            ₹{tier.price.toLocaleString("en-IN")}
                          </p>
                          <button
                            onClick={() => {
                              //   setSelectedPlan(true);
                              setSelectedServiceFinal(tier);
                            }}
                            className="mt-6 mb-4 text-lg bg-blueGradient-3/60 hover:bg-gradient1 transition-colors duration-300 font-bold py-2 px-5 rounded-lg"
                          >
                            Buy now
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Estimated Time Given (Hours)"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {tier.estimatedTime}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Price"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          ₹{tier.price.toLocaleString("en-IN")}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Input / Track Limit"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {tier.inputTrackLimit}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {
                        "Upload File Format - .wav (sampling rate 44.1-96k, bit depth 16 or 24bit)"
                      }
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {tier.uploadFileFormat.join(", ")}
                        </span>
                      </td>
                    ))}
                  </tr>
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
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Delivery (Days)"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {tier.deliveryDays}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Maximum Song / File Duration"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {secondsToTime(tier.maxFileDuration!)}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Mix Processing: Vocal Tuning"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {tier.mixVocalTuning}
                        </span>
                      </td>
                    ))}
                  </tr>
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
                </tbody>
              </table>
            </div>
          ) : selectedService && !selectedServiceFinal ? (
            <div className="hidden lg:block">
              <table className="w-full table-fixed">
                <caption className="sr-only">Pricing plan comparison</caption>
                <thead className="sticky top-[14.6rem] left-0 z-20 backdrop-blur-xl bg-darkBlue/30 divide-y divide-blueGradient-2">
                  <tr>
                    <th
                      className="pb-4 px-6 text-md font-medium text-left"
                      scope="col"
                    >
                      <span>Plans</span>
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
                      {}
                    </th>
                    {selectedService.map((tier) => (
                      <td
                        key={tier.serviceName}
                        className="h-full py-2 px-6 align-top"
                      >
                        <div className="relative h-full table text-center text-sm">
                          <p className="pt-4 text-white h-36">
                            {tier.description}
                          </p>
                          <p className="text-2xl">
                            ₹{tier.price.toLocaleString("en-IN")}
                          </p>
                          <button
                            onClick={() => {
                              //   setSelectedPlan(true);
                            }}
                            className="mt-6 mb-4 text-lg bg-blueGradient-3/60 hover:bg-gradient1 transition-colors duration-300 font-bold py-2 px-5 rounded-lg"
                          >
                            Buy now
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Estimated Time Given (Hours)"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {tier.estimatedTime}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Price"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          ₹{tier.price.toLocaleString("en-IN")}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Input / Track Limit"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {tier.inputTrackLimit}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {
                        "Upload File Format - .wav (sampling rate 44.1-96k, bit depth 16 or 24bit)"
                      }
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {tier.uploadFileFormat.join(", ")}
                        </span>
                      </td>
                    ))}
                  </tr>
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
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Delivery (Days)"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {tier.deliveryDays}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Maximum Song / File Duration"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {secondsToTime(tier.maxFileDuration!)}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="text-center">
                    <th
                      className="py-5 px-6 text-sm font-normal text-white text-left"
                      scope="row"
                    >
                      {"Mix Processing: Vocal Tuning"}
                    </th>
                    {selectedService.map((tier, tierIdx) => (
                      <td key={tierIdx} className="py-5 px-6">
                        <span className="block text-sm text-white">
                          {tier.mixVocalTuning}
                        </span>
                      </td>
                    ))}
                  </tr>
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
                </tbody>
              </table>
            </div>
          ) : null}
          {selectedServiceFinal && (
            <div className="relative text-center flex w-full justify-center items-center flex-col md:flex-row gap-10 md:gap-20 pt-10 md:pb-16">
              {/* Bottom Bar */}
              <div className="fixed z-50 bottom-0 p-4 bg-gradient-to-r from-blueGradient-2/60 to-blueGradient-2/70 filter md:flex w-full flex-1 items-center backdrop-blur-xl">
                <div className="md:w-1/2 text-md pb-4  md:text-xl">
                  Estimated Delivery: {selectedServiceFinal.deliveryDays} days
                </div>
                <div className="md:w-1/2 text-left space-y-3">
                  <div className="md:flex items-center gap-8">
                    {localStorage.getItem("loggedIn") ? (
                      <div className="w-60"></div>
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
                  <div className="font-bold flex items-center justify-between text-xl md:text-2xl">
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
                </div>
              </div>
              <div className="absolute -top-5 left-4 md:-left-1">
                <svg
                  onClick={() => {
                    setSelectedServiceFinal(undefined);
                    // setAddOns(null)
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="30"
                  className="fill-white hover:fill-primary duration-300 transition-colors cursor-pointer"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                  />
                </svg>
              </div>
              <div className="mx-auto w-full space-y-16 rounded-lg py-16 bg-blueGradient-2/30 backdrop-blur-lg">
                <div className="text-2xl space-y-3  font-bold">
                  <span className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r py-5 from-pink-600 to-primary">
                    {selectedService && selectedService[0].subService2
                      ? selectedService[0].subService
                      : selectedService
                      ? selectedService[0].serviceName
                      : ""}
                  </span>
                  <span className="block">
                    {selectedServiceFinal.subService2
                      ? selectedServiceFinal.subService2
                      : selectedServiceFinal.serviceName}
                  </span>
                </div>
                <div className="text-xl space-y-3">
                  <div>
                    Estimated Time Given(Hours) :{" "}
                    {selectedServiceFinal.estimatedTime}
                  </div>
                  <div>
                    Input Track Limit : {selectedServiceFinal.inputTrackLimit}
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
                    Delivery (Days): {selectedServiceFinal.deliveryDays}
                  </div>
                  <div>
                    Maximum Song / File Duration:{" "}
                    {secondsToTime(selectedServiceFinal.maxFileDuration!)}
                  </div>
                </div>
              </div>
              <div className="mx-auto w-full md:text-left space-y-10">
                <span className="text-xl md:text-3xl font-extrabold text-white">
                  Add Ons
                </span>
                <fieldset className="">
                  <div className="">
                    <div className="space-y-3 md:max-h-96 overflow-auto border-none w-11/12 mx-auto md:pr-3">
                      {/* Mapping Through Categories */}
                      {selectedServiceFinal.addOn
                        .filter((el) => el.value)
                        .map((addOn, i) => (
                          <div key={i}>
                            <label
                              htmlFor={addOn.type}
                              className=" font-medium text-white "
                            >
                              <div className="border-2 border-gray-600 rounded-lg relative flex items-start py-4 px-3 justify-center">
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
                                <div className="flex justify-center items-center my-auto">
                                  <input
                                    id={addOn.type}
                                    aria-describedby="comments-description"
                                    name={addOn.type}
                                    type="checkbox"
                                    defaultChecked={
                                      selectedAddons.find(
                                        (el) => el.type === addOn.type
                                      )
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      const elem = selectedAddons.find(
                                        (el) => el.type === addOn.type
                                      );
                                      let arr = [...selectedAddons];

                                      if (elem) {
                                        console.log("remove");
                                        arr = arr.filter(
                                          (el) => el.type !== addOn.type
                                        );
                                      } else {
                                        console.log("add");
                                        arr.push(addOn);
                                      }

                                      setSelectedAddons(arr);
                                    }}
                                    className="focus:ring-indigo-500 h-4 w-4 text-primary border-gray-300 rounded"
                                  />
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
