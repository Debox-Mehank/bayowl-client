import React from "react";
import Button from "./reusable/Button";
import { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import useMediaQuery from "../hooks/useMediaQuery";
import FloatingProfile from "./reusable/FloatingProfile";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

function DashNav({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const router = useRouter();
  const currentRoute = router.pathname;

  useEffect(() => {
    isDesktop ? setIsOpen(true) : setIsOpen(false);
  }, [isDesktop]);

  return (
    <div>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed top-6 right-3 text-white lg:hidden inline-block z-[120]"
      >
        <div
          id="nav-icon3"
          className={`z-[120] w-full h-full ${isOpen ? "open" : ""}`}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 lg:static ${isOpen ? "z-[60]" : "z-0"}`}
      >
        <div className="hidden lg:block">
          <FloatingProfile position="absolute" name={name} email={email} />
        </div>

        <aside
          id="menu"
          className={`min-h-screen md:w-80 flex duration-500 transition-transform bg-darkBlue ${
            !isDesktop && isOpen
              ? "translate-x-0"
              : "-translate-x-80 lg:-translate-x-0"
          }`}
        >
          <div className="lg:hidden">
            <FloatingProfile position="absolute" name={name} email={email} />
          </div>
          <div className="w-full flex items-start flex-col text-white px-10 py-4 space-y-6 sticky">
            <svg
              height={100}
              width={200}
              className={`fill-white hover:fill-primary transition-colors duration-300 cursor-pointer mx-auto`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 715.02 158.51"
            >
              <g id="Layer_2" data-name="Layer 2">
                <g id="Your_design" data-name="Your design">
                  <path
                    className="cls-1"
                    d="M80.35,82.51a1.64,1.64,0,1,0,1.72,1.64A1.67,1.67,0,0,0,80.35,82.51Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M85.57,82.51a1.64,1.64,0,1,0,1.71,1.64A1.68,1.68,0,0,0,85.57,82.51Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M44.43,113.22A2.86,2.86,0,0,0,41.5,116h0a2.93,2.93,0,0,0,5.86,0h0A2.86,2.86,0,0,0,44.43,113.22Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M60.62,33.52a7.71,7.71,0,0,1-15.4,0,7.54,7.54,0,0,1,7.7-7.36,7.75,7.75,0,0,1,3.67,1,20.57,20.57,0,0,0-12.16-4c-11.14,0-20.16,8.64-20.16,19.28s9,19.29,20.16,19.29S64.6,53.11,64.6,42.46a18.77,18.77,0,0,0-5.71-13.4A7,7,0,0,1,60.62,33.52Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M52.92,30a2.94,2.94,0,1,0,2.94-2.82A2.88,2.88,0,0,0,52.92,30Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M137.68,33.52a7.71,7.71,0,0,1-15.4,0,7.53,7.53,0,0,1,7.7-7.36,7.68,7.68,0,0,1,3.66,1,20.51,20.51,0,0,0-12.15-4c-11.14,0-20.17,8.64-20.17,19.28s9,19.29,20.17,19.29,20.16-8.64,20.16-19.29a18.76,18.76,0,0,0-5.7-13.4A7,7,0,0,1,137.68,33.52Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M130,30a2.94,2.94,0,1,0,2.94-2.82A2.87,2.87,0,0,0,130,30Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M242.93,40.32c-.05-.72-.1-1.44-.17-2.16s-.17-1.42-.29-2.14-.25-1.39-.39-2.08A40.68,40.68,0,0,0,241,29.87c-.17-.48-.34-1-.51-1.48a39.71,39.71,0,0,0-5.1-9.66A36.1,36.1,0,0,0,231.52,14a.69.69,0,0,1-.12-.14c-.44-.44-.85-.86-1.29-1.28l-.39-.37c-.41-.4-.85-.79-1.31-1.18s-1-.89-1.6-1.33-.92-.72-1.41-1.07l-.51-.34a3,3,0,0,0-.32-.24.72.72,0,0,0-.29-.2,3.66,3.66,0,0,0-2-.56,3.55,3.55,0,0,0-3.6,3V15a6.42,6.42,0,0,0,2.14,4.76A30.33,30.33,0,0,1,218.72,67a33.12,33.12,0,0,1-18.15,6.6c-.68,0-1.34,0-2,0s-1.33,0-2,0A33,33,0,0,1,178.43,67a30.32,30.32,0,0,1-2.16-47.3A6.37,6.37,0,0,0,178.43,15V10.77a3.56,3.56,0,0,0-3.64-3.48,3.51,3.51,0,0,0-2,.6c-.68.47-1.36,1-2,1.46s-1.41,1.1-2.09,1.68l-.12.11c-.73.65-1.46,1.32-2.14,2s-1.36,1.39-2,2.11-1.07,1.28-1.58,1.93c-.22.26-.41.53-.61.81-.46.61-.89,1.23-1.31,1.88-.29.44-.58.88-.85,1.35a.35.35,0,0,1-.07.12,45.41,45.41,0,0,0-77,0A44.71,44.71,0,0,0,44.45,0C19.91,0,0,19,0,42.5V116c0,23.46,19.88,42.47,44.42,42.47a44.75,44.75,0,0,0,38.51-21.33,43.57,43.57,0,0,0,13,13.7,3.43,3.43,0,0,0,5.39-2.67v-4.6a6.43,6.43,0,0,0-2.13-4.73,30.3,30.3,0,0,1,2.13-47.31,33.46,33.46,0,0,1,19.37-6.64,6.11,6.11,0,0,0,1.56,0,33.46,33.46,0,0,1,19.37,6.64,30.36,30.36,0,0,1,2.14,47.31,6.3,6.3,0,0,0-2.14,4.73v4.46a3.49,3.49,0,0,0,5.49,2.71,41.83,41.83,0,0,0,7.76-6.7,7.07,7.07,0,0,1,10.3,0,43.94,43.94,0,0,0,13.2,9.82,46.15,46.15,0,0,0,20.15,4.61,45.56,45.56,0,0,0,20.15-4.64,43.65,43.65,0,0,0,16.12-13.3A3.29,3.29,0,0,0,232,135.4H227.1a6.89,6.89,0,0,0-5,2,33.32,33.32,0,0,1-28.52,9.35c-14-2-25.2-12.74-27.21-26.09a30.15,30.15,0,0,1,8.32-25.83,0,0,0,0,0,0,0,35.28,35.28,0,0,1,2.86-2.6l0,0A30.71,30.71,0,0,1,180.81,90a25.38,25.38,0,0,1,2.28-1.3,12.81,12.81,0,0,1,1.16-.6,33.47,33.47,0,0,1,6.34-2.21.86.86,0,0,0,.24,0c.9-.2,1.82-.39,2.77-.53s1.75-.18,2.62-.25L197.6,85h.22c.25,0,.49,0,.73,0s.61,0,.9,0h.75c.56,0,1.09,0,1.63-.1s1.19-.09,1.77-.16c.29,0,.56,0,.83-.09.7-.1,1.4-.19,2.11-.33s1.33-.23,2-.39c.39-.07.75-.16,1.12-.26.72-.16,1.43-.35,2.11-.55s1.53-.49,2.28-.77,1.6-.58,2.38-.93,1.43-.63,2.13-1a1,1,0,0,0,.3-.14c.63-.3,1.26-.63,1.87-1h0a0,0,0,0,0,0,0,4,4,0,0,0,.61-.33c.68-.39,1.36-.81,2-1.23a10.66,10.66,0,0,0,.89-.6,22.13,22.13,0,0,0,1.8-1.3,2.7,2.7,0,0,0,.36-.26c.68-.51,1.34-1,2-1.6.22-.18.44-.37.63-.55.51-.47,1-.93,1.48-1.42l.46-.46a12.93,12.93,0,0,0,1-1.09l.83-.91c.46-.53.9-1.07,1.31-1.6s.85-1.09,1.24-1.67.8-1.14,1.16-1.72.73-1.18,1.07-1.79A32.21,32.21,0,0,0,239.48,59c.46-1.05.9-2.14,1.29-3.25a6.75,6.75,0,0,1,.24-.72c.36-1.16.7-2.35,1-3.55,0-.19.07-.35.1-.51.14-.68.26-1.35.39-2s.19-1.28.26-1.91c0-.11,0-.25,0-.37.07-.67.12-1.34.17-2s.07-1.46.07-2.2S243,41,242.93,40.32ZM10.66,116.43c-.2-7.64,3.06-15.5,9.17-20.22-4.46,6.06-7,13.05-6.62,20.15.12,7.1,3.18,13.93,8.06,19.64C14.83,131.73,11,124.09,10.66,116.43Zm5.53-.18c-.22-7.66,3.06-15.51,9.15-20.2-4.46,6-7,13-6.62,20.1.12,7.15,3.2,13.93,8.08,19.66C20.34,131.52,16.53,123.91,16.19,116.25Zm40.52,1.83a12.13,12.13,0,0,1-9.42,9.56c-9.1,2-17.09-5.71-15-14.44a12.08,12.08,0,0,1,9.37-8.79C50.52,102.62,58.14,109.72,56.71,118.08ZM45.88,73.61c-.48,0-1-.07-1.46-.07s-.94,0-1.43.07C25.66,72.86,11.82,59.24,11.82,42.5c0-18.38,16.66-33,36.29-31C62.92,13.05,75,24.42,76.78,38.56,79.16,57,64.57,72.82,45.88,73.61Zm49.24,1.06-5,7.81L83,93.84l-7.2-11.36-5-7.81a2.33,2.33,0,0,1,2.09-3.54H93A2.33,2.33,0,0,1,95.12,74.67Zm27.28-1-.9,0-.9,0c-18.91-.49-33.81-16.34-31.48-35,1.77-14.2,13.86-25.62,28.71-27.18,19.67-2,36.27,12.63,36.27,31C154.1,59.4,140,73.16,122.4,73.63Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M316.4,51.34A16.59,16.59,0,0,0,324.23,46a13.48,13.48,0,0,0,2.91-8.68q0-10.07-7.72-14.88t-22.05-4.82a109.86,109.86,0,0,0-11.76.62,42.49,42.49,0,0,0-9.51,2,9.12,9.12,0,0,0-3.53,2.07,4.92,4.92,0,0,0-1.29,3.64V78.2q0,5.82,6.16,8.18a26.19,26.19,0,0,0,4.93,1.39q2.69.51,5.43.84c1.82.23,3.6.38,5.31.45s3.21.11,4.48.11q15.45,0,23.68-5.31t8.22-16.4a14.92,14.92,0,0,0-3.75-10.41A19.33,19.33,0,0,0,316.4,51.34ZM290.31,32.87a29.08,29.08,0,0,1,3.42-.34c1.45-.07,2.74-.11,3.86-.11q5,0,7.56,1.79A5.61,5.61,0,0,1,307.67,39a6.38,6.38,0,0,1-2.19,5.26c-1.45,1.2-3.79,1.8-7,1.8h-8.18Zm16.18,39.46a13.86,13.86,0,0,1-7.44,1.84c-1.5,0-3.07,0-4.71-.16a20.54,20.54,0,0,1-4-.62V59.73h9.18c3.36,0,5.86.53,7.5,1.57s2.47,2.8,2.47,5.26A6.31,6.31,0,0,1,306.49,72.33Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M393.08,54.64q-2.35-8.23-4.7-16T384,25.14q-1.23-3.47-5.54-5.09a28.06,28.06,0,0,0-9.91-1.62,30.81,30.81,0,0,0-7.78,1A23.34,23.34,0,0,0,355,21.56c-.53,1.34-1.25,3.28-2.19,5.82s-2,5.43-3.08,8.68-2.31,6.7-3.58,10.35-2.46,7.22-3.58,10.69-2.15,6.7-3.08,9.69-1.66,5.48-2.18,7.5c-.37,1.41-.71,2.65-1,3.69a11.33,11.33,0,0,0-.45,3.13,6.29,6.29,0,0,0,2.75,5.43q2.73,2,8.45,2a19.49,19.49,0,0,0,4.2-.39,29.49,29.49,0,0,0,3.3-1c.6-2.24,1.19-4.55,1.79-6.94s1.19-4.7,1.79-6.94h20.26l2,7.72a19.66,19.66,0,0,0,1.29,3.36,6.43,6.43,0,0,0,1.9,2.35,7.87,7.87,0,0,0,3,1.34,19.44,19.44,0,0,0,4.53.45,19.22,19.22,0,0,0,6.38-1,9.17,9.17,0,0,0,4-2.52q-1.68-6.15-3.92-14.16T393.08,54.64ZM361.4,58.17q1.56-5.94,3.52-11.7T368.45,36h.67q1.35,4.59,3,10.36t3.19,11.81Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M458.06,21.28a10.74,10.74,0,0,0-6.66-2.07,21.4,21.4,0,0,0-4.7.56,19.23,19.23,0,0,0-4.48,1.57q-1.58,4-2.8,7.1c-.82,2.06-1.6,4-2.35,5.94s-1.51,3.8-2.29,5.71-1.7,4-2.75,6.32h-.67l-9.29-18.69c-1.64-3.29-3.38-5.53-5.2-6.72a12.83,12.83,0,0,0-7.11-1.79,11,11,0,0,0-6.22,1.68,15.27,15.27,0,0,0-4,3.69,93.46,93.46,0,0,0,4.37,9.35q2.69,5.1,5.82,10.35t6.38,10.3q3.24,5,6,9.18V78.88q0,5.59,2.58,7.33c1.71,1.16,4.29,1.73,7.72,1.73a39.71,39.71,0,0,0,5-.33,31.41,31.41,0,0,0,3.81-.68V64.21q6.6-10.63,10.46-17.24t5.88-10.47a36,36,0,0,0,2.57-5.76,11.58,11.58,0,0,0,.56-3.25A7.28,7.28,0,0,0,458.06,21.28Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M557.13,37.9a31.78,31.78,0,0,0-7.56-11.25,32.53,32.53,0,0,0-11.25-6.88,42.49,42.49,0,0,0-27.87,0,31.11,31.11,0,0,0-18.7,18.13A40.8,40.8,0,0,0,489,53.35a41.07,41.07,0,0,0,2.69,15.34A32.11,32.11,0,0,0,499.09,80a31.19,31.19,0,0,0,11.19,7,40.16,40.16,0,0,0,14.11,2.41,41.31,41.31,0,0,0,14.1-2.35,30.73,30.73,0,0,0,18.7-18.19,41.88,41.88,0,0,0,2.68-15.51A40.6,40.6,0,0,0,557.13,37.9ZM535.58,68.58a14.85,14.85,0,0,1-22.28,0q-4.14-5-4.14-15.23t4.2-15.17a13.84,13.84,0,0,1,11.14-5,13.58,13.58,0,0,1,11.14,5q4.08,5,4.08,15.11T535.58,68.58Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M653.9,20.89a13.72,13.72,0,0,0-7.16-1.79,17.57,17.57,0,0,0-8.84,2.35q-.67,6-1.35,11.92t-1.34,11.87q-.68,6-1.46,12.2t-1.79,13h-.56q-.9-3.92-1.84-7.5t-2-7.22c-.68-2.43-1.37-5-2.07-7.61l-2.3-8.57a6.13,6.13,0,0,0-3.81-4.08,19.11,19.11,0,0,0-7.83-1.4,19.67,19.67,0,0,0-5.32.73,28.47,28.47,0,0,0-3.86,1.28q-1.12,5.72-2.13,10.13t-2,8.29c-.63,2.57-1.25,5.13-1.84,7.67s-1.24,5.29-1.91,8.28H594c-.22-1-.44-2.46-.67-4.25s-.58-4.31-1.06-7.56-1.12-7.41-1.9-12.48-1.78-11.42-3-19q-.67-4.36-3.42-6.22a12.26,12.26,0,0,0-7-1.84,14.87,14.87,0,0,0-6,1.23A15.65,15.65,0,0,0,566.59,23q.43,4.69,1.34,10.35t2,11.59q1.07,5.92,2.35,11.86t2.52,11q1.23,5.1,2.41,9.07a38.89,38.89,0,0,0,2.18,6c.82,1.71,2.59,3,5.32,4a28.07,28.07,0,0,0,9.12,1.4,25.69,25.69,0,0,0,7.39-1,12.73,12.73,0,0,0,5-2.57q1.34-4.82,3-11.76t3.24-14.21q1.9,7.38,3.59,13.54t3.13,10.64c.52,1.71,2,3,4.42,4a25,25,0,0,0,8.9,1.4,30.59,30.59,0,0,0,7.84-1,13,13,0,0,0,5.48-2.57,52,52,0,0,0,2.41-7q1.29-4.53,2.52-10.13t2.35-11.76q1.13-6.15,2-11.75t1.34-10.13a67.08,67.08,0,0,0,.51-7C656.93,24.1,655.92,22.08,653.9,20.89Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M712.9,71.93H687.26V27.72a13.58,13.58,0,0,0-.67-4.7,6.06,6.06,0,0,0-2-2.8,8,8,0,0,0-3.31-1.4,23.31,23.31,0,0,0-4.53-.39,35.89,35.89,0,0,0-5.15.39c-1.79.26-3.1.46-3.92.61V77.31a9.67,9.67,0,0,0,10.41,10.41h30a6.94,6.94,0,0,0,5-1.85Q715,84,715,79.55a13.78,13.78,0,0,0-.67-4.31A15.19,15.19,0,0,0,712.9,71.93Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M307,125.41a25.08,25.08,0,0,0-4.49-1.3l-.22,0-.23,0-.15,0-.15,0a35.18,35.18,0,0,1-3.59-.86,5.24,5.24,0,0,1-2.16-1.3,3.28,3.28,0,0,1-.86-2.4v0a4,4,0,0,1,1.68-3.42,7.88,7.88,0,0,1,4.71-1.21,9.5,9.5,0,0,1,3.36.62,13.66,13.66,0,0,1,3.37,1.86l2.36-3.3a18.13,18.13,0,0,0-2.94-1.72,15.89,15.89,0,0,0-3-1,15.46,15.46,0,0,0-8.8.67,7.67,7.67,0,0,0-3.59,3,8.56,8.56,0,0,0-1.23,4.69v0a7.75,7.75,0,0,0,1.32,4.83,6.83,6.83,0,0,0,3.18,2.34,33.14,33.14,0,0,0,4.84,1.15l.3.06.13,0a.34.34,0,0,1,.14,0,22.86,22.86,0,0,1,3.28.8,4.84,4.84,0,0,1,2.08,1.34,3.6,3.6,0,0,1,.8,2.45v0a3.82,3.82,0,0,1-1.77,3.37,8.9,8.9,0,0,1-5,1.19,12.93,12.93,0,0,1-4.42-.73,11.55,11.55,0,0,1-3.72-2.2l-2.58,3.18a14.92,14.92,0,0,0,3.1,2,15.18,15.18,0,0,0,3.57,1.22l1.91.41h2.14a15.3,15.3,0,0,0,5.86-1,8,8,0,0,0,3.72-2.93,8.17,8.17,0,0,0,1.28-4.63v0a7.71,7.71,0,0,0-1.21-4.58A7.09,7.09,0,0,0,307,125.41Z"
                  ></path>
                  <polygon
                    className="cls-1"
                    points="354.7 115.1 363.06 115.1 363.06 140.73 367.21 140.73 367.21 115.1 375.57 115.1 375.57 111.16 354.7 111.16 354.7 115.1"
                  ></polygon>
                  <path
                    className="cls-1"
                    d="M436.72,130.17a7.11,7.11,0,0,1-1.64,5,6.9,6.9,0,0,1-9.23,0,7.15,7.15,0,0,1-1.62-5v-19h-4.15V130A13.24,13.24,0,0,0,421.3,136a8.53,8.53,0,0,0,3.55,3.77,11.39,11.39,0,0,0,5.6,1.29,11.52,11.52,0,0,0,5.64-1.29,8.55,8.55,0,0,0,3.56-3.77,13.38,13.38,0,0,0,1.22-5.95V111.15h-4.15Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M504.5,112.4a13.62,13.62,0,0,0-6.08-1.25H489v29.58h9.35a13.71,13.71,0,0,0,6.1-1.24,8.6,8.6,0,0,0,3.85-3.62,11.68,11.68,0,0,0,1.32-5.74v-8.38a11.64,11.64,0,0,0-1.32-5.73A8.58,8.58,0,0,0,504.5,112.4Zm.91,17.9a6.28,6.28,0,0,1-1.8,4.79,7.11,7.11,0,0,1-5.07,1.7h-5.35V115.1h5.35a7.11,7.11,0,0,1,5.07,1.7,6.27,6.27,0,0,1,1.8,4.79Z"
                  ></path>
                  <rect
                    className="cls-1"
                    x="557.63"
                    y="111.15"
                    width="4.15"
                    height="29.58"
                  ></rect>
                  <path
                    className="cls-1"
                    d="M626,112.2a11.68,11.68,0,0,0-10.9,0,9.26,9.26,0,0,0-3.66,3.83,12.15,12.15,0,0,0-1.29,5.72v8.38a12.22,12.22,0,0,0,1.29,5.73,9.24,9.24,0,0,0,3.66,3.82,11.6,11.6,0,0,0,10.9,0,9.21,9.21,0,0,0,3.65-3.82,12.22,12.22,0,0,0,1.29-5.73v-8.38a12.15,12.15,0,0,0-1.29-5.72A9.24,9.24,0,0,0,626,112.2Zm.69,18.08a7.64,7.64,0,0,1-.76,3.5,5.5,5.5,0,0,1-2.16,2.34,6.68,6.68,0,0,1-6.45,0,5.48,5.48,0,0,1-2.15-2.34,7.65,7.65,0,0,1-.77-3.5v-8.67a7.69,7.69,0,0,1,.77-3.51,5.54,5.54,0,0,1,2.15-2.34,6.75,6.75,0,0,1,6.45,0,5.56,5.56,0,0,1,2.16,2.34,7.69,7.69,0,0,1,.76,3.51Z"
                  ></path>
                  <path
                    className="cls-1"
                    d="M694,125.41a25,25,0,0,0-4.48-1.3l-.23,0-.22,0-.15,0-.15,0a35.48,35.48,0,0,1-3.6-.86,5.14,5.14,0,0,1-2.15-1.3,3.24,3.24,0,0,1-.87-2.4v0a4,4,0,0,1,1.68-3.42,7.93,7.93,0,0,1,4.71-1.21,9.51,9.51,0,0,1,3.37.62,13.43,13.43,0,0,1,3.36,1.86l2.36-3.3a18.05,18.05,0,0,0-2.93-1.72,15.75,15.75,0,0,0-3-1,15.43,15.43,0,0,0-8.79.67,7.62,7.62,0,0,0-3.59,3,8.56,8.56,0,0,0-1.23,4.69v0a7.75,7.75,0,0,0,1.32,4.83,6.83,6.83,0,0,0,3.18,2.34,32.65,32.65,0,0,0,4.83,1.15l.31.06.13,0a.27.27,0,0,1,.13,0,23,23,0,0,1,3.29.8,4.8,4.8,0,0,1,2.07,1.34,3.55,3.55,0,0,1,.8,2.45v0a3.81,3.81,0,0,1-1.76,3.37,8.93,8.93,0,0,1-5,1.19,12.87,12.87,0,0,1-4.41-.73,11.7,11.7,0,0,1-3.73-2.2l-2.58,3.18a15.18,15.18,0,0,0,3.1,2,15.5,15.5,0,0,0,3.57,1.22l1.92.41h2.13a15.35,15.35,0,0,0,5.87-1A8,8,0,0,0,697,137.1a8.1,8.1,0,0,0,1.28-4.63v0a7.64,7.64,0,0,0-1.21-4.58A7,7,0,0,0,694,125.41Z"
                  ></path>
                </g>
              </g>
            </svg>
            <div className="w-full bg-gray-800 h-10">
              <Link href={"/services"}>
                <Button>
                  <div className="text-center w-full mx-auto text-md">
                    New Service
                  </div>
                </Button>
              </Link>
            </div>
            {/* <div onClick={() => setIsOpen(false)}
                        className="text-right text-4xl hover:text-primary cursor-pointer">&times;</div> */}
            {/* className={currentRoute === "/dashboard" ? "text-blueGradient-3" : ""} */}
            <Link href="/dashboard">
              <span
                className={`hover:text-primary/80 cursor-pointer duration-300 transition-colors text-lg ${
                  currentRoute === "/dashboard" ? "text-primary" : ""
                }`}
              >
                Dashboard
              </span>
            </Link>
            <Link href="/service-tracking">
              {/* */}
              <span
                className={`hover:text-primary/80 cursor-pointer duration-300 transition-colors text-lg ${
                  currentRoute === "/service-tracking" ? "text-primary" : ""
                }`}
              >
                Service Tracking
              </span>
            </Link>
          </div>
          {/* <main id="main" className="p-5">
                <span onClick={() => setIsOpen(true)} className="text-2xl text-primary font-semibold cursor-pointer hover:text-blueGradient-0">&#9776;</span>
            </main> */}
        </aside>
      </div>
    </div>
  );
}

export default DashNav;
