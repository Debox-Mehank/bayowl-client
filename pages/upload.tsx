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
        <div className='min-h-screen bg-darkBlue text-white flex'>
            <DashNav />
            <div className='px-8 py-10 relative mt-24 w-full flex gap-5'>
                <div className='flex flex-col justify-center gap-4 w-1/6'>
                    <div>
                        <span className='text-2xl font-bold'>{service.projName}</span>
                        <div className='text-xl font-bold'>{service.name}</div>
                    </div>
                    <div className='rounded-lg text-center py-5 px-10 bg-white/20 inline'>
                        Estimated Time
                        <span className='block text-xl'>
                            {service.serviceDetails.estimatedTime}
                        </span>
                    </div>
                    <div className='rounded-lg text-center py-5 px-10 bg-white/20 inline'>
                        Input Track Limit
                        <span className='block text-xl'>
                            {service.serviceDetails.inputTrackLimit}
                        </span>
                    </div>
                    <div className='rounded-lg text-center py-5 px-10 bg-white/20 inline'>
                        No. of Reference Files
                        <span className='block text-xl'>
                            {service.serviceDetails.refFile}
                        </span>
                    </div>
                    <div className='rounded-lg text-center py-5 px-10 bg-white/20 inline'>
                        Delivery Format
                        <span className='block text-xl'>
                            {service.serviceDetails.deliveryFormat}
                        </span>
                    </div>
                    <div className='rounded-lg text-center py-5 px-10 bg-white/20 inline'>
                        Revision Delivery Days
                        <span className='block text-xl'>
                            {service.serviceDetails.deliveryDays}
                        </span>
                    </div>

                </div>
                <div className='w-5/6'>
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
                            <div>
                                <div>Drag your files here, or click to upload!</div>
                            </div>
                        </div>

                    </FileUploader>
                </div>
                <div>
                    {/* {file && Array.from(file.map(file => console.log(file)))} */}
                </div>
            </div>
        </div>
    )
}

export default Upload