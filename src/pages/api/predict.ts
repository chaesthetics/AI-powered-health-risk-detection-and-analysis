import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const response = await axios.post(process.env.AWS_ENDPOINT as string, req.body, {
      headers: { "Content-Type": "application/json" }
    });

    const prediction = JSON.parse(response.data.body).prediction;
    res.status(200).json({ prediction });
  } catch (err) {
    const error = err as AxiosError;
    console.error("Predict API error:", error.message);
    res.status(500).json({ error: "Prediction request failed" });
  }
}
