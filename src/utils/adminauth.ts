import jwt from "jsonwebtoken";
const SECRET_KEY = "your_secret_key"; // Store in .env

export const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    SECRET_KEY,
    // { expiresIn: "6h" }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};
