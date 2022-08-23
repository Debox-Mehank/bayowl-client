import React from 'react'

type ButtonProps = {
    children: JSX.Element,
    classNames: string,
    isWFull: boolean,
}

function SmallBtn({ children, classNames, isWFull = false }: ButtonProps) {
    return (
        // <button className="cursor-pointer
        // border-gradient-br-blue-green-gray-900 hover:border-gradient-tl-blue-green-gray-900 gradient-border-3
        // inline-flex items-center py-2 px-3 text-sm font-bold text-center text-white rounded-lg transition-colors duration-300 z-50">
        //     {children}
        // </button>
        <div className={`relative inline-block group ${isWFull ? 'w-full' : null}`}>
            <div className="p-4 z-40 absolute inset-0.5 bg-gradient-to-r from-pink-600 to-blueGradient-0 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <button className={`cursor-pointer
         border-gradient-br-blue-green-gray-900 gradient-border-3
         inline-flex items-center py-2 px-3 text-sm font-bold text-center text-white rounded-lg transition-colors duration-300 z-40 relative ${isWFull ? 'w-full' : null} ${classNames}`}>
                {children}
            </button>
        </div>
    )
}

export default SmallBtn