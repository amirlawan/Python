import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Mistral } from "@mistralai/mistralai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { MISTRAL_API_KEY, PORT = "3000" } = process.env;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const client = new Mistral({ apiKey: MISTRAL_API_KEY ?? "missing" });
const MODEL = "mistral-small-latest";

app.post("/api/chat", async (req, res) => {
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages must be a non-empty array" });
    return;
  }
  try {
    const response = await client.chat.complete({
      model: MODEL,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content ?? ""),
      })),
    });
    const raw = response.choices?.[0]?.message?.content;
    const reply =
      typeof raw === "string"
        ? raw
        : Array.isArray(raw)
          ? raw.map((c) => ("text" in c ? c.text : "")).join("")
          : "";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mistral API request failed" });
  }
});

app.listen(Number(PORT), () => {
  console.log(`Chat app running at http://localhost:${PORT}`);
});
