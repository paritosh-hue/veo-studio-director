import { ShotData, StoryboardProject } from '../types';
import { SHOTS_DATA as DEFAULT_SHOTS } from './shots';

export const STORYBOARD_PRESETS: StoryboardProject[] = [
  {
    id: 'parse-it-distillation',
    name: 'AI Distillation ($1B vs $5M)',
    description: 'Cinematic 30-second breakdown of US frontier model distillation and AI capex collapse.',
    brand: 'parse.it',
    totalDuration: 30,
    shots: DEFAULT_SHOTS,
  },
  {
    id: 'quantum-supremacy',
    name: 'Quantum Cryo-Supremacy',
    description: 'Inside a 15-millikelvin dilution refrigerator operating 1,000 superconducting qubits.',
    brand: 'QUBIT.X',
    totalDuration: 30,
    shots: [
      {
        id: 1,
        title: 'Absolute Zero Descent',
        subtitle: 'Cryostat descent into 15 millikelvin golden chandelier',
        durationStr: '0:00 - 0:06',
        startTime: 0,
        endTime: 6,
        veoPrompt: 'Cinematic slow push-in macro shot of an ornate golden quantum chandelier suspended in a vacuum chamber. Volumetric golden light glinting off copper microwave coaxial lines. Subtle cryogenic nitrogen vapor curls lazily in zero gravity. High contrast, 8K hyper-detailed photorealism.',
        audioPrompt: 'Deep resonant cryogenic pump hum at 40Hz, layered with ultra-high harmonic crystalline metallic pings and spatial reverbs.',
        voiceover: 'At fifteen millikelvin, the laws of classical physics cease to exist.',
        keyEntities: ['Golden Chandelier', 'Coaxial Microwave Lines', '15mK Chamber', 'Superconducting Qubits'],
        visualKeywords: ['Golden Chandelier', 'Cryogenic Vapor', 'Copper Coax', 'Macro Lens', 'Absolute Zero'],
        cameraMotion: 'Slow motorized downward crane jib entering thermal shield',
        lightingStyle: 'Chiaroscuro golden rim lights against deep obsidian vacuum chamber',
        colorGrade: 'Polished Gold (#EAB308), Liquid Nitrogen Cyan (#06B6D4), Pitch Obsidian (#020408)',
        soundDesignStems: ['40Hz Cryo Compressor', 'High-Q Resonator Ring', 'Helium-4 Valve Release', 'Whispering Void Ambience'],
        directorNotes: 'Establish extreme scale and thermal isolation. The visual contrast of ornate golden craftsmanship with subatomic computing.',
        technicalMetrics: [
          { label: 'Operating Temp', value: '15 mK', sublabel: 'Colder than deep space' },
          { label: 'Coherence Time', value: '120 µs', sublabel: 'T2 dephasing limit' },
          { label: 'Physical Qubits', value: '1,024', sublabel: 'Hexagonal transmon array' }
        ],
        userCanvasOverrides: {
          headline: 'THE QUANTUM THRESHOLD',
          primaryStat: '15 MILLIKELVIN',
          secondaryStat: '1,024 TRANSMON QUBITS',
          customBrand: 'QUBIT.X'
        }
      },
      {
        id: 2,
        title: 'Superposition Entanglement',
        subtitle: 'Visualizing multi-qubit Bloch spheres in phase space',
        durationStr: '0:06 - 0:14',
        startTime: 6,
        endTime: 14,
        veoPrompt: 'Abstract 3D scientific visualization of interconnected translucent Bloch spheres oscillating synchronously in a dark hyperspace void. Laser-like microwave pulses in ultraviolet and emerald trigger instantaneous phase rotations. Clean mathematical vectors rendered in holographic wireframe.',
        audioPrompt: 'Rapid rhythmic sequence of pure sine tones shifting in frequency at microsecond intervals, underlaid by a warm analog synthesizer pulse.',
        voiceover: 'A single microwave pulse triggers superpositions that evaluate two to the power of one thousand states simultaneously.',
        keyEntities: ['Bloch Spheres', 'Microwave Control Pulses', 'Entanglement Lattice', 'Phase Space Vectors'],
        visualKeywords: ['Bloch Spheres', 'Ultraviolet Lasers', 'Emerald Pulses', 'Phase Rotations', 'Hyperspace Void'],
        cameraMotion: 'Continuous orbital dolly revolving around the central entangled cluster',
        lightingStyle: 'Self-illuminating neon vector geometry with lens flare flares',
        colorGrade: 'Ultraviolet Violet (#8B5CF6), Neon Emerald (#10B981), Electric Azure (#3B82F6)',
        soundDesignStems: ['Pure 1kHz Micro-beeps', 'Binaural Phase Wobble', 'Sub-frequency Glissando', 'Synthetic Air Sweeps'],
        directorNotes: 'Make quantum mathematics visually intuitive and kinetic without dumbing down the actual gate mechanics.',
        technicalMetrics: [
          { label: 'Hilbert Space', value: '2^1024', sublabel: 'Total quantum states' },
          { label: 'Gate Fidelity', value: '99.94%', sublabel: 'Two-qubit CZ gate' },
          { label: 'Error Threshold', value: '< 0.1%', sublabel: 'Surface code fault tolerance' }
        ],
        userCanvasOverrides: {
          headline: 'ENTANGLEMENT ACCELERATION',
          primaryStat: '2^1024 STATES',
          secondaryStat: '99.94% CZ FIDELITY',
          customBrand: 'QUBIT.X'
        }
      },
      {
        id: 3,
        title: 'Classical vs Quantum Race',
        subtitle: '10,000 years of supercomputing reduced to 200 seconds',
        durationStr: '0:14 - 0:22',
        startTime: 14,
        endTime: 22,
        veoPrompt: 'Split-screen high contrast visual. Left: An exascale supercomputer complex stretching for acres, roaring cooling towers and blinking red error counters calculating for 10,000 years. Right: A single silicon quantum chip glowing with cool serenity, completing the calculation in 180 seconds. Bold typographic timer stamps.',
        audioPrompt: 'Chaotic mechanical roar and siren alarm on left channel, contrasting with a calm ethereal celestial bell chord on right channel.',
        voiceover: 'Calculations that would exhaust the lifetime of the universe on conventional clusters... resolved in under three minutes.',
        keyEntities: ['Exascale Data Center ($$$$)', 'Quantum Processor Chip (180s)', '10,000 Year Counter', 'Thermal Inefficiency'],
        visualKeywords: ['Exascale Cluster', 'Cooling Towers', 'Quantum Silicon', 'Typographic Counters', 'Split Screen'],
        cameraMotion: 'Dynamic horizontal whip-pan snapping between the two computational realities',
        lightingStyle: 'High-contrast duel between industrial hot amber and cool cryogenic cyan',
        colorGrade: 'Molten Amber (#F59E0B) vs Superconducting Cyan (#06B6D4)',
        soundDesignStems: ['Left: Industrial Fan Turbine', 'Left: Alarm Tones', 'Right: 432Hz Zen Chime', 'Right: Crystal Decay'],
        directorNotes: 'The dramatic climax of the video. Emphasize energy and time disparity between classical brute-force and quantum parallelism.',
        technicalMetrics: [
          { label: 'Classical Runtime', value: '10,000 Yrs', sublabel: 'Top 500 #1 Supercomputer' },
          { label: 'Quantum Runtime', value: '180 Sec', sublabel: 'Sampling benchmark' },
          { label: 'Energy Savings', value: '10,000,000x', sublabel: 'Megawatts vs Kilowatts' }
        ],
        userCanvasOverrides: {
          headline: 'THE SUPREMACY BENCHMARK',
          primaryStat: '10,000 YEARS -> 180 SEC',
          secondaryStat: '10,000,000x ENERGY REDUCTION',
          customBrand: 'QUBIT.X'
        }
      },
      {
        id: 4,
        title: 'The New Computational Era',
        subtitle: 'Molecular drug discovery and catalyst simulation resolution',
        durationStr: '0:22 - 0:30',
        startTime: 22,
        endTime: 30,
        veoPrompt: 'Cinematic pull-back from a synthesized room-temperature superconductor crystalline molecular lattice into a futuristic minimalist laboratory. A holographic interface displays the QUBIT.X logo in shimmering metallic typography. Warm golden sunrise light through floor-to-ceiling windows. Professional cinematic grade.',
        audioPrompt: 'Warm cinematic strings swell building into a clean, modern corporate outro chime and sub-bass resolution.',
        voiceover: 'Welcome to the post-silicon era. Follow QUBIT.X for daily quantum engineering breakthroughs.',
        keyEntities: ['Molecular Lattice', 'Futuristic Research Lab', 'QUBIT.X Hologram', 'Golden Sunrise'],
        visualKeywords: ['Molecular Lattice', 'Room-Temp Superconductor', 'Futuristic Lab', 'Golden Sunrise', 'Brand Outro'],
        cameraMotion: 'Slow sweeping crane pullback rotating 45 degrees to reveal panoramic skyline',
        lightingStyle: 'Warm anamorphic golden hour sunlight through panoramic architectural glass',
        colorGrade: 'Warm Gold (#F59E0B), Clean Titanium White (#FFFFFF), Deep Royal Navy (#0F172A)',
        soundDesignStems: ['Warm Orchestral Cello Pad', 'Glass Shimmer Resonance', 'Clean Brand Sonic Logo', 'Sub-frequency Boom'],
        directorNotes: 'Triumphant, forward-looking resolution that leaves the viewer feeling they have witnessed historical inflection.',
        technicalMetrics: [
          { label: 'Material Simulated', value: 'Fe-Based High-Tc', sublabel: 'Exact Fermi surface' },
          { label: 'Catalyst Efficiency', value: '+400%', sublabel: 'Synthetic nitrogen fixation' },
          { label: 'Commercial Deploy', value: 'Q4 2026', sublabel: 'Cloud quantum access' }
        ],
        userCanvasOverrides: {
          headline: 'THE POST-SILICON ERA',
          primaryStat: 'FE-BASED HIGH-TC',
          secondaryStat: 'COMMERCIAL ACCESS Q4',
          customBrand: 'QUBIT.X'
        }
      }
    ]
  },
  {
    id: 'cybernetic-bci',
    name: 'The $100 Neural Interface',
    description: 'How non-invasive ultrasound arrays democratized mind-machine interfaces.',
    brand: 'SYNAPSE.OS',
    totalDuration: 30,
    shots: [
      {
        id: 1,
        title: 'The Invasive Myth',
        subtitle: 'Rejecting $100,000 brain surgery for wearable acoustics',
        durationStr: '0:00 - 0:05',
        startTime: 0,
        endTime: 5,
        veoPrompt: 'Extreme macro close-up of a delicate titanium cranial implant dissolving into thin air, replaced by a sleek, ultra-thin holographic headband resting comfortably across a human temple. Dark studio backdrop with pulsing violet neon neuro-electric signals.',
        audioPrompt: 'Tense hospital monitor beeping rapidly dissolving into a smooth, futuristic harmonic wash and quiet breath.',
        voiceover: 'You don’t need brain surgery to control machines at the speed of thought.',
        keyEntities: ['Titanium Implant', 'Ultrasonic Headband', 'Pulsing Violet Signals', 'Synapse.OS Halo'],
        visualKeywords: ['Extreme Macro', 'Temple Headband', 'Violet Signals', 'Studio Backdrop', 'Cyber-Sleek'],
        cameraMotion: 'Fast 180-degree rotational orbit around subject temple with shallow depth of field',
        lightingStyle: 'Moody side-rim lighting in electric violet and cyber-teal',
        colorGrade: 'Electric Violet (#8B5CF6), Cyber Teal (#14B8A6), Deep Charcoal (#111827)',
        soundDesignStems: ['Heartbeat Bass Thump', 'Dissolving Static Noise', 'Soft Sonic Air Puff', 'Violet Resonance'],
        directorNotes: 'Immediately debunk the misconception that neural links require surgical skull trepanation.',
        technicalMetrics: [
          { label: 'Surgical Cost', value: '$100,000 -> $99', sublabel: 'Consumer price collapse' },
          { label: 'Surgical Risk', value: 'Zero', sublabel: '100% non-invasive acoustic' },
          { label: 'Setup Time', value: '5 Seconds', sublabel: 'Auto-calibrating phased array' }
        ],
        userCanvasOverrides: {
          headline: 'THE NON-INVASIVE BREAKTHROUGH',
          primaryStat: '$99 CONSUMER BCI',
          secondaryStat: 'ZERO SURGICAL RISK',
          customBrand: 'SYNAPSE.OS'
        }
      },
      {
        id: 2,
        title: 'Phased Ultrasonic Arrays',
        subtitle: 'Sub-millimeter spatial resolution through cranial bone',
        durationStr: '0:05 - 0:13',
        startTime: 5,
        endTime: 13,
        veoPrompt: 'Holographic volumetric cross-section of a human skull showing focused micro-acoustic soundwaves penetrating bone with surgical precision, illuminating neural firing patterns in the motor cortex with glowing bioluminescent gold and turquoise nodes.',
        audioPrompt: 'Rhythmic high-frequency acoustic pings cascading like a synthetic radar sweep, coupled with a deep resonant heartbeat.',
        voiceover: 'Phased ultrasound arrays read sub-millimeter neural blood-oxygen patterns through intact skull in real time.',
        keyEntities: ['Cranial Cross-Section', 'Phased Ultrasound Wavefront', 'Motor Cortex Glow', 'Neural Action Potentials'],
        visualKeywords: ['Volumetric Skull', 'Acoustic Wavefront', 'Bioluminescent Neurons', 'Turquoise Nodes', 'Sub-millimeter'],
        cameraMotion: 'Slow push-in entering the microscopic cortical layers of the motor strip',
        lightingStyle: 'Bioluminescent internal volumetric lighting from glowing neural synapses',
        colorGrade: 'Turquoise (#06B6D4), Synapse Gold (#F59E0B), Obsidian (#030712)',
        soundDesignStems: ['2.4MHz Subharmonic Chirp', 'Cortical Pulse Loop', 'Radar Sweep Whistle', 'Sub-bass Swell'],
        directorNotes: 'Ground the tech in cutting-edge functional ultrasound neuroimaging (fUS) physics.',
        technicalMetrics: [
          { label: 'Acoustic Frequency', value: '2.5 MHz', sublabel: 'Transcranial penetration' },
          { label: 'Spatial Resolution', value: '100 µm', sublabel: 'Sub-millimeter precision' },
          { label: 'Latency', value: '8 ms', sublabel: 'Real-time motor decoding' }
        ],
        userCanvasOverrides: {
          headline: 'TRANSLATING THOUGHT IN 8MS',
          primaryStat: '100 µm RESOLUTION',
          secondaryStat: '8ms LATENCY',
          customBrand: 'SYNAPSE.OS'
        }
      },
      {
        id: 3,
        title: 'Thought-to-Code Telepathy',
        subtitle: '1,200 words per minute synthetic mental typing',
        durationStr: '0:13 - 0:21',
        startTime: 13,
        endTime: 21,
        veoPrompt: 'First-person perspective of a developer looking at a holographic multi-monitor coding workspace. Code files, 3D CAD models, and architectural designs assemble themselves effortlessly at blinding speed simply by thinking. Subtle eye movements and neural intention rings pulse in screen corners.',
        audioPrompt: 'Rapid mechanical keyboard clicks transforming into liquid digital synthesis chimes at superhuman 200 BPM speed.',
        voiceover: 'Twelve hundred words per minute. Software compiled before your fingers even touch a keyboard.',
        keyEntities: ['Holographic IDE', 'Neural Intention HUD', 'Autonomous CAD Assembly', 'Thought Velocity Counter'],
        visualKeywords: ['First-Person POV', 'Holographic IDE', 'Blinding Speed', 'Intention Rings', 'Digital Synthesis'],
        cameraMotion: 'Subtle organic head-tracking movements tracking focal points across the floating monitors',
        lightingStyle: 'Glow from holographic floating monitors casting soft cyan shadows across the hands',
        colorGrade: 'Cyan HUD (#22D3EE), Neon Green Terminal (#4ADE80), Shadow Slate (#0F172A)',
        soundDesignStems: ['Hyper-speed Type Clicks', 'Data Packet Whoosh', 'Neural Confirmation Ping', 'Rising Synth Arp'],
        directorNotes: 'Demonstrate the tangible productivity superpower: human cognitive intention executing without physical bottleneck.',
        technicalMetrics: [
          { label: 'Typing Velocity', value: '1,200 WPM', sublabel: '10x physical keyboard' },
          { label: 'Vocabulary Size', value: '250,000 Words', sublabel: 'Transformer language model' },
          { label: 'Motor Intent Accuracy', value: '99.8%', sublabel: 'Closed-loop calibration' }
        ],
        userCanvasOverrides: {
          headline: 'THE HYPER-SPEED INTERFACE',
          primaryStat: '1,200 WORDS / MIN',
          secondaryStat: '99.8% INTENT ACCURACY',
          customBrand: 'SYNAPSE.OS'
        }
      },
      {
        id: 4,
        title: 'Democratizing the Human Mind',
        subtitle: 'Open-weights neuro-model running on consumer hardware',
        durationStr: '0:21 - 0:30',
        startTime: 21,
        endTime: 30,
        veoPrompt: 'Wide cinematic shot of the user taking off the sleek headband and placing it next to a smartphone. The screen displays the SYNAPSE.OS logo with the text: "Open Weights. Zero Surgery. $99." Cinematic warm sunset lighting pours across the desk. Seamless fade to brand outro.',
        audioPrompt: 'Warm triumphant electronic groove resolving into a crisp authoritative brand chime.',
        voiceover: 'The future of intelligence isn’t silicon replacing humans. It’s humans unlocking infinite bandwidth. Join SYNAPSE.OS today.',
        keyEntities: ['SYNAPSE Headband', 'Smartphone Display', 'SYNAPSE.OS Logo', 'Warm Sunset Horizon'],
        visualKeywords: ['Wide Cinematic', 'Sunset Lighting', 'Open Weights', 'Sleek Headband', 'Brand Outro'],
        cameraMotion: 'Slow elegant dolly-out ascending upward to reveal the horizon through window',
        lightingStyle: 'Warm sunset rim lighting with cinematic lens flare',
        colorGrade: 'Sunset Coral (#FB7185), Warm Gold (#FBBF24), Deep Onyx (#030712)',
        soundDesignStems: ['Warm Rhodes Chords', 'Soft Sub-drop', 'Clean Brand Identity Tone', 'Ambient Breeze'],
        directorNotes: 'Warm, humanistic resolution highlighting accessibility, affordability, and empowerment.',
        technicalMetrics: [
          { label: 'Hardware MSRP', value: '$99.00', sublabel: 'Global accessibility' },
          { label: 'Model Weights', value: 'Apache 2.0', sublabel: 'Open-source on GitHub' },
          { label: 'Battery Life', value: '18 Hours', sublabel: 'Wireless Qi charging' }
        ],
        userCanvasOverrides: {
          headline: 'HUMAN BANDWIDTH UNLOCKED',
          primaryStat: '$99 MSRP',
          secondaryStat: 'OPEN WEIGHTS APACHE 2.0',
          customBrand: 'SYNAPSE.OS'
        }
      }
    ]
  }
];
