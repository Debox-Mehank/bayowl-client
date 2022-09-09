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
              { subService: "In Depth Mix" },
              { subService: "Industry Mix" },
            ],
          },
          {
            serviceName: "Master",
            subServices: [
              { subService: "Automated Mix" },
              { subService: "Template Mix" },
              { subService: "In Depth Mix" },
              { subService: "Industry Mix" },
            ],
          },
          {
            serviceName: "Stem Master",
            subServices: [
              { subService: "Automated Stem Mix" },
              { subService: "Template Stem Mix" },
              { subService: "In Depth Stem Mix" },
              { subService: "Industry Stem Mix" },
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
              { subService: "Guitar Mix" },
            ],
          },
          {
            serviceName: "Drums",
            subServices: [
              { subService: "Resample" },
              { subService: "Phase Improvement" },
              { subService: "Drum Mix" },
            ],
          },
          {
            serviceName: "Bass",
            subServices: [
              { subService: "Resample" },
              { subService: "Noise Cleanup" },
              { subService: "Bass Mix" },
            ],
          },
          {
            serviceName: "Piano",
            subServices: [
              { subService: "Resample" },
              { subService: "Piano Mix" },
            ],
          },
          {
            serviceName: "Other Instruments",
            subServices: [{ subService: "Noise Cleanup" }],
          },
          {
            serviceName: "Pitch Correction",
            subServices: [
              { subService: "Basic Pitch Correction" },
              { subService: "Advanced Pitch Correction" },
            ],
          },
          {
            serviceName: "Quantise",
            subServices: [
              { subService: "Basic Time Correctionn" },
              { subService: "Advanced Time Correction" },
            ],
          },
        ],
      },
      {
        subCategory: "Vocals",
        services: [
          {
            serviceName: "Pitch Correction",
            subServices: [
              { subService: "Basic Tuning" },
              { subService: "Advanced Tuning" },
            ],
          },
          {
            serviceName: "Noise Cleanup",
            subServices: [
              { subService: "Basic Cleanup" },
              { subService: "Advanced Cleanup" },
            ],
          },
          {
            serviceName: "Vocal Mix",
            subServices: [{ subService: "Vocal Mix" }],
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
      {
        subCategory: "Episodes & Features",
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
      {
        subCategory: "Audiobooks & Podcasts",
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

// export enum MainCategory {
//   audioPostForMusic = "Audio Post for Music",
//   voiceOverAndDialogue = "Voice Overs & Dialogue",
// }

// export interface AllServices {
//   mainCategory: string;
//   subCategories: {
//     subCategory: string;
//     services: {
//       serviceName: string;
//       subServices: { subService: string }[] | null;
//     }[];
//   }[];
// }

// export const allServices: AllServices[] = [
//   {
//     mainCategory: "Audio Post for Music",
//     subCategories: [
//       {
//         subCategory: "Mix & Master",
//         services: [
//           {
//             serviceName: "Mix",
//             subServices: [
//               { subService: "Automated Mix" },
//               { subService: "Template Mix" },
//             ],
//           },
//         ],
//       },
//       {
//         subCategory: "Instrument Processing",
//         services: [
//           {
//             serviceName: "Guitars",
//             subServices: [
//               { subService: "Reamp" },
//               { subService: "Noise Cleanup" },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     mainCategory: "Voice Overs & Dialogue",
//     subCategories: [
//       {
//         subCategory: "TVCs & Digital",
//         services: [
//           {
//             serviceName: "Basic Cleanup",
//             subServices: null,
//           },
//           {
//             serviceName: "Advanced Cleanup",
//             subServices: null,
//           },
//           {
//             serviceName: "Dialogue Restoration",
//             subServices: null,
//           },
//           {
//             serviceName: "Voice Processing",
//             subServices: null,
//           },
//         ],
//       },
//     ],
//   },
// ];
