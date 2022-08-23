import React, { useEffect } from 'react'
/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { CheckIcon, MinusIcon } from '@heroicons/react/solid'
import Navbar from '../../../components/Navbar'
import { useState } from 'react'

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
    {
        name: 'Add Ons',
        features: [
            {
                name: 'Extra Revision',
                tiers: {
                    "Commercial Rate**": { price: 500, strPrice: "₹500" },
                    "Independent Artist Rate*": { price: 250, strPrice: "₹250" }
                }
            },
            {
                name: '10 Tracks (Adds 1 day to delivery)',
                tiers: {
                    "Commercial Rate**": { price: 1000, strPrice: "₹1000" },
                    "Independent Artist Rate*": { price: 500, strPrice: "₹500" }
                }
            },
            {
                name: '30s Duration (Adds 1 day to delivery)',
                tiers: {
                    "Commercial Rate**": { price: 1000, strPrice: "₹1000" },
                    "Independent Artist Rate*": { price: 500, strPrice: "₹500" }
                }
            },
            // Initially below will be free promo, then 75% off.
            {
                name: 'Mastering (Same category mix)',
                tiers: {
                    "Commercial Rate**": "75% Off",
                    "Independent Artist Rate*": "75% Off"
                }
            },
            {
                name: 'Mastering (Higher mastering category than mix category)',
                tiers: {
                    "Commercial Rate**": "50% Off",
                    "Independent Artist Rate*": "50% Off"
                }
            },
            // { name: 'Add on: Expedited Delivery - 5 Days', tiers: { "Commercial Rate**": false, "Independent Artist Rate*": false } },
            // { name: 'Add on: Expedited Delivery - 3 Days', tiers: { "Commercial Rate**": false, "Independent Artist Rate*": false } },
            // { name: 'Add on: Expedited Delivery - 2 Days', tiers: { "Commercial Rate**": false, "Independent Artist Rate*": false } },
            {
                name: 'Expedited Delivery - 1 Day',
                tiers: {
                    "Commercial Rate**": { price: 2500, strPrice: "₹2500" },
                    "Independent Artist Rate*": { price: 1250, strPrice: "₹1250" },
                }
            },
            {
                name: 'Bus Stems Export',
                tiers: {
                    "Commercial Rate**": { price: 500, strPrice: "₹500" },
                    "Independent Artist Rate*": { price: 250, strPrice: "₹250" },
                }
            },
            {
                name: 'Multitrack Export',
                tiers: {
                    "Commercial Rate**": { price: 1000, strPrice: "₹1000" },
                    "Independent Artist Rate*": { price: 500, strPrice: "₹500" }
                }
            },

        ],
    },

]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function pricing() {

    // Grabbing the AddOn Section
    const prevAddOnArr = sections.filter(section => section.name === "Add Ons")[0]
    // Mapping it with a "isAdded" boolean for handling cart addition
    const newAddOnArray = prevAddOnArr.features.map(addOn => {
        return {
            ...addOn,
            tiers: {
                "Commercial Rate**": {
                    ...addOn.tiers["Commercial Rate**"],
                    isAdded: false,
                },
                "Independent Artist Rate*": {
                    ...addOn.tiers["Independent Artist Rate*"],
                    isAdded: false,
                }
            }
        }
    })

    const [addOnList, setAddOnList] = useState(newAddOnArray)
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {

    }, [])

    return (
        <div className='bg-darkBlue'>
            <div className="bg-darkBlue text-white relative">
                <div className='absolute animation-delay-2000 top-[10%] left-[36%] w-36 md:w-96 h-56 bg-blueGradient-0 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden' />
                <div className='absolute animation-delay-4000 top-[5%] right-[18%] w-36 md:w-96 h-56 bg-blueGradient-2 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden' />
                {/* <div className='absolute top-[42%] left-[40%] w-36 md:w-80 h-72 bg-orange3 rounded-full mix-blend-screen filter blur-[80px] animate-blob overflow-hidden' /> */}
                <div className="max-w-7xl mx-auto py-16 sm:py-24 sm:px-6 lg:px-8">
                    <div className='mt-8 mb-16 text-xl mx-auto space-y-2'>
                        <h1 className='text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r py-5 from-pink-600 to-primary'>Automated Mix Plans</h1>
                        <p>For entry level musicians on a budget.
                        </p>
                        <p>
                            Your song is mixed using state of the art plugins that automate the mix process, with final touch ups from one of our professional studio engineers.
                        </p>
                    </div>
                    {/* xs to lg // SMALLER SCREENS */}

                    <div className="max-w-2xl mx-auto space-y-16 lg:hidden">
                        {tiers.map((tier, tierIdx) => (
                            <section key={tier.name}>
                                <div className="px-4 mb-8">
                                    <h2 className="text-lg leading-6 font-medium">{tier.name}</h2>
                                    <p className="mt-4 text-sm text-white">{tier.description}</p>
                                </div>
                                {sections.map((section) => (
                                    <table key={section.features[0].name} className="w-full">
                                        <caption className="border-t border-gray-200 py-3 px-4 text-sm font-medium text-gray-900 text-left">
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

                    {/* lg+ / LARGER SCREENS*/}
                    <div className="hidden lg:block">
                        <table className="w-full h-px table-fixed">
                            <caption className="sr-only">Pricing plan comparison</caption>
                            <thead>
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
                                                <button className='mt-6 mb-4 text-lg bg-gradient1/80 hover:bg-gradient1 transition-colors duration-300 font-bold py-2 px-5 rounded-lg'>Buy now</button>
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
                                                            section.name === 'Add Ons' && typeof feature.tiers[tier.name] === 'object' ? (
                                                                <div className='space-y-4'>
                                                                    <span className="block text-sm text-white">
                                                                        {addOnList[addOnidx]?.tiers[tier.name].strPrice}
                                                                        {/* {feature.tiers[tier.name].strPrice} */}
                                                                    </span>

                                                                    <button
                                                                        id={`${tier.name}`}
                                                                        onClick={(e) => {

                                                                            const updated = addOnList.map(addOn => {
                                                                                return {
                                                                                    ...addOn,
                                                                                    tiers: {
                                                                                        "Commercial Rate**": {
                                                                                            ...addOn.tiers["Commercial Rate**"],
                                                                                            isAdded: !addOn.tiers["Commercial Rate**"].isAdded,
                                                                                        },
                                                                                        "Independent Artist Rate*": {
                                                                                            ...addOn.tiers["Independent Artist Rate*"],
                                                                                            isAdded: !addOn.tiers["Independent Artist Rate*"].isAdded,
                                                                                        }
                                                                                    },
                                                                                }
                                                                            })
                                                                            setAddOnList(updated)
                                                                            console.log(addOnList[0].tiers)
                                                                        }}
                                                                        className='px-3 py-1 transition-colors duration-300 bg-gradient1/80 rounded-md hover:bg-gradient1'>
                                                                        {addOnList[addOnidx]?.tiers[tier.name].isAdded ? "Remove" : "Add"}
                                                                    </button>

                                                                </div>
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
                </div>
            </div>
        </div>
    )
}

export default pricing