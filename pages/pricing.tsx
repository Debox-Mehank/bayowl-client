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
import Modal from "../components/reusable/Modal";
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

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="text-white relative">
        <div className="absolute animation-delay-2000 top-[35%] left-[35%] w-36 md:w-96 h-56 bg-blueGradient-0 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        <div className="absolute top-[42%] right-[34%] w-36 md:w-80 h-72 bg-orange3 opacity-60 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 ">
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
                      { }
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
              <div className="fixed z-50 bottom-0 p-4 filter md:flex w-full flex-1 items-center backdrop-blur-xl">
                <div className="md:w-1/2 text-md md:text-xl relative">
                  <div className="absolute animation-delay-4000 top-0 right-[20%] w-36 md:w-96 h-20 bg-primary opacity-50 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden" />
                  <div className="absolute animation-delay-2000 top-20 left-[10%] w-36 md:w-96 h-20 bg-blueGradient-0 opacity-70 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden" />
                  Estimated Delivery: {selectedServiceFinal.deliveryDays} days
                </div>
                <div className="md:w-1/2 text-left space-x-3 relative">
                  <div className="absolute animation-delay-4000 top-2 right-[20%] w-36 md:w-96 h-20 bg-primary opacity-40 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden" />
                  <div className="absolute animation-delay-2000 top-20 left-[10%] w-36 md:w-96 h-20 bg-blueGradient-0 opacity-20 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden" />
                  <div className="absolute top-5 right-[5%] w-36 md:w-96 h-10 bg-pink-700 opacity-30 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden" />
                  <div className="md:flex items-center gap-8">
                    {localStorage.getItem("loggedIn") ? (
                      // Add price here.
                      <div className="font-bold flex items-center justify-between text-xl md:text-2xl">
                        <span>
                          ₹{" "}
                          {(
                            selectedServiceFinal.price +
                            selectedAddons.reduce((acc, o) => acc + o.value! * (o.qty ?? 0), 0)
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
              <div className="mx-auto w-full space-y-8 rounded-lg py-12 bg-blueGradient-2/30 backdrop-blur-lg">
                <div className="text-2xl space-y-3">
                  <span className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r py-5 from-pink-600 to-primary">
                    {selectedService && selectedService[0].subService2
                      ? selectedService[0].subService
                      : selectedService
                        ? selectedService[0].serviceName
                        : ""}
                  </span>
                  <span className="block space-x-2">
                    <span>
                      {selectedServiceFinal.subService2?.split("*")[0] ||
                        selectedServiceFinal.serviceName.split("*")[0]}
                    </span>
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
                          xmlns="http://www.w3.org/2000/svg"
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
                          {selectedServiceFinal.subService2?.split("*")[0] ||
                            selectedServiceFinal.serviceName.split("*")[0]}
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
                              <div className={`border-2 rounded-lg relative flex-1 flex items-start gap-4 py-4 px-3 justify-center 
                              ${selectedAddons.find(
                                (el) => el.type === addOn.type
                              )
                                  ? "border-primary"
                                  : "border-gray-400/60"}`}>
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
                                    <svg onClick={() => {
                                      let arr: AddOn[] = [...selectedAddons]
                                      const objIndex = arr.findIndex(el => el.type === addOn.type)
                                      console.log(objIndex)
                                      if (objIndex < 0) {
                                        // arr.push({ ...addOn, qty: 1 })
                                      } else {
                                        const qt = arr[objIndex].qty!;
                                        if (qt === 1) {
                                          arr = arr.filter((el) => el.type !== addOn.type)
                                        } else {
                                          arr[objIndex].qty! -= 1;
                                        }
                                      }
                                      setSelectedAddons(arr)

                                    }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                    </svg>

                                  </div>
                                  <span>{selectedAddons.find(el => el.type === addOn.type) ? selectedAddons.find(el => el.type === addOn.type)?.qty : 0}</span>
                                  <div className="bg-white/10 p-[3px] rounded-full cursor-pointer">
                                    <svg onClick={() => {
                                      const arr: AddOn[] = [...selectedAddons]
                                      const objIndex = arr.findIndex(el => el.type === addOn.type)
                                      if (objIndex < 0) {
                                        arr.push({ ...addOn, qty: 1 })
                                      } else {
                                        arr[objIndex].qty! += 1;
                                      }
                                      console.log(arr)
                                      setSelectedAddons(arr)
                                    }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                  </div>
                                  {/* <input
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
                                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                                  /> */}
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
