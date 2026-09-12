/**
 * Resolve public asset paths (handles spaces and special characters).
 */
export function assetPath(...segments) {
  return `/assets/${segments.map((s) => encodeURIComponent(s)).join("/")}`;
}

/**
 * Asset map.
 *
 * Folder names mirror the design-handoff folders in `Site Icon & Images/`
 * one-to-one so every image stays traceable to its source:
 *
 *   Better Sleep        -> Home            (Frame 3786-3790)
 *   More than sleep     -> About           (Frame 3791-3795)
 *   A Better Tommrrow   -> Why Avalon      (Frame 3796-3799)
 *   Sleep Beyond        -> Mattresses      (Frame 3800-3803)
 *   We're here          -> Contact         (Frame 3804-3805)
 *   Knowledge for       -> Resources       (Frame 3806)
 *   Feel the Difference -> Try Before You Buy
 *   Experience Avalon   -> Find a Dealer
 *   Partner for brighter-> Become a Dealer
 *   Description Page    -> Product detail
 *   Listing Page        -> Product catalogue
 *
 * Several hero images have the white diagonal wedge (and in some cases the
 * wall lettering) *baked into the bitmap*. Those are flagged `bakedDiagonal`
 * below — do NOT layer the `.hero-diagonal` CSS overlay on top of them.
 */

const BETTER_SLEEP = "Better Sleep";
const MORE_THAN_SLEEP = "More than sleep";
const A_BETTER_TOMORROW = "A Better Tommrrow";
const SLEEP_BEYOND = "Sleep Beyond";
const WERE_HERE = "We're here";
const KNOWLEDGE_FOR = "Knowledge for";

export const assets = {
  brand: {
    logo: "/logo.png",
    /** Full-screen intro (`public/splash.mp4`) */
    splashVideo: "/splash.mp4",
  },

  products: {
    prince: "/products/1000276743.jpg",
    king: "/products/1000276739.jpg",
    brittany: "/products/1000276747.jpg",
    celeste: "/products/1000276737.jpg",
    prada: "/products/1000276735.jpg",
    lilly: "/products/lilly.jpg",
    magna: "/products/1000276749.jpg",
    elita: "/products/1000276745.jpg",
    belle: "/products/1000276741.jpg",
    layers: {
      prince: "/products/layers/prince.jpg",
      king: "/products/layers/king.jpg",
      brittany: "/products/layers/brittany.jpg",
      celeste: "/products/layers/celeste.jpg",
      prada: "/products/layers/prada.jpg",
      lilly: "/products/layers/lilly.jpg",
      magna: "/products/layers/magna.jpg",
      elita: "/products/layers/elita.jpg",
      belle: "/products/layers/belle.jpg",
    },
  },

  /** Home — "Better Sleep" folder */
  home: {
    /** Hero: bedroom, arched window, mountains. Diagonal baked in; wall
     *  lettering is NOT baked and is overlaid in markup. */
    hero: assetPath(BETTER_SLEEP, "Frame 3786.webp"),
    /** "More Than Just a Mattress" — woman sleeping */
    moreThanMattress: assetPath(BETTER_SLEEP, "Frame 3787.webp"),
    /** "Quality in Every Detail" — grayscale production floor thumbnail */
    manufacturing: assetPath(BETTER_SLEEP, "Frame 3788.webp"),
    manufacturingVideo: "/Manufacturing_process.mp4",
    /** "Find a Showroom Near You" — showroom interior (left half) */
    findShowroom: assetPath(BETTER_SLEEP, "Frame 3789.webp"),
    /** India map with pins + baked dark tooltip chip (right half) */
    indiaMap: assetPath(BETTER_SLEEP, "Frame 3790.webp"),
    /** Couches category — `public/assets/Home/crouches.png` */
    couches: assetPath("Home", "crouches.png"),
    couch: assetPath("Home", "crouches.png"),
    sofa: assetPath("Home", "sofa.png"),
    chair: assetPath("Home", "chair.png"),
    excellence: assetPath(BETTER_SLEEP, "Excellence.svg"),
    healthier: assetPath(BETTER_SLEEP, "Healthier.svg"),
  },

  /** About — Frames 3791–3795 (also under `More than sleep/` in handoff) */
  about: {
    hero: "/assets/about/hero.webp",
    heroBakedDiagonal: true,
    storyCollage: "/assets/about/story.webp",
    manufacturing: "/assets/about/manufacturing.webp",
    sustainabilityBand: "/assets/about/sustainability.webp",
    completeComfort: "/assets/about/comfort.webp",
    purpose: assetPath(MORE_THAN_SLEEP, "ep_setting.svg"),
  },

  /** Why Avalon — Frames 3796–3799 (+ shared hero 3793) */
  whyAvalon: {
    hero: "/assets/about/hero.webp",
    heroBakedDiagonal: true,
    ctaBand: "/assets/why-avalon/cta.webp",
    healthierPlanet: "/assets/why-avalon/healthier-planet.webp",
    betterLiving: "/assets/why-avalon/better-living.webp",
    storySketch: "/assets/why-avalon/story-sketch.webp",
    belief: "/assets/why-avalon/belief.webp",
    home: assetPath(A_BETTER_TOMORROW, "ant-design_home-outlined.svg"),
    infinity: assetPath(A_BETTER_TOMORROW, "cil_infinity.svg"),
    globe: assetPath(A_BETTER_TOMORROW, "f7_globe.svg"),
    layers: assetPath(A_BETTER_TOMORROW, "glyphs_layer-group.svg"),
    leaf: assetPath(A_BETTER_TOMORROW, "lsicon_leaf-outline.svg"),
  },

  /** Mattresses — "Sleep Beyond" folder */
  mattresses: {
    /** Frame 3802 was not in the handoff; the reference hero is the same
     *  bedroom plate as About / Why Avalon (Frame 3793). */
    hero: assetPath(MORE_THAN_SLEEP, "Frame 3793.webp"),
    heroBakedDiagonal: true,
    /** "Not Sure Which Mattress is for You?" — bedroom corner (right) */
    /** Served from `/assets/mattresses/` (no spaces — reliable with `next/image`). */
    guide: "/assets/mattresses/guide.webp",
    /** "Compare Mattresses" — split plate, labels + toggle baked in */
    compare: assetPath(SLEEP_BEYOND, "Frame 3801.webp"),
    /** "Every Mattress A Healthier Tomorrow" — quilting close-up (left) */
    detail: "/assets/mattresses/detail.webp",
    moon: assetPath(SLEEP_BEYOND, "solar_moon-sleep-linear.svg"),
  },

  /** Contact — Frames 3804–3805 */
  contact: {
    hero: "/assets/contact/hero.webp",
    heroBakedDiagonal: true,
    office: "/assets/contact/office.webp",
    /** Bedroom plate for bottom CTA band */
    ctaBedroom: "/assets/contact/cta-bedroom.webp",
    messageStar: assetPath(WERE_HERE, "boxicons_message-circle-star.svg"),
    messageDots: assetPath(WERE_HERE, "mynaui_message-dots.svg"),
  },

  /** Resources — "Knowledge for" folder */
  resources: {
    /** Hero: bedside books. Diagonal baked in. */
    hero: assetPath(KNOWLEDGE_FOR, "Frame 3806.webp"),
    heroBakedDiagonal: true,
    video: assetPath(KNOWLEDGE_FOR, "ant-design_video-camera-outlined.svg"),
    download: assetPath(KNOWLEDGE_FOR, "clarity_download-line.svg"),
    chatHelp: assetPath(KNOWLEDGE_FOR, "fluent_chat-help-24-regular.svg"),
    /** Product / brand videos (`public/*.mp4`) */
    avalonDifference: "/avalon_diffrence.mp4",
    feelBetter: "/feel_better.mp4",
    manufacturing: "/Manufacturing_process.mp4",
  },

  listing: {
    hero: assetPath("Listing Page", "image_ec082f5e.jpg"),
    support: assetPath("Listing Page", "ix_support.svg"),
    delivery: assetPath("Listing Page", "carbon_delivery-truck.svg"),
    shield: assetPath("Listing Page", "material-symbols-light_shield-rounded.svg"),
    heart: assetPath("Listing Page", "bx_heart.svg"),
    leaf: assetPath("Listing Page", "bx_leaf.svg"),
    grid: assetPath("Listing Page", "boxicons_grid-filled.svg"),
    list: assetPath("Listing Page", "ant-design_bars-outlined.svg"),
    arrowDown: assetPath("Listing Page", "akar-icons_arrow-down.svg"),
    tick: assetPath("Listing Page", "tick-square_svgrepo.com.svg"),
  },

  findDealer: {
    hero: assetPath("FindADealer", "Hero.webp"),
    bottom: assetPath("FindADealer", "Bottom.webp"),
    map: assetPath("FindADealer", "ChatGPT Image Sep 7, 2026, 10_31_39 PM.png"),
    search: assetPath("FindADealer", "akar-icons_search.svg"),
    location: assetPath("FindADealer", "boxicons_location.svg"),
    shop: assetPath("FindADealer", "solar_shop-2-bold.svg"),
    message: assetPath("FindADealer", "eva_message-square-fill.svg"),
    shield: assetPath("FindADealer", "material-symbols-light_shield-rounded.svg"),
    buildings: assetPath("FindADealer", "solar_buildings-3-line-duotone.svg"),
    bell: assetPath("FindADealer", "bi_bell.svg"),
    plus: assetPath("FindADealer", "plus.svg"),
    minus: assetPath("FindADealer", "minus.svg"),
    arrow: assetPath("FindADealer", "akar-icons_arrow-right.svg"),
    phone: assetPath("FindADealer", "eva_phone-call-outline.svg"),
    email: assetPath("FindADealer", "fontisto_email.svg"),
    instagram: assetPath("FindADealer", "lets-icons_insta.svg"),
    facebook: assetPath("FindADealer", "bxl_facebook.svg"),
    youtube: assetPath("FindADealer", "basil_youtube-solid.svg"),
    linkedin: assetPath("FindADealer", "cib_linkedin-in.svg"),
    gridLocation: assetPath("FindADealer", "gridicons_location.svg"),
  },

  singleProduct: {
    main: assetPath("SingleProduct Page", "Frame 3775.webp"),
    gallery1: assetPath("SingleProduct Page", "Frame 3779.webp"),
    gallery2: assetPath("SingleProduct Page", "Frame 3780.webp"),
    lifestyle: assetPath("SingleProduct Page", "Frame 3781.webp"),
    pocketSpring: assetPath("SingleProduct Page", "pocket spring.svg"),
    breathable: assetPath("SingleProduct Page", "breathable fabric.svg"),
    pressure: assetPath("SingleProduct Page", "pressure relief.svg"),
    motion: assetPath("SingleProduct Page", "motion.svg"),
    spinal: assetPath("SingleProduct Page", "spinal.svg"),
    durability: assetPath("SingleProduct Page", "durablity.svg"),
    sizeGuide: assetPath("SingleProduct Page", "matress size guide.svg"),
    star: assetPath("SingleProduct Page", "ant-design_star-filled.svg"),
    share: assetPath("SingleProduct Page", "basil_share-outline.svg"),
  },

  tryBeforeYouBuy: {
    hero: assetPath("Try Before You Buy", "Frame 3782.webp"),
    showroom: assetPath("Try Before You Buy", "Frame 3783.webp"),
    bedroom: assetPath("Try Before You Buy", "Frame 3784.webp"),
    bed: assetPath("Try Before You Buy", "famicons_bed-outline.svg"),
    users: assetPath("Try Before You Buy", "heroicons_users.svg"),
    usersAlt: assetPath("Try Before You Buy", "heroicons_users-1.svg"),
    calendar: assetPath("Try Before You Buy", "famicons_calendar-clear-outline.svg"),
    tick: assetPath("Try Before You Buy", "charm_circle-tick.svg"),
  },

  becomeDealer: {
    hero: assetPath("FindADealer", "Hero.webp"),
    handshakePhoto: assetPath("Partner for brighter", "Frame 3785.webp"),
    trophy: assetPath("Partner for brighter", "lineicons_trophy-1.svg"),
    diamond: assetPath("Partner for brighter", "grommet-icons_diamond.svg"),
    graph: assetPath("Partner for brighter", "streamline-plump_graph-bar-increase-remix.svg"),
    trophyBold: assetPath("Partner for brighter", "glyphs_trophy-bold.svg"),
    mail: assetPath("Partner for brighter", "ci_mail.svg"),
    document: assetPath("Partner for brighter", "famicons_document-text-outline.svg"),
    handshake: assetPath("Partner for brighter", "fa_handshake-o.svg"),
    trending: assetPath("Partner for brighter", "fluent_arrow-trending-lines-24-filled.svg"),
    service: assetPath("Partner for brighter", "ri_customer-service-2-line.svg"),
    vector: assetPath("Partner for brighter", "image 198 [Vectorized].svg"),
  },
};

/** Shared dark CTA band background used across Home, Why Avalon and Mattresses. */
export const ctaBandImage = assets.whyAvalon.ctaBand;
