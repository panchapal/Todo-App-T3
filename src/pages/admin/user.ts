// import { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/server/trpc/prisma";
// import { verifyToken } from "@/utils/adminauth";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Unauthorized - No Token" });
//   }

//   try {
//     const token = authHeader.split(" ")[1];
//     const admin = verifyToken(token);

//     if (admin.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

//     const users = await prisma.user.findMany({
//       include: { tasks: true }, // Assuming tasks are stored in the `tasks` table
//     });

//     res.json(users);
//   } catch (error) {
//     res.status(401).json({ error: "Invalid Token" });
//   }
// }
