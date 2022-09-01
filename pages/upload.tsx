import React from 'react'
import { useState } from 'react';
import DashNav from "../components/DashNav"
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPEG", "PNG", "GIF"];
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
    const [uploaded, setIsUploaded] = useState(false);
    const handleChange = (file: any) => {
        setFile(file);
        console.log(Array.from(file))
    };
    return (
        <div className='min-h-screen bg-darkBlue text-white flex relative'>
            <div className='absolute animation-delay-2000 top-[45%] left-[15%] w-36 md:w-96 h-96 bg-blueGradient-0 opacity-60 rounded-full mix-blend-screen filter blur-[60px] animate-blob overflow-hidden' />
            <div className='absolute animation-delay-2000 top-[35%] left-[55%] w-36 md:w-96 h-56 bg-primary opacity-60 rounded-full mix-blend-screen filter blur-[75px] animate-blob overflow-hidden' />
            <div className='absolute animation-delay-4000 top-[60%] right-[35%] w-36 md:w-96 h-56 bg-blueGradient-2 opacity-80 rounded-full mix-blend-screen filter blur-[70px] animate-blob overflow-hidden' />
            <div className='absolute top-[60%] right-[15%] w-36 md:w-96 h-56 bg-blueGradient-1 opacity-80 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden' />
            <DashNav />
            <div className='md:hidden grid place-items-center text-center mx-auto w-11/12'>
                <h3 className='text-xl'>Please continue with the uploading process with a computer.</h3>
            </div>
            <div className='hidden md:flex px-8 py-10 relative mt-24 w-full justify-center gap-3'>
                <div className='flex flex-col justify-center gap-6 w-1/6'>
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
                <div className='mx-auto w-4/6'>
                    <FileUploader
                        multiple={true}
                        handleChange={handleChange}
                        name="file"
                        types={fileTypes}>
                        <div className='w-full h-full bg-white/10 flex flex-col gap-8 justify-center items-center rounded-xl'>
                            <div className='h-48 w-48 bg-white/10 hover:bg-white/20 transition-colors duration-100 rounded-full cursor-pointer mx-auto grid place-items-center z-10'>
                                <svg className='z-0 fill-primary' xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                </svg>
                            </div>
                            <div className='text-center'>
                                {/* @ts-ignore */}
                                <p>{file ? `File names: ${Array.from(file).map(file => file.name)}` : "No files uploaded yet."}</p>
                                <div>Drag your files here, or click to upload!</div>
                            </div>
                        </div>

                    </FileUploader>
                </div>

            </div>
        </div>
    )
}

export default Upload