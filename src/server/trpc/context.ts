// import { inferAsyncReturnType } from '@trpc/server';
// import { prisma } from './prisma';// Corrected path
// import { getToken } from '../../utils/auth';

// export async function createContext({ req }: { req: any }) {
//   const token = req.headers.authorization;
//   const user = token ? getToken(token) : null;
//   return { prisma, user };
  
// }

// export type Context = inferAsyncReturnType<typeof createContext>;



// import { inferAsyncReturnType } from '@trpc/server';
// import { prisma } from './prisma'; // Ensure the path is correct
// import { getToken } from '../../utils/auth'; // Ensure this function properly verifies JWTs
// import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

// export async function createContext({ req }: CreateNextContextOptions) {
//   let user = null;
  
//   const authHeader = req.headers.authorization;
  
//   if (authHeader && authHeader.startsWith('Bearer ')) {
//     const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
//     try {
//       user = await getToken(token); // Ensure `getToken` properly verifies the token
//     } catch (error) {
//       console.error('Invalid token:', error);
//     }
//   }

//   return { prisma, user };
// }

// export type Context = inferAsyncReturnType<typeof createContext>;

import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function createContext({ req }: trpcNext.CreateNextContextOptions) {
  // Get user ID from request (authentication logic depends on your implementation)
  const userId = req.headers.authorization || '';
  
  // If there's no userId, return minimal context
  if (!userId) {
    return { prisma };
  }
  
  // Fetch user with permissions
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      permissions: true,
    },
  });
  
  // Return context with user data
  return {
    prisma,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
