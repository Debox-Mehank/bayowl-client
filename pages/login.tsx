import type { GetServerSideProps, NextPage } from "next";
import GoogleIcon from "../public/googleIcon.png";
import Image from "next/image";
import Button from "../components/reusable/Button";
import Link from "next/link";
import { addApolloState, initializeApollo } from "../lib/apolloClient";
import {
  MeDocument,
  MeQuery,
  useLoginLazyQuery,
} from "../graphql/generated/graphql";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import Loader from "../components/reusable/Loader";

const Home: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [loginQuery] = useLoginLazyQuery();

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    if (!email || !password) {
      toast.error("Please provide all the details");
      return;
    }

    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.toString())
    ) {
      toast.error("Please provide valid email id");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await loginQuery({
        variables: {
          email: email.toString().trim(),
          password: password.toString().trim(),
        },
      });

      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }

      if (!data || !data.login) {
        setLoading(false);
        toast.error("Something went wrong, try again later.");
        return;
      }

      setLoading(false);
      localStorage.setItem("loggedIn", "true");
      router.replace("/dashboard");
    } catch (error: any) {
      console.log("login error : " + error.toString());
      toast.error("Something went wrong, try again later.");
      return;
    }
  };

  const handleSuccess = async (
    response: Omit<TokenResponse, "error" | "error_description" | "error_uri">
  ) => {
    const token = response.access_token;

    try {
      setLoading(true);
      const { data, error } = await loginQuery({
        variables: {
          email: email.toString().trim(),
          password: password.toString().trim(),
          token: token,
        },
      });

      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }

      if (!data || !data.login) {
        setLoading(false);
        toast.error("Something went wrong, try again later.");
        return;
      }

      setLoading(false);
      router.replace("/dashboard");
      localStorage.setItem("loggedIn", "true");
    } catch (error: any) {
      console.log("gmail login error : " + error.toString());
      toast.error("Something went wrong, try again later.");
      return;
    }
  };

  const handleError = async (
    errorResponse: Pick<
      TokenResponse,
      "error" | "error_description" | "error_uri"
    >
  ) => {
    console.log(
      "gmail login error : " + errorResponse.error_description?.toString()
    );
    toast.error("Something went wrong, try again later.");
  };

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen text-white overflow-hidden">
      <div className="w-full h-1/3 lg:h-full lg:w-1/2 grid place-items-center bg-loginImg bg-center bg-cover"></div>
      <div className="w-full min-h-2/3 lg:h-full lg:w-1/2 grid place-items-center bg-darkBlue relative md:p-0">
        <div className="-z-0 absolute animation-delay-2000 top-0 md:top-[30%] left-[0%] lg:left-[11%] w-32 md:w-96 h-96 bg-blueGradient-2 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        <div className="-z-0 hidden lg:block absolute animation-delay-4000 top-1/3 right-[24%] w-32 md:w-80 h-80 bg-orange3 rounded-full mix-blend-screen filter blur-[100px] opacity-90 animate-blob overflow-hidden" />
        <div className="-z-0 hidden lg:block absolute top-[48%] left-[20%] w-32 md:w-96 h-96 bg-blueGradient-0 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-3.5 text-center z-10 px-4 relative py-8  md:w-4/6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 504.04 517.13"
              className="fill-white mx-auto hover:fill-primary cursor-pointer transition-colors duration-300"
              height={150}
              width={150}
            >
              <g id="Layer_2" data-name="Layer 2">
                <g id="Your_design" data-name="Your design">
                  <path
                    className="cls-1"
                    d="M74.48,427.43a16.59,16.59,0,0,0,7.83-5.32,13.44,13.44,0,0,0,2.92-8.67q0-10.08-7.73-14.89t-22-4.81a109.9,109.9,0,0,0-11.76.61,43.06,43.06,0,0,0-9.51,2,9.24,9.24,0,0,0-3.53,2.07A4.92,4.92,0,0,0,29.36,402V454.3q0,5.82,6.16,8.17a26.4,26.4,0,0,0,4.93,1.4q2.69.51,5.43.84c1.82.22,3.6.37,5.31.45s3.21.11,4.48.11q15.45,0,23.68-5.32t8.23-16.4a14.92,14.92,0,0,0-3.75-10.41A19.49,19.49,0,0,0,74.48,427.43ZM48.4,409a28.87,28.87,0,0,1,3.41-.34c1.45-.07,2.74-.11,3.86-.11q5,0,7.56,1.79a5.63,5.63,0,0,1,2.52,4.82,6.4,6.4,0,0,1-2.19,5.26q-2.18,1.78-7,1.79H48.4Zm16.17,39.46a13.87,13.87,0,0,1-7.44,1.85c-1.5,0-3.06-.06-4.7-.17a19.59,19.59,0,0,1-4-.62V435.83h9.17q5,0,7.5,1.56c1.65,1.05,2.47,2.8,2.47,5.27A6.29,6.29,0,0,1,64.57,448.42Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M151.16,430.73q-2.35-8.22-4.7-16t-4.37-13.54c-.82-2.32-2.67-4-5.54-5.1a28.06,28.06,0,0,0-9.91-1.62,30.82,30.82,0,0,0-7.78,1,24,24,0,0,0-5.76,2.12c-.53,1.35-1.25,3.29-2.19,5.83s-2,5.42-3.07,8.67-2.32,6.7-3.59,10.36-2.46,7.22-3.58,10.69-2.14,6.7-3.08,9.68-1.66,5.49-2.18,7.5c-.37,1.42-.71,2.65-1,3.69a11.33,11.33,0,0,0-.44,3.14,6.31,6.31,0,0,0,2.74,5.43c1.83,1.3,4.64,2,8.45,2a19.49,19.49,0,0,0,4.2-.39,29.5,29.5,0,0,0,3.3-1c.6-2.24,1.19-4.55,1.79-6.94s1.19-4.7,1.79-6.94h20.26l2,7.73a19.66,19.66,0,0,0,1.29,3.36,6.62,6.62,0,0,0,1.9,2.35,8.18,8.18,0,0,0,3,1.34,19.47,19.47,0,0,0,4.54.45,19.27,19.27,0,0,0,6.38-1,9.37,9.37,0,0,0,4-2.52Q158,455,155.75,447T151.16,430.73Zm-31.68,3.53q1.56-5.92,3.52-11.7t3.53-10.46h.67q1.35,4.59,3,10.35t3.19,11.81Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M216.14,397.37a10.74,10.74,0,0,0-6.66-2.07,21.4,21.4,0,0,0-4.7.56,20.38,20.38,0,0,0-4.48,1.57c-1,2.69-2,5.06-2.8,7.11s-1.6,4-2.35,5.93-1.51,3.81-2.29,5.71-1.7,4-2.75,6.33h-.67l-9.29-18.7c-1.64-3.28-3.38-5.52-5.2-6.72a12.83,12.83,0,0,0-7.11-1.79,11,11,0,0,0-6.22,1.68,15.29,15.29,0,0,0-4,3.7A95.67,95.67,0,0,0,162,410q2.68,5.1,5.82,10.36t6.38,10.3q3.24,5,6,9.18V455c0,3.73.86,6.18,2.58,7.33s4.29,1.74,7.72,1.74a38,38,0,0,0,5-.34,31.46,31.46,0,0,0,3.81-.67V440.31q6.6-10.63,10.46-17.24t5.88-10.47a36.39,36.39,0,0,0,2.57-5.77,11.52,11.52,0,0,0,.56-3.24A7.31,7.31,0,0,0,216.14,397.37Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M315.21,414a31.6,31.6,0,0,0-7.56-11.25,32.46,32.46,0,0,0-11.25-6.89,42.49,42.49,0,0,0-27.87,0A31.18,31.18,0,0,0,249.84,414a40.6,40.6,0,0,0-2.75,15.45,41,41,0,0,0,2.69,15.33,32.25,32.25,0,0,0,7.39,11.31,31.47,31.47,0,0,0,11.19,7,40.39,40.39,0,0,0,14.11,2.4,41.07,41.07,0,0,0,14.1-2.35,31.81,31.81,0,0,0,11.25-6.88A31.35,31.35,0,0,0,315.27,445a41.79,41.79,0,0,0,2.68-15.5A40.6,40.6,0,0,0,315.21,414Zm-21.55,30.67a14.83,14.83,0,0,1-22.28,0q-4.14-5-4.14-15.22t4.2-15.17a13.84,13.84,0,0,1,11.14-5,13.61,13.61,0,0,1,11.14,5q4.08,5,4.08,15.12T293.66,444.67Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M412,397a13.81,13.81,0,0,0-7.16-1.79,17.7,17.7,0,0,0-8.84,2.35q-.68,6-1.35,11.93t-1.34,11.86q-.68,6-1.45,12.2c-.53,4.14-1.12,8.49-1.8,13h-.56c-.59-2.61-1.21-5.11-1.84-7.5s-1.29-4.79-2-7.22-1.36-5-2.07-7.61l-2.3-8.56a6.17,6.17,0,0,0-3.8-4.09,19.33,19.33,0,0,0-7.84-1.4,20.13,20.13,0,0,0-5.32.73,28.2,28.2,0,0,0-3.86,1.29c-.75,3.8-1.45,7.18-2.13,10.13s-1.32,5.71-2,8.28-1.25,5.13-1.84,7.67-1.23,5.3-1.91,8.28h-.56c-.22-1-.44-2.46-.67-4.25s-.58-4.31-1.06-7.56-1.12-7.4-1.9-12.48-1.78-11.42-3-19q-.67-4.37-3.41-6.21a12.29,12.29,0,0,0-7-1.85,14.87,14.87,0,0,0-6.05,1.23,15.89,15.89,0,0,0-4.36,2.69c.3,3.13.74,6.59,1.34,10.36s1.25,7.63,2,11.58,1.49,7.91,2.35,11.87,1.7,7.63,2.52,11,1.62,6.42,2.41,9.07a38.49,38.49,0,0,0,2.18,6q1.23,2.58,5.32,4a27.8,27.8,0,0,0,9.12,1.4,25.7,25.7,0,0,0,7.39-1,12.73,12.73,0,0,0,5-2.58q1.33-4.82,3-11.75t3.25-14.22q1.89,7.4,3.58,13.55T377.28,459c.52,1.72,2,3,4.42,4a24.78,24.78,0,0,0,8.9,1.4,30.59,30.59,0,0,0,7.84-1,13,13,0,0,0,5.49-2.58,53.16,53.16,0,0,0,2.4-7q1.29-4.53,2.52-10.13t2.35-11.75q1.13-6.15,2-11.75c.56-3.74,1-7.11,1.34-10.14a67.1,67.1,0,0,0,.51-7C415,400.19,414,398.18,412,397Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M471,448H445.34V403.81a13.58,13.58,0,0,0-.67-4.7,6.11,6.11,0,0,0-2-2.8,8.1,8.1,0,0,0-3.31-1.4,23.31,23.31,0,0,0-4.53-.39,35.89,35.89,0,0,0-5.15.39c-1.79.26-3.1.47-3.92.62V453.4a9.67,9.67,0,0,0,10.41,10.41h30a6.93,6.93,0,0,0,5-1.84c1.27-1.24,1.91-3.34,1.91-6.33a13.83,13.83,0,0,0-.68-4.31A14.42,14.42,0,0,0,471,448Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M65.07,501.51a24.28,24.28,0,0,0-4.49-1.3l-.22,0-.23,0-.15,0-.15,0a32.32,32.32,0,0,1-3.59-.87,5.33,5.33,0,0,1-2.16-1.29,3.28,3.28,0,0,1-.86-2.4v0a4,4,0,0,1,1.68-3.43,7.93,7.93,0,0,1,4.71-1.21,9.72,9.72,0,0,1,3.36.62,13.66,13.66,0,0,1,3.37,1.86L68.7,490a16.43,16.43,0,0,0-2.94-1.72,15.27,15.27,0,0,0-3-1,15.46,15.46,0,0,0-8.8.67,7.79,7.79,0,0,0-3.59,3,8.6,8.6,0,0,0-1.23,4.69v0a7.71,7.71,0,0,0,1.32,4.83,6.8,6.8,0,0,0,3.19,2.34A31.43,31.43,0,0,0,58.45,504l.3.06.13,0,.14,0a22.71,22.71,0,0,1,3.28.81,4.75,4.75,0,0,1,2.08,1.34,3.58,3.58,0,0,1,.8,2.45v0A3.84,3.84,0,0,1,63.41,512a8.9,8.9,0,0,1-5,1.19,12.93,12.93,0,0,1-4.42-.74,11.73,11.73,0,0,1-3.72-2.19l-2.58,3.17a14.92,14.92,0,0,0,3.1,2,14.74,14.74,0,0,0,3.57,1.22l1.91.41h2.14a15.31,15.31,0,0,0,5.86-1A8.1,8.1,0,0,0,68,513.2a8.22,8.22,0,0,0,1.28-4.63v0a7.69,7.69,0,0,0-1.21-4.59A7,7,0,0,0,65.07,501.51Z"
                  ></path>
                  <polygon
                    className="cls-1"
                    points="112.78 491.2 121.14 491.2 121.14 516.83 125.29 516.83 125.29 491.2 133.65 491.2 133.65 487.25 112.78 487.25 112.78 491.2"
                  ></polygon>
                  <path
                    className="cls-1"
                    d="M194.8,506.27a7.09,7.09,0,0,1-1.64,5,6,6,0,0,1-4.63,1.77,5.91,5.91,0,0,1-4.59-1.77,7.08,7.08,0,0,1-1.63-5v-19h-4.15v18.88a13.38,13.38,0,0,0,1.22,6,8.5,8.5,0,0,0,3.55,3.76,11.39,11.39,0,0,0,5.6,1.29,11.52,11.52,0,0,0,5.64-1.29,8.52,8.52,0,0,0,3.56-3.76,13.38,13.38,0,0,0,1.22-6V487.25H194.8Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M262.58,488.49a13.62,13.62,0,0,0-6.08-1.24h-9.38v29.58h9.36a13.84,13.84,0,0,0,6.09-1.24,8.66,8.66,0,0,0,3.85-3.62,11.57,11.57,0,0,0,1.33-5.74v-8.38a11.57,11.57,0,0,0-1.33-5.74A8.63,8.63,0,0,0,262.58,488.49Zm.91,17.9a6.27,6.27,0,0,1-1.8,4.79,7.11,7.11,0,0,1-5.07,1.7h-5.35V491.2h5.35a7.11,7.11,0,0,1,5.07,1.69,6.28,6.28,0,0,1,1.8,4.79Z"
                  ></path>
                  <rect
                    className="cls-1"
                    x="315.71"
                    y="487.25"
                    width="4.15"
                    height="29.58"
                  ></rect>
                  <path
                    className="cls-1"
                    d="M384.08,488.3a11.6,11.6,0,0,0-10.9,0,9.15,9.15,0,0,0-3.65,3.82,12.23,12.23,0,0,0-1.3,5.73v8.38a12.16,12.16,0,0,0,1.3,5.72,9.18,9.18,0,0,0,3.65,3.83,11.68,11.68,0,0,0,10.9,0,9.24,9.24,0,0,0,3.65-3.83,12.15,12.15,0,0,0,1.29-5.72v-8.38a12.22,12.22,0,0,0-1.29-5.73A9.21,9.21,0,0,0,384.08,488.3Zm.69,18.07a7.69,7.69,0,0,1-.76,3.51,5.56,5.56,0,0,1-2.16,2.34,6.73,6.73,0,0,1-6.44,0,5.56,5.56,0,0,1-2.16-2.34,7.69,7.69,0,0,1-.76-3.51v-8.66a7.69,7.69,0,0,1,.76-3.51,5.56,5.56,0,0,1,2.16-2.34,6.66,6.66,0,0,1,6.44,0A5.56,5.56,0,0,1,384,494.2a7.69,7.69,0,0,1,.76,3.51Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M452.11,501.51a24.15,24.15,0,0,0-4.48-1.3l-.23,0-.22,0-.15,0-.15,0a31.76,31.76,0,0,1-3.59-.87,5.27,5.27,0,0,1-2.16-1.29,3.24,3.24,0,0,1-.86-2.4v0a4,4,0,0,1,1.67-3.43,7.93,7.93,0,0,1,4.71-1.21,9.74,9.74,0,0,1,3.37.62,13.66,13.66,0,0,1,3.37,1.86l2.36-3.29a17.15,17.15,0,0,0-2.94-1.72,15.14,15.14,0,0,0-3-1A15.43,15.43,0,0,0,441,488a7.74,7.74,0,0,0-3.59,3,8.6,8.6,0,0,0-1.23,4.69v0a7.71,7.71,0,0,0,1.32,4.83,6.83,6.83,0,0,0,3.18,2.34,31.43,31.43,0,0,0,4.83,1.15l.31.06.13,0,.13,0a22.88,22.88,0,0,1,3.29.81,4.66,4.66,0,0,1,2.07,1.34,3.53,3.53,0,0,1,.81,2.45v0a3.84,3.84,0,0,1-1.77,3.37,8.91,8.91,0,0,1-5,1.19,12.88,12.88,0,0,1-4.41-.74,11.52,11.52,0,0,1-3.72-2.19l-2.59,3.17a15.46,15.46,0,0,0,3.1,2,15,15,0,0,0,3.58,1.22l1.91.41h2.13a15.36,15.36,0,0,0,5.87-1,8,8,0,0,0,3.71-2.93,8.15,8.15,0,0,0,1.29-4.63v0a7.76,7.76,0,0,0-1.21-4.59A7,7,0,0,0,452.11,501.51Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M166.67,179a3.56,3.56,0,1,0,3.57,3.56A3.56,3.56,0,0,0,166.67,179Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M177.49,179a3.56,3.56,0,1,0,3.56,3.56A3.56,3.56,0,0,0,177.49,179Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M92.16,245.61a6.08,6.08,0,0,0-6.08,6.08h0a6.08,6.08,0,0,0,12.16,0h0A6.08,6.08,0,0,0,92.16,245.61Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M125.74,72.72a16,16,0,1,1-16-16,15.54,15.54,0,0,1,7.6,2.19,40.56,40.56,0,1,0,4.78,4.1A15.65,15.65,0,0,1,125.74,72.72Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M109.77,65.07a6.1,6.1,0,1,0,6.1-6.1A6.1,6.1,0,0,0,109.77,65.07Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M285.58,72.72a16,16,0,1,1-16-16,15.57,15.57,0,0,1,7.61,2.19A40.56,40.56,0,1,0,282,63,15.65,15.65,0,0,1,285.58,72.72Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M269.6,65.07a6.11,6.11,0,1,0,6.11-6.1A6.11,6.11,0,0,0,269.6,65.07Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M503.89,87.46c-.1-1.56-.2-3.12-.35-4.68s-.35-3.07-.61-4.63-.5-3-.8-4.53a87.52,87.52,0,0,0-2.27-8.81c-.35-1.06-.7-2.17-1.05-3.23a87.12,87.12,0,0,0-10.58-20.94,78,78,0,0,0-8-10.28,1.33,1.33,0,0,1-.25-.3c-.9-1-1.76-1.86-2.67-2.77l-.8-.8c-.86-.86-1.76-1.72-2.72-2.57s-2.17-1.92-3.32-2.87c-1-.81-1.92-1.56-2.92-2.32L466.48,18a6.32,6.32,0,0,0-.66-.51,1.72,1.72,0,0,0-.6-.45,7.5,7.5,0,0,0-11.53,5.34V32.43a14.19,14.19,0,0,0,4.43,10.32,67.73,67.73,0,0,1-4.43,102.62A66.78,66.78,0,0,1,416,159.67c-1.41,0-2.77-.1-4.18-.1s-2.77.05-4.18.1a66.67,66.67,0,0,1-37.56-14.3,67.69,67.69,0,0,1-4.48-102.62,14,14,0,0,0,4.48-10.32V23.36a7.54,7.54,0,0,0-7.55-7.55,7,7,0,0,0-4.18,1.31c-1.41,1-2.82,2.06-4.18,3.17s-2.92,2.37-4.33,3.63l-.25.25c-1.51,1.41-3,2.87-4.43,4.38s-2.82,3-4.13,4.58c-1.16,1.36-2.22,2.77-3.28,4.18-.45.56-.85,1.16-1.26,1.76-.95,1.31-1.86,2.67-2.71,4.08-.61,1-1.21,1.92-1.77,2.92a1.19,1.19,0,0,1-.15.26,92.05,92.05,0,0,0-159.82.05A92.11,92.11,0,0,0,0,92.2V251.72a92.11,92.11,0,0,0,172,45.87,92.62,92.62,0,0,0,27,29.71,7.09,7.09,0,0,0,11.18-5.79v-10a14.16,14.16,0,0,0-4.43-10.27,67.64,67.64,0,0,1,44.61-117,14.51,14.51,0,0,0,1.61.11,14.35,14.35,0,0,0,1.61-.11,67.67,67.67,0,0,1,44.62,117,14,14,0,0,0-4.44,10.27v9.67a7.23,7.23,0,0,0,11.38,5.89,88.85,88.85,0,0,0,16.12-14.55,14.2,14.2,0,0,1,21.35,0,92.21,92.21,0,0,0,144.41-7.61,7.16,7.16,0,0,0-5.89-11.23H471.06a14,14,0,0,0-10.32,4.43A67.45,67.45,0,0,1,362.4,205.8a0,0,0,0,0,.05-.05,67.19,67.19,0,0,1,5.94-5.64l.05-.05a61.91,61.91,0,0,1,6.6-4.89c1.51-1,3.12-2,4.73-2.82.8-.5,1.61-.9,2.42-1.31a68.34,68.34,0,0,1,13.14-4.78,2.2,2.2,0,0,0,.5-.1c1.87-.46,3.78-.86,5.74-1.16s3.63-.4,5.44-.55l2.87-.15h.45c.51,0,1,0,1.51,0,.66,0,1.26,0,1.87,0h1.56c1.16-.06,2.26-.11,3.37-.21s2.47-.2,3.68-.35c.6-.05,1.16-.1,1.71-.2,1.46-.2,2.92-.4,4.38-.71s2.77-.5,4.13-.85c.81-.15,1.56-.35,2.32-.56q2.26-.53,4.38-1.2c1.61-.51,3.17-1.06,4.73-1.67s3.32-1.25,4.93-2,3-1.36,4.44-2.11a1.72,1.72,0,0,0,.6-.31c1.31-.65,2.62-1.36,3.88-2.11h.05a0,0,0,0,0,.05,0,9.71,9.71,0,0,0,1.26-.71c1.41-.85,2.82-1.76,4.18-2.67.65-.4,1.26-.85,1.86-1.3,1.26-.86,2.52-1.82,3.73-2.82a9.11,9.11,0,0,0,.75-.56c1.41-1.11,2.77-2.26,4.08-3.47.45-.41.91-.81,1.31-1.21,1.06-1,2.11-2,3.07-3.07.35-.36.65-.71,1-1a31.11,31.11,0,0,0,2.11-2.37c.61-.65,1.16-1.31,1.71-2q1.44-1.74,2.72-3.47c.91-1.21,1.76-2.37,2.57-3.63s1.66-2.47,2.42-3.73,1.51-2.56,2.21-3.87a70.18,70.18,0,0,0,3.88-8.06c1-2.27,1.86-4.63,2.67-7.05.15-.5.3-1.06.5-1.56.76-2.52,1.46-5.09,2-7.7.05-.41.15-.76.2-1.11.3-1.46.55-2.92.8-4.38s.41-2.77.56-4.13c0-.25.05-.56.05-.81.15-1.46.25-2.92.35-4.38s.15-3.17.15-4.78S504,89,503.89,87.46ZM22.11,252.57c-.41-16.56,6.34-33.63,19-43.85-9.27,13.14-14.6,28.3-13.75,43.7.25,15.41,6.6,30.22,16.72,42.6C30.77,285.76,22.86,269.19,22.11,252.57Zm11.48-.4c-.46-16.61,6.34-33.63,19-43.81C43.3,221.41,38,236.66,38.82,252c.25,15.51,6.65,30.21,16.77,42.65C42.2,285.3,34.29,268.79,33.59,252.17Zm84,4a25.87,25.87,0,1,1-31.17-29.66A25.84,25.84,0,0,1,117.63,256.15ZM95.17,159.67c-1,0-2-.15-3-.15s-2,.1-3,.15a67.63,67.63,0,1,1,6,0ZM197.3,162,187,178.93l-14.94,24.63-14.94-24.63L146.86,162a5.06,5.06,0,0,1,4.32-7.69H193A5.06,5.06,0,0,1,197.3,162Zm56.58-2.27c-.6,0-1.25-.05-1.86-.05s-1.26.05-1.86.05a67.63,67.63,0,1,1,3.72,0Z"
                  ></path>
                </g>
              </g>
            </svg>

            <button
              onClick={() => login()}
              className="bg-white/90 hover:scale-105 hover:bg-white duration-300 transition-all text-black w-full py-2 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Image height={20} width={20} src={GoogleIcon} />
              <span>Continue with Google</span>
            </button>

            {/* Before and after for surrounding content with a horizontal line */}
            <div
              className='flex gap-2 after:content-[""] after:flex-1 after:border-b-2 after:border-solid after:m-auto after:mr-2.5
                    before:content-[""] before:flex-1 before:border-b-2 before:border-solid before:m-auto before:ml-2.5'
            >
              or login with email
            </div>
            <div className="space-y-6">
              <input
                autoComplete="off"
                className="w-full py-2 rounded-xl bg-black/30 px-4 placeholder:text-white/40 border-none focus:ring-0"
                placeholder="Email"
                type="email"
                name="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="w-full bg-black/30 flex items-center rounded-xl pr-2 ">
                <input
                  autoComplete="off"
                  className="py-2 rounded-xl bg-transparent px-4 placeholder:text-white/40 w-full border-0 border-none focus:ring-0"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {!showPassword ? (
                  <svg
                    onClick={() => setShowPassword((prev) => !prev)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 stroke-white/50 inline cursor-pointer hover:stroke-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    onClick={() => setShowPassword((prev) => !prev)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 stroke-white/50 inline cursor-pointer hover:stroke-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div
              onClick={handleSubmit}
              className="w-full bg-black/70 filter backdrop-blur-3xl font-bold text-lg rounded-xl px-4 py-3 cursor-pointer flex justify-center items-center transition-all hover:scale-105 hover:bg-black/90 duration-300"
            >
              {loading ? (
                <svg
                  className="animate-spin h-8 w-8 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Login"
              )}
            </div>
            <div className="flex flex-col gap-1 md:flex-row justify-between">
              <Link href={"/sign-up"}>
                <span className="underline cursor-pointer">
                  Create an account
                </span>
              </Link>
              <Link href={"/forgot-password"}>
                <span className="underline cursor-pointer">
                  Forgot password?
                </span>
              </Link>
            </div>
            <div className="lg:hidden pt-8 text-center mx-auto md:left-0 md:right-0">
              <p>
                {" "}
                <span className="text-primary">Bay Owl Studios</span> | © All
                rights reserved 2022
              </p>
              <p>
                {"Designed & Developed by"}{" "}
                <a
                  href="https://debox.co.in/"
                  className="text-primary cursor-pointer"
                >
                  Debox Consulting Private Limited
                </a>
              </p>
            </div>
          </div>
        )}
        <div className="hidden lg:block lg:absolute md:bottom-2 mt-20 text-center mx-auto md:left-0 md:right-0">
          <p className="text-sm">
            {" "}
            <span className="text-primary">
              <a href="https://bayowlstudios.com">Bay Owl Studios</a>
            </span>{" "}
            | © All rights reserved 2022
          </p>
          <p className="text-sm">
            {"Designed & Developed by"}{" "}
            <a
              href="https://debox.co.in/"
              className="text-primary cursor-pointer"
            >
              Debox Consulting Private Limited
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo(null, context);

  try {
    const meQueryData = await apolloClient.query<MeQuery>({
      query: MeDocument,
    });

    if (meQueryData.error || meQueryData.errors) {
      return addApolloState(apolloClient, {
        props: {},
      });
    }

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } catch (error: any) {
    return addApolloState(apolloClient, {
      props: {},
    });
  }
};
