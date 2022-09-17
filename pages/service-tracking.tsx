import React, { useEffect } from "react";
import DashNav from "../components/DashNav";
import Button from "../components/reusable/Button";
import {
  ServiceStatusObjectState,
  useMeQuery,
  UserServiceStatus,
} from "../graphql/generated/graphql";
import { useState } from "react";
import { UserServiceFinal } from "./dashboard";
import { getStatusNames } from "../components/reusable/Accordion";
import Link from "next/link";
import moment from "moment";

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
  "Upload",
  "Download",
  "Request Revision",
  "Mark Completed",
  "Add a Service",
];

function ServiceTracking() {
  const { data, loading, error } = useMeQuery({
    fetchPolicy: "network-only",
  });

  const [services, setServices] = useState<UserServiceFinal[]>([]);
  const [filteredServices, setFilteredServices] = useState<UserServiceFinal[]>(
    []
  );
  const [tableHeaders, setTableHeaders] = useState<string[]>(TABLE_HEADERS);

  useEffect(() => {
    if (data?.me) {
      const servicesArr = data.me.services.filter((el) => el.projectName);
      setServices(servicesArr);
      setFilteredServices(servicesArr);
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-darkBlue text-white flex relative ">
      <div className="absolute animation-delay-2000 top-[35%] left-[55%] w-36 md:w-96 h-56 bg-primary opacity-60 rounded-full mix-blend-screen filter blur-[75px] animate-blob overflow-hidden" />
      <div className="absolute animation-delay-4000 top-[60%] right-[35%] w-36 md:w-96 h-56 bg-blueGradient-2 opacity-80 rounded-full mix-blend-screen filter blur-[70px] animate-blob overflow-hidden" />
      <div className="absolute top-[60%] right-[15%] w-36 md:w-96 h-56 bg-blueGradient-1 opacity-80 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
      <DashNav name={data?.me.name} email={data?.me.email} />
      {/* issue */}
      <div className="mt-16 md:mt-0 md:py-10 relative w-full flex justify-center gap-3 md:overflow-hidden">
        {/* Scrollable Div Below, issue */}
        <div className="px-2 sm:px-3 lg:px-4 md:w-screen overflow-x-auto whitespace-nowrap relative z-[60]">
          <div className="w-full max-w-sm text-center text-xl sm:max-w-md text-white bg-white/10 rounded-md py-1 md:py-2 px-10 md:px-2 flex items-center gap-2 fixed">
            <input
              onChange={(e) => {
                const input = e.target.value.toString().toLowerCase().trim();
                if (input) {
                  const arr = [...services];
                  setFilteredServices(
                    arr.filter((el) =>
                      el.projectName?.toLocaleLowerCase().trim().includes(input)
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
              <span className="cursor-pointer flex gap-2 items-center md:mr-3 text-sm md:text-md">
                <label className="cursor-pointer" htmlFor="search">
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
                      {filteredServices.map((transaction) => (
                        <tr key={transaction._id}>
                          <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-white sticky -left-4 bg-black/60 z-50 backdrop-blur-[6px] flicker-fix backface-hidden">
                            {transaction.projectName}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                            {transaction.serviceName}
                          </td>
                          <td className="whitespace-pre-wrap px-2 py-2 text-sm text-white">
                            {transaction.notes === "" || !transaction.notes
                              ? "N/A"
                              : transaction.notes}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                            {transaction.submissionDate
                              ? moment(transaction.submissionDate).format(
                                  "MMM Do YY, h:mm a"
                                )
                              : "N/A"}
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
                                  "MMM Do YY, h:mm a"
                                )
                              : "N/A"}
                          </td>
                          <td className="whitespace-pre-wrap px-2 py-2 text-sm text-white">
                            {transaction.reupload
                              ? transaction.reuploadNote
                              : "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white text-center">
                            {transaction.reupload
                              ? moment(transaction.reupload).format(
                                  "MMM Do YY, h:mm a"
                                )
                              : "N/A"}
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
                                ) : getStatusNames(transaction.statusType) ===
                                    "Pending Upload" &&
                                  transaction.reupload !== null ? (
                                  <Link
                                    href={
                                      "/upload?serviceId=" +
                                      transaction._id +
                                      "&reupload=true"
                                    }
                                  >
                                    Reupload
                                  </Link>
                                ) : (
                                  "Upload"
                                )}
                              </div>
                            </Button>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white relative">
                            {/* DIsabled unless delivered / revision delivered / completed */}
                            <Button
                              disabled={
                                !(
                                  getStatusNames(transaction.statusType) ===
                                  "Delivered"
                                ) ||
                                !(
                                  getStatusNames(transaction.statusType) ===
                                  "Revision Delivered"
                                ) ||
                                !(
                                  getStatusNames(transaction.statusType) ===
                                  "Completed"
                                )
                              }
                            >
                              <div className="text-xs">Download</div>
                            </Button>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                            {/* Disabled unless Delivered, Revision Delivered, or if there are revisions left. */}
                            <Button
                              disabled={
                                !(
                                  getStatusNames(transaction.statusType) ===
                                  "Delivered"
                                ) ||
                                !(
                                  getStatusNames(transaction.statusType) ===
                                  "Revision Delivered"
                                ) ||
                                !(
                                  transaction.setOfRevisions &&
                                  transaction.setOfRevisions >
                                    transaction.revisionFiles.length
                                )
                              }
                            >
                              <div className="text-xs">Request Revision</div>
                            </Button>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                            <Button
                              disabled={
                                !(
                                  getStatusNames(transaction.statusType) ===
                                  "Delivered"
                                ) ||
                                !(
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
                              disabled={
                                getStatusNames(transaction.statusType) ===
                                "Completed"
                                  ? false
                                  : true
                              }
                            >
                              <div className="text-xs">Add Service</div>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceTracking;
