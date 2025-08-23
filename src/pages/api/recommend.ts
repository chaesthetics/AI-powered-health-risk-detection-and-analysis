import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const response = await axios.post(
      `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: req.body.prompt }
            ]
          }
        ]
      }
    );

    const text = response.data.candidates[0]?.content?.parts[0]?.text ?? "";
    res.status(200).json({ text });
  } catch (err) {
    const error = err as AxiosError;
    console.error("Recommend API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Recommendation request failed" });
  }
}
