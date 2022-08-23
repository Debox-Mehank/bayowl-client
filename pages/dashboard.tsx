import React from 'react'
import DashNav from "../components/DashNav"
import Image from 'next/image'
import PromoImg from '../public/dash1.jpg'

function Dashboard() {

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
                    <span className='text-4xl font-bold'>
                        Good {hours < 12 ? "Morning" : hours >= 12 && hours < 17 ? "Afternoon" : "Evening"}, {"John"}.
                    </span>
                    <div className='text-xl'>
                        You have the following paid subscriptions in your account.
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Dashboard