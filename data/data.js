const offlineServicesData = [
    {
        category: "Song",
        hasServices: true,
        services: [
            {
                hasSubServices: false,
                name: "Mix & Master",
                route: "/mix-master,",
            },
            {
                hasSubServices: false,
                name: "Vocals (Singing)",
                route: "/vocals,",
            },
            {
                hasSubServices: true,
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
        hasServices: false,
        services: null,
    },
    {
        category: "Film Audio Post",
        hasServices: true,
        services: [
            {
                hasSubServices: false,
                name: "Commercials",
                route: "/commercials,",
            },
            {
                hasSubServices: false,
                name: "Short Films, Episodes & Features",
                route: "/short-films-episodes-features,",
            },
            {
                hasSubServices: true,
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
        hasServices: false,
        services: null,
    },

]

const onlineServicesData = [
    {
        category: "Mix & Master",
        hasServices: true,
        services: [
            {
                name: "Mix",
                route: "/mixing,",
            },
            {
                name: "Master",
                route: "/mastering,",
            },
            {
                hasSubServices: true,
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
        hasServices: false,
        services: null,
    },
    {
        category: "Film Audio Post",
        hasServices: true,
        services: [
            {
                hasSubServices: false,
                name: "Commercials",
                route: "/commercials,",
            },
            {
                hasSubServices: false,
                name: "Short Films, Episodes & Features",
                route: "/short-films-episodes-features,",
            },
            {
                hasSubServices: true,
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
        hasServices: false,
        services: null,
    },

]