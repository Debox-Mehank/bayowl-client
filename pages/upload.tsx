// Defaults
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import JSZip from "jszip";
import { Uploader } from "../utils/uploader";
import { saveAs } from "file-saver";

// Hooks
import { useCallback } from "react";
import { useRef } from "react";

import { MusicNoteIcon, TrashIcon } from "@heroicons/react/solid/";

const maxFileSize = 104857600;

// Utils
import secondsToTime from "../utils/secsToTime";
import formatBytes from "../utils/formatBytes";
import isValidHttpUrl from "../utils/isValidURL";
import { getClickableLink } from "../utils/getClickableLink";

// Components
import Modal from "../components/reusable/Modal";
import Button from "../components/reusable/Button";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";
import {
  useGetS3SignedUrlLazyQuery,
  useGetUserServiceDetailsByIdLazyQuery,
  useGetUserServiceDetailsByIdQuery,
  useInitFileUploadLazyQuery,
} from "../graphql/generated/graphql";
import { UserServiceFinal } from "./dashboard";

// const fileTypes = ["wav", "mp3"];
// const service = {
//   projName: "Dream",
//   name: "Mix & Master (Pro Mix)",
//   status: [
//     { name: "Submitted", href: "#", status: "complete" },
//     { name: "Under Review", href: "#", status: "complete" },
//     { name: "Work In Progress", href: "#", status: "current" },
//     { name: "Delivered", href: "#", status: "upcoming" },
//     { name: "Revision Request", href: "#", status: "upcoming" },
//     { name: "Revision Delivered", href: "#", status: "upcoming" },
//   ],
//   // Submitted / Under Review / Work In Progress / Delivered / Revision Request Under Review / Revision Delivered
//   isExpanded: false,
//   serviceDetails: {
//     estimatedTime: "16 Hours",
//     inputTrackLimit: 10,
//     refTrackLimit: 3,
//     uploadTime: 20,
//     refFile: 3,
//     deliveryFormat: "48/24 .wav mix file + Instrument bus stems",
//     deliveryDays: 7,
//     revisionDays: 3,
//   },
// };

interface errorList {
  fileName: string;
  issue: string[];
}

interface refFileList {
  name?: string;
  file?: File;
  url?: string;
  isAddedByUpload: boolean;
}

const checkTypeDurationSize = async (
  file: File,
  fileTypes: string[],
  uploadTime: number
): Promise<boolean | errorList> => {
  async function getDuration(file: File) {
    const url = URL.createObjectURL(file);

    return new Promise((resolve) => {
      const audio = document.createElement("audio");
      audio.muted = true;
      const source = document.createElement("source");
      source.src = url; //--> blob URL
      audio.preload = "metadata";
      audio.appendChild(source);
      audio.onloadedmetadata = function () {
        resolve(audio.duration);
      };
    });
  }

  let errorDetails: errorList = {
    fileName: file.name,
    issue: [],
  };

  const fileType = `.${file.type.replace(/(.*)\//g, "")}`;

  // Type Check
  if (!fileTypes.includes(fileType)) {
    errorDetails.issue.push(
      `Invalid File Type. Only ${fileTypes.join(" , ")} are supported.`
    );
    return errorDetails;
  }

  // Duration Check
  const duration = await getDuration(file);
  // @ts-ignore
  if (duration > uploadTime) {
    // setFilesArray((prev) => prev.filter((file, idx) => idx !== index));
    errorDetails.issue.push(
      `Upload duration more than ${secondsToTime(uploadTime)}`
    );
  }

  // Size Check
  if (file.size > maxFileSize) {
    errorDetails.issue.push(`File size more than ${formatBytes(maxFileSize)}`);
  }

  if (errorDetails.issue.length > 0) {
    return errorDetails;
  }
  return false;
};

function Upload() {
  const router = useRouter();
  const { serviceId } = router.query;

  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<UserServiceFinal>();
  const [uploader, setUploader] = useState<Uploader>();

  const [getUserServiceDetailsByIdQuery] =
    useGetUserServiceDetailsByIdLazyQuery();
  const [getS3URL] = useGetS3SignedUrlLazyQuery();
  const [initFileUploadQuery] = useInitFileUploadLazyQuery();

  useEffect(() => {
    const fetchFunc = async () => {
      setLoading(true);
      const { data, error } = await getUserServiceDetailsByIdQuery({
        variables: { serviceId: serviceId?.toString() ?? "" },
      });

      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }

      if (!data || !data.getUserServiceDetailsById) {
        setLoading(false);
        toast.error("Something went wrong, try again later.");
        return;
      }

      setService(data.getUserServiceDetailsById);
    };
    if (serviceId) {
      fetchFunc();
    }
  }, [serviceId]);

  // Modals
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<Boolean>(false);
  const [isRefModalOpen, setIsRefModalOpen] = useState<Boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<Boolean>(false);
  const [onLoadModalOpen, setOnLoadModalOpen] = useState<Boolean>(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState<Boolean>(false);

  // Main File State
  const [filesArray, setFilesArray] = useState<File[]>([]);

  // Ref Tracks File State
  const [refFilesArray, setRefFilesArray] = useState<File[]>([]);

  // To let user choose between adding references tracks by files or links.
  const [isRefByUpload, setIsRefByUpload] = useState<Boolean | null>(null);
  const [refArray, setrefArray] = useState<refFileList[]>([]);

  // Error list to alert users reasons for upload failure.
  const [errorList, setErrorList] = useState<errorList[]>([]);

  const key = useRef(0);
  const key2 = useRef(0);
  const key3 = useRef(0);
  const urlEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // setOnLoadModalOpen(true)
  }, []);

  const handleChange = useCallback(
    async (files: FileList) => {
      if (service) {
        setErrorList([]);

        // Checking Number of files based on track Limit
        if (Array.from(files).length > (service.inputTrackLimit ?? 0)) {
          setErrorList([
            {
              fileName: "Tracks over the limit.",
              issue: [
                `Track limit for the selected plan is ${service.inputTrackLimit}`,
              ],
            },
          ]);
          setIsErrorModalOpen(true);
          return;
        }

        let approvedFiles: File[] = [];

        // Checking Type, Duration & Size for each file.

        for (const file of Array.from(files)) {
          const hasErrors = await checkTypeDurationSize(
            file,
            service.uploadFileFormat,
            service.maxFileDuration ?? 0
          );
          //  If no errors, push to approved files.
          if (!hasErrors) {
            approvedFiles = [...approvedFiles, file];
          } else if (typeof hasErrors === "object") {
            // Else append error list.
            setErrorList((prev) => [...prev, hasErrors]);
            setIsErrorModalOpen(true);
          }
        }
        // console.log(approvedFiles)

        {
          approvedFiles.length && setFilesArray(approvedFiles);
        }

        key.current = key.current + 1;
      }
    },
    [service]
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      let percentage: number | undefined = undefined;

      const finalFileName = `uploadedFiles_${serviceId}`;

      const zip = new JSZip();

      filesArray.forEach((file) => {
        zip.file(`${file.name}`, file);
      });

      const file = await zip.generateAsync({ type: "blob" });

      const { data: initData, error: initError } = await initFileUploadQuery({
        variables: { fileName: finalFileName + ".zip" },
      });

      if (initError) {
        setLoading(false);
        toast.error(initError.message);
        return;
      }

      if (!initData || !initData.initFileUpload) {
        setLoading(false);
        toast.error("Something went wrong, try again later.");
        return;
      }

      console.log(
        initData.initFileUpload.fileId,
        initData.initFileUpload.fileKey
      );

      const chunkSize = 100 * 1024 * 1024; // 10 MB
      const chunkCount = Math.floor(file.size / chunkSize) + 1;

      console.log("Chunks : ", chunkCount);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.toString());
    }
  };

  return (
    <>
      {loading ? <>Loading...</> : null}
      <div className="md:h-[96vh] max-h-[48rem] bg-darkBlue text-white flex relative max-w-7xl mx-auto">
        <Modal open={summaryModalOpen} setOpen={setSummaryModalOpen}>
          <div className="relative text-center">
            <svg
              onClick={() => setSummaryModalOpen(false)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute right-0 -top-2 w-6 h-6 hover:text-primary cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <h3 className="font-bold text-primary text-lg">Summary</h3>
            <p className="pt-4">
              Please ensure all your files added. After proceeding from this
              step, you will not be able to make any changes.
            </p>
            <p className="pt-4 text-center">
              <ul>
                <li>
                  Tracks Selected:{" "}
                  {filesArray.length + " / " + (service?.inputTrackLimit || 0)}
                </li>
                {(service?.numberOfReferenceFileUploads || 0) > 0 && (
                  <li>
                    Reference Tracks Selected:{" "}
                    {refArray.length +
                      " / " +
                      (service?.numberOfReferenceFileUploads || 0)}
                  </li>
                )}
              </ul>
            </p>
            <div className="pt-4">
              <span className="w-fit mx-auto block pt-4">
                <Button onClick={handleSubmit}>
                  <>{"Proceed & Upload"}</>
                </Button>
              </span>
            </div>
          </div>
        </Modal>
        <Modal open={onLoadModalOpen} setOpen={setOnLoadModalOpen}>
          <div>
            <svg
              onClick={() => setOnLoadModalOpen(false)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute right-3 top-3 w-6 h-6 hover:text-primary cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

            <h4 className="font-bold text-primary text-center">
              Before you proceed with adding your files, please ensure the
              following.
            </h4>

            <p className="pt-2">
              Please ensure that there is no white noise / silence in the
              beginning or towards the end of your tracks, and they match the
              following conditions.
            </p>

            <p className="pt-3 pb-2 px-4">
              <ul className="list-disc">
                <li>
                  Your input track limit is {service?.inputTrackLimit} track(s)
                </li>
                <li>
                  Accepted file format(s) are: {service?.uploadFileFormat}
                </li>
                <li>
                  The maximum duration for your plan is{" "}
                  {secondsToTime(service?.maxFileDuration ?? 0)}{" "}
                </li>
                <li>
                  The maximum file size for one track is{" "}
                  {formatBytes(maxFileSize)}{" "}
                </li>
                {/* <li></li> */}
              </ul>
            </p>
          </div>
        </Modal>
        <div className="absolute animation-delay-2000 top-[45%] left-[15%] w-36 md:w-96 h-96 bg-blueGradient-0 opacity-60 rounded-full mix-blend-screen filter blur-[60px] animate-blob overflow-hidden" />
        <div className="absolute animation-delay-2000 top-[35%] left-[55%] w-36 md:w-96 h-56 bg-primary opacity-60 rounded-full mix-blend-screen filter blur-[75px] animate-blob overflow-hidden" />
        <div className="absolute animation-delay-4000 top-[60%] right-[35%] w-36 md:w-96 h-56 bg-blueGradient-2 opacity-80 rounded-full mix-blend-screen filter blur-[70px] animate-blob overflow-hidden" />
        <div className="absolute top-[60%] right-[15%] w-36 md:w-96 h-56 bg-blueGradient-1 opacity-80 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
        {service ? (
          <>
            <div className="md:hidden grid place-items-center text-center mx-auto w-11/12">
              <h3 className="text-xl">
                Please continue with the uploading process on a desktop or a
                laptop.{" "}
                <span
                  className="underline underline-offset-4 mx-1"
                  onClick={() => router.back()}
                >
                  Go back
                </span>
              </h3>
            </div>
            <div className="hidden md:flex px-8 py-10 relative w-full justify-center items-center gap-10">
              <div className="w-2/6 relative flex flex-col gap-1">
                <svg
                  onClick={() => {
                    // setAddOns(null)
                    router.back();
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="30"
                  className="fill-white hover:fill-primary duration-300 transition-colors cursor-pointer top-0"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                  />
                </svg>
                <div className="flex flex-col justify-center gap-6 flex-1">
                  <div>
                    <span className="text-4xl font-bold">
                      {service.projectName}
                    </span>
                    <div className="text-xl font-bold">
                      {service.subCategory}
                    </div>
                  </div>
                  <div className="rounded-lg text-center py-3 px-6 bg-white/20 inline">
                    Upload Formats:
                    <span className="block text-xl">
                      {service.uploadFileFormat.join(", ")}
                    </span>
                  </div>
                  <div className="rounded-lg text-center py-3 px-6 bg-white/20 inline">
                    Input Track Limit
                    <span className="block text-xl">
                      {service.inputTrackLimit}
                    </span>
                  </div>
                  <div className="rounded-lg text-center py-3 px-6 bg-white/20 inline">
                    No. of Reference Files
                    <span className="block text-xl">
                      {service.numberOfReferenceFileUploads}
                    </span>
                  </div>

                  <div className="rounded-lg text-center py-3 px-6 bg-white/20 inline">
                    Maximum Duration of Files
                    <span className="block text-xl">
                      {secondsToTime(service.maxFileDuration ?? 0)}
                    </span>
                  </div>
                  <div className="rounded-lg text-center py-3 px-6 bg-white/20 inline">
                    Maximum File Size
                    <span className="block text-xl">
                      {formatBytes(maxFileSize)}
                    </span>
                  </div>
                </div>
                {/* <div className="rounded-lg text-center py-3 px-6 bg-white/20 inline">
                        Delivery Format
                        <span className="block text-xl">
                            {service.serviceDetails.deliveryFormat}
                        </span>
                    </div> */}
              </div>
              <div className="mx-auto w-4/6 rounded-2xl h-full">
                <form className="w-full h-full" name="File Upload Form">
                  {/* Error Modal */}
                  <Modal
                    open={isErrorModalOpen}
                    setOpen={() => {
                      setIsErrorModalOpen(true);
                      // setErrorList([]);
                    }}
                  >
                    <div className="text-center relative">
                      <svg
                        onClick={() => setIsErrorModalOpen(false)}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="absolute right-0 w-6 h-6 hover:text-primary duration-300 transition-colors cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>

                      {errorList.length > 0 && (
                        <>
                          <h4 className="text-lg">
                            {"We've found some issues with your file(s)."}{" "}
                          </h4>
                          <h4>They will not be uploaded.</h4>
                        </>
                      )}
                      <div className="pt-7 pb-4 space-y-2">
                        {errorList.map((err) => (
                          <div
                            key={err.fileName}
                            className="flex gap-4 text-left"
                          >
                            <span className="font-bold overflow-auto">
                              {err.fileName}
                            </span>
                            <span className="flex-1">
                              {err.issue.map((issue, index) => (
                                <p key={`${issue} - ${index}`}>{issue}</p>
                              ))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Modal>
                  {/* Upload Section */}
                  <div className="flex flex-col gap-2 items-stretch justify-around h-full py-3">
                    <div className="h-[65%]">
                      {filesArray.length <= 0 && (
                        <FileUploader
                          key={key.current}
                          multiple={true}
                          handleChange={handleChange}
                          name="Base Files"
                          disabled={false}
                          fileOrFiles={filesArray}
                        >
                          <div
                            className={`w-full cursor-pointer h-full px-2 bg-white/10 flex flex-col gap-8 rounded-xl ${
                              filesArray.length <= 0
                                ? "justify-center items-center"
                                : ""
                            }`}
                          >
                            {filesArray.length <= 0 && (
                              <>
                                <div className="h-48 w-48 bg-white/10 hover:bg-white/20 transition-colors duration-100 rounded-full cursor-pointer mx-auto grid place-items-center z-10">
                                  <svg
                                    className="z-0 fill-primary"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="100"
                                    height="100"
                                    viewBox="0 0 16 16"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                                    />
                                  </svg>
                                </div>
                                <div className="text-center">
                                  Drag your files here, or click to upload!
                                </div>
                              </>
                            )}
                          </div>
                        </FileUploader>
                      )}

                      {/* Showing Selected Files */}
                      {filesArray.length > 0 && (
                        <div className="flex flex-col justify-start w-full divide-y-2 divide-purple-500/20 px-4 h-full overflow-auto">
                          {filesArray.map((file, index) => (
                            // @ts-ignore
                            <div
                              key={file.name}
                              className="w-full py-3 px-4 flex items-center gap-4"
                            >
                              <div className="bg-white/10 py-3 px-3 rounded-md">
                                <MusicNoteIcon className="h-10 w-10 fill-transparent stroke-white stroke-[0.4]" />
                              </div>
                              <div>
                                {/*@ts-ignore */}
                                {file.name}
                              </div>
                              <div className="ml-auto">
                                <TrashIcon
                                  onClick={() => {
                                    setFilesArray((prev) =>
                                      prev.filter((file, idx) => idx !== index)
                                    );
                                  }}
                                  className="h-5 w-5 hover:fill-primary cursor-pointer"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Remarks, References */}
                    <div className="h-[35%] flex flex-col justify-around">
                      {/* Reference Tracks Modal */}
                      <Modal setOpen={setIsRefModalOpen} open={isRefModalOpen}>
                        <div className="relative">
                          {/* Common Header Content */}

                          <div className="relative">
                            {/* Back Icon */}
                            {isRefByUpload !== null && (
                              <svg
                                onClick={() => {
                                  setIsRefByUpload(null);
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 absolute top-0.5 left-0 hover:text-primary duration-300 transition-colors cursor-pointer"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                />
                              </svg>
                            )}
                            <h3 className="text-lg font-bold text-center align-middle">
                              Add Reference Tracks
                            </h3>
                            {/* Close Icon */}
                            <svg
                              onClick={() => setIsRefModalOpen(false)}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="absolute top-0.5 right-0 w-6 h-6 hover:text-primary duration-300 transition-colors cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <p className="pt-2 text-center">
                              {refArray.length +
                                " / " +
                                service.numberOfReferenceFileUploads}{" "}
                              References Added
                            </p>
                            <div className="mt-3">
                              {refArray.length > 0 &&
                                refArray.map((link, index) => (
                                  <div
                                    key={link.url}
                                    className="flex py-4 justify-between px-4 bg-white/5 mb-4 rounded-xl"
                                  >
                                    <a
                                      className="max-w-xs text-sm text-ellipsis overflow-hidden hover:text-primary"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      href={link.url}
                                    >
                                      {link.name ? link.name : link.url}
                                    </a>

                                    <TrashIcon
                                      onClick={() => {
                                        setrefArray((prev) =>
                                          prev.filter(
                                            (link, idx) => idx !== index
                                          )
                                        );
                                      }}
                                      className="ml-8 h-5 w-5 hover:fill-primary cursor-pointer inline"
                                    />
                                  </div>
                                ))}
                            </div>
                            {refArray.length > 0 && (
                              <div className="text-center mt-4 space-y-4 ">
                                <span
                                  className="block max-w-[8rem] w-fit mx-auto"
                                  onClick={() => setIsRefModalOpen(false)}
                                >
                                  <Button>
                                    <>Proceed</>
                                  </Button>
                                </span>
                                {refArray.length <
                                  (service.numberOfReferenceFileUploads ??
                                    0) && (
                                  <div className="font-bold text-md py-3">
                                    Or add more
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Letting user choose  */}

                          {isRefByUpload === null &&
                            refArray.length <
                              (service.numberOfReferenceFileUploads ?? 0) && (
                              <div
                                data-aos="fade-up"
                                className="text-center space-y-4 mt-4"
                              >
                                {refArray.length < 1 && (
                                  <div className="space-y-0.5">
                                    <p>
                                      Please select how you would like to add
                                      reference tracks.
                                    </p>
                                    <p>
                                      You can add references through a link or
                                      upload them.
                                    </p>
                                  </div>
                                )}
                                <div className="flex justify-around">
                                  <span onClick={() => setIsRefByUpload(false)}>
                                    <Button>
                                      <h3>Use a link</h3>
                                    </Button>
                                  </span>
                                  <span onClick={() => setIsRefByUpload(true)}>
                                    <Button>
                                      <h3> Upload Track</h3>
                                    </Button>
                                  </span>
                                </div>
                              </div>
                            )}

                          {/* Render according to choice */}

                          {/* By File Upload */}

                          {/* data-aos="fade-up" */}
                          {isRefByUpload && (
                            <div data-aos="fade-up">
                              <div className="mt-4 flex flex-col w-full text-center gap-3">
                                {refFilesArray.length > 0 &&
                                  refFilesArray.map((file, index) => (
                                    <div
                                      key={file.size}
                                      className="flex py-4 justify-between px-8 bg-white/5 mb-4 rounded-xl"
                                    >
                                      <p className="text-lg">{file.name}</p>
                                      <TrashIcon
                                        onClick={() => {
                                          setRefFilesArray((prev) =>
                                            prev.filter(
                                              (file, idx) => idx !== index
                                            )
                                          );
                                        }}
                                        className="h-5 w-5 hover:fill-primary cursor-pointer inline"
                                      />
                                    </div>
                                  ))}

                                {!(
                                  refFilesArray.length >
                                  (service.numberOfReferenceFileUploads ?? 0)
                                ) && (
                                  <FileUploader
                                    key={key3.current}
                                    handleChange={async (file: File) => {
                                      let approvedFiles: File[] = [];
                                      // Checking Type, Duration & Size for each file.

                                      // Check if files with the same name exists in the array or not.
                                      if (
                                        refFilesArray.find(
                                          (prevFile) =>
                                            prevFile.name === file.name
                                        )
                                      ) {
                                        // alert()
                                        toast.error(
                                          `Upload Failed - Reference file named ${file.name} has already been selected.`
                                        );
                                        return;
                                      }
                                      //
                                      if (
                                        filesArray.find(
                                          (prevFile) =>
                                            prevFile.name === file.name
                                        )
                                      ) {
                                        // alert()
                                        toast.error(
                                          `Upload Failed - You have already added this file as a part of your base files.`
                                        );
                                        return;
                                      }

                                      const hasErrors =
                                        await checkTypeDurationSize(
                                          file,
                                          service.uploadFileFormat,
                                          service.maxFileDuration ?? 0
                                        );
                                      //  If no errors, push to approved files.
                                      if (!hasErrors) {
                                        // Upload the file to S3 that returns a URL
                                        // Append refArray with the returned URL.
                                        setrefArray((prev) => [
                                          ...prev,
                                          {
                                            name: file.name,
                                            file: file,
                                            isAddedByUpload: true,
                                          },
                                        ]);
                                      } else if (
                                        typeof hasErrors === "object"
                                      ) {
                                        // Else append error list.
                                        toast.error(
                                          "Upload Failed - " +
                                            hasErrors.fileName +
                                            " - " +
                                            hasErrors.issue.join(" & ")
                                        );
                                      }

                                      setIsRefByUpload(null);

                                      key3.current = key3.current + 1;
                                    }}
                                    name="Reference Files"
                                    fileOrFiles={refFilesArray}
                                    classes={
                                      "w-full text-center cursor-pointer group"
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-8 h-8 my-1 group-hover:text-primary duration-200 transition-colors mx-auto"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span className="text-center mx-auto group-hover:text-primary duration-200 transition-colors">
                                      Click to upload or drag on this area.
                                    </span>
                                  </FileUploader>
                                )}
                                {refFilesArray.length > 0 && (
                                  <div className="text-sm text-center">
                                    <span
                                      className=""
                                      onClick={() => setIsRefModalOpen(false)}
                                    >
                                      <Button>
                                        <>Proceed</>
                                      </Button>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Upload By Links */}

                          {isRefByUpload === false && (
                            <div data-aos="fade-up">
                              <div className="mt-4 flex flex-col gap-2 px-4">
                                {refArray.length <
                                  (service.numberOfReferenceFileUploads ??
                                    0) && (
                                  <div className="w-full flex gap-4">
                                    <input
                                      ref={urlEl}
                                      placeholder="Enter URL"
                                      className="bg-white/10 rounded-xl w-full border-transparent focus:border-transparent focus:ring-0"
                                      type="url"
                                      name="Ref Link"
                                      id="refLink"
                                    />
                                    <svg
                                      onClick={() => {
                                        const input = urlEl.current?.value;
                                        if (input && isValidHttpUrl(input)) {
                                          setrefArray((prev) => [
                                            ...prev,
                                            {
                                              url: getClickableLink(input),
                                              isAddedByUpload: false,
                                            },
                                          ]);
                                          urlEl.current.value = "";
                                          setIsRefByUpload(null);
                                          return;
                                        }
                                        toast.error(
                                          "Invalid URL. Please check and try again."
                                        );
                                        // urlEl.current.text
                                        // refArray()
                                      }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-10 h-10 cursor-pointer hover:text-primary duration-200 transition-colors mx-auto"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </Modal>
                      <textarea
                        className="bg-darkBlue/20 rounded-xl w-full h-full my-2"
                        name="Remarks"
                        id="remarks"
                        placeholder="Please mention any preferences or special requests here."
                      />
                      <div className="pb-2 pt-1 flex gap-2">
                        <div>
                          Tracks Selected:{" "}
                          {filesArray.length +
                            " / " +
                            (service.inputTrackLimit ?? 0)}
                        </div>
                        {errorList.length > 0 && (
                          <>
                            <span>|</span>
                            <div
                              onClick={() => setIsErrorModalOpen(true)}
                              className="flex gap-2 items-center justify-center cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 inline stroke-red-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                                />
                              </svg>
                              <span className="text-red-500">
                                Issues with your recent upload.
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex justify-between z-50">
                        <div className="space-x-4">
                          {(service.numberOfReferenceFileUploads ?? 0) > 0 && (
                            <span
                              onClick={() => {
                                setIsRefModalOpen(true);
                              }}
                            >
                              <div className="w-fit">
                                <Button>
                                  <>Add References</>
                                </Button>
                              </div>
                            </span>
                          )}
                          {filesArray.length > 0 &&
                            filesArray.length <
                              (service.inputTrackLimit ?? 0) && (
                              <span>
                                <FileUploader
                                  key={key2.current}
                                  multiple={true}
                                  handleChange={async (fileList: FileList) => {
                                    setErrorList([]);

                                    let hasIssues = false;

                                    // Checking Number of files based on track Limit
                                    if (
                                      Array.from(fileList).length >
                                      (service.inputTrackLimit ?? 0)
                                    ) {
                                      setErrorList([
                                        {
                                          fileName: "Tracks over the limit.",
                                          issue: [
                                            `Track limit for the selected plan is ${service.inputTrackLimit}`,
                                          ],
                                        },
                                      ]);
                                      setIsErrorModalOpen(true);
                                      hasIssues = true;
                                      return;
                                    }

                                    //

                                    let approvedFiles: File[] = [];

                                    // Checking Type, Duration & Size for each file.

                                    for (const file of Array.from(fileList)) {
                                      // Check if files with the same name exists in the array or not.
                                      if (
                                        filesArray.find(
                                          (prevFile) =>
                                            prevFile.name === file.name
                                        )
                                      ) {
                                        setErrorList((prev) => [
                                          ...prev,
                                          {
                                            fileName: file.name,
                                            issue: [
                                              "A file by this name already exists.",
                                            ],
                                          },
                                        ]);
                                        hasIssues = true;
                                        // Break and don't run other checks
                                        break;
                                      }

                                      const hasErrors =
                                        await checkTypeDurationSize(
                                          file,
                                          service.uploadFileFormat,
                                          service.maxFileDuration ?? 0
                                        );
                                      //  If no errors, push to approved files.
                                      if (!hasErrors) {
                                        approvedFiles = [
                                          ...approvedFiles,
                                          file,
                                        ];
                                      } else if (
                                        typeof hasErrors === "object"
                                      ) {
                                        hasIssues = true;
                                        // Else append error list.
                                        setErrorList((prev) => [
                                          ...prev,
                                          hasErrors,
                                        ]);
                                      }
                                    }
                                    {
                                      hasIssues && setIsErrorModalOpen(true);
                                    }

                                    {
                                      approvedFiles.length &&
                                        setFilesArray((prev) => [
                                          ...prev,
                                          ...approvedFiles,
                                        ]);
                                    }

                                    key2.current = key2.current + 1;
                                  }}
                                  fileOrFiles={filesArray}
                                  name="Additional Base Files"
                                  className=""
                                >
                                  <div className="w-fit">
                                    <Button>
                                      <>Add More Files</>
                                    </Button>
                                  </div>
                                </FileUploader>
                              </span>
                            )}
                        </div>

                        <div className="ml-auto">
                          <Button
                            onClick={() => {
                              filesArray.length === 0
                                ? toast.error(
                                    "Please select the file(s) before proceeding."
                                  )
                                : setSummaryModalOpen(true);
                            }}
                          >
                            <>Submit</>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default Upload;
