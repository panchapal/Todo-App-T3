// import NextAuth, { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       accessToken: string; // ✅ Add this to fix the issue
//     } & DefaultSession["user"];
//   }

//   interface User {
//     id: string;
//     name: string;
//     email: string;
//     accessToken: string; // ✅ Add this to fix the issue
//   }
// }


import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: "USER" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "USER" | "ADMIN";
    };
  }
}
