import { trpc } from "@/utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { AppType } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/globals.css"; // Ensure global styles are imported

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({ url: "http://localhost:3000/api/trpc" }),
      //  // Ensure this matches your API route
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default MyApp;




// const trpcClient = trpc.createClient({
//   links: [
//     httpBatchLink({
//       url: "http://localhost:3000/api/trpc",
//       headers() {
//         const token = localStorage.getItem("token");
//         return token ? { Authorization: `Bearer ${token}` } : {};
//       },
//     }),
//   ],
// });