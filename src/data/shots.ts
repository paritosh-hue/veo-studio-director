import { ShotData } from '../types';

export const SHOTS_DATA: ShotData[] = [
  {
    id: 1,
    title: "The Hook",
    subtitle: "High-voltage opening statement & federal intelligence seals",
    durationStr: "0:00 - 0:04",
    startTime: 0,
    endTime: 4,
    veoPrompt: `Cinematic 3D animation, dark minimal background. Bold electric cyan text rapidly flashing on screen: "How to build a billion-dollar AI for $5 million." Fast montage cut to glowing, official-looking government seals of the NSA, CISA, and FBI pulsing with a subtle neon digital border. Sleek motion graphics, macro lens, dramatic studio lighting.`,
    audioPrompt: `Low, tense digital hum building into a sharp alert tone, followed by a crisp authoritative voiceover announcing the warning.`,
    voiceover: `"Warning: How to build a billion-dollar AI... for five million dollars."`,
    keyEntities: ["NSA Seal", "CISA Seal", "FBI Seal", "$1,000,000,000 vs $5,000,000"],
    visualKeywords: ["Electric Cyan", "Macro Lens", "Government Seals", "Digital Neon Border", "Dramatic Studio Lighting"],
    cameraMotion: "Crash zoom into rapid typographic cuts with macro shallow depth of field",
    lightingStyle: "Rim-lit volumetric cyans, pitch black specular studio backdrop",
    colorGrade: "Deep Onyx (#080b10) with High-Luminance Electric Cyan (#00F0FF) & Alert Crimson (#FF3366)",
    soundDesignStems: [
      "55Hz Sub-Bass Drone",
      "Rising High-Pass Resonant Filter",
      "Dual Harmonic Alert Beep (880Hz / 440Hz)",
      "Authoritative Voiceover Transient"
    ],
    directorNotes: "Designed to arrest immediate attention within the first 3 seconds of swipe feed. The juxtaposed $1B vs $5M economics combined with official cybersecurity seals establishes immediate geopolitical and industry stakes.",
    technicalMetrics: [
      { label: "Frontier Model Dev Cost", value: "$100M - $1B+", sublabel: "Initial base training" },
      { label: "Distillation Cost", value: "$5.6M", sublabel: "DeepSeek-V3 reported compute" },
      { label: "Cost Reduction Factor", value: "95% - 99%", sublabel: "Fractional expenditure" }
    ]
  },
  {
    id: 2,
    title: "The Core Problem",
    subtitle: "The distillation pipeline & massive token streams from US models",
    durationStr: "0:04 - 0:12",
    startTime: 4,
    endTime: 12,
    veoPrompt: `Vertical scrolling digital grid showcasing tech company names: DeepSeek, Moonshot AI, Alibaba, MiniMax, StepFun, Z.AI in glowing white and blue typography. Abstract infographic overlay showing massive glowing streams of data tokens flowing outward from icons representing US frontier models. Dark tech-noir color grade, smooth pan down.`,
    audioPrompt: `Rapid server rack whirring sounds layered with high-speed data transmission clicks and a low, driving sub-bass rhythm.`,
    voiceover: `"Behind closed doors, billions of generated tokens flow across borderless APIs—extracting weights, reasoning, and synthetic reasoning datasets."`,
    keyEntities: ["DeepSeek", "Moonshot AI", "Alibaba", "MiniMax", "StepFun", "Z.AI", "Frontier Teacher Models"],
    visualKeywords: ["Vertical Scrolling Grid", "Token Streams", "Tech-Noir", "Data Flow", "Glowing Typography"],
    cameraMotion: "Continuous smooth vertical tracking pan descending through matrix data layers",
    lightingStyle: "Ambient cold blue diffused light with fiber-optic particle glows",
    colorGrade: "Tech-Noir: Cobalt Blue (#1E3A8A), Sapphire (#3B82F6), Pure White (#FFFFFF)",
    soundDesignStems: [
      "High-RPM Server Cooling Fan Turbine",
      "Staccato Binary Data Clicks (160 BPM)",
      "Driving 120BPM Sub-Bass Pulse",
      "Fiber-Optic Shimmer Sweeps"
    ],
    directorNotes: "Visually represents knowledge distillation at scale. Rather than training models tabula rasa from raw internet text, target companies query frontier US models (GPT-4, Claude 3.5, Gemini 1.5) millions of times to curate pristine synthetic training datasets.",
    technicalMetrics: [
      { label: "Active Distillers", value: "6 Major Labs", sublabel: "DeepSeek, Moonshot, Alibaba, etc." },
      { label: "Token Transfer Rate", value: "Billions/Day", sublabel: "API queries & synthetic reasoning" },
      { label: "Compression Ratio", value: "10x - 50x", sublabel: "Student model parameter efficiency" }
    ]
  },
  {
    id: 3,
    title: "The Logic Twist",
    subtitle: "The stark contrast: 100,000 GPU cluster vs a $0.05 API loop",
    durationStr: "0:12 - 0:20",
    startTime: 12,
    endTime: 20,
    veoPrompt: `Split screen animation. On the left: a massive, towering data center supercomputer with blinking server lights and heavy metallic cooling tubes, stamped with a bold "$$$$" overlay. On the right: a clean, minimalist minimalist screen showing a single line of code and a sleek API prompt loop asking questions with a "$0.05" stamp. High contrast, sharp architectural lighting, smooth camera track.`,
    audioPrompt: `Heavy mechanical humming on the left channel contrasting with a light, single, clean digital chime on the right.`,
    voiceover: `"On one side: tens of thousands of GPUs burning through small nations' worth of power. On the other: a single API loop querying answers for five cents."`,
    keyEntities: ["Supercomputer Cluster ($$$$)", "Distillation Loop ($0.05)", "Cooling Tubes", "API Prompt Loop"],
    visualKeywords: ["Split Screen", "Architectural Lighting", "Metallic Tubes", "Minimalist Code", "Price Stamps"],
    cameraMotion: "Parallel dual-axis synchronized dolly: forward drift on left, elegant lateral slide on right",
    lightingStyle: "Split contrast: Heavy amber/industrial sodium lighting (Left) vs Pristine surgical ice-white (Right)",
    colorGrade: "Left: Industrial Amber & Dark Steel (#261E14). Right: Crisp Obsidian & Platinum White (#0B0F19)",
    soundDesignStems: [
      "Stereo Channel Left: 60Hz Electrical Transformer & Liquid Coolant Hum",
      "Stereo Channel Right: Pristine 1200Hz Crystal Digital Chime & Subtle Keystrokes",
      "Sub-Split Dynamic Panning",
      "Audio Phase Isolation"
    ],
    directorNotes: "The core conceptual turning point. The visual split-screen forces viewers to confront the asymmetrical economics: a 100,000 GPU cluster burning millions in electricity vs a student model distilling the reasoning outputs through prompt automation.",
    technicalMetrics: [
      { label: "Frontier Infrastructure", value: "16,000+ H100s", sublabel: "Liquid cooled, ~50MW datacenter" },
      { label: "API Query Cost", value: "$0.05 / 1k Tokens", sublabel: "Prompt distillation loop" },
      { label: "Economic Asymmetry", value: "2,000x Margin", sublabel: "Capex vs Opex disparity" }
    ]
  },
  {
    id: 4,
    title: "Conclusion & Call to Action",
    subtitle: "The geopolitical reality & parse.it brand resolve",
    durationStr: "0:20 - 0:30",
    startTime: 20,
    endTime: 30,
    veoPrompt: `Minimal typography animation on a sleek dark background. Text transitions smoothly: "It’s efficient. It violates terms of service. And it’s rewriting global AI competition." Final resolve pulls back to reveal the clean "parse.it" logo mark surrounded by subtle particle dust and a "Hit follow" prompt button. Premium tech commercial aesthetic.`,
    audioPrompt: `Ambient electronic backing track resolving into a clean, professional outro chord while a clear voice delivers the call to action.`,
    voiceover: `"It’s efficient. It violates terms of service. And it’s rewriting global AI competition. Follow parse.it for real AI breakdowns."`,
    keyEntities: ["parse.it Logo", "Hit follow Button", "TOS Warning", "Global AI Competition"],
    visualKeywords: ["Minimal Typography", "Particle Dust", "Brand Resolve", "Hit Follow CTA", "Premium Tech Commercial"],
    cameraMotion: "Slow, majestic orbital pull-back from center typography into wide brand staging with floating bokeh particles",
    lightingStyle: "Subtle top-down spotlight rimming the brand mark with soft volumetric falloff",
    colorGrade: "Deep Midnight Slate (#030712) with Pearlescent White (#F8FAFC) & Cyan Accent (#06B6D4)",
    soundDesignStems: [
      "Lush F-Minor 9th Synth Pad",
      "Reverb-Drenched Glass Bell Strike",
      "Warm Analog Low-End Resolution",
      "Crisp Vocal Outro Delivery"
    ],
    directorNotes: "The three thesis lines transition on rhythm, leading into a commercial-grade brand resolve for parse.it. Leaves the audience with sharp conceptual clarity and a high-conversion call to action.",
    technicalMetrics: [
      { label: "OpenAI TOS Clause", value: "Section 2(c)", sublabel: "Prohibits using output to train competing models" },
      { label: "Enforceability", value: "Extraterritorial", sublabel: "Zero jurisdiction over overseas labs" },
      { label: "Market Impact", value: "Paradigm Shift", sublabel: "Democratized frontier intelligence" }
    ]
  }
];
