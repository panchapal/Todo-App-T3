import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/trpc/prisma";
import { generateToken } from "@/utils/adminauth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ error: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: "ADMIN" },
  });

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}


// import { NextApiRequest, NextApiResponse } from "next";
// import bcrypt from "bcryptjs";
// import { prisma } from "@/server/trpc/prisma";
// import { generateToken, verifyToken } from "@/utils/adminauth"; // Import verifyToken

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

//   // Get token from request headers
//   const token = req.headers.authorization?.split(" ")[1]; // Bearer token

//   if (!token) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   try {
//     // Verify token
//     const decoded = verifyToken(token);
    
//     // Check if user is an admin
//     if (decoded.role !== "ADMIN") {
//       return res.status(403).json({ error: "You must be an admin to register users" });
//     }

//     const { name, email, password } = req.body;

//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) return res.status(400).json({ error: "Email already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await prisma.user.create({
//       data: { name, email, password: hashedPassword, role: "ADMIN" },
//     });

//     const newToken = generateToken(user);
//     res.json({ token: newToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

//   } catch (error) {
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// }
