import React from 'react'

type ButtonProps = {
    children: JSX.Element,
}

function CTAButton({ children }: ButtonProps) {
    return (
        <>
            {/* <button className=' border-gradient-br-blue-green-gray-900 hover:border-gradient-tl-blue-green-gray-900 gradient-border-3 mt-12 lg:mt-8 flex mx-auto justify-center items-center gap-2.5 text-gray-300 bg-white text-2xl font-bold py-2 px-4 rounded-2xl  hover:-translate-y-1 duration-300 transition-all hover:shadow-2xl'>
                {children}
            </button> */}
            <button className='flex justify-center items-center gap-2.5 text-gray-300 bg-transparent text-2xl font-bold py-2 px-4 rounded-2xl  hover:-translate-y-1 duration-300 transition-all hover:shadow-2xl relative'>
                {children}
            </button>
        </>
    )
}

export default CTAButton