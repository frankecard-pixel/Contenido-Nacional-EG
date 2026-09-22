import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const upload = multer({ storage: multer.memoryStorage() });

// Gemini Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

// API route for CV parsing
app.post("/api/parse-cv", upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const base64Data = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const prompt = `
      Analiza este CV en PDF y extrae la información en formato JSON siguiendo exactamente este esquema:
      {
        "experience": [
          { "role": "título del puesto", "company": "nombre de la empresa", "period": "año inicio - año fin", "desc": "descripción breve" }
        ],
        "education": [
          { "degree": "título obtenido", "school": "institución", "year": "año de graduación" }
        ],
        "skills": ["habilidad 1", "habilidad 2"]
      }
      Si no encuentras alguna sección, devuelve un array vacío. Traduce todo al español si está en otro idioma.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company: { type: Type.STRING },
                  period: { type: Type.STRING },
                  desc: { type: Type.STRING }
                }
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  school: { type: Type.STRING },
                  year: { type: Type.STRING }
                }
              }
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error) {
    console.error("Error parsing CV:", error);
    res.status(500).json({ error: "Error processing CV" });
  }
});

// API route for Lex AI Assistant
app.post("/api/lex-chat", async (req, res) => {
  try {
    const { prompt, history = [], systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const client = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      } 
    });

    // Build contents from history and latest prompt
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.forEach((msg: { role: string; text: string }) => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction: systemInstruction || "Eres Lex, el Asistente de Inteligencia Jurídica oficial del Ministerio de Hidrocarburos, Minas y Electricidad de Guinea Ecuatorial. Responde siempre con rigor técnico y fundamento legal.",
        temperature: 0.7,
      }
    });

    res.json({ text: response.text || "No se ha generado respuesta." });
  } catch (error: any) {
    console.error("Error in /api/lex-chat:", error);
    res.status(500).json({ error: error?.message || "Error procesando la consulta jurídica con Gemini." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
