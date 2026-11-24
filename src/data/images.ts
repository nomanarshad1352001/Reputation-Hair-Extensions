/// <reference types="vite/client" />
// Brand imagery registry. Every asset is original to Reputation (generated for this build),
// exported as WebP. On Shopify these map to theme-editor image pickers served via the CDN with srcset.
import hero from "@/assets/img/hero.webp";
import heroMobile from "@/assets/img/hero-mobile.webp";
import catWeft from "@/assets/img/cat-weft.webp";
import catWigs from "@/assets/img/cat-wigs.webp";
import catClosures from "@/assets/img/cat-closures.webp";
import catFrontals from "@/assets/img/cat-frontals.webp";
import pStraightBlack from "@/assets/img/p-straight-black.webp";
import pWaveBrown from "@/assets/img/p-wave-brown.webp";
import pStraightBlonde from "@/assets/img/p-straight-blonde.webp";
import pCurlyBlack from "@/assets/img/p-curly-black.webp";
import pWig from "@/assets/img/p-wig.webp";
import pClosure from "@/assets/img/p-closure.webp";
import pFrontal from "@/assets/img/p-frontal.webp";
import pPlatinum from "@/assets/img/p-platinum.webp";
import ugc1 from "@/assets/img/ugc-1.webp";
import ugc2 from "@/assets/img/ugc-2.webp";
import ugc3 from "@/assets/img/ugc-3.webp";
import ugc4 from "@/assets/img/ugc-4.webp";
import edCare from "@/assets/img/ed-care.webp";
import edSalon from "@/assets/img/ed-salon.webp";
import edStreet from "@/assets/img/ed-street.webp";
import edBox from "@/assets/img/ed-box.webp";
import mission from "@/assets/img/mission.webp";
import owners from "@/assets/img/owners.webp";

export const IMG = {
  hero,
  heroMobile,
  catWeft,
  catWigs,
  catClosures,
  catFrontals,
  pStraightBlack,
  pWaveBrown,
  pStraightBlonde,
  pCurlyBlack,
  pWig,
  pClosure,
  pFrontal,
  pPlatinum,
  ugc1,
  ugc2,
  ugc3,
  ugc4,
  edCare,
  edSalon,
  edStreet,
  edBox,
  mission,
  owners,
} as const;

export type ImgKey = keyof typeof IMG;

export const ALT: Record<ImgKey, string> = {
  hero: "Model looking over her shoulder with waist-length glossy body-wave hair against a blush backdrop",
  heroMobile: "Model looking over her shoulder with waist-length glossy body-wave hair",
  catWeft: "Model in profile with long, bone-straight black weft extensions",
  catWigs: "Model wearing a middle-part lace front wig with voluminous chestnut curls",
  catClosures: "Close-up of a sleek middle-part closure install with straight dark hair",
  catFrontals: "Model in profile showing a natural lace frontal hairline with deep-wave hair",
  pStraightBlack: "Straight natural black hair weft bundle on a blush surface",
  pWaveBrown: "Body-wave dark brown hair weft bundle on a blush surface",
  pStraightBlonde: "Straight honey blonde hair weft bundle on a blush surface",
  pCurlyBlack: "Deep-wave natural black hair weft bundle on a blush surface",
  pWig: "Body-wave dark brown lace front wig on a white display stand",
  pClosure: "4x4 lace closure with a middle part and straight black hair",
  pFrontal: "Ear-to-ear lace frontal with wavy black hair",
  pPlatinum: "Straight platinum blonde hair weft bundle on a blush surface",
  ugc1: "Customer selfie with honey blonde body-wave hair",
  ugc2: "Customer selfie in a car with long sleek black hair",
  ugc3: "Customer laughing outdoors with long deep-curly hair",
  ugc4: "Customer in a café with a layered chestnut blowout",
  edCare: "Comb, bristle brush, silk scrunchie and serum on blush silk",
  edSalon: "Stylist hand-sewing a weft into a client's hair",
  edStreet: "Woman walking down a city street with long wavy brown hair",
  edBox: "Hair bundle tied with black ribbon in a black gift box with blush tissue",
  mission: "Three women with different hair textures laughing together on a sofa",
  owners: "Liv and Kathy, the mother-and-daughter founders of Reputation, standing together in a bright room",
};
