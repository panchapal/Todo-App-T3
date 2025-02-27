// import { router, publicProcedure,protectedProcedure } from "./trpc";
// import { z } from "zod";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { TRPCError } from "@trpc/server";
// import { prisma } from "./prisma";

// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//   throw new Error("JWT_SECRET is not set in .env");
// }

// export const authRouter = router({
//   // 🟢 REGISTER USER
//   register: publicProcedure
//     .input(
//       z.object({
//         name: z.string().min(2, "Name must be at least 2 characters long"),
//         email: z.string().email("Invalid email format"),
//         password: z.string().min(6, "Password must be at least 6 characters long"),
//       })
//     )
//     .mutation(async ({ input }) => {
//       try {
//         // 🔍 Check if email is already registered
//         const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
//         if (existingUser) {
//           throw new TRPCError({ code: "CONFLICT", message: "Email is already in use" });
//         }

//         // 🔒 Hash the password
//         const hashedPassword = await bcrypt.hash(input.password, 10);

//         // 🛠️ Create user
//         const user = await prisma.user.create({
//           data: { name: input.name, email: input.email, password: hashedPassword },
//         });

//         // 🔑 Generate JWT token
//         const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

//         return { token, userId: user.id, name: user.name, email: user.email };
//       } catch (error) {
//         console.error("Registration error:", error);
//         throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Registration failed" });
//       }
//     }),

//   // 🔵 LOGIN USER
//   login: publicProcedure
//     .input(
//       z.object({
//         email: z.string().email("Invalid email format"),
//         password: z.string(),
//       })
//     )
//     .mutation(async ({ input }) => {
//       try {
//         // 🔍 Find user by email
//         const user = await prisma.user.findUnique({ where: { email: input.email } });
//         if (!user) {
//           throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
//         }

//         // 🔑 Verify password
//         const isPasswordValid = await bcrypt.compare(input.password, user.password);
//         if (!isPasswordValid) {
//           throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
//         }

//         // 🔑 Generate JWT token
//         const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

//         return { token, userId: user.id, name: user.name, email: user.email };
//       } catch (error) {
//         console.error("Login error:", error);
//         throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Login failed" });
//       }
//     }),
    
//     // 🔵 GET ALL USERS
//   getAllUsers: publicProcedure.query(async () => {
//     try {
//       const users = await prisma.user.findMany({
//         select: { id: true, name: true, email: true },
//       });
//       return users;
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch users" });
//     }
//   }),
  
//   updateUserRole: protectedProcedure
//   .input(
//     z.object({
//       userId: z.string(),
//       role: z.enum(["USER", "ADMIN"]),
//     })
//   )
//   .mutation(async ({ ctx, input }) => {
//     if (!ctx.user) {
//       throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
//     }

//     // Type assertion to ensure `ctx.user` is not null and has the expected properties
//     const user = ctx.user as { role: "USER" | "ADMIN" };

//     if (user.role !== "ADMIN") {
//       throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update user roles" });
//     }

//     try {
//       const updatedUser = await prisma.user.update({
//         where: { id: input.userId },
//         data: { role: input.role },
//       });

//       return { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role };
//     } catch (error) {
//       console.error("Error updating user role:", error);
//       throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to update user role" });
//     }
//   }),

// });



import { router, publicProcedure, protectedProcedure } from "./trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in .env");
}

export const authRouter = router({
  // Public routes that don't need authentication
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters long"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
        if (existingUser) {
          throw new TRPCError({ code: "CONFLICT", message: "Email is already in use" });
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = await prisma.user.create({
          data: { 
            name: input.name, 
            email: input.email, 
            password: hashedPassword,
            role: "USER"
          },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
        return { token, userId: user.id, name: user.name, email: user.email, role: user.role };
      } catch (error) {
        console.error("Registration error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Registration failed" });
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email format"),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Find the user (permissions will be stored as a JSON array)
        const user = await prisma.user.findUnique({ 
          where: { email: input.email }
          // No need to include permissions explicitly if it's a JSON field
        });
        
        if (!user) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(input.password, user.password);
        if (!isPasswordValid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
        return { 
          token, 
          userId: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          // Return permissions directly as they are stored (an array of strings)
          permissions: user.permissions
        };
      } catch (error) {
        console.error("Login error:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Login failed" });
      }
    }),

  // Protected routes that need authentication
  getAllUsers: publicProcedure.query(async () => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true },
      });
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch users" });
    }
  }),

  updateUserRole: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["USER", "ADMIN", "SUBADMIN"]),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
      return user;
    }),

  updateUserPermissions: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        permissions: z.array(z.enum(["VIEW", "EDIT", "DELETE"])),
      })
    )
    .mutation(async ({ input }) => {
      const updatedUser = await prisma.user.update({
        where: { id: input.userId },
        data: { permissions: input.permissions }, // Storing permissions as a JSON array
      });

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        permissions: updatedUser.permissions, // Returning the JSON array directly
      };
    }),

  makeSubAdmin: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        permissions: z.array(z.enum(["VIEW", "EDIT", "DELETE"])).default(["VIEW"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const updatedUser = await prisma.user.update({
          where: { id: input.userId },
          data: {
            role: "SUBADMIN",
            permissions: input.permissions, // Directly updating the JSON field
          },
        });

        return {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          permissions: updatedUser.permissions, // Returning the JSON array
        };
      } catch (error) {
        console.error("Error making user a subadmin:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to make user a subadmin",
        });
      }
    }),
});
