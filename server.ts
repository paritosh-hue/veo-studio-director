import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google Gen AI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// AI-Powered Storyboard Generator
app.post('/api/generate-storyboard', async (req, res) => {
  try {
    const { topic, brand } = req.body;
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'A topic string is required.' });
    }

    const ai = getAIClient();
    if (!ai) {
      // Graceful fallback response when API key is not yet set
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY detected in environment. Generated cinematic prototype directly.',
        project: {
          id: `custom-${Date.now()}`,
          name: topic.slice(0, 40),
          description: `Cinematic 30-second breakdown of ${topic}`,
          brand: brand || 'STUDIO.VEO',
          totalDuration: 30,
          shots: [
            {
              id: 1,
              title: `The ${topic} Catalyst`,
              subtitle: 'Initial Disruption & Paradigm Shift',
              durationStr: '0:00 - 0:06',
              startTime: 0,
              endTime: 6,
              veoPrompt: `Cinematic dramatic macro opening shot visualizing ${topic}. Atmospheric volumetric rim lighting, photorealistic 8K fidelity, shallow depth of field.`,
              audioPrompt: 'Deep 45Hz sub-bass drone layered with high-frequency telemetry pulses and rising tension.',
              voiceover: `Everything we assumed about ${topic} changed overnight.`,
              keyEntities: [topic, 'Disruption', 'Threshold', 'Next-Gen'],
              visualKeywords: ['Macro Lens', 'Volumetric Lighting', 'Atmospheric', 'Photorealistic'],
              cameraMotion: 'Slow forward dolly in with subtle roll',
              lightingStyle: 'High-contrast chiaroscuro cyan and gold rim lighting',
              colorGrade: 'Deep Obsidian (#020617) and Cyber Cyan (#06B6D4)',
              soundDesignStems: ['45Hz Sub Drone', 'Rising Filter Sweep', 'Telemetry Beeps'],
              directorNotes: 'Establish dramatic scale and immediate thematic tension.',
              technicalMetrics: [
                { label: 'Disruption Velocity', value: '10x Faster', sublabel: 'Year-over-year' },
                { label: 'Market Cap', value: '$450B', sublabel: 'Projected 2030' },
                { label: 'Adoption Rate', value: '84.2%', sublabel: 'Enterprise deployment' }
              ],
              userCanvasOverrides: {
                headline: topic.toUpperCase(),
                primaryStat: '10x ACCELERATION',
                secondaryStat: 'ENTERPRISE ADOPTION 84%',
                customBrand: brand || 'STUDIO.VEO'
              }
            },
            {
              id: 2,
              title: 'The Core Mechanism',
              subtitle: 'Underlying Architecture & Data Flow',
              durationStr: '0:06 - 0:14',
              startTime: 6,
              endTime: 14,
              veoPrompt: `Holographic technical cross-section showing internal mechanism of ${topic}. Floating data conduits and glowing nodes in 3D space.`,
              audioPrompt: 'Rapid rhythmic acoustic clicks and turbine hum reflecting real-time parallel computation.',
              voiceover: `Under the hood, billions of operations coordinate across distributed networks in milliseconds.`,
              keyEntities: ['Parallel Matrix', 'Data Conduits', 'Neural Nodes', 'Latency Pipeline'],
              visualKeywords: ['Holographic', 'Conduits', 'Glowing Nodes', '3D Schematic'],
              cameraMotion: 'Continuous orbital pan around glowing central nexus',
              lightingStyle: 'Internal bioluminescent volumetric illumination',
              colorGrade: 'Electric Blue (#3B82F6) and Emerald Green (#10B981)',
              soundDesignStems: ['Turbine Whistle', 'Data Packet Whoosh', 'Micro-clicks'],
              directorNotes: 'Make intricate systems intuitive and kinetic.',
              technicalMetrics: [
                { label: 'Processing Latency', value: '4.2 ms', sublabel: 'End-to-end' },
                { label: 'Throughput', value: '1.2M req/sec', sublabel: 'Sustained load' },
                { label: 'Efficiency', value: '+420%', sublabel: 'Over legacy baseline' }
              ],
              userCanvasOverrides: {
                headline: 'DISTRIBUTED ARCHITECTURE',
                primaryStat: '4.2ms LATENCY',
                secondaryStat: '1.2M OPS / SEC',
                customBrand: brand || 'STUDIO.VEO'
              }
            },
            {
              id: 3,
              title: 'The Asymmetric Advantage',
              subtitle: 'Legacy Brute Force vs Next-Gen Agility',
              durationStr: '0:14 - 0:22',
              startTime: 14,
              endTime: 22,
              veoPrompt: `Split-screen comparison. Left: Massive cumbersome industrial facility burning massive capital. Right: Sleek automated pipeline resolving challenges at fractional cost.`,
              audioPrompt: 'Left channel industrial mechanical roar vs right channel serene crystal chime.',
              voiceover: `What once demanded millions in infrastructure is now executed in seconds at fractional cost.`,
              keyEntities: ['Legacy Complex ($$$$)', 'Next-Gen Agility ($0.05)', 'Efficiency Gap'],
              visualKeywords: ['Split Screen', 'High Contrast', 'Industrial vs Sleek', 'Cost Differential'],
              cameraMotion: 'Dynamic horizontal snap pan highlighting the contrast',
              lightingStyle: 'Dual-tone amber vs cool cyan lighting',
              colorGrade: 'Amber (#F59E0B) vs Neon Cyan (#06B6D4)',
              soundDesignStems: ['Industrial Rumble', 'Pristine 432Hz Chime', 'Sub Drop'],
              directorNotes: 'The dramatic turning point. Emphasize asymmetric economics.',
              technicalMetrics: [
                { label: 'Capex Reduction', value: '98.5%', sublabel: 'Marginal cost collapse' },
                { label: 'Time to Value', value: 'Hours vs Months', sublabel: 'Deployment speed' },
                { label: 'Energy Savings', value: '120x', sublabel: 'Net footprint' }
              ],
              userCanvasOverrides: {
                headline: 'ASYMMETRIC ADVANTAGE',
                primaryStat: '98.5% COST REDUCTION',
                secondaryStat: 'HOURS VS MONTHS',
                customBrand: brand || 'STUDIO.VEO'
              }
            },
            {
              id: 4,
              title: 'The New Horizon',
              subtitle: 'Synthesis, Brand Resolve & Call to Action',
              durationStr: '0:22 - 0:30',
              startTime: 22,
              endTime: 30,
              veoPrompt: `Epic cinematic wide shot revealing panoramic futuristic skyline illuminated by warm dawn sunlight. Elegant brand typography resolves in center frame with subtle particle shimmer.`,
              audioPrompt: 'Warm cinematic orchestral swell resolving into a clean corporate brand chime.',
              voiceover: `The frontier is here. Follow ${brand || 'us'} for daily breakthroughs.`,
              keyEntities: ['Panoramic Skyline', 'Brand Logo', 'Golden Dawn', 'Community Network'],
              visualKeywords: ['Panoramic Skyline', 'Golden Dawn', 'Particle Shimmer', 'Brand Outro'],
              cameraMotion: 'Smooth crane pullback elevating into panoramic vista',
              lightingStyle: 'Warm anamorphic golden hour sunlight through haze',
              colorGrade: 'Golden Amber (#F59E0B), Pristine White, Deep Navy (#0F172A)',
              soundDesignStems: ['Warm Cello Pad', 'Sub-frequency Boom', 'Brand Sonic Logo'],
              directorNotes: 'Triumphant, inspiring conclusion leaving strong call to action.',
              technicalMetrics: [
                { label: 'Commercial Deploy', value: 'Live Now', sublabel: 'Global availability' },
                { label: 'Community', value: '250,000+', sublabel: 'Engineers & creators' },
                { label: 'Status', value: 'Production Ready', sublabel: '99.99% SLA' }
              ],
              userCanvasOverrides: {
                headline: 'THE NEW FRONTIER',
                primaryStat: 'LIVE PRODUCTION READY',
                secondaryStat: 'JOIN 250,000+ CREATORS',
                customBrand: brand || 'STUDIO.VEO'
              }
            }
          ]
        }
      });
    }

    const systemPrompt = `You are a world-class cinematic video director and prompt engineer for Google Veo 3.1.
Given a topic, create a structured 4-shot, 30-second cinematic video breakdown storyboard project.
Each shot must have:
- id: number (1, 2, 3, 4)
- title: string
- subtitle: string
- durationStr: string (e.g. "0:00 - 0:06")
- startTime: number
- endTime: number (shots must span 0 to 30 seconds total: 0-6, 6-14, 14-22, 22-30)
- veoPrompt: highly descriptive, cinematic prompt for Veo 3.1
- audioPrompt: native audio prompt describing sound design, frequencies, and ambience
- voiceover: punchy, compelling 1-2 sentence narration script
- keyEntities: array of 4 key visual elements
- visualKeywords: array of 5 keywords
- cameraMotion: cinematic camera move
- lightingStyle: lighting technique
- colorGrade: color palette description
- soundDesignStems: array of 4 audio sound effects
- directorNotes: strategic direction notes
- technicalMetrics: array of 3 objects with { label, value, sublabel }
- userCanvasOverrides: { headline, primaryStat, secondaryStat, customBrand }

Output strictly valid JSON matching:
{
  "id": "generated-...",
  "name": "...",
  "description": "...",
  "brand": "...",
  "totalDuration": 30,
  "shots": [...]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create a 30-second cinematic Veo 3.1 video storyboard for: "${topic}". Brand name: "${brand || 'STUDIO.VEO'}".`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);
    res.json({ project: parsed });
  } catch (error: any) {
    console.error('Error generating storyboard:', error);
    res.status(500).json({ error: error.message || 'Failed to generate storyboard' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
