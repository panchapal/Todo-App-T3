import { router } from "./trpc";// Adjust path based on your project structure
import { todoRouter } from "./todo"; // Ensure correct import
import { authRouter } from "./auth";
// import { adminRouter } from "./activity";
export const appRouter = router({
  todo: todoRouter,
  auth: authRouter, 
  // activity: adminRouter,
});

// Export router type
export type AppRouter = typeof appRouter;
