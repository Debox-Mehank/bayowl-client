// Defaults
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import JSZip from "jszip";

// Hooks
import { useCallback } from "react";
import { useRef } from "react";

import { MusicNoteIcon, TrashIcon } from "@heroicons/react/solid/";

const maxFileSize = 209715200;

// Utils
import secondsToTime from "../utils/secsToTime";
import { formatBytes, formatBytesNumber } from "../utils/formatBytes";
import isValidHttpUrl from "../utils/isValidURL";
import { getClickableLink } from "../utils/getClickableLink";

// Components
import Modal from "../components/reusable/Modal";
import Button from "../components/reusable/Button";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";
import {
  FinalMultipartUploadPartsInput,
  MeDocument,
  MeQuery,
  MultipartSignedUrlResponse,
  useFinalizeMultipartUploadLazyQuery,
  useGetMultipartPreSignedUrlsLazyQuery,
  useGetS3SignedUrlLazyQuery,
  useGetUserServiceDetailsByIdLazyQuery,
  useInitFileUploadLazyQuery,
  UserServiceStatus,
  useUploadFilesForServiceLazyQuery,
} from "../graphql/generated/graphql";
import { UserServiceFinal } from "./dashboard";
import { GetServerSideProps } from "next";
import { addApolloState, initializeApollo } from "../lib/apolloClient";
import axios from "axios";

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
  const [notes, setNotes] = useState<string>("");

  const [getUserServiceDetailsByIdQuery] =
    useGetUserServiceDetailsByIdLazyQuery();
  const [getS3URL] = useGetS3SignedUrlLazyQuery();
  const [initFileUploadQuery] = useInitFileUploadLazyQuery();
  const [multipartPresignedQuery] = useGetMultipartPreSignedUrlsLazyQuery();
  const [finalizeMultipartUploadQuery] = useFinalizeMultipartUploadLazyQuery();
  const [uploadFilesForServiceQuery] = useUploadFilesForServiceLazyQuery();

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

      setLoading(false);
      setService(data.getUserServiceDetailsById);

      if (
        data.getUserServiceDetailsById.statusType !==
        UserServiceStatus.Pendingupload
      ) {
        setLoading(false);
        router.back();
        toast.error("You have already uploaded the files");
      }

      if (data.getUserServiceDetailsById.reupload) {
        setNotes(data.getUserServiceDetailsById.notes ?? "");
      }
    };
    if (serviceId) {
      fetchFunc();
    }
  }, [serviceId]);

  // Modals
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<Boolean>(false);
  const [isRefModalOpen, setIsRefModalOpen] = useState<Boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<Boolean>(false);
  const [onLoadModalOpen, setOnLoadModalOpen] = useState<Boolean>(true);
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

  const handleRefFilesSubmit = async (): Promise<string[]> => {
    if (refArray.length > 0) {
      let finalRefArr: string[] = [];
      const filesUploadedForRef = refArray
        .filter((el) => el.isAddedByUpload)
        .map((el) => el.file!);
      const filesLinkForRef = refArray
        .filter((el) => !el.isAddedByUpload)
        .map((el) => el.url!);
      if (filesUploadedForRef.length > 0) {
        // Final zip file name uploaded to aws
        const refFileName = `referenceFiles_${serviceId}`;

        // Creating the zip file
        const zipInit = new JSZip();
        const zip = zipInit.folder("files");

        if (!zip) {
          return [];
        }

        filesUploadedForRef.forEach((file) => {
          zip.file(`${file.name}`, file);
        });
        const file = await zip.generateAsync({ type: "blob" });

        let finalUploadedUrl: undefined | string = undefined;

        // Check if file size is bigger than 5 MB
        if (formatBytesNumber(file.size) > 5) {
          // Initializing the upload from server
          setLoading(true);
          const { data: initData, error: initError } =
            await initFileUploadQuery({
              variables: { fileName: refFileName + ".zip" },
            });

          // Handling Errors
          if (initError) {
            setLoading(false);
            toast.error(initError.message);
            return [];
          }
          if (!initData || !initData.initFileUpload) {
            setLoading(false);
            toast.error("Something went wrong, try again later.");
            return [];
          }

          // Multipart upload part (dividing the file into chunks and upload the chunks)
          const chunkSize = 10 * 1024 * 1024; // 10 MiB
          const chunkCount = Math.floor(file.size / chunkSize) + 1;

          // Getting multiple urls
          const { data: multipleSignedUrlData, error: multipleSignedUrlError } =
            await multipartPresignedQuery({
              variables: {
                fileId: initData.initFileUpload.fileId ?? "",
                fileKey: initData.initFileUpload.fileKey ?? "",
                parts: chunkCount,
              },
            });

          // Handling Errors
          if (multipleSignedUrlError) {
            setLoading(false);
            toast.error(multipleSignedUrlError.message);
            return [];
          }
          if (
            !multipleSignedUrlData ||
            !multipleSignedUrlData.getMultipartPreSignedUrls
          ) {
            setLoading(false);
            toast.error("Something went wrong, try again later.");
            return [];
          }

          let multipartUrls: MultipartSignedUrlResponse[] =
            multipleSignedUrlData.getMultipartPreSignedUrls.map((el) => ({
              signedUrl: el.signedUrl,
              PartNumber: el.PartNumber,
            }));

          let partsUploadArray: FinalMultipartUploadPartsInput[] = [];

          for (let index = 1; index < chunkCount + 1; index++) {
            let start = (index - 1) * chunkSize;
            let end = index * chunkSize;
            let fileBlob =
              index < chunkCount ? file.slice(start, end) : file.slice(start);
            let signedUrl = multipartUrls[index - 1].signedUrl ?? "";
            let partNumber = multipartUrls[index - 1].PartNumber ?? 0;

            let uploadChunk = await fetch(signedUrl, {
              method: "PUT",
              body: fileBlob,
            });
            let etag = uploadChunk.headers.get("etag");
            partsUploadArray.push({
              ETag: etag ?? "",
              PartNumber: partNumber,
            });
          }

          // Finalize multipart upload
          const { data: finalMultipartData, error: finalMultipartError } =
            await finalizeMultipartUploadQuery({
              variables: {
                input: {
                  fileId: initData.initFileUpload.fileId ?? "",
                  fileKey: initData.initFileUpload.fileKey ?? "",
                  parts: partsUploadArray,
                },
              },
            });

          // Handling Errors
          if (finalMultipartError) {
            setLoading(false);
            toast.error(finalMultipartError.message);
            return [];
          }
          if (
            !finalMultipartData ||
            !finalMultipartData.finalizeMultipartUpload
          ) {
            setLoading(false);
            toast.error("Something went wrong, try again later.");
            return [];
          }

          finalUploadedUrl = finalMultipartData.finalizeMultipartUpload;
        } else {
          // Direct Upload The Zip File To S3 using pre signed url
          const { data: s3Url, error: s3Error } = await getS3URL({
            variables: { fileName: refFileName },
          });

          // Handling Errors
          if (s3Error) {
            setLoading(false);
            toast.error(s3Error.message);
            return [];
          }
          if (!s3Url || !s3Url.getS3SignedURL) {
            setLoading(false);
            toast.error("Something went wrong, try again later.");
            return [];
          }

          await fetch(s3Url.getS3SignedURL, {
            method: "PUT",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            body: file,
          });
          const imageUrl = s3Url.getS3SignedURL.split("?")[0];

          finalUploadedUrl = imageUrl;
        }

        // Update user status and uploadedFiles Array
        if (!finalUploadedUrl) {
          setLoading(false);
          toast.error("Something went wrong, try again later.");
          return [];
        }

        finalRefArr.push(finalUploadedUrl);
      }
      return [...filesLinkForRef, ...finalRefArr];
    }
    return [];
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      // For showing the upload progess
      let percentage: number | undefined = undefined;
      // Final zip file name uploaded to aws
      const finalFileName = `uploadedFiles_${serviceId}`;

      // Creating the zip file
      const zipInit = new JSZip();
      const zip = zipInit.folder("files");

      if (!zip) {
        return;
      }

      filesArray.forEach((file) => {
        zip.file(`${file.name}`, file);
      });
      const file = await zip.generateAsync({ type: "blob" });

      let finalUploadedUrl: undefined | string = undefined;

      // Check if file size is bigger than 5 MB
      if (formatBytesNumber(file.size) > 5) {
        // Initializing the upload from server
        setLoading(true);
        const { data: initData, error: initError } = await initFileUploadQuery({
          variables: { fileName: finalFileName + ".zip" },
        });

        // Handling Errors
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

        // Multipart upload part (dividing the file into chunks and upload the chunks)
        const chunkSize = 10 * 1024 * 1024; // 10 MiB
        const chunkCount = Math.floor(file.size / chunkSize) + 1;

        // Getting multiple urls
        const { data: multipleSignedUrlData, error: multipleSignedUrlError } =
          await multipartPresignedQuery({
            variables: {
              fileId: initData.initFileUpload.fileId ?? "",
              fileKey: initData.initFileUpload.fileKey ?? "",
              parts: chunkCount,
            },
          });

        // Handling Errors
        if (multipleSignedUrlError) {
          setLoading(false);
          toast.error(multipleSignedUrlError.message);
          return;
        }
        if (
          !multipleSignedUrlData ||
          !multipleSignedUrlData.getMultipartPreSignedUrls
        ) {
          setLoading(false);
          toast.error("Something went wrong, try again later.");
          return;
        }

        let multipartUrls: MultipartSignedUrlResponse[] =
          multipleSignedUrlData.getMultipartPreSignedUrls.map((el) => ({
            signedUrl: el.signedUrl,
            PartNumber: el.PartNumber,
          }));

        let partsUploadArray: FinalMultipartUploadPartsInput[] = [];

        for (let index = 1; index < chunkCount + 1; index++) {
          let start = (index - 1) * chunkSize;
          let end = index * chunkSize;
          let fileBlob =
            index < chunkCount ? file.slice(start, end) : file.slice(start);
          let signedUrl = multipartUrls[index - 1].signedUrl ?? "";
          let partNumber = multipartUrls[index - 1].PartNumber ?? 0;

          let uploadChunk = await axios.put(
            signedUrl,
            { data: fileBlob },
            {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: (pe) => {
                console.log(pe);
              },
            }
          );
          let etag = uploadChunk.headers["etag"];

          // let uploadChunk = await fetch(signedUrl, {
          //   method: "PUT",
          //   body: fileBlob,
          // });
          // let etag = uploadChunk.headers.get("etag");
          partsUploadArray.push({
            ETag: etag ?? "",
            PartNumber: partNumber,
          });
        }

        // Finalize multipart upload
        const { data: finalMultipartData, error: finalMultipartError } =
          await finalizeMultipartUploadQuery({
            variables: {
              input: {
                fileId: initData.initFileUpload.fileId ?? "",
                fileKey: initData.initFileUpload.fileKey ?? "",
                parts: partsUploadArray,
              },
            },
          });

        // Handling Errors
        if (finalMultipartError) {
          setLoading(false);
          toast.error(finalMultipartError.message);
          return;
        }
        if (
          !finalMultipartData ||
          !finalMultipartData.finalizeMultipartUpload
        ) {
          setLoading(false);
          toast.error("Something went wrong, try again later.");
          return;
        }

        finalUploadedUrl = finalMultipartData.finalizeMultipartUpload;
      } else {
        setLoading(true);
        // Direct Upload The Zip File To S3 using pre signed url
        const { data: s3Url, error: s3Error } = await getS3URL({
          variables: { fileName: finalFileName },
        });

        // Handling Errors
        if (s3Error) {
          setLoading(false);
          toast.error(s3Error.message);
          return;
        }
        if (!s3Url || !s3Url.getS3SignedURL) {
          setLoading(false);
          toast.error("Something went wrong, try again later.");
          return;
        }

        await fetch(s3Url.getS3SignedURL, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: file,
        });
        const imageUrl = s3Url.getS3SignedURL.split("?")[0];

        finalUploadedUrl = imageUrl;
      }

      // Update user status and uploadedFiles Array
      if (!finalUploadedUrl) {
        setLoading(false);
        toast.error("Something went wrong, try again later.");
        return;
      }

      const refArr = await handleRefFilesSubmit();

      const { data, error } = await uploadFilesForServiceQuery({
        variables: {
          referenceUploadedFiles: refArr,
          serviceId: serviceId?.toString() ?? "",
          uplodedFiles: [finalUploadedUrl],
          notes: notes,
          isReupload: service?.reupload ? true : false,
        },
      });

      // Handling Errors
      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }
      if (!data || !data.uploadFilesForService) {
        setLoading(false);
        toast.error("Something went wrong, try again later.");
        return;
      }

      setLoading(false);
      router.push("/service-tracking");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.toString());
    }
  };

  return (
    <>
      {loading ? <>Loading...</> : null}
      <div className="md:h-[96vh]  bg-darkBlue text-white flex relative max-w-7xl mx-auto">
        <svg
          onClick={() => {
            router.back();
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="27"
          height="30"
          className="fill-white hover:fill-primary duration-300 transition-colors cursor-pointer absolute top-10 -left-8"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
          />
        </svg>
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
                  <>
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
                      "Proceed & Upload"
                    )}
                  </>
                </Button>
              </span>
            </div>
          </div>
        </Modal>
        <Modal open={onLoadModalOpen} setOpen={setOnLoadModalOpen}>
          <div className="pt-2">
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
              Before you proceed, and to avoid an error with your upload, please
              check the following:
            </h4>
            <div className="pt-3 pb-2 px-4">
              <ul className="list-decimal">
                <li>
                  Each file duration is within your chosen limit -{" "}
                  {secondsToTime(service?.maxFileDuration ?? 0)}{" "}
                </li>
                <li>
                  Number of files are within the selected service limit -{" "}
                  {service?.inputTrackLimit}
                </li>
                <li>No file is more than {formatBytes(maxFileSize)} </li>
                <li>
                  Each file format(s) is:{" "}
                  {service?.uploadFileFormat.join(" , ")}
                </li>
                <li>
                  Remove unwanted silence from the beginning and end of your
                  files.
                </li>

                {/* <li></li> */}
              </ul>
            </div>
          </div>
        </Modal>
        <Modal
          open={isErrorModalOpen}
          setOpen={() => setIsErrorModalOpen(true)}
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
            <div className="pt-7 pb-4 space-y-2 max-h-[70vh] overflow-auto px-2">
              {errorList.map((err) => (
                <div key={err.fileName} className="flex gap-4 text-left">
                  <div className="font-bold w-1/2 break-words">
                    {err.fileName}
                  </div>
                  <div className="flex-1 w-1/2">
                    {err.issue.map((issue, index) => (
                      <p key={`${issue} - ${index}`}>{issue}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
              <div className="w-2/6 relative flex flex-col gap-1 h-full pb-24">
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
                  {service.numberOfReferenceFileUploads && (
                    <div className="rounded-lg text-center py-3 px-6 bg-white/20 inline">
                      No. of Reference Files
                      <span className="block text-xl">
                        {service.numberOfReferenceFileUploads || 0}
                      </span>
                    </div>
                  )}

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
                                {/* Reference File Button */}
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
                        className="bg-darkBlue/20 rounded-xl w-full h-[60%] my-2"
                        name="Remarks"
                        id="remarks"
                        placeholder="Please mention any preferences or special requests here."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
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
                        <div className="space-x-4 flex">
                          {!service.reupload &&
                            (service.numberOfReferenceFileUploads ?? 0) > 0 && (
                              <div
                                onClick={() => {
                                  setIsRefModalOpen(true);
                                }}
                              >
                                <div className="w-fit">
                                  <Button>
                                    <>Add References</>
                                  </Button>
                                </div>
                              </div>
                            )}
                          {filesArray.length > 0 &&
                            filesArray.length <
                              (service.inputTrackLimit ?? 0) && (
                              <div>
                                <FileUploader
                                  key={key2.current}
                                  multiple={true}
                                  handleChange={async (fileList: FileList) => {
                                    setErrorList([]);

                                    let hasIssues = false;
                                    console.log(
                                      Array.from(fileList).length,
                                      service.inputTrackLimit
                                    );
                                    // Checking Number of files based on track Limit
                                    if (
                                      Array.from(fileList).length +
                                        filesArray.length >
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
                                        // Don't run other checks, Skip this iteration.
                                        continue;
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
                              </div>
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
      props: {},
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
