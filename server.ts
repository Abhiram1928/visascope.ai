
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // LOCAL ML PREDICTION API (No Google Connection)
  app.post("/api/predict", async (req, res) => {
    const data = req.body;
    
    console.log("Running Local ML Prediction for:", data.nationality);

    // Call the local Python script
    const pythonProcess = spawn("python3", ["ml_model.py", JSON.stringify(data)]);
    
    let resultData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python Error:", errorData);
        return res.status(500).json({ error: "ML Model Execution Failed", details: errorData });
      }
      try {
        const result = JSON.parse(resultData);
        res.json(result);
      } catch (e) {
        res.status(500).json({ error: "Failed to parse ML output" });
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
