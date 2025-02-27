// import { NextApiRequest, NextApiResponse } from "next";
// import bcrypt from "bcryptjs";
// import { prisma } from "@/server/trpc/prisma";
// import { generateToken } from "@/utils/adminauth";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

//   const { email, password } = req.body;
//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ error: "Invalid email or password" });
//   }

//   const token = generateToken(user);
//   res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
// }


import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/trpc/prisma";
import { generateToken } from "@/utils/adminauth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });

  // Check if user exists and has an allowed role
  if (!user || !["ADMIN", "SUBADMIN"].includes(user.role)) {
    return res.status(403).json({ error: "Access denied. Only admins and sub-admins can log in." });
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT token
  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
