import DashNav from "../components/DashNav"
import Navbar from "../components/Navbar"
import ServiceCard from "../components/reusable/ServiceCard"

function Testing() {
    return (
        <div className="relative h-screen">
            <div className='absolute animation-delay-2000 top-[2%] left-[35%] w-36 md:w-96 h-56 bg-blueGradient-0 opacity-70 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden' />
            <div className='absolute animation-delay-4000 top-[0%] right-[22%] w-36 md:w-96 h-56 bg-primary opacity-50 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden' />
            <div className='absolute top-[0%] right-[55%] w-36 md:w-96 h-56 bg-pink-700 opacity-60 rounded-full mix-blend-screen filter blur-[80px]  overflow-hidden' />
            <Navbar />

            <div className="mt-96 flex justify-center flex-wrap gap-4 mx-auto w-full">
                <ServiceCard title="Abc" />
                <ServiceCard title="Abc" />
                <ServiceCard title="Abc" />
                <ServiceCard title="Abc" />
            </div>

        </div>
    )
}

export default Testing