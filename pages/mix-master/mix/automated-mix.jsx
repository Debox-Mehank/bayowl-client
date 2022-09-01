import React, { useEffect } from 'react'

import { Fragment } from 'react'
import { CheckIcon, MinusIcon } from '@heroicons/react/solid'
import Navbar from '../../../components/Navbar'
import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { useRouter } from 'next/router'

const addOns = [
    {
        name: "Extra Revision",
        price: 250,
        strPrice: "₹250",
    },
    {
        name: "Expedited Delivery - 5 Day",
        price: 5000,
        strPrice: "₹5000",
    },
    {
        name: "Expedited Delivery - 3 Day",
        price: 7500,
        strPrice: "₹10000",
    },
    {
        name: "Expedited Delivery - 2 Day",
        price: 12500,
        strPrice: "₹12500",
    },
    {
        name: "Expedited Delivery - 1 Day",
        price: 25000,
        strPrice: "₹25000",
    },
    {
        name: "Bus Stems Export",
        price: 500,
        strPrice: "₹500",
    },
    {
        name: "Multitrack Export",
        price: 500,
        strPrice: "₹500",
    },

]





const tiers = [
    {
        name: 'Commercial Rate**',
        href: '#',
        description: '**If backed by a label or management or using the file for commercial purposes.',
        priceNum: 5000,
        priceString: "₹5,000"
    },
    {
        name: 'Independent Artist Rate*',
        href: '#',
        description: "*For independent musicians and artists releasing their own music without an existing agreement to sell the song commercially.",
        priceNum: 2500,
        priceString: "₹2,500"
    },
]



const sections = [
    {
        name: 'Basic Details',
        features: [
            { name: 'Estimated Time Given (Hours)', tiers: { "Commercial Rate**": "2", "Independent Artist Rate*": "2" } },
            { name: 'Price', tiers: { "Commercial Rate**": "₹5,000", "Independent Artist Rate*": "₹2,500" } },
            { name: 'Input / Track Limit', tiers: { "Commercial Rate**": "20", "Independent Artist Rate*": "20" } },
            { name: 'Upload File Format -  .wav (sampling rate 44.1-96k, bit depth 16 or 24bit)', tiers: { "Commercial Rate**": "wav", "Independent Artist Rate*": "wav" } },
            { name: 'Delivery Format ', tiers: { "Commercial Rate**": "48/24 .wav mix file", "Independent Artist Rate*": "48/24 .wav mix file" } },
            { name: 'Delivery (Days)', tiers: { "Commercial Rate**": "2", "Independent Artist Rate*": "2" } },
            { name: 'Maximum Song / File Duration', tiers: { "Commercial Rate**": "3m30s", "Independent Artist Rate*": "3m30s" } },
            // { name: 'Number of reference file uploads', tiers: { "Commercial Rate**": false, "Independent Artist Rate*": false } },
            // { name: 'Set of Revisions', tiers: { "Commercial Rate**": false, "Independent Artist Rate*": false } },
            // { name: 'Revisions Delivery (Days)', tiers: { "Commercial Rate**": false, "Independent Artist Rate*": false } },
        ],
    },
    {
        name: 'Creative Processing',
        features: [
            { name: 'Mix Processing: Vocal Tuning', tiers: { "Commercial Rate**": false, "Independent Artist Rate*": false } },
            { name: 'Mix Processing: Reverbs', tiers: { "Commercial Rate**": false, "Independent Artist Rate*": false } },
            { name: 'Mix Processing: Delays', tiers: { "Commercial Rate**": false, "Independent Artist Rate*": false } },
            { name: 'Mix Processing: Other Fx', tiers: { "Commercial Rate**": false, "Independent Artist Rate*": false } },
        ],
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Pricing() {

    // Grabbing the AddOn Section
    // const prevAddOnArr = sections.filter(section => section.name === "Add Ons")[0]
    // // Mapping it with a "isAdded" boolean for handling cart addition
    // const newAddOnArray = prevAddOnArr.features.map(addOn => {
    //     return {
    //         ...addOn,
    //         tiers: {
    //             "Commercial Rate**": {
    //                 ...addOn.tiers["Commercial Rate**"],
    //                 isAdded: false,
    //             },
    //             "Independent Artist Rate*": {
    //                 ...addOn.tiers["Independent Artist Rate*"],
    //                 isAdded: false,
    //             }
    //         }
    //     }
    // })

    // const [addOnList, setAddOnList] = useState(newAddOnArray)
    const [totalPrice, setTotalPrice] = useState(0)
    const [selectedPlan, setSelectedPlan] = useState(null)
    // const [addOns, setAddOns] = useState(null)
    const router = useRouter()
    // const [selected, setSelected] = useState(plans[0])

    useEffect(() => {

    }, [])

    return (
        <div className=''>
            <div className="text-white relative">

                <div className='absolute animation-delay-2000 top-[35%] left-[35%] w-36 md:w-96 h-56 bg-blueGradient-0 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden' />
                {/* <div className='absolute animation-delay-4000 top-[45%] right-[18%] w-36 md:w-96 h-56 bg-blueGradient-2 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden' /> */}
                <div className='absolute top-[42%] right-[34%] w-36 md:w-80 h-72 bg-orange3 opacity-60 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden' />
                <div className="max-w-7xl mx-auto py-16 sm:py-24 sm:px-6 lg:px-8">

                    {
                        !selectedPlan && (
                            <div className='mt-8 mb-16 text-xl mx-auto space-y-2 md:sticky md:top-0 md:bg-darkBlue/30 md:backdrop-blur-xl z-20 px-4 pb-2 py-3'>
                                <svg onClick={() => {
                                    setSelectedPlan(null)
                                    // setAddOns(null)
                                    router.back()
                                }} xmlns="http://www.w3.org/2000/svg" width="27" height="30" className='fill-white hover:fill-primary duration-300 transition-colors cursor-pointer' viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                </svg>
                                <h1 className='text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r py-5 from-pink-600 to-primary'>Automated Mix Plans</h1>
                                <p>For entry level musicians on a budget.
                                </p>
                                <p>
                                    Your song is mixed using state of the art plugins that automate the mix process, with final touch ups from one of our professional studio engineers.
                                </p>
                            </div>
                        )
                    }
                    {/* Table Start */}
                    {/* xs to lg // SMALLER SCREENS */}
                    {/* Rendering both plans if no plan is selected */}
                    {!selectedPlan && (

                        <div className="max-w-2xl mx-auto space-y-16 lg:hidden">
                            {tiers.map((tier, tierIdx) => (
                                <section key={tier.name}>
                                    <div className="px-4 mb-8 sticky top-0 left-0 backdrop-blur-md">
                                        <h2 className="text-lg leading-6 font-medium">{tier.name} - {tier.priceString}</h2>
                                        <p className="mt-4 text-sm text-white">{tier.description}</p>

                                        <button
                                            onClick={() => {
                                                setSelectedPlan(true)
                                            }}
                                            className='mt-6 mb-4 text-lg bg-blueGradient-3/60 hover:bg-gradient1 transition-colors duration-300 font-bold py-2 px-5 rounded-lg'>
                                            Buy now
                                        </button>
                                    </div>
                                    {sections.map((section) => (
                                        <table key={section.features[0].name} className="w-full">
                                            <caption className="border-t border-gray-200 py-3 px-4 text-sm font-bold text-primary text-left">
                                                {section.name}
                                            </caption>
                                            <thead>
                                                <tr>
                                                    <th className="sr-only" scope="col">
                                                        Feature
                                                    </th>
                                                    <th className="sr-only" scope="col">
                                                        Included
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gradient1">
                                                {section.features.map((feature) => (
                                                    <tr key={feature.name} className="border-t border-gray-200">
                                                        <th className="py-5 px-4 text-sm font-normal text-white text-left" scope="row">
                                                            {feature.name}
                                                        </th>
                                                        <td className="py-5 pr-4">
                                                            {typeof feature.tiers[tier.name] === 'string' ? (
                                                                <span className="block text-sm text-right">{feature.tiers[tier.name]}</span>
                                                            ) : (
                                                                <>
                                                                    {feature.tiers[tier.name] === true ? (
                                                                        <CheckIcon className="ml-auto h-5 w-5 text-green-500" aria-hidden="true" />
                                                                    ) : (
                                                                        <MinusIcon className="ml-auto h-5 w-5 text-gradient1" aria-hidden="true" />
                                                                    )}

                                                                    <span className="sr-only">{feature.tiers[tier.name] === true ? 'Yes' : 'No'}</span>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ))}

                                    <div
                                        className={classNames(
                                            tierIdx < tiers.length - 1 ? 'py-5 border-b' : 'pt-5',
                                            'border-t border-gray-200 px-4'
                                        )}
                                    >

                                    </div>
                                </section>
                            ))}
                        </div>

                    )}
                    {/* lg+ / LARGER SCREENS*/}
                    {
                        !selectedPlan && (
                            <div className="hidden lg:block">
                                <table className="w-full h-px table-fixed">
                                    <caption className="sr-only">Pricing plan comparison</caption>
                                    <thead className='sticky top-[14.6rem] left-0 z-20 backdrop-blur-xl bg-darkBlue/30 divide-y divide-blueGradient-2'>
                                        <tr>
                                            <th className="pb-4 px-6 text-md font-medium text-left" scope="col">
                                                <span>Plans</span>
                                            </th>
                                            {tiers.map((tier) => (
                                                <th
                                                    key={tier.name}
                                                    className="w-1/4 pb-4 px-6 text-lg leading-6 font-medium text-center"
                                                    scope="col"
                                                >
                                                    {tier.name}
                                                </th>
                                            ))}
                                        </tr>

                                    </thead>
                                    <tbody className="border-t border-gray-200 divide-y divide-blueGradient-2">
                                        <tr>
                                            <th className="py-8 px-6 text-sm font-medium text-left align-top" scope="row">
                                                { }
                                            </th>
                                            {tiers.map((tier) => (
                                                <td key={tier.name} className="h-full py-2 px-6 align-top">
                                                    <div className="relative h-full table text-center text-sm">
                                                        <p className="pt-4 text-white h-36">{tier.description}</p>
                                                        <p className='text-2xl'>{tier.priceString}</p>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPlan(true)
                                                            }}
                                                            className='mt-6 mb-4 text-lg bg-blueGradient-3/60 hover:bg-gradient1 transition-colors duration-300 font-bold py-2 px-5 rounded-lg'>
                                                            Buy now
                                                        </button>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                        {sections.map((section) => (
                                            <Fragment key={section.name}>
                                                <tr>
                                                    <th
                                                        className="bg-gradient3 text-white py-3 pl-6 text-sm font-bold text-left"
                                                        colSpan={3}
                                                        scope="colgroup"
                                                    >
                                                        {section.name}
                                                    </th>
                                                </tr>
                                                {section.features.map((feature, addOnidx) => (
                                                    <tr className='text-center' key={feature.name}>
                                                        <th className="py-5 px-6 text-sm font-normal text-white text-left" scope="row">
                                                            {feature.name}
                                                        </th>
                                                        {tiers.map((tier, tierIdx) => (
                                                            <td key={tier.name} className="py-5 px-6">
                                                                {
                                                                    section.name === 'Add Ons' ? (
                                                                        <>
                                                                        </>
                                                                    )
                                                                        :
                                                                        typeof feature.tiers[tier.name] === 'string' ? (
                                                                            <span className="block text-sm text-white">{feature.tiers[tier.name]}</span>
                                                                        ) :

                                                                            (
                                                                                <div className=''>
                                                                                    {feature.tiers[tier.name] === true ? (
                                                                                        <CheckIcon className="h-5 w-5 text-primary mx-auto" aria-hidden="true" />
                                                                                    ) : (
                                                                                        <MinusIcon className="h-5 w-5 text-gradient1 mx-auto" aria-hidden="true" />
                                                                                    )}

                                                                                    <span className="sr-only">
                                                                                        {feature.tiers[tier.name] === true ? 'Included' : 'Not included'} in {tier.name}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </Fragment>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        )
                    }
                    {/* Table End */}
                    {/* Conditionally rendering selected plan if it is chosen - Values to be added as per schema */}

                    {
                        selectedPlan && (
                            <div className='relative text-center flex w-full justify-center items-center flex-col md:flex-row gap-10 md:gap-20 py-20'>

                                <div className='absolute -top-5 left-4 md:-left-1'>
                                    <svg onClick={() => {
                                        setSelectedPlan(null)
                                        // setAddOns(null)
                                    }} xmlns="http://www.w3.org/2000/svg" width="27" height="30" className='fill-white hover:fill-primary duration-300 transition-colors cursor-pointer' viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                                    </svg>
                                </div>
                                <div className='mx-auto w-full space-y-16 rounded-lg py-20 bg-blueGradient-2/30 backdrop-blur-lg'>
                                    <div className='text-2xl space-y-3  font-bold'>
                                        <span className='text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r py-5 from-pink-600 to-primary'>Automated Mix Plan</span>
                                        <span className='block'>Independent Artist - ₹2,500</span>
                                    </div>
                                    <div className='text-xl space-y-3'>
                                        <div>Estimated Time Given(Hours) : 2</div>
                                        <div>Input Track Limit : 20</div>
                                        <div>Upload File Format: .wav</div>
                                        <div>Delivery Format: 48/24.wav mix file</div>
                                        <div>Delivery (Days): 2</div>
                                        <div>Maximum Song / File Duration: 3m30s</div>
                                    </div>
                                </div>
                                <div className='mx-auto w-full md:text-left space-y-10'>
                                    <span className='text-xl md:text-3xl font-extrabold text-white'>Add Ons</span>
                                    <fieldset className="">
                                        <div className="">

                                            <div className="space-y-3 md:max-h-96 overflow-auto border-none w-11/12 mx-auto md:pr-3">
                                                {
                                                    addOns.map(addOn => (
                                                        <div>
                                                            <label htmlFor={addOn.name} className=" font-medium text-white ">
                                                                <div className='border-2 border-gray-600 rounded-lg relative flex items-start py-4 px-3 justify-center'>
                                                                    <div className="min-w-0 flex-1 text-md">
                                                                        <p id="comments-description" className="text-gray-200">
                                                                            <span className='font-bold'>{addOn.name}</span> - {addOn.strPrice}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex justify-center items-center my-auto">
                                                                        <input
                                                                            id={addOn.name}
                                                                            aria-describedby="comments-description"
                                                                            name={addOn.name}
                                                                            type="checkbox"
                                                                            className="focus:ring-indigo-500 h-4 w-4 text-primary border-gray-300 rounded"
                                                                        />
                                                                    </div>
                                                                </div>

                                                            </label>
                                                        </div>
                                                    ))
                                                }
                                            </div>



                                        </div>
                                    </fieldset>

                                    <button className='mt-12 lg:mt-8 flex mx-auto justify-center items-center gap-2.5 text-gray-100 bg-white/20 text-xl font-bold py-3 px-5 rounded-2xl  hover:-translate-y-1 duration-300 transition-all hover:shadow-2xl hover:bg-primary hover:text-white '>
                                        Buy Now
                                    </button>

                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Pricing