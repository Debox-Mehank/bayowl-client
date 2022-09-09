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
import Modal from '../components/reusable/Modal';

const fileTypes = ["WAV", "JPEG", "PNG", "GIF", "JPG"];
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
        inputTrackLimit: 10,
        refTrackLimit: 3,
        uploadTime: 60,
        refFile: 3,
        deliveryFormat: "48/24 .wav mix file + Instrument bus stems",
        deliveryDays: 7,
        revisionDays: 3,
    }
}


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
            resolve(audio.duration)
        };
    });
}


function Upload() {
    const [isAlertModalOpen, setIsAlertModalOpen] = useState<Boolean>(false)
    const [isRefModalOpen, setIsRefModalOpen] = useState<Boolean>(false)
    // const [refFileList, setRefFileList] = useState<Object[]>([])
    const [file, setFile] = useState(null);
    const [filesArray, setFilesArray] = useState<File[]>([]);

    const [refFile, setRefFile] = useState(null);
    const [refFileArray, setRefFileArray] = useState<refTrack[]>([]);

    interface refTrack {
        type: string,
        file: File | null,
        link: string | null
    }

    const router = useRouter()

    const handleRefFileChange = (file: any) => {

        // Skipping the process if user tries uploading tracks more than limit.
        if (Array.from(file).length > service.serviceDetails.refTrackLimit) {
            setRefFile(null)
            setRefFileArray([])
            console.log("Tracks more than the limit.")
            // To show Modal with Track Limit Error
        } else {
            setFile(file);
            setFilesArray(file && Array.from(file))
            console.log(filesArray)
        }

    };

    const handleChange = (file: any) => {
        // Skipping the process if user tries uploading tracks more than limit.
        if (Array.from(file).length > service.serviceDetails.inputTrackLimit) {
            setFile(null)
            setFilesArray([])
            console.log("Tracks more than the limit.")
            // To show Modal with Track Limit Error
        } else {
            setFile(file);
            setFilesArray(file && Array.from(file))
            console.log(filesArray)
        }

    };

    useEffect(() => {
        filesArray &&
            filesArray.forEach(async (file, index) => {
                // Check duration for each file, if it's higher than the track limit, throw error in modal and remove that file from the array.
                const duration = await getDuration(file);
                // @ts-ignore
                if (duration > service.serviceDetails.uploadTime) {
                    console.log(`Track length more than expected. ${file.name} will not be uploaded.`)
                    setFilesArray(prev => prev.filter((file, idx) => idx !== index))
                    // Show Modal
                }
                // Check file size for each file, if it's higher than (100mb), throw error in modal and remove that file from array. To get confirmation from Varun on max size.
                // https://www.gbmb.org/mb-to-bytes
                if (file.size > 5000000) {
                    console.log(`File size more than expected. ${file.name} will not be uploaded.`)
                    setFilesArray(prev => prev.filter((file, idx) => idx !== index))
                    // Show Modal
                }

            })

    }, [filesArray])


    return (
        <div className='h-screen bg-darkBlue text-white flex relative max-w-7xl mx-auto'>

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
            <div className='hidden md:flex px-8 py-10 relative w-full justify-center items-center gap-10'>
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
                <div className='mx-auto w-4/6 bg-white/10 rounded-2xl h-full'>
                    <form className='w-full h-full' name='files' action="">
                        {
                            (!file || filesArray.length <= 0) &&
                            <FileUploader
                                multiple={true}
                                handleChange={handleChange}
                                name="files"
                                types={fileTypes}
                                disabled={false}
                                className=""
                            >
                                <div className={`w-full h-full cursor-pointer bg-white/10 flex flex-col gap-8 py-10 rounded-xl ${(!file || filesArray.length <= 0) ? "justify-center items-center" : ""}`}>
                                    {
                                        (!file || filesArray.length <= 0) &&
                                        <>
                                            <div className='h-48 w-48 bg-white/10 hover:bg-white/20 transition-colors duration-100 rounded-full cursor-pointer mx-auto grid place-items-center z-10'>
                                                <svg className='z-0 fill-primary' xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                                                </svg>
                                            </div>
                                            <div className='text-center'>Drag your files here, or click to upload!</div>
                                        </>
                                    }



                                </div>

                            </FileUploader>
                        }



                        {file && filesArray.length > 0 &&
                            <div className='w-full h-full py-10'>
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
                                                            setFilesArray(prev => prev.filter((file, idx) => idx !== index))
                                                            console.log(filesArray)

                                                        }}
                                                        className='h-5 w-5 hover:fill-primary cursor-pointer' />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className='h-1/4 px-8 flex flex-col justify-around'>
                                    <Modal setOpen={setIsRefModalOpen} open={isRefModalOpen}>
                                        <div className='text-center space-y-4'>
                                            <h3 className='text-lg font-bold'>Upload References</h3>
                                            <div className='flex justify-between'>
                                                <div>
                                                    <FileUploader
                                                        multiple={true}
                                                        handleChange={handleRefFileChange}
                                                        name="refFiles"
                                                        types={fileTypes}
                                                        className=""
                                                    >
                                                        <div className='space-x-4'>
                                                            <SmallBtn classNames='bg-black/80' isWFull={false}>
                                                                <>
                                                                    Upload References
                                                                </>
                                                            </SmallBtn>
                                                            <span>or</span>
                                                        </div>
                                                    </FileUploader>
                                                </div>
                                                <div className='mx-auto space-x-4'>
                                                    <input placeholder='Enter URL' className='bg-white/20 rounded-xl' type="url" name="" id="" />
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>
                                    <textarea className='bg-darkBlue/20 rounded-xl w-full h-full my-10' name="" id="remarks" placeholder='Please mention any preferences or special requests here.' />
                                    <div className='flex justify-between z-50'>
                                        <div
                                            onClick={() => setIsRefModalOpen(true)}
                                        >
                                            <SmallBtn classNames='bg-black/80' isWFull={false}>
                                                <>
                                                    Add References
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
                    </form>
                </div>

            </div >
        </div >
    )
}

export default Upload