type Role = "programmer" | "artist" | "sound" | "money";

export type ParticipantSeedData = {
  username: string;
  roles: Role[];
  bio: string;
  skills: { skill: string }[];
  lookingForTeam: boolean;
  discordHandle: string;
  portfolio?: {
    title: string;
    description?: string;
    videoUrl?: string;
    url?: string;
  }[];
};

export const participantsData: ParticipantSeedData[] = [
  {
    username: "alex_dev",
    roles: ["programmer"],
    bio: "Gameplay programmer with a soft spot for movement mechanics. Shipped two s&box prototypes, both janky, both fun.",
    skills: [{ skill: "C#" }, { skill: "Networking" }, { skill: "Physics" }],
    lookingForTeam: true,
    discordHandle: "alex_dev",
    portfolio: [
      {
        title: "Grapple Rush",
        description: "Movement shooter prototype built in a weekend. Grappling hook, wall running, way too much screen shake.",
        url: "https://sbox.game",
      },
    ],
  },
  {
    username: "sam_pixels",
    roles: ["artist"],
    bio: "2D/3D artist. I do stylized low-poly with hand-painted textures. Happy to own the entire art pipeline for a small team.",
    skills: [{ skill: "Blender" }, { skill: "Substance Painter" }, { skill: "Hand-painted textures" }],
    lookingForTeam: true,
    discordHandle: "sampixels",
    portfolio: [
      {
        title: "Low-poly environment pack",
        description: "A set of modular village assets I made for practice.",
      },
    ],
  },
  {
    username: "riley_3d",
    roles: ["artist"],
    bio: "Character modeler and animator. Rigging is my happy place.",
    skills: [{ skill: "Character modeling" }, { skill: "Rigging" }, { skill: "Animation" }],
    lookingForTeam: true,
    discordHandle: "riley3d",
  },
  {
    username: "casey_sound",
    roles: ["sound"],
    bio: "Composer and sound designer. I can turn around a full ambience + SFX pass in a jam weekend.",
    skills: [{ skill: "FMOD" }, { skill: "Composition" }, { skill: "Foley" }],
    lookingForTeam: true,
    discordHandle: "caseysound",
  },
  {
    username: "morgan_net",
    roles: ["programmer"],
    bio: "Multiplayer/netcode specialist. If your jam game desyncs, I'm the person you wish you had.",
    skills: [{ skill: "C#" }, { skill: "Netcode" }, { skill: "Server infrastructure" }],
    lookingForTeam: false,
    discordHandle: "morgannet",
  },
  {
    username: "quinn_vfx",
    roles: ["artist"],
    bio: "VFX and shaders. Explosions, portals, water — the shiny stuff.",
    skills: [{ skill: "Shaders" }, { skill: "Particles" }, { skill: "HLSL" }],
    lookingForTeam: true,
    discordHandle: "quinnvfx",
  },
  {
    username: "avery_ui",
    roles: ["artist"],
    bio: "UI/UX designer who codes. Razor components don't scare me.",
    skills: [{ skill: "UI design" }, { skill: "Razor" }, { skill: "Figma" }],
    lookingForTeam: true,
    discordHandle: "averyui",
  },
  {
    username: "taylor_sys",
    roles: ["programmer"],
    bio: "Systems designer-programmer. I like economies, progression loops, and spreadsheets.",
    skills: [{ skill: "C#" }, { skill: "Systems design" }, { skill: "Balancing" }],
    lookingForTeam: false,
    discordHandle: "taylorsys",
  },
  {
    username: "drew_anim",
    roles: ["artist"],
    bio: "Animator, mostly characters. First jam, eager to learn the s&box pipeline.",
    skills: [{ skill: "Animation" }, { skill: "Blender" }],
    lookingForTeam: true,
    discordHandle: "drewanim",
  },
  {
    username: "jamie_words",
    roles: ["money"],
    bio: "Narrative designer. I write barks, lore, and the tutorial text nobody reads.",
    skills: [{ skill: "Narrative design" }, { skill: "Dialogue" }],
    lookingForTeam: true,
    discordHandle: "jamiewords",
  },
];
