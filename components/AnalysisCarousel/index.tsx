//@ts-nocheck

import React, { useContext, useMemo } from "react";
import { Carousel } from "@mantine/carousel";
import { Stack } from "@mantine/core";
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

export default function AnalysisCarousel({ type }: Props) {
  const { status, userDetails } = useContext(UserContext);
  const {
    _id: userId,
    potential,
    // latestProgress,
    latestStyleAnalysis,
    currentlyHigherThan,
    potentiallyHigherThan,
  } = userDetails || {};

  const latestProgress = fakeSix;

  const progressRecord = latestProgress?.[type as "head"];
  const potentialRecord = potential?.[type as "head"];
  const styleAnalysis = latestStyleAnalysis?.[type as "head"];

  function getSlides() {
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
            progressRecord={progressRecord}
            currentlyHigherThan={typeCurrentlyHigherThan}
            type={type as TypeEnum}
            title={`Current ${type}`}
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
            potentialRecord={potentialRecord}
            potentiallyHigherThan={typePotentiallyHigherThan}
            type={type as TypeEnum}
            authStatus={status}
            title={`Potential ${type}`}
          />
        )}
      </Carousel.Slide>
    );

    // const slides = [analysisCard, analysisPotentialCard, currentBetterCard, potentialBetterCard];

    const slides = [analysisCard];
    return slides;
  }

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
