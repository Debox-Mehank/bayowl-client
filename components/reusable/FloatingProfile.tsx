import Link from "next/link"
import { useState } from "react"

function FloatingProfile() {
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    return (
        <div className="static">
            <div
                onClick={() => setIsProfileOpen(prev => !prev)}
                onBlur={() => setIsProfileOpen(false)}
                className='z-50 absolute bottom-10 lg:bottom-auto lg:top-10 lg:right-0 overflow-clip flex justify-center items-center gap-2 cursor-pointer duration-300 transition-colors text-white px-8'>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="inline" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                </svg>
                <span>
                    John Doe
                </span>
                {/* Expanded */}
                <div className={`fixed space-y-3 bg-blueGradient-2/70 filter backdrop-blur-lg p-3 rounded-lg bottom-20 left-4 lg:bottom-auto lg:left-auto lg:top-24 lg:right-2 min-w-[20rem] transition-all duration-300 ${isProfileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 invisible'}`}>
                    <Link href={"/account"}>
                        <div className='flex items-center justify-start gap-4 px-1 py-2 w-full hover:bg-blueGradient-2/80'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="inline" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                            </svg>
                            <div className='flex flex-col w-full'>
                                <span>
                                    John Doe
                                </span>
                                <span>
                                    johndoe@bayowlstudios.com
                                </span>
                            </div>

                        </div>
                    </Link>
                    <Link href={"/account#settings"}>
                        <div className='flex items-center justify-start gap-4 px-1 py-2 hover:bg-blueGradient-2/80'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-gear-fill inline" viewBox="0 0 16 16">
                                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                            </svg>
                            <span>
                                {"Account Settings"}
                            </span>
                        </div>
                    </Link>
                    <Link href={"/login"}>
                        <div className='flex items-center justify-start gap-4 px-1 py-2 hover:bg-blueGradient-2/80'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="inline" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                            </svg>
                            <span>
                                {"Log Out"}
                            </span></div>
                    </Link>

                </div>
            </div>
        </div>
    )
}

export default FloatingProfile