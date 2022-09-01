import React from 'react'
import DashNav from "../components/DashNav"
import Image from 'next/image'
import PromoImg from '../public/dash1.jpg'
import up from "../public/up.svg"
import down from "../public/down.svg"
import Button from '../components/reusable/Button'
import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/solid'
import Link from 'next/link'


function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

const dummyServ = [
    {
        projName: "Dream",
        name: "Mix & Master (Pro Mix)",
        status: [
            { name: 'Submitted', href: '#', status: 'complete' },
            { name: 'Under Review', href: '#', status: 'complete' },
            { name: 'Work In Progress', href: '#', status: 'current' },
            { name: 'Delivered', href: '#', status: 'upcoming' },
            { name: 'Revision Request', href: '#', status: 'upcoming' },
            { name: 'Revision Delivered', href: '#', status: 'upcoming' },
        ],
        // Submitted / Under Review / Work In Progress / Delivered / Revision Request Under Review / Revision Delivered
        isExpanded: false,
        serviceDetails: {
            estimatedTime: "16 Hours",
            inputTrackLimit: 30,
            refFile: 3,
            deliveryFormat: "48/24 .wav mix file + Instrument bus stems",
            deliveryDays: 7,
            revisionDays: 3,
        }
    },
    {
        projName: "Stream",
        name: "Mix & Master (Pro Mix)",
        // Submitted / Under Review / Work In Progress / Delivered / Revision Request Under Review / Revision Delivered
        status: [
            { name: 'Submitted', href: '#', status: 'complete' },
            { name: 'Under Review', href: '#', status: 'complete' },
            { name: 'Work In Progress', href: '#', status: 'complete' },
            { name: 'Delivered', href: '#', status: 'complete' },
            { name: 'Revision Request', href: '#', status: 'complete' },
            { name: 'Revision Delivered', href: '#', status: 'complete' },
        ],
        isExpanded: false,
        serviceDetails: {
            estimatedTime: "16 Hours",
            inputTrackLimit: 30,
            refFile: 3,
            deliveryFormat: "48/24 .wav mix file + Instrument bus stems",
            deliveryDays: 7,
            revisionDays: 3,
        }
    }
]

function Dashboard() {

    const [activeServices, setactiveServices] = useState(dummyServ)

    const date = new Date();
    const hours = date.getHours();

    return (
        <div className='bg-darkBlue text-white flex'>
            <DashNav />
            <div className='px-8 relative'>
                <div className='absolute animation-delay-2000 top-[55%] left-[20%] w-36 md:w-96 h-56 bg-blueGradient-0 opacity-60 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden' />
                <div className='absolute animation-delay-4000 top-[60%] right-[35%] w-36 md:w-96 h-56 bg-blueGradient-2 opacity-80 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden' />
                <div className='mt-28'>
                    <Image objectFit='cover' height={900} className='rounded-xl' src={PromoImg} />
                </div>

                <div className='py-4 space-y-3'>
                    <span className='text-2xl md:text-4xl font-bold'>
                        Good {hours < 12 ? "Morning" : hours >= 12 && hours < 17 ? "Afternoon" : "Evening"}, {"John"}.
                    </span>
                    <div className='text-lg md:text-xl'>
                        You have the following paid subscriptions in your account.
                    </div>

                </div>

                {/* Paid Subscriptions */}


                <div className='py-6 md:px-4 space-y-10 z-50'>
                    {
                        activeServices.map((service, index) => (
                            <div
                                // Flipping State for the particular div
                                onClick={() => setactiveServices(prev => {
                                    const newArr = [...prev]
                                    newArr[index].isExpanded = !newArr[index].isExpanded
                                    return newArr
                                })}
                                className=' bg-white/5 rounded-lg p-2 sm:p-3 lg:p-4 xl:p-6 cursor-pointer h-full' key={service.projName}>
                                <div className='flex gap-4 items-center'>
                                    <Image className='inline' height={30} width={30} src={service.isExpanded ? up : down} />
                                    {service.isExpanded}
                                    <span className='text-md md:text-2xl'>
                                        {service.projName} - {service.name}
                                    </span>

                                    <span className={`ml-auto ${service.isExpanded ? "hidden md:block" : null}`}>
                                        <Button>
                                            <>
                                                {service.status.filter(service => service.status === "current")[0]?.name || "Completed"}
                                            </>
                                        </Button>
                                    </span>
                                </div>


                                {/* Expanded */}

                                <div className={`filter backdrop-blur-lg p-3 rounded-lg top-14 w-full transition-all duration-300
                                 ${service.isExpanded ? "opacity-100 translate-y-0 h-auto py-8" : "opacity-0 -translate-y-10 invisible p-0 h-0"}`}>

                                    <hr className="border-1 drop-shadow-xl py-4" />
                                    {/* Plan Details */}
                                    <div className='flex flex-col md:flex-row justify-center gap-4'>
                                        <div className='rounded-lg text-center py-5 md:px-10 bg-white/20 inline'>
                                            Estimated Time
                                            <span className='block md:text-xl'>
                                                {service.serviceDetails.estimatedTime}
                                            </span>
                                        </div>
                                        <div className='rounded-lg text-center py-5 md:px-10 bg-white/20 inline'>
                                            Input Track Limit
                                            <span className='block md:text-xl'>
                                                {service.serviceDetails.inputTrackLimit}
                                            </span>
                                        </div>
                                        <div className='rounded-lg text-center py-5 md:px-10 bg-white/20 inline'>
                                            No. of Reference Files
                                            <span className='block md:text-xl'>
                                                {service.serviceDetails.refFile}
                                            </span>
                                        </div>
                                        <div className='rounded-lg text-center py-5 md:px-10 bg-white/20 inline'>
                                            Delivery Format
                                            <span className='block md:text-xl'>
                                                {service.serviceDetails.deliveryFormat}
                                            </span>
                                        </div>
                                        <div className='rounded-lg text-center py-5 md:px-10 bg-white/20 inline'>
                                            Revision Delivery Days
                                            <span className='block md:text-xl'>
                                                {service.serviceDetails.deliveryDays}
                                            </span>
                                        </div>

                                    </div>

                                    {/* Progress tracker till sm - smaller screens  */}

                                    <nav aria-label="Progress" className='sm:hidden py-10 w-fit mx-auto text-center'>
                                        <ol role="list" className="overflow-hidden">
                                            {service.status.map((step: any, stepIdx: any) => (
                                                <li key={step.name} className={classNames(stepIdx !== service.status.length - 1 ? 'pb-10' : '', 'relative')}>
                                                    {step.status === 'complete' ? (
                                                        <>
                                                            {stepIdx !== service.status.length - 1 ? (
                                                                <div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-primary" aria-hidden="true" />
                                                            ) : null}
                                                            <a href={step.href} className="relative flex items-start group">
                                                                <span className="h-9 flex items-center">
                                                                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-primary rounded-full group-hover:bg-primary">
                                                                        <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                                                                    </span>
                                                                </span>
                                                                <span className="ml-4 min-w-0 flex flex-col">
                                                                    <span className="text-xs font-semibold tracking-wide uppercase">{step.name}</span>
                                                                    <span className="text-sm text-gray-500">{step.description}</span>
                                                                </span>
                                                            </a>
                                                        </>
                                                    ) : step.status === 'current' ? (
                                                        <>
                                                            {stepIdx !== service.status.length - 1 ? (
                                                                <div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true" />
                                                            ) : null}
                                                            <a href={step.href} className="relative flex items-start group" aria-current="step">
                                                                <span className="h-9 flex items-center" aria-hidden="true">
                                                                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-primary rounded-full">
                                                                        <span className="h-2.5 w-2.5 bg-primary rounded-full" />
                                                                    </span>
                                                                </span>
                                                                <span className="ml-4 min-w-0 flex flex-col">
                                                                    <span className="text-xs font-semibold tracking-wide uppercase text-primary">{step.name}</span>
                                                                    <span className="text-sm text-gray-500">{step.description}</span>
                                                                </span>
                                                            </a>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {stepIdx !== service.status.length - 1 ? (
                                                                <div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true" />
                                                            ) : null}
                                                            <a href={step.href} className="relative flex items-start group">
                                                                <span className="h-9 flex items-center" aria-hidden="true">
                                                                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                                                                        <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
                                                                    </span>
                                                                </span>
                                                                <span className="ml-4 min-w-0 flex flex-col">
                                                                    <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">{step.name}</span>
                                                                    <span className="text-sm text-gray-500">{step.description}</span>
                                                                </span>
                                                            </a>
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ol>
                                    </nav>
                                    {/* Progress Tracker for sm+ - bigger screens */}

                                    <nav aria-label="Progress" className='hidden sm:block'>
                                        <ol role="list" className="flex items-center justify-center pt-8 pb-8 text-center">
                                            {service.status.map((step, stepIdx) => (
                                                <li key={step.name} className={classNames(stepIdx !== service.status.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>
                                                    {step.status === 'complete' ? (
                                                        <>
                                                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                                <div className="h-0.5 w-full bg-primary" />
                                                            </div>
                                                            <a
                                                                href="#"
                                                                className="relative w-8 h-8 flex flex-col items-center justify-center bg-primary rounded-full hover:bg-primary"
                                                            >
                                                                <CheckIcon className="w-5 h-5 text-white fill-white" aria-hidden="true" />
                                                                <span className='absolute top-10'>{step.name}</span>
                                                            </a>
                                                        </>
                                                    ) : step.status === 'current' ? (
                                                        <>
                                                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                                <div className="h-0.5 w-full bg-gray-200" />
                                                            </div>
                                                            <a
                                                                href="#"
                                                                className="relative w-8 h-8 flex items-center justify-center bg-white border-4 border-primary rounded-full"
                                                                aria-current="step"
                                                            >
                                                                <span className="h-2.5 w-2.5 bg-primary rounded-full" aria-hidden="true" />
                                                                <span className="mt-24">{step.name}</span>
                                                            </a>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                                <div className="h-0.5 w-full bg-gray-200" />
                                                            </div>
                                                            <a
                                                                href="#"
                                                                className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400"
                                                            >
                                                                <span
                                                                    className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
                                                                    aria-hidden="true"
                                                                />
                                                                <span className="mt-24">{step.name}</span>
                                                            </a>
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ol>
                                    </nav>


                                </div>

                                {/* Expanded End */}


                            </div>
                        ))
                    }
                </div>

                {/* Add */}

                <div className='text-center space-y-3'>
                    <Link href={"/"}>
                        <div className='h-24 w-24 bg-white/10 hover:bg-white/20 transition-colors duration-100 rounded-full cursor-pointer mx-auto grid place-items-center z-10'>
                            <svg className='z-0 fill-primary' xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                            </svg>
                        </div>
                    </Link>

                    <div className=''>
                        <Link href={"/"}>
                            <span className='group cursor-pointer'>
                                Add a service
                            </span>
                        </Link>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default Dashboard