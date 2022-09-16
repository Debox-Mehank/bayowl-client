import React from "react";
import Link from "next/link";

const PaymentSuccess = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-darkBlue text-white relative max-w-7xl mx-auto">
      <div className="absolute animation-delay-2000 top-[45%] left-[15%] w-36 md:w-96 h-96 bg-blueGradient-0 opacity-60 rounded-full mix-blend-screen filter blur-[60px] animate-blob overflow-hidden pointer-events-none" />
      <div className="absolute animation-delay-2000 top-[35%] left-[55%] w-36 md:w-96 h-56 bg-primary opacity-60 rounded-full mix-blend-screen filter blur-[75px] animate-blob overflow-hidden pointer-events-none" />
      <div className="absolute animation-delay-4000 top-[60%] right-[35%] w-36 md:w-96 h-56 bg-blueGradient-2 opacity-80 rounded-full mix-blend-screen filter blur-[70px] animate-blob overflow-hidden pointer-events-none" />
      <div className="absolute top-[60%] right-[15%] w-36 md:w-96 h-56 bg-blueGradient-1 opacity-80 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden pointer-events-none" />

      <div className="mx-auto w-4/6 bg-white/10 rounded-2xl p-4">
        <h4
          className={`text-2xl lg:text-4xl font-bold text-white text-center py-2`}
        >
          Payment Completed Successfully
        </h4>
        <p
          className="text-justify text-white font-light text-sm lg:text-lg py-2"
          style={{ textAlignLast: "center" }}
        >
          {
            "Thanks for purchasing our service, you can continue to dashboard by "
          }
          <span className="text-primary font-semibold">
            <Link href={"/dashboard"}>clicking here</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
