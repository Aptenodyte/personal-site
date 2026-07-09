/**
 * ───────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — edit this file to make the site yours.
 *  Everything from your name and bio to your work history lives here, so you
 *  never have to dig through page components to update content.
 * ───────────────────────────────────────────────────────────────────────────
 */

export type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  stack: string[];
};

export type Project = {
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
};

export const site = {
  name: "Hamza Ghaffari",
  firstName: "Hamza",
  initials: "HG",
  username: "aptenodyte",
  role: "Computer Science Student",
  // Short, punchy line shown under your name on the homepage hero.
  tagline:
    "I'm a CS student at UT Dallas interested in cybersecurity and digital privacy. I like to dig into how things work, why they work the way they do, and how we can make them better.",
  // One-line summary used in metadata and footers.
  summary:
    "Computer Science student at UT Dallas focused on cybersecurity, digital privacy, and secure systems.",
  email: "hamzasghaffari@gmail.com",
  location: "Chicago, IL",

  socials: [
    { label: "GitHub", href: "https://github.com/Aptenodyte", icon: "github" as const },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/hamza-s-ghaffari/", icon: "linkedin" as const },
    { label: "Email", href: "mailto:hamzasghaffari@gmail.com", icon: "mail" as const },
  ],

  // Flat list shown in the scrolling marquee on the homepage.
  skills: [
    "TypeScript", "Python", "JavaScript", "C", "C++", "Java",
    "React", "Vue", "Nuxt", "Node.js", "Tailwind", "Linux",
    "OpenCV", "Prisma", "Redis",
  ],

  // Categorized skills, shown on the About page (from resume).
  skillGroups: [
    {
      label: "Security & Systems",
      items: ["JWT", "Magic Links", "Access Control", "Linux", "Threat Modeling"],
    },
    {
      label: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "C", "C++", "Java", "HTML", "CSS"],
    },
    {
      label: "Frameworks & Tools",
      items: ["Node.js", "React", "Vue", "Nuxt", "Tailwind", "Bootstrap", "Redis", "Prisma"],
    },
  ],

  about: {
    intro:
      "I'm a CS student at UT Dallas. The more I learn about how systems work, the more I want to poke at how they break, and what they're quietly doing with people's data along the way. I found my niche of interest in computer science to be focusing on security and privacy, and they're what I keep coming back to.",
    body: [
      "What I really like is the offensive side of security. Not in a malicious way, but the curiosity of it. You take something that's supposed to be locked down and figure out how it actually behaves when you push on it, feed it weird input, or look at it the way someone trying to break in would. Reverse engineering is a big part of that for me. Taking something compiled, or a protocol you're not supposed to see inside of, and slowly piecing together what it's actually doing. There's something satisfying about finding a flaw before anyone else does, and then knowing how to actually fix it.",
      "I'm into the building-up side too, especially authentication and access control. How do you let the right people in and keep the wrong ones out, without making it a pain to use? How do you handle permissions so a mistake doesn't snowball into a breach? That stuff is harder than it looks, and I find it really interesting to think through.",
      "Privacy matters a lot to me too, and I don't think you can really separate it from security. Keeping someone out of a system is one thing. Asking whether the system should even be holding that data in the first place is a different, harder question. I think a lot about what gets collected, what gets logged, what sticks around long after it needs to, and whether any of that actually has to be there. I'm also pretty firmly against mass surveillance. The idea that people should have to give up their privacy by default, just because the technology exists to watch everything, doesn't sit right with me. The systems we build make a lot of this possible, which means they can also push back on it.",
      "When I'm not staring at a screen, I've got a few things that keep me sane. I'm a huge trivia nerd and will get unnecessarily competitive about it. I read a lot of history and can go down a rabbit hole about basically any era. And I play way too much Mario Kart — Wii and 8 are both great, and yes I take it personally.",
      "I'm always down to talk about security, privacy, CTFs, history, or whatever you're working on. Say hi anytime.",
    ],
    focuses: [
      {
        title: "Security engineering",
        body: "Authentication, access control, and permissions. How do you let the right people in and keep the wrong ones out, without making it painful to use?",
      },
      {
        title: "Digital privacy",
        body: "Questioning whether a system should hold data in the first place. What gets collected, what gets logged, and whether any of it has to be there.",
      },
      {
        title: "Offensive security & RE",
        body: "Poking at something locked down to see how it behaves, and reverse engineering compiled binaries or protocols to figure out what they're actually doing.",
      },
    ],
    education: {
      school: "The University of Texas at Dallas",
      degree: "B.S. in Computer Science",
      period: "Expected May 2027",
      gpa: "3.76",
      detail:
        "Coursework: Data Structures & Algorithms, UNIX Systems Programming, Software Engineering, Digital Logic, Database Systems, Intro to Machine Learning, Cyber Attack & Defense Lab, Advanced Algorithms.",
      honors:
        "National Merit Scholarship Recipient · Dean's List (Spring 2024, Fall 2025)",
    },
  },

  experiences: [
    {
      role: "Student Researcher",
      company: "VR-Physical Proving Ground Lab",
      period: "Sep 2025 — Present",
      location: "Richardson, TX",
      description:
        "Computer vision and autonomous systems research, supervised by Dr. Zejiang Wang.",
      highlights: [
        "Built a camera positioning system with OpenCV and AprilTag pose detection in Python — 98% success rate.",
        "Wrote a custom DDS receiver as a Donkeycar part so a Waveshare RC car could take remote driving commands — 95% success rate.",
        "Worked with 5 other lab members to ship a working MVP before the semester deadline.",
      ],
      stack: ["Python", "OpenCV", "AprilTag", "DDS", "Donkeycar"],
    },
    {
      role: "IT Support Intern",
      company: "Glenbard School District 87",
      period: "May — Aug 2022",
      location: "Glen Ellyn, IL",
      description:
        "Deploying devices, fixing network issues, and handling support tickets across the district.",
      highlights: [
        "Deployed and replaced 300+ devices across the district so classrooms stayed up and running.",
        "Troubleshot network issues and did routine maintenance to keep a 99.95% uptime on connected devices.",
        "Closed 34 help desk tickets and helped faculty get comfortable with their classroom tech.",
      ],
      stack: ["Networking", "Hardware", "Help Desk"],
    },
  ] satisfies Experience[],

  projects: [
    {
      name: "Guidepoint",
      tagline: "Indoor navigation system for visually impaired users",
      description:
        "A navigation aid combining classical pathfinding with real-time object detection.",
      highlights: [
        "Implemented A* pathfinding with an optimal heuristic, ensuring a 99% selection of the shortest path.",
        "Developed a quantized TFLite VPS model using YOLOv8 segmentation with 77.6% precision.",
        "Optimized the JSON map schema, leading to a 5–10x reduction in stored map size.",
      ],
      stack: ["Python", "YOLOv8", "TFLite", "A*"],
    },
    {
      name: "IDLE",
      tagline: "Automated data collection & idle detection for a race car",
      description:
        "A telemetry pipeline that detects a race car's idle state and automates data capture.",
      highlights: [
        "Built a Python pipeline to deserialize CAN bus data into a Redis stream, processing 10,000+ ECU signals/sec.",
        "Developed a 98%-accurate algorithm to detect an F1 car's idle state, automating data collection.",
        "Improved analysis reliability by 40% by automating collection start/stop and removing human error.",
      ],
      stack: ["Python", "Redis", "CAN Bus"],
    },
    {
      name: "Noble Award",
      tagline: "Award site for recognizing people doing good in their community",
      description:
        "A nomination platform with passwordless, role-based auth and email integration.",
      highlights: [
        "Built role-based auth with JWT and magic links, so admins and users only see what they should — and no passwords get stored.",
        "Created the nomination workflow in Vue + Tailwind, with a Prisma/MySQL backend, Nuxt/Nitro, and AWS SES for email.",
        "Ran Agile sprints with the client and hit 100% of their requirements ahead of schedule.",
      ],
      stack: ["Vue", "Nuxt", "Tailwind", "Prisma", "MySQL", "AWS SES"],
    },
    {
      name: "Quickdraw",
      tagline: "Preparation tool for an online web game",
      description:
        "A web app that automates Excel parsing to cut game setup from 1.5 hours to minutes.",
      highlights: [
        "Built a web app in TypeScript, Bootstrap, and SheetJS to automate Excel parsing for 30,000+ entries.",
        "Reduced game prep time from 1.5 hours to 10 minutes, eliminating manual analysis of 1,000+ rows.",
        "Adopted by 50+ players in the community as the standard tool for game setup.",
      ],
      stack: ["TypeScript", "Bootstrap", "SheetJS"],
    },
  ] satisfies Project[],

  // Cover palettes for blog posts.
  accents: ["vermilion", "ink", "forest", "ochre", "plum", "cobalt"] as const,
} as const;

export type Accent = (typeof site.accents)[number];

/** Solid cover colour per accent name. */
export const accentSolid: Record<Accent, string> = {
  vermilion: "#ff4a1c",
  ink: "#1a1611",
  forest: "#2f5d3a",
  ochre: "#c98a1e",
  plum: "#6b3b66",
  cobalt: "#2c4fb8",
};

/** Hex fallback used for inline styles / CSS variables. */
export const accentHex: Record<string, string> = {
  vermilion: "#ff4a1c",
  ink: "#1a1611",
  forest: "#2f5d3a",
  ochre: "#c98a1e",
  plum: "#6b3b66",
  cobalt: "#2c4fb8",
  blue: "#2c4fb8",
};
