const offlineServicesData = [
    {
        category: "Song",
        hasCategories: true,
        services: [
            {
                hassubServices: false,
                name: "Mix & Master",
                route: "/mix-master,",
            },
            {
                hassubServices: false,
                name: "Vocals (Singing)",
                route: "/vocals,",
            },
            {
                hassubServices: true,
                name: "Instrument Processing",
                subServices: [
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
                hassubServices: false,
                name: "Commercials",
                route: "/commercials,",
            },
            {
                hassubServices: false,
                name: "Short Films, Episodes & Features",
                route: "/short-films-episodes-features,",
            },
            {
                hassubServices: true,
                name: "Instrument Processing",
                subServices: [
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
                subServices: [
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
                    {
                        name: "Pro Mix - Indie Special Rate!",
                        route: "/mix-master/mix/pro-mix"
                    },
                ]
            },
            {
                name: "Master",
                route: '/mix-master/master',
                subServices: [
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
                    },
                    {
                        name: "Pro Master  Indie Special Rate!",
                        route: "/mix-master/master/pro-master"
                    }
                ]
            },
            {
                name: "Stem Master",
                route: "/mix-master/stem-master",
                subServices: [
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
                    },
                    {
                        name: "Pro Stem Master  Indie Special Rate!",
                        route: "/pro-stem-master"
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
                subServices: [
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
                subServices: [
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
                subServices: [
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
                subServices: null,
                route: "/vocals/basic-tuning"
            },
            {
                name: "Advanced Tuning",
                subServices: null,
                route: "/vocals/advanced-tuning"
            },
            {
                name: "Vocals Cleanup",
                subServices: null,
                route: "/vocals/vocals-cleanup"
            },
            {
                name: "Vocal Mix",
                subServices: null,
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
                subServices: null,
                route: "/voiceovers/basic-cleanup"
            },
            {
                name: "Advanced Cleanup",
                subServices: null,
                route: "/voiceovers/advanced-cleanup"
            },
            {
                name: "Dialogue Restoration",
                subServices: null,
                route: "/voiceovers/dialogue-restoration"
            },
            {
                name: "Voice Processing",
                subServices: null,
                route: "/voiceovers/voice-processing"
            },

        ]
    }
]


export default onlineServicesData;