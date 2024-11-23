//@ts-nocheck

import React, { useCallback, useContext, useMemo } from "react";
import { Carousel } from "@mantine/carousel";
import { Stack } from "@mantine/core";
import ConcernsCard from "@/components/AnalysisCarousel//ConcernsCard";
import AnalysisCard from "@/components/AnalysisCarousel/AnalysisCard";
import AnalysisCardPotential from "@/components/AnalysisCarousel/AnalysisCardPotential";
import BetterThanCard from "@/components/AnalysisCarousel/BetterThanCard";
import BetterThanCardPotential from "@/components/AnalysisCarousel/BetterThanCardPotential";
import { PartEnum } from "@/context/UploadPartsChoicesContext/types";
import { UserContext } from "@/context/UserContext";
import { StyleAnalysisType, TypeEnum } from "@/types/global";
import classes from "./AnalysisCarousel.module.css";

type Props = {
  type: "head" | "body";
  styleAnalyses?: StyleAnalysisType[];
};

const fakeSix = {
  head: {
    overall: 58,
    face: {
      _id: "674053e5967c7f1f90753e47",
      userId: "674033fb1ad895fad61ad0b0",
      type: "head" as TypeEnum,
      part: "face" as PartEnum,
      scores: {
        overall: 55,
        lips: 60,
        grooming: 40,
        eyes: 60,
        skin: 60,
      },
      demographics: {
        sex: "male",
        ageInterval: "24-30",
        ethnicity: "white",
        skinColor: "fitzpatrick-2",
        skinType: "normal",
      },
      images: [
        {
          position: "front",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/_wm2FVkH8hNlF4yZocxs5.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
            },
          ],
        },
        {
          position: "right",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/LTnVKvmAcCApFrMTHhg7M.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
            },
          ],
        },
        {
          position: "left",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ALV5xrG2IOcVjxfx4lS0y.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
            },
          ],
        },
      ],
      initialImages: [
        {
          position: "front",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/_wm2FVkH8hNlF4yZocxs5.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
            },
          ],
        },
        {
          position: "right",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/LTnVKvmAcCApFrMTHhg7M.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
            },
          ],
        },
        {
          position: "left",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ALV5xrG2IOcVjxfx4lS0y.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
            },
          ],
        },
      ],
      initialDate: "2024-11-22T09:50:17.118Z",
      createdAt: "2024-11-22T09:50:17.118Z",
      concerns: [
        {
          name: "ungroomed_facial_hair",
          explanation:
            "Your beard appears full and may benefit from grooming to achieve a more defined shape.",
          part: "face",
          importance: 1,
          isDisabled: false,
          type: "head" as TypeEnum,
        },
      ],
      scoresDifference: {
        overall: 0,
        lips: 0,
        grooming: 0,
        eyes: 0,
        skin: 0,
      },
      explanation:
        "# Head analysis Fri Nov 22 2024\n\n## Lips\n- Score: 60\n- Explanation: The lips appear generally smooth but slightly dry. There is no visible cracking, but the texture suggests minimal dryness.\n\n## Grooming\n- Score: 40\n- Explanation: The beard appears somewhat uneven and slightly unkempt, with some stray hairs visible. It doesn't look completely neglected but could use some trimming for a more defined shape.\n\n## Eyes\n- Score: 60\n- Explanation: The images show minimal crow's feet and no significant under-eye bags or dark circles. The skin texture appears generally smooth, indicating a score in the 60-80 range. However, due to the lighting and image quality, a conservative score of 60 is given.\n\n## Skin\n- Score: 60\n- Explanation: The skin appears generally healthy with no significant visible issues. There are no apparent signs of acne or major discoloration. The lighting is not optimal, but the skin seems to have a smooth texture with minor imperfections.\n\n## Conclusion: \n\nThis person should address the following concerns to improve their appearance at this date:\n\n- ungroomed_facial_hair: Your beard appears full and may benefit from grooming to achieve a more defined shape.",
      specialConsiderations: null,
      isPublic: false,
    },
    mouth: {
      _id: "674053e2967c7f1f90753e46",
      userId: "674033fb1ad895fad61ad0b0",
      type: "head",
      part: "mouth",
      scores: {
        overall: 40,
        mouth: 40,
      },
      demographics: {
        sex: "male",
        ageInterval: "24-30",
        ethnicity: "white",
        skinColor: "fitzpatrick-2",
        skinType: "normal",
      },
      images: [
        {
          position: "mouth",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/tQJSzrdOVuxoYk7jnxu1k.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
            },
          ],
        },
      ],
      initialImages: [
        {
          position: "mouth",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/tQJSzrdOVuxoYk7jnxu1k.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
            },
          ],
        },
      ],
      initialDate: "2024-11-22T09:50:11.953Z",
      createdAt: "2024-11-22T09:50:11.953Z",
      concerns: [
        {
          name: "teeth_discoloration",
          explanation: "Your teeth appear to have a yellowish tint, indicating discoloration.",
          part: "mouth",
          importance: 1,
          isDisabled: false,
          type: "head",
        },
      ],
      scoresDifference: {
        overall: 0,
        mouth: 0,
      },
      explanation:
        "# Head analysis Fri Nov 22 2024\n\n## Mouth\n- Score: 40\n- Explanation: The image is not very clear, but there appears to be some discoloration on the teeth, which could indicate plaque buildup or staining. The gums are not clearly visible, making it difficult to assess their health. Based on the visible teeth, the oral health seems to be in the fair range.\n\n## Conclusion: \n\nThis person should address the following concerns to improve their appearance at this date:\n\n- teeth_discoloration: Your teeth appear to have a yellowish tint, indicating discoloration.",
      specialConsiderations: null,
      isPublic: false,
    },
    scalp: {
      _id: "674053dd967c7f1f90753e45",
      userId: "674033fb1ad895fad61ad0b0",
      type: "head",
      part: "scalp",
      scores: {
        overall: 80,
        scalp: 80,
      },
      demographics: {
        sex: "male",
        ageInterval: "24-30",
        ethnicity: "white",
        skinColor: "fitzpatrick-2",
        skinType: "normal",
      },
      images: [
        {
          position: "scalp",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ocGZNgkY3ENl_Ll5Jo_w9.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
            },
          ],
        },
      ],
      initialImages: [
        {
          position: "scalp" as "eyes",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ocGZNgkY3ENl_Ll5Jo_w9.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
            },
          ],
        },
      ],
      initialDate: "2024-11-22T09:50:11.408Z",
      createdAt: "2024-11-22T09:50:11.408Z",
      concerns: [
        {
          name: "alopecia_areata",
          explanation: "You have noticeable thinning or patchy hair loss on the top of your scalp.",
          part: "scalp",
          importance: 1,
          isDisabled: false,
          type: "head" as TypeEnum,
        },
      ],
      scoresDifference: {
        overall: 0,
        scalp: 0,
      },
      explanation:
        "# Head analysis Fri Nov 22 2024\n\n## Scalp\n- Score: 80\n- Explanation: The scalp appears mostly clear and smooth with no visible flakes or redness. The hair is well-groomed, indicating a healthy scalp condition.\n\n## Conclusion: \n\nThis person should address the following concerns to improve their appearance at this date:\n\n- alopecia_areata: You have noticeable thinning or patchy hair loss on the top of your scalp.",
      specialConsiderations: null,
      isPublic: false,
    },
  },
  body: {
    overall: 0,
    body: null,
  },
  health: {
    overall: 0,
    health: null,
  },
};

const fakeFive = {
  head: {
    overall: 58,
    face: {
      _id: "674053e5967c7f1f90753e47",
      userId: "674033fb1ad895fad61ad0b0",
      type: "head" as TypeEnum,
      part: "face" as PartEnum,
      scores: {
        overall: 55,
        lips: 60,
        grooming: 40,
        eyes: 60,
        skin: 60,
      },
      demographics: {
        sex: "male",
        ageInterval: "24-30",
        ethnicity: "white",
        skinColor: "fitzpatrick-2",
        skinType: "normal",
      },
      images: [
        {
          position: "front",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/_wm2FVkH8hNlF4yZocxs5.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
            },
          ],
        },
        {
          position: "right",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/LTnVKvmAcCApFrMTHhg7M.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
            },
          ],
        },
        {
          position: "left",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ALV5xrG2IOcVjxfx4lS0y.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
            },
          ],
        },
      ],
      initialImages: [
        {
          position: "front",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/_wm2FVkH8hNlF4yZocxs5.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
            },
          ],
        },
        {
          position: "right",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/LTnVKvmAcCApFrMTHhg7M.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
            },
          ],
        },
        {
          position: "left",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ALV5xrG2IOcVjxfx4lS0y.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
            },
          ],
        },
      ],
      initialDate: "2024-11-22T09:50:17.118Z",
      createdAt: "2024-11-22T09:50:17.118Z",
      concerns: [
        {
          name: "ungroomed_facial_hair",
          explanation:
            "Your beard appears full and may benefit from grooming to achieve a more defined shape.",
          part: "face",
          importance: 1,
          isDisabled: false,
          type: "head" as TypeEnum,
        },
      ],
      scoresDifference: {
        overall: 0,
        lips: 0,
        grooming: 0,
        eyes: 0,
        skin: 0,
      },
      explanation:
        "# Head analysis Fri Nov 22 2024\n\n## Lips\n- Score: 60\n- Explanation: The lips appear generally smooth but slightly dry. There is no visible cracking, but the texture suggests minimal dryness.\n\n## Grooming\n- Score: 40\n- Explanation: The beard appears somewhat uneven and slightly unkempt, with some stray hairs visible. It doesn't look completely neglected but could use some trimming for a more defined shape.\n\n## Eyes\n- Score: 60\n- Explanation: The images show minimal crow's feet and no significant under-eye bags or dark circles. The skin texture appears generally smooth, indicating a score in the 60-80 range. However, due to the lighting and image quality, a conservative score of 60 is given.\n\n## Skin\n- Score: 60\n- Explanation: The skin appears generally healthy with no significant visible issues. There are no apparent signs of acne or major discoloration. The lighting is not optimal, but the skin seems to have a smooth texture with minor imperfections.\n\n## Conclusion: \n\nThis person should address the following concerns to improve their appearance at this date:\n\n- ungroomed_facial_hair: Your beard appears full and may benefit from grooming to achieve a more defined shape.",
      specialConsiderations: null,
      isPublic: false,
    },
    mouth: {
      _id: "674053e2967c7f1f90753e46",
      userId: "674033fb1ad895fad61ad0b0",
      type: "head",
      part: "mouth",
      scores: {
        overall: 40,
        mouth: 40,
      },
      demographics: {
        sex: "male",
        ageInterval: "24-30",
        ethnicity: "white",
        skinColor: "fitzpatrick-2",
        skinType: "normal",
      },
      images: [
        {
          position: "mouth",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/tQJSzrdOVuxoYk7jnxu1k.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
            },
          ],
        },
      ],
      initialImages: [
        {
          position: "mouth",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/tQJSzrdOVuxoYk7jnxu1k.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
            },
          ],
        },
      ],
      initialDate: "2024-11-22T09:50:11.953Z",
      createdAt: "2024-11-22T09:50:11.953Z",
      concerns: [
        {
          name: "teeth_discoloration",
          explanation: "Your teeth appear to have a yellowish tint, indicating discoloration.",
          part: "mouth",
          importance: 1,
          isDisabled: false,
          type: "head",
        },
      ],
      scoresDifference: {
        overall: 0,
        mouth: 0,
      },
      explanation:
        "# Head analysis Fri Nov 22 2024\n\n## Mouth\n- Score: 40\n- Explanation: The image is not very clear, but there appears to be some discoloration on the teeth, which could indicate plaque buildup or staining. The gums are not clearly visible, making it difficult to assess their health. Based on the visible teeth, the oral health seems to be in the fair range.\n\n## Conclusion: \n\nThis person should address the following concerns to improve their appearance at this date:\n\n- teeth_discoloration: Your teeth appear to have a yellowish tint, indicating discoloration.",
      specialConsiderations: null,
      isPublic: false,
    },
    scalp: null,
  },
  body: {
    overall: 0,
    body: null,
  },
  health: {
    overall: 0,
    health: null,
  },
};

const fakeFour = {
  head: {
    overall: 58,
    face: {
      _id: "674053e5967c7f1f90753e47",
      userId: "674033fb1ad895fad61ad0b0",
      type: "head" as TypeEnum,
      part: "face" as PartEnum,
      scores: {
        overall: 55,
        lips: 60,
        grooming: 40,
        eyes: 60,
        skin: 60,
      },
      demographics: {
        sex: "male",
        ageInterval: "24-30",
        ethnicity: "white",
        skinColor: "fitzpatrick-2",
        skinType: "normal",
      },
      images: [
        {
          position: "front",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/_wm2FVkH8hNlF4yZocxs5.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
            },
          ],
        },
        {
          position: "right",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/LTnVKvmAcCApFrMTHhg7M.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
            },
          ],
        },
        {
          position: "left",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ALV5xrG2IOcVjxfx4lS0y.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
            },
          ],
        },
      ],
      initialImages: [
        {
          position: "front",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/_wm2FVkH8hNlF4yZocxs5.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-dzdnNGH7W6ZR49Se0lIjc.webp",
            },
          ],
        },
        {
          position: "right",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/LTnVKvmAcCApFrMTHhg7M.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-AXYhJS970xlmR1UcVTnq-.webp",
            },
          ],
        },
        {
          position: "left",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ALV5xrG2IOcVjxfx4lS0y.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-qM5JWUreFRiFw_pc0kr-J.webp",
            },
          ],
        },
      ],
      initialDate: "2024-11-22T09:50:17.118Z",
      createdAt: "2024-11-22T09:50:17.118Z",
      concerns: [
        {
          name: "ungroomed_facial_hair",
          explanation:
            "Your beard appears full and may benefit from grooming to achieve a more defined shape.",
          part: "face",
          importance: 1,
          isDisabled: false,
          type: "head" as TypeEnum,
        },
      ],
      scoresDifference: {
        overall: 0,
        lips: 0,
        grooming: 0,
        eyes: 0,
        skin: 0,
      },
      explanation:
        "# Head analysis Fri Nov 22 2024\n\n## Lips\n- Score: 60\n- Explanation: The lips appear generally smooth but slightly dry. There is no visible cracking, but the texture suggests minimal dryness.\n\n## Grooming\n- Score: 40\n- Explanation: The beard appears somewhat uneven and slightly unkempt, with some stray hairs visible. It doesn't look completely neglected but could use some trimming for a more defined shape.\n\n## Eyes\n- Score: 60\n- Explanation: The images show minimal crow's feet and no significant under-eye bags or dark circles. The skin texture appears generally smooth, indicating a score in the 60-80 range. However, due to the lighting and image quality, a conservative score of 60 is given.\n\n## Skin\n- Score: 60\n- Explanation: The skin appears generally healthy with no significant visible issues. There are no apparent signs of acne or major discoloration. The lighting is not optimal, but the skin seems to have a smooth texture with minor imperfections.\n\n## Conclusion: \n\nThis person should address the following concerns to improve their appearance at this date:\n\n- ungroomed_facial_hair: Your beard appears full and may benefit from grooming to achieve a more defined shape.",
      specialConsiderations: null,
      isPublic: false,
    },
    mouth: null,
    scalp: null,
  },
  body: {
    overall: 0,
    body: null,
  },
  health: {
    overall: 0,
    health: null,
  },
};

const fakeTwo = {
  head: {
    overall: 58,
    face: null,
    mouth: {
      _id: "674053e2967c7f1f90753e46",
      userId: "674033fb1ad895fad61ad0b0",
      type: "head",
      part: "mouth",
      scores: {
        overall: 40,
        mouth: 40,
      },
      demographics: {
        sex: "male",
        ageInterval: "24-30",
        ethnicity: "white",
        skinColor: "fitzpatrick-2",
        skinType: "normal",
      },
      images: [
        {
          position: "mouth",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/tQJSzrdOVuxoYk7jnxu1k.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
            },
          ],
        },
      ],
      initialImages: [
        {
          position: "mouth",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/tQJSzrdOVuxoYk7jnxu1k.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-g9PfZdq0LPJHnBQ_tGgdc.webp",
            },
          ],
        },
      ],
      initialDate: "2024-11-22T09:50:11.953Z",
      createdAt: "2024-11-22T09:50:11.953Z",
      concerns: [
        {
          name: "teeth_discoloration",
          explanation: "Your teeth appear to have a yellowish tint, indicating discoloration.",
          part: "mouth",
          importance: 1,
          isDisabled: false,
          type: "head",
        },
      ],
      scoresDifference: {
        overall: 0,
        mouth: 0,
      },
      explanation:
        "# Head analysis Fri Nov 22 2024\n\n## Mouth\n- Score: 40\n- Explanation: The image is not very clear, but there appears to be some discoloration on the teeth, which could indicate plaque buildup or staining. The gums are not clearly visible, making it difficult to assess their health. Based on the visible teeth, the oral health seems to be in the fair range.\n\n## Conclusion: \n\nThis person should address the following concerns to improve their appearance at this date:\n\n- teeth_discoloration: Your teeth appear to have a yellowish tint, indicating discoloration.",
      specialConsiderations: null,
      isPublic: false,
    },
    scalp: {
      _id: "674053dd967c7f1f90753e45",
      userId: "674033fb1ad895fad61ad0b0",
      type: "head",
      part: "scalp",
      scores: {
        overall: 80,
        scalp: 80,
      },
      demographics: {
        sex: "male",
        ageInterval: "24-30",
        ethnicity: "white",
        skinColor: "fitzpatrick-2",
        skinType: "normal",
      },
      images: [
        {
          position: "scalp",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ocGZNgkY3ENl_Ll5Jo_w9.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
            },
          ],
        },
      ],
      initialImages: [
        {
          position: "scalp" as "eyes",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ocGZNgkY3ENl_Ll5Jo_w9.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
            },
          ],
        },
      ],
      initialDate: "2024-11-22T09:50:11.408Z",
      createdAt: "2024-11-22T09:50:11.408Z",
      concerns: [
        {
          name: "alopecia_areata",
          explanation: "You have noticeable thinning or patchy hair loss on the top of your scalp.",
          part: "scalp",
          importance: 1,
          isDisabled: false,
          type: "head" as TypeEnum,
        },
      ],
      scoresDifference: {
        overall: 0,
        scalp: 0,
      },
      explanation:
        "# Head analysis Fri Nov 22 2024\n\n## Scalp\n- Score: 80\n- Explanation: The scalp appears mostly clear and smooth with no visible flakes or redness. The hair is well-groomed, indicating a healthy scalp condition.\n\n## Conclusion: \n\nThis person should address the following concerns to improve their appearance at this date:\n\n- alopecia_areata: You have noticeable thinning or patchy hair loss on the top of your scalp.",
      specialConsiderations: null,
      isPublic: false,
    },
  },
  body: {
    overall: 0,
    body: null,
  },
  health: {
    overall: 0,
    health: null,
  },
};

const fakeOne = {
  head: {
    overall: 58,
    face: null,
    mouth: null,
    scalp: {
      _id: "674053dd967c7f1f90753e45",
      userId: "674033fb1ad895fad61ad0b0",
      type: "head",
      part: "scalp",
      scores: {
        overall: 80,
        scalp: 80,
      },
      demographics: {
        sex: "male",
        ageInterval: "24-30",
        ethnicity: "white",
        skinColor: "fitzpatrick-2",
        skinType: "normal",
      },
      images: [
        {
          position: "scalp",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ocGZNgkY3ENl_Ll5Jo_w9.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
            },
          ],
        },
      ],
      initialImages: [
        {
          position: "scalp" as "eyes",
          mainUrl: {
            name: "eyes" as "eyes",
            url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
          },
          urls: [
            {
              url: "https://myo-data.nyc3.digitaloceanspaces.com/ocGZNgkY3ENl_Ll5Jo_w9.jpg",
              name: "original" as "eyes",
            },
            {
              name: "eyes" as "eyes",
              url: "https://myo-data.nyc3.digitaloceanspaces.com/MYO-jKyOL4YafuJ5HJuKNZmS1.webp",
            },
          ],
        },
      ],
      initialDate: "2024-11-22T09:50:11.408Z",
      createdAt: "2024-11-22T09:50:11.408Z",
      concerns: [
        {
          name: "alopecia_areata",
          explanation: "You have noticeable thinning or patchy hair loss on the top of your scalp.",
          part: "scalp",
          importance: 1,
          isDisabled: false,
          type: "head" as TypeEnum,
        },
      ],
      scoresDifference: {
        overall: 0,
        scalp: 0,
      },
      explanation:
        "# Head analysis Fri Nov 22 2024\n\n## Scalp\n- Score: 80\n- Explanation: The scalp appears mostly clear and smooth with no visible flakes or redness. The hair is well-groomed, indicating a healthy scalp condition.\n\n## Conclusion: \n\nThis person should address the following concerns to improve their appearance at this date:\n\n- alopecia_areata: You have noticeable thinning or patchy hair loss on the top of your scalp.",
      specialConsiderations: null,
      isPublic: false,
    },
  },
  body: {
    overall: 0,
    body: null,
  },
  health: {
    overall: 0,
    health: null,
  },
};

const fakePotential = {
  head: {
    overall: 88,
    face: {
      overall: 83,
      lips: 85,
      grooming: 80,
      eyes: 80,
      skin: 90,
      explanations: [
        {
          feature: "lips",
          explanation:
            "Your lips currently have a score of 60, showing moderate dryness and slight roughness, but no severe cracking. The natural color indicates some hydration, and the normal elasticity suggests good overall health. With regular use of a high-quality lip balm, gentle exfoliation, and proper hydration and nutrition, your lips could easily reach a score of 85. Given your age, you're in a great position to achieve this, as your body responds well to care and maintenance. Focusing on these areas will help your lips become smoother and more supple, enhancing their appearance and complementing your facial features.",
        },
        {
          feature: "grooming",
          explanation:
            "Your current grooming score of 40 reflects a generally trimmed beard, but with some uneven edges and stray hairs. The full beard looks thick, but the lack of defined edges makes it appear slightly unkempt. The hair on your head is pulled back, which keeps the focus on the beard for grooming. With regular trimming and shaping, your beard could easily reach a score of 80. By maintaining a consistent length and creating well-defined edges, especially around the cheeks and neckline, the beard would look much neater and more polished. Additionally, using beard oil or balm can improve the texture and help manage the stray hairs, giving the beard a healthier appearance. Regular grooming, including combing or brushing, will keep the beard tidy and enhance the overall look. Since you're in your 20s, achieving a well-groomed appearance is definitely within reach with some consistent care and attention.",
        },
        {
          feature: "eyes",
          explanation:
            "Your eyes currently show minimal to no visible wrinkles or lines, with few or no noticeable crow's feet. The skin around your eyes appears generally smooth and firm, though there may be occasional under-eye bags or puffiness, which seem manageable. Dark circles are minimal, and overall, the area looks healthy. Given your age, your skin retains good elasticity and firmness, making it easier to maintain and slightly improve your current condition. With proper hydration, sun protection, and possibly some targeted treatments like eye creams, you could reach a score of 80. However, achieving a score above 80 would be challenging without advanced treatments or surgical intervention, as it would require the complete absence of any visible lines, bags, or dark circles. By focusing on maintaining your current condition and preventing any further signs of aging, you can aim for the higher end of the 60-80 range.",
        },
        {
          feature: "skin",
          explanation:
            "Your skin is currently in great shape, with a smooth texture, even tone, and no signs of sagging or significant imperfections. At your age, you're in an excellent position to maintain and even improve your skin's condition. With some attention to hydration, a balanced diet, and a consistent skincare routine, you could easily reach a score of 90. Your skin's natural resilience means that, while it might not reach perfection, you're already very close to having the best skin possible.",
        },
      ],
    },
    mouth: {
      overall: 80,
      mouth: 80,
      explanations: [
        {
          feature: "mouth",
          explanation:
            "Your mouth currently shows some signs of discoloration on the teeth, which could be due to plaque buildup or staining. The individual teeth are not clearly visible, making it hard to assess for cavities or decay. The gums are also not visible, so their health can't be determined. Overall, your oral health seems to be at a fair level, with occasional issues like early signs of gum disease or minor cavities, which is reflected in your current score of 40. With consistent oral care, including regular brushing, flossing, and dental check-ups, your score could improve to the 60-80 range. At your age, you're in a great position to make these improvements, as your body responds well to good habits. Since there are no permanent structural defects, focusing on hygiene and regular dental visits will significantly enhance your oral health. The key is to maintain consistency in your care routine, which will not only improve your score but also keep your mouth healthy in the long run.",
        },
      ],
    },
    scalp: {
      overall: 100,
      scalp: 100,
      explanations: [
        {
          feature: "scalp",
          explanation:
            "Your scalp looks great! The hair is well-groomed, and there are no visible signs of issues like dandruff or redness. The overall appearance is smooth and even, which is why it currently scores at 80. To reach the highest score of 100, you could maintain your current routine and focus on keeping the scalp hydrated and nourished. Regular gentle cleansing, occasional exfoliation, and a balanced diet will help ensure your scalp stays in excellent condition. But honestly, you're already doing an amazing job!",
        },
      ],
    },
  },
  body: {
    overall: 0,
    body: null,
  },
  health: {
    overall: 0,
    health: null,
  },
};

const fakeCurrentlyHigherThan = {
  head: {
    overall: 0,
    face: 0,
    mouth: 0,
    scalp: 0,
  },
  body: {
    overall: 0,
    body: 0,
  },
  health: {
    overall: 0,
    health: 0,
  },
};

const fakePotentiallyHigherThan = {
  head: {
    overall: 100,
    face: 100,
    mouth: 0,
    scalp: 0,
  },
  body: {
    overall: 0,
    body: 0,
  },
  health: {
    overall: 0,
    health: 0,
  },
};

const fakeConcerns = [
  {
    name: "ungroomed_facial_hair",
    explanation:
      "Your beard appears full and may benefit from grooming to achieve a more defined shape.",
    part: "face",
    importance: 1,
    isDisabled: false,
    type: "head",
  },
  {
    name: "teeth_discoloration",
    explanation: "Your teeth appear to have a yellowish tint, indicating discoloration.",
    part: "mouth",
    importance: 1,
    isDisabled: false,
    type: "head",
  },
  {
    name: "alopecia_areata",
    explanation: "You have noticeable thinning or patchy hair loss on the top of your scalp.",
    part: "scalp",
    importance: 1,
    isDisabled: false,
    type: "head",
  },
];

export default function AnalysisCarousel({ type }: Props) {
  const { status, userDetails } = useContext(UserContext);
  const {
    _id: userId,
    demographics,
    // concerns,
    // potential,
    // latestProgress,
    latestStyleAnalysis,
    // currentlyHigherThan,
    // potentiallyHigherThan,
  } = userDetails || {};

  const { ageInterval } = demographics || {};

  const latestProgress = fakeSix;
  const potential = fakePotential;
  const currentlyHigherThan = fakeCurrentlyHigherThan;
  const potentiallyHigherThan = fakePotentiallyHigherThan;
  const concerns = fakeConcerns;

  const progressRecord = latestProgress?.[type as "head"];
  const potentialRecord = potential?.[type as "head"];
  const styleAnalysis = latestStyleAnalysis?.[type as "head"];

  const getSlides = useCallback(() => {
    const analysisCard = (
      <Carousel.Slide key={"analysisCard"}>
        {progressRecord && (
          <AnalysisCard record={progressRecord} title={`Current ${type} analysis`} />
        )}
      </Carousel.Slide>
    );

    const analysisPotentialCard = (
      <Carousel.Slide key={"analysisCardPotential"}>
        {potentialRecord && progressRecord && (
          <AnalysisCardPotential
            currentRecord={progressRecord}
            potentialRecord={potentialRecord}
            title={`Potential ${type}`}
          />
        )}
      </Carousel.Slide>
    );

    const typeCurrentlyHigherThan = currentlyHigherThan && currentlyHigherThan[type as "head"];

    const currentBetterCard = (
      <Carousel.Slide key={"currentBetterThanCard"}>
        {progressRecord && typeCurrentlyHigherThan && (
          <BetterThanCard
            userId={userId}
            ageInterval={ageInterval}
            progressRecord={progressRecord}
            currentlyHigherThan={typeCurrentlyHigherThan}
            type={type as TypeEnum}
            title={`Current ${type} statistics`}
          />
        )}
      </Carousel.Slide>
    );

    const typePotentiallyHigherThan =
      potentiallyHigherThan && potentiallyHigherThan[type as "head"];

    const potentialBetterCard = (
      <Carousel.Slide key={"potentialBetterCard"}>
        {potentialRecord && typePotentiallyHigherThan && (
          <BetterThanCardPotential
            userId={userId}
            ageInterval={ageInterval}
            potentialRecord={potentialRecord}
            potentiallyHigherThan={typePotentiallyHigherThan}
            type={type as TypeEnum}
            authStatus={status}
            title={`Potential ${type} statistics`}
          />
        )}
      </Carousel.Slide>
    );

    const concernsCard = (
      <Carousel.Slide key={"concernsCard"}>
        {concerns && <ConcernsCard concerns={concerns} title="Areas of improvement" type={type} />}
      </Carousel.Slide>
    );

    const slides = [
      analysisCard,
      analysisPotentialCard,
      currentBetterCard,
      potentialBetterCard,
      concernsCard,
    ];

    return slides;
  }, [
    typeof progressRecord,
    typeof potentialRecord,
    typeof currentlyHigherThan,
    typeof potentiallyHigherThan,
    typeof concerns,
    userId,
    status,
    type,
  ]);

  const slides = useMemo(() => getSlides(), [progressRecord, styleAnalysis]);

  return (
    <Stack className={classes.container}>
      {progressRecord && (
        <Carousel
          align="start"
          slideGap={16}
          slidesToScroll={1}
          classNames={{
            root: classes.root,
            controls: classes.controls,
            control: classes.control,
            viewport: classes.viewport,
            container: classes.container,
          }}
        >
          {slides}
        </Carousel>
      )}
    </Stack>
  );
}
