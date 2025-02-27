// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// // Define User type explicitly
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   token: string;
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "test@example.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing email or password");
//         }

//         try {
//           const res = await fetch("http://localhost:3000/api/auth/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(credentials),
//           });

//           const text = await res.text();
//           console.log("Raw API Response:", text); // Debugging

//           try {
//             const user: User = JSON.parse(text); // Ensure JSON format

//             if (res.ok && user.token) {
//               return user; // Return user object with token
//             } else {
//               throw new Error(user?.token ? "Invalid response" : "Invalid email or password");
//             }
//           } catch (error) {
//             console.error("JSON Parse Error:", error);
//             throw new Error("Invalid response format from API");
//           }
//         } catch (error) {
//           console.error("Authorize Error:", error);
//           throw new Error("Authentication failed");
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.accessToken = (user as User).token; // Type assertion for token
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       return {
//         ...session,
//         accessToken: token.accessToken, // Explicitly add accessToken
//       };
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default NextAuth(authOptions);


// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "admin@example.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email and password are required");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) {
//           throw new Error("No user found with this email");
//         }

//         const isValidPassword = bcrypt.compareSync(credentials.password, user.password);
//         if (!isValidPassword) {
//           throw new Error("Invalid password");
//         }

//         return { id: user.id, email: user.email, role: user.role };
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.role = token.role;
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//       }
//       return token;
//     },
//   },
//   pages: {
//     signIn: "/admin/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
// });
