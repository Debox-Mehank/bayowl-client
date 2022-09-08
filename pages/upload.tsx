import React, { useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import Image from 'next/image';
import Button from '../components/reusable/Button';
import SmallBtn from '../components/reusable/SmallBtn';
import CTAButton from '../components/reusable/CTAButton';
import { MusicNoteIcon, TrashIcon } from '@heroicons/react/solid/'

const fileTypes = ["JPEG", "PNG", "GIF", "JPG"];
const service = {
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
}


function Upload() {
    const [file, setFile] = useState(null);
    const [filesArray, setFilesArray] = useState<any>(null);
    const router = useRouter()

    const handleChange = (file: any) => {
        setFile(file);
        console.log(file)
        console.log(Array.from(file))
    };

    useEffect(() => {
        setFilesArray(file && Array.from(file))
    }, [file])

    return (
        <div className='min-h-screen bg-darkBlue text-white flex relative max-w-7xl mx-auto'>

            <div className='absolute animation-delay-2000 top-[45%] left-[15%] w-36 md:w-96 h-96 bg-blueGradient-0 opacity-60 rounded-full mix-blend-screen filter blur-[60px] animate-blob overflow-hidden' />
            <div className='absolute animation-delay-2000 top-[35%] left-[55%] w-36 md:w-96 h-56 bg-primary opacity-60 rounded-full mix-blend-screen filter blur-[75px] animate-blob overflow-hidden' />
            <div className='absolute animation-delay-4000 top-[60%] right-[35%] w-36 md:w-96 h-56 bg-blueGradient-2 opacity-80 rounded-full mix-blend-screen filter blur-[70px] animate-blob overflow-hidden' />
            <div className='absolute top-[60%] right-[15%] w-36 md:w-96 h-56 bg-blueGradient-1 opacity-80 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden' />
            {/* <DashNav /> */}
            <div className='md:hidden grid place-items-center text-center mx-auto w-11/12'>
                <h3 className='text-xl'>
                    Please continue with the uploading process on a desktop or a laptop. <span className='underline underline-offset-4 mx-1' onClick={() => router.back()}>
                        Go back
                    </span>

                </h3>
            </div>
            <div className='hidden md:flex px-8 py-10 relative w-full justify-center gap-10'>
                <svg onClick={() => {
                    // setAddOns(null)
                    router.back()
                }} xmlns="http://www.w3.org/2000/svg" width="27" height="30" className='fill-white hover:fill-primary duration-300 transition-colors cursor-pointer absolute top-12 left-4' viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                </svg>
                <div className='flex flex-col justify-center gap-6 w-2/6'>
                    <div>
                        <span className='text-4xl font-bold'>{service.projName}</span>
                        <div className='text-xl font-bold'>{service.name}</div>
                    </div>
                    <div className='rounded-lg text-center py-3 px-6 bg-white/20 inline'>
                        Estimated Time
                        <span className='block text-xl'>
                            {service.serviceDetails.estimatedTime}
                        </span>
                    </div>
                    <div className='rounded-lg text-center py-3 px-6 bg-white/20 inline'>
                        Input Track Limit
                        <span className='block text-xl'>
                            {service.serviceDetails.inputTrackLimit}
                        </span>
                    </div>
                    <div className='rounded-lg text-center py-3 px-6 bg-white/20 inline'>
                        No. of Reference Files
                        <span className='block text-xl'>
                            {service.serviceDetails.refFile}
                        </span>
                    </div>
                    <div className='rounded-lg text-center py-3 px-6 bg-white/20 inline'>
                        Delivery Format
                        <span className='block text-xl'>
                            {service.serviceDetails.deliveryFormat}
                        </span>
                    </div>
                    <div className='rounded-lg text-center py-3 px-6 bg-white/20 inline'>
                        Revision Delivery Days
                        <span className='block text-xl'>
                            {service.serviceDetails.deliveryDays}
                        </span>
                    </div>

                </div>
                <div className='mx-auto w-4/6 py-24'>
                    <form className='w-full h-full' name='files' action="">
                        <FileUploader
                            multiple={true}
                            handleChange={handleChange}
                            name="files"
                            types={fileTypes}

                        >
                            <div className={`w-full h-full bg-white/10 flex flex-col gap-8 py-4 rounded-xl ${!file ? "justify-center items-center" : ""}`}>
                                {
                                    !file &&
                                    <>
                                        <div className='h-48 w-48 bg-white/10 hover:bg-white/20 transition-colors duration-100 rounded-full cursor-pointer mx-auto grid place-items-center z-10'>
                                            <svg className='z-0 fill-primary' xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                            </svg>
                                        </div>
                                        <div className='text-center'>Drag your files here, or click to upload!</div>
                                    </>
                                }


                                {file &&
                                    <div className='w-full h-full'>
                                        <div className='flex flex-col justify-start w-full divide-y-2 divide-purple-500/20 px-4 h-3/4 overflow-auto'>
                                            {filesArray &&
                                                filesArray.map((file, index) => (
                                                    // @ts-ignore
                                                    <div key={file.name} className='w-full py-3 px-4 flex items-center gap-4' >
                                                        <div className='bg-white/10 py-3 px-3 rounded-md'>
                                                            <MusicNoteIcon className='h-10 w-10 fill-transparent stroke-white stroke-[0.4]' />
                                                        </div>
                                                        <div>
                                                            {/*@ts-ignore */}
                                                            {file.name}
                                                        </div>
                                                        <div className='ml-auto'>
                                                            <TrashIcon
                                                                onClick={() => {
                                                                    setFilesArray(prev => prev.slice(index))
                                                                }}
                                                                className='h-5 w-5 hover:fill-primary cursor-pointer' />
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className='h-1/4 px-8 space-y-3'>
                                            <textarea className='bg-darkBlue/20 rounded-xl w-full h-28' name="" id="remarks" placeholder='Please mention any preferences or special requests here.' />
                                            <div className='flex justify-between'>
                                                <div>
                                                    <SmallBtn classNames='bg-black/80' isWFull={false}>
                                                        <>
                                                            Upload References
                                                        </>
                                                    </SmallBtn>
                                                </div>
                                                <div>
                                                    <SmallBtn classNames='bg-black/80' isWFull={false}>
                                                        <>
                                                            Submit
                                                        </>
                                                    </SmallBtn>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                }


                            </div>

                        </FileUploader>
                    </form>
                </div>

            </div >
        </div >
    )
}

export default Upload