import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/utils/adminauth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No Token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: "Invalid Token" });
  }
}
