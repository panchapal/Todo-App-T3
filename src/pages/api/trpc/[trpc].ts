import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "@/server/trpc/router"; // Ensure this is correctly imported
import { createContext } from "@/server/trpc/context";// Ensure this exists

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
