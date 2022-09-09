export enum MainCategory {
  audioPostForMusic = "Audio Post for Music",
  voiceOverAndDialogue = "Voice Overs & Dialogue",
}

export interface AllServices {
  mainCategory: string;
  subCategories: {
    subCategory: string;
    services: {
      serviceName: string;
      subServices: { subService: string }[] | null;
    }[];
  }[];
}

export const allServices: AllServices[] = [
  {
    mainCategory: "Audio Post for Music",
    subCategories: [
      {
        subCategory: "Mix & Master",
        services: [
          {
            serviceName: "Mix",
            subServices: [
              { subService: "Automated Mix" },
              { subService: "Template Mix" },
            ],
          },
        ],
      },
      {
        subCategory: "Instrument Processing",
        services: [
          {
            serviceName: "Guitars",
            subServices: [
              { subService: "Reamp" },
              { subService: "Noise Cleanup" },
            ],
          },
        ],
      },
    ],
  },
  {
    mainCategory: "Voice Overs & Dialogue",
    subCategories: [
      {
        subCategory: "TVCs & Digital",
        services: [
          {
            serviceName: "Basic Cleanup",
            subServices: null,
          },
          {
            serviceName: "Advanced Cleanup",
            subServices: null,
          },
          {
            serviceName: "Dialogue Restoration",
            subServices: null,
          },
          {
            serviceName: "Voice Processing",
            subServices: null,
          },
        ],
      },
    ],
  },
];
