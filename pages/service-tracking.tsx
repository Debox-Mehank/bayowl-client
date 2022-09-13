import React from "react";
import DashNav from "../components/DashNav";
import Button from "../components/reusable/Button";
import { useMeQuery } from "../graphql/generated/graphql";
import { useState } from "react";
const transactions = [
  {
    id: "001",
    projName: "Dream",
    serviceName: "Mix & Master - Pro Mix",
    notes: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    dateSubmitted: "12-Aug-2022",
    estimatedDelivery: "14-Aug-2022",
    status: [
      { name: "Submitted", href: "#", status: "complete" },
      { name: "Under Review", href: "#", status: "complete" },
      { name: "Work In Progress", href: "#", status: "complete" },
      { name: "Delivered", href: "#", status: "complete" },
      { name: "Revision Request", href: "#", status: "complete" },
      { name: "Revision Delivered", href: "#", status: "complete" },
    ],
    downloads: [
      { name: "Download", href: "#", status: "complete", link: "/download1" },
      { name: "Revision 1", href: "#", status: "complete", link: "/revision1" },
      { name: "Revision 2", href: "#", status: "complete", link: "/revision2" },
      { name: "Revision 3", href: "#", status: "complete", link: "/revision3" },
    ],
    revisionsRequested: 0,
  },
  {
    id: "002",
    projName: "Dreaming",
    serviceName: "Mix & Master - Pro Mix",
    notes: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    dateSubmitted: "12-Aug-2022",
    estimatedDelivery: "14-Aug-2022",
    status: [
      { name: "Submitted", href: "#", status: "complete" },
      { name: "Under Review", href: "#", status: "complete" },
      { name: "Work In Progress", href: "#", status: "complete" },
      { name: "Delivered", href: "#", status: "complete" },
      { name: "Revision Request", href: "#", status: "complete" },
      { name: "Revision Delivered", href: "#", status: "complete" },
    ],
    downloads: [
      { name: "Download", href: "#", status: "complete", link: "/download1" },
      { name: "Revision 1", href: "#", status: "complete", link: "/revision1" },
      { name: "Revision 2", href: "#", status: "complete", link: "/revision2" },
      { name: "Revision 3", href: "#", status: "complete", link: "/revision3" },
    ],
    revisionsRequested: 0,
  },
  {
    id: "002",
    projName: "Sleep",
    serviceName: "Mix & Master - Pro Mix",
    notes: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    dateSubmitted: "12-Aug-2022",
    estimatedDelivery: "14-Aug-2022",
    status: [
      { name: "Submitted", href: "#", status: "complete" },
      { name: "Under Review", href: "#", status: "complete" },
      { name: "Work In Progress", href: "#", status: "complete" },
      { name: "Delivered", href: "#", status: "complete" },
      { name: "Revision Request", href: "#", status: "complete" },
      { name: "Revision Delivered", href: "#", status: "complete" },
    ],
    downloads: [
      { name: "Download", href: "#", status: "complete", link: "/download1" },
      { name: "Revision 1", href: "#", status: "complete", link: "/revision1" },
      { name: "Revision 2", href: "#", status: "complete", link: "/revision2" },
      { name: "Revision 3", href: "#", status: "complete", link: "/revision3" },
    ],
    revisionsRequested: 0,
  },
];

function ServiceTracking() {
  const { data, loading, error } = useMeQuery({
    fetchPolicy: "network-only",
  });

  const [projectList, setProjectList] = useState(transactions)
  const [filteredList, setFilteredList] = useState<any>([])


  return (
    <div className="min-h-screen bg-darkBlue text-white flex relative ">
      <div className="absolute animation-delay-2000 top-[35%] left-[55%] w-36 md:w-96 h-56 bg-primary opacity-60 rounded-full mix-blend-screen filter blur-[75px] animate-blob overflow-hidden" />
      <div className="absolute animation-delay-4000 top-[60%] right-[35%] w-36 md:w-96 h-56 bg-blueGradient-2 opacity-80 rounded-full mix-blend-screen filter blur-[70px] animate-blob overflow-hidden" />
      <div className="absolute top-[60%] right-[15%] w-36 md:w-96 h-56 bg-blueGradient-1 opacity-80 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden" />
      <DashNav name={data?.me.name} email={data?.me.email} />
      {/* issue */}
      <div className="mt-16 md:mt-0 md:py-10 relative w-full flex justify-center gap-3 md:overflow-hidden">
        {/* Scrollable Div Below, issue */}
        <div className="px-2 sm:px-3 lg:px-4 md:w-screen overflow-x-auto whitespace-nowrap relative z-[100]">
          <div className="w-80 md:w-full text-center text-xl sm:max-w-3xl text-white bg-white/10 rounded-md py-1 md:py-2 px-3 md:px-2 flex items-center gap-2 fixed">
            <input
              onChange={(e) => {
                const input = e.target.value
                if (input) {
                  const filteredArray = transactions.filter(projects => projects.projName.includes(input))
                  setFilteredList(filteredArray)
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
            <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className=" shadow ring-1 ring-black ring-opacity-5 md:rounded-lg block">
                  <table className="w-full">
                    <thead className="bg-white/10">
                      <tr>
                        <th
                          scope="col"
                          className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6 sticky -left-4 bg-black/40 z-50 backdrop-blur-[6px] flicker-fix backface-hidden"
                        >
                          Project Name
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          Service Name
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          Note to Engineer
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          Date of Submission
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          Current Status
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          Est. Delivery Date
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          Re-Upload
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          Download
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          Request Revision
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          Mark Completed
                        </th>
                        <th
                          scope="col"
                          className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          Add a Service
                        </th>
                      </tr>
                    </thead>
                    <tbody className=" ">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-white sticky -left-4 bg-black/60 z-50 backdrop-blur-[6px] flicker-fix backface-hidden">
                            {transaction.projName}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                            {transaction.serviceName}
                          </td>
                          <td className="whitespace-pre-wrap px-2 py-2 text-sm text-white">
                            {transaction.notes}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                            {transaction.dateSubmitted}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white text-center">
                            <div className="flex items-center justify-center gap-2 h-full">
                              <span className="relative z-10 w-5 h-5 flex items-center justify-center bg-white border-2 border-primary rounded-full">
                                <span className="h-1.5 w-1.5 bg-primary rounded-full" />
                              </span>
                              <span>
                                {transaction.status.find(
                                  (stat) => stat.status === "current"
                                )?.name || "Completed"}
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white text-center">
                            {transaction.estimatedDelivery}
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                            <Button>
                              <div className="text-xs">Reupload</div>
                            </Button>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                            <Button>
                              <div className="text-xs">Download</div>
                            </Button>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                            <Button>
                              <div className="text-xs">Request Revision</div>
                            </Button>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                            <Button>
                              <div className="text-xs">Mark Completed</div>
                            </Button>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-sm text-white">
                            <Button>
                              <div className="text-xs">Add Service</div>
                            </Button>
                          </td>
                          {/* <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                            Edit<span className="sr-only">, {transaction.id}</span>
                                                        </a>
                                                    </td> */}
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
