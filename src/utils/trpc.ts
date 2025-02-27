// import { createTRPCReact } from '@trpc/react-query';
// import type { AppRouter } from '../server/trpc/router'; // Adjust the path as needed

// export const trpc = createTRPCReact<AppRouter>();



import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/trpc/router';
import { httpBatchLink } from '@trpc/client';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc', // Ensure this matches your Next.js API route
      headers() {
        const token = localStorage.getItem('adminToken'); // Ensure correct token key
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
