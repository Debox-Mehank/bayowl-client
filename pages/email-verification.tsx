import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useVerifyUserLazyQuery } from "../graphql/generated/graphql";

const EmailVerification = () => {
  const router = useRouter();
  const { userId, token } = router.query;
  const [verifyEmailQuery] = useVerifyUserLazyQuery();

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const myFunc = async () => {
      if (
        token !== "" &&
        token !== undefined &&
        userId !== "" &&
        userId !== undefined
      ) {
        setLoading(true);
        const { data, error } = await verifyEmailQuery({
          variables: {
            token: token as string,
          },
        });

        if (error) {
          setLoading(false);
          setSuccess(false);
          setError(error.message);
          return false;
        }

        if (!data) {
          setLoading(false);
          setSuccess(false);
          setError("Something went wrong, please try again later");
          return false;
        }

        if (!data.verifyUser) {
          setLoading(false);
          setSuccess(false);
          setError("Something went wrong, please try again later");
          return false;
        }

        setSuccess(true);
      }
    };
    myFunc();
  }, [userId, token, verifyEmailQuery]);

  return (
    <div className="h-screen flex justify-center items-center bg-darkBlue text-white relative max-w-7xl mx-auto">
      <div className="absolute animation-delay-2000 top-[45%] left-[15%] w-36 md:w-96 h-96 bg-blueGradient-0 opacity-60 rounded-full mix-blend-screen filter blur-[60px] animate-blob overflow-hidden pointer-events-none" />
      <div className="absolute animation-delay-2000 top-[35%] left-[55%] w-36 md:w-96 h-56 bg-primary opacity-60 rounded-full mix-blend-screen filter blur-[75px] animate-blob overflow-hidden pointer-events-none" />
      <div className="absolute animation-delay-4000 top-[60%] right-[35%] w-36 md:w-96 h-56 bg-blueGradient-2 opacity-80 rounded-full mix-blend-screen filter blur-[70px] animate-blob overflow-hidden pointer-events-none" />
      <div className="absolute top-[60%] right-[15%] w-36 md:w-96 h-56 bg-blueGradient-1 opacity-80 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden pointer-events-none" />

      {success === true ? (
        <div className="mx-auto w-4/6 bg-white/10 rounded-2xl p-4">
          <h4
            className={`text-2xl lg:text-4xl font-bold text-white text-center py-2`}
          >
            Email Verified!
          </h4>
          <p
            className="text-justify text-white font-light text-sm lg:text-lg py-2"
            style={{ textAlignLast: "center" }}
          >
            {
              "Thanks for verifying your email id. Click here to login to your account!, "
            }
            <span className="text-primary font-semibold">
              <Link href={"/login"}>click here </Link>
            </span>
            to login.
          </p>
        </div>
      ) : success === false ? (
        <div className="mx-auto w-4/6 bg-white/10 rounded-2xl p-4">
          <h4
            className={`text-2xl lg:text-4xl font-bold text-white text-center py-2`}
          >
            Email Not Verified!
          </h4>
          <p
            className="text-justify text-white font-light text-sm lg:text-lg py-2"
            style={{ textAlignLast: "center" }}
          >
            {error}
          </p>
          <p className="text-center">
            Go back to{" "}
            <span className="text-primary font-semibold">
              <Link href={"/login"}>login</Link>
            </span>
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default EmailVerification;
