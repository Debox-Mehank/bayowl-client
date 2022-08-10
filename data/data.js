const offlineServicesData = [
    {
        category: "Song",
        hasCategories: true,
        services: [
            {
                hassubCategories: false,
                name: "Mix & Master",
                route: "/mix-master,",
            },
            {
                hassubCategories: false,
                name: "Vocals (Singing)",
                route: "/vocals,",
            },
            {
                hassubCategories: true,
                name: "Instrument Processing",
                subCategories: [
                    {
                        name: "Guitars",
                        route: "/instrument-processing-guitars"
                    },
                    {
                        name: "Drums",
                        route: "/instrument-processing-guitars"
                    },
                    {
                        name: "All Instruments",
                        route: "/instrument-processing-guitars"
                    }
                ]
            },
        ]
    },
    {
        category: "Voice Overs & Dialogue",
        route: "voice-overs-dialogue",
        hasCategories: false,
        services: null,
    },
    {
        category: "Film Audio Post",
        hasCategories: true,
        services: [
            {
                hassubCategories: false,
                name: "Commercials",
                route: "/commercials,",
            },
            {
                hassubCategories: false,
                name: "Short Films, Episodes & Features",
                route: "/short-films-episodes-features,",
            },
            {
                hassubCategories: true,
                name: "Instrument Processing",
                subCategories: [
                    {
                        name: "Guitars",
                        route: "/instrument-processing-guitars"
                    },
                    {
                        name: "Drums",
                        route: "/instrument-processing-guitars"
                    },
                    {
                        name: "All Instruments",
                        route: "/instrument-processing-guitars"
                    }
                ]
            },
        ]
    },
    {
        category: "Session Artists",
        route: "/session-artists",
        hasCategories: false,
        services: null,
    },

]
const onlineServicesData = [
    {
        category: "Mix & Master",
        route: '/mix-master',
        services: [
            {
                name: "Mix",
                route: '/mix-master/mix',
                subCategories: [
                    {
                        name: "Automated Mix",
                        route: "/mix-master/mix/automated-mix"
                    },
                    {
                        name: "Template Mix",
                        route: "/mix-master/mix/template-mix"
                    },
                    {
                        name: "In Depth Mix",
                        route: "/mix-master/mix/in-depth-mix"
                    },
                    {
                        name: "Industry Mix",
                        route: "/mix-master/mix/industry-mix"
                    },

                ]
            },
            {
                name: "Master",
                route: '/mix-master/master',
                subCategories: [
                    {
                        name: "Automated Master",
                        route: "/mix-master/master/automated-master"
                    },
                    {
                        name: "Template Master",
                        route: "/mix-master/master/template-master"
                    },
                    {
                        name: "In Depth Master",
                        route: "/mix-master/master/in-depth-master"
                    },
                    {
                        name: "Industry Master",
                        route: "/mix-master/master/industry-master"
                    }
                ]
            },
            {
                name: "Stem Master",
                route: "/mix-master/stem-master",
                subCategories: [
                    {
                        name: "Automated Stem Master",
                        route: "/mix-master/stem-master/automated-stem-master"
                    },
                    {
                        name: "Template Stem Master",
                        route: "/mix-master/stem-master/template-stem-master"
                    },
                    {
                        name: "In Depth Stem Master",
                        route: "/mix-master/stem-master/in-depth-stem-master"
                    },
                    {
                        name: "Commercial Stem Master",
                        route: "/mix-master/stem-master/commercial-stem-master"
                    }
                ]
            },
        ]
    },
    {
        category: "Instrument Processing",
        route: "/instrument-processing",
        services: [
            {
                name: "Guitars",
                route: "/instrument-processing/guitars",
                subCategories: [
                    {
                        name: "String Noise",
                        route: "/instrument-processing/guitars/string-noise"
                    },
                    {
                        name: "Pluck Noise",
                        route: "/instrument-processing/guitars/pluck-noise"
                    },
                    {
                        name: "Guitar Mix",
                        route: "/instrument-processing/guitars/guitar-mix"
                    },
                ]
            },
            {
                name: "Drums",
                route: "/instrument-processing/drums",
                subCategories: [
                    {
                        name: "Re-Sample",
                        route: "/instrument-processing/drums/re-sample"
                    },
                    {
                        name: "Phase Correction",
                        route: "/instrument-processing/drums/phase-correction"
                    },
                    {
                        name: "Drum Mix",
                        route: "/instrument-processing/drums/drum-mix"
                    },
                ]
            },
            {
                name: "All Instruments",
                route: "/instrument-processing/all",
                subCategories: [
                    {
                        name: "Instrument Cleanup",
                        route: "/instrument-processing/all/instrument-cleanup"
                    },
                    {
                        name: "Basic Pitch Correction",
                        route: "/instrument-processing/all/basic-pitch-correction"
                    },
                    {
                        name: "Advanced Pitch Correction",
                        route: "/instrument-processing/all/advanced-pitch-correction"
                    },
                    {
                        name: "Basic Time Correction",
                        route: "/instrument-processing/all/basic-time-correction"
                    },
                    {
                        name: "Advanced Time Correction",
                        route: "/instrument-processing/all/advanced-time-correction"
                    },
                ]
            }
        ]
    },
    {
        category: "Vocals (Singing)",
        route: "/vocals",
        services: [
            {
                name: "Basic Tuning",
                subCategories: null,
                route: "/vocals/basic-tuning"
            },
            {
                name: "Advanced Tuning",
                subCategories: null,
                route: "/vocals/advanced-tuning"
            },
            {
                name: "Vocals Cleanup",
                subCategories: null,
                route: "/vocals/vocals-cleanup"
            },
            {
                name: "Vocal Mix",
                subCategories: null,
                route: "/vocals/vocal-mix"
            },

        ]
    },
    {
        category: "Voice Overs & Dialogue",
        route: "/voiceovers",
        services: [
            {
                name: "Basic Cleanup",
                subCategories: null,
                route: "/voiceovers/basic-cleanup"
            },
            {
                name: "Advanced Cleanup",
                subCategories: null,
                route: "/voiceovers/advanced-cleanup"
            },
            {
                name: "Dialogue Restoration",
                subCategories: null,
                route: "/voiceovers/dialogue-restoration"
            },
            {
                name: "Vocal Processing",
                subCategories: null,
                route: "/voiceovers/vocal-processing"
            },

        ]
    }
]


export default onlineServicesData;