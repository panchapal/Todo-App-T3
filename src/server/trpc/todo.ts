// import { initTRPC } from "@trpc/server";
// import { z } from "zod";
// import { Context } from "./context";

// const t = initTRPC.context<Context>().create();

// export const todoRouter = t.router({
//   // ✅ Fetch all todos (Include user details)
//   getTodos: t.procedure.query(async ({ ctx }) => {
//     return ctx.prisma.todo.findMany({
//       include: { user: true }, // Include user data
//     });
//   }),

//   // ✅ Add a new todo (Require userId)
//   addTodo: t.procedure
//     .input(
//       z.object({
//         title: z.string().min(1),
//         description: z.string().optional(),
//         dueDate: z.string().optional(), // Accepts ISO Date string
//         priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
//         status: z.enum(["Pending", "In Progress", "Completed"]).default("Pending"),
//         userId: z.string().min(1), // Ensure userId is provided
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       return ctx.prisma.todo.create({
//         data: {
//           title: input.title,
//           description: input.description,
//           dueDate: input.dueDate ? new Date(input.dueDate) : null,
//           priority: input.priority,
//           status: input.status,
//           user: {
//             connect: { id: input.userId }, // Connect todo to user
//           },
//         },
//       });
//     }),

//   // ✅ Edit a todo (Ensure userId remains unchanged)
//   editTodo: t.procedure
//     .input(
//       z.object({
//         id: z.string(), // Required for identifying the todo
//         title: z.string().min(1),
//         description: z.string().optional(),
//         dueDate: z.string().optional(),
//         priority: z.enum(["Low", "Medium", "High"]),
//         status: z.enum(["Pending", "In Progress", "Completed"]),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       return ctx.prisma.todo.update({
//         where: { id: input.id },
//         data: {
//           title: input.title,
//           description: input.description,
//           dueDate: input.dueDate ? new Date(input.dueDate) : null,
//           priority: input.priority,
//           status: input.status,
//         },
//       });
//     }),

//   // ✅ Toggle a todo's status
//   toggleTodo: t.procedure
//     .input(z.string())
//     .mutation(async ({ ctx, input }) => {
//       const todo = await ctx.prisma.todo.findUnique({ where: { id: input } });
//       if (!todo) throw new Error("Todo not found");

//       return ctx.prisma.todo.update({
//         where: { id: input },
//         data: { status: todo.status === "Completed" ? "Pending" : "Completed" },
//       });
//     }),

//   // ✅ Delete a todo
//   deleteTodo: t.procedure
//     .input(z.string())
//     .mutation(async ({ ctx, input }) => {
//       return ctx.prisma.todo.delete({ where: { id: input } });
//     }),
// });

// export type AppRouter = typeof todoRouter;



// import { initTRPC } from "@trpc/server";
// import { z } from "zod";
// import { Context } from "./context";

// const t = initTRPC.context<Context>().create();

// export const todoRouter = t.router({
//   // ✅ Fetch all todos (Include user details)
//   getTodos: t.procedure.query(async ({ ctx }) => {
//     return ctx.prisma.todo.findMany({
//       include: { user: true }, // Include user data
//     });
//   }),

//   // ✅ Add a new todo (Require userId)
//   addTodo: t.procedure
//     .input(
//       z.object({
//         title: z.string().min(1),
//         description: z.string().optional(),
//         completed: z.boolean().default(false),
//         tags: z.string().optional(),
//         deadline: z.string().optional(),
//         reminder: z.string().optional(),
//         userId: z.string().min(1), // Ensure userId is provided
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       return ctx.prisma.todo.create({
//         data: {
//           title: input.title,
//           description: input.description,
//           completed: input.completed,
//           tags: input.tags,
//           deadline: input.deadline ? new Date(input.deadline) : null,
//           reminder: input.reminder ? new Date(input.reminder) : null,
//           user: {
//             connect: { id: input.userId }, // Connect todo to user
//           },
//         },
//       });
//     }),

//   // ✅ Edit a todo (Ensure userId remains unchanged)
//   editTodo: t.procedure
//     .input(
//       z.object({
//         id: z.string(),
//         title: z.string().min(1),
//         description: z.string().optional(),
//         completed: z.boolean(),
//         tags: z.string().optional(),
//         deadline: z.string().optional(),
//         reminder: z.string().optional(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       return ctx.prisma.todo.update({
//         where: { id: input.id },
//         data: {
//           title: input.title,
//           description: input.description,
//           completed: input.completed,
//           tags: input.tags,
//           deadline: input.deadline ? new Date(input.deadline) : null,
//           reminder: input.reminder ? new Date(input.reminder) : null,
//         },
//       });
//     }),

//   // ✅ Toggle task completion
//   toggleTodo: t.procedure
//     .input(z.string())
//     .mutation(async ({ ctx, input }) => {
//       const todo = await ctx.prisma.todo.findUnique({ where: { id: input } });
//       if (!todo) throw new Error("Todo not found");

//       return ctx.prisma.todo.update({
//         where: { id: input },
//         data: { completed: !todo.completed },
//       });
//     }),

//   // ✅ Delete a todo
//   deleteTodo: t.procedure
//     .input(z.string())
//     .mutation(async ({ ctx, input }) => {
//       return ctx.prisma.todo.delete({ where: { id: input } });
//     }),
// });

// export type AppRouter = typeof todoRouter;



import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { Context } from "./context";

const t = initTRPC.context<Context>().create();

// Create middleware to check permissions
const checkPermission = t.middleware(async ({ ctx, next, meta }) => {
  // Skip permission check for admin users
  if (ctx.user?.role === "ADMIN") {
    return next();
  }

  // For subadmins, check if they have the required permission
  if (ctx.user?.role === "SUBADMIN") {
    const requiredPermission = (meta as { requiredPermission?: "VIEW" | "EDIT" | "DELETE" })?.requiredPermission;
    
    if (!requiredPermission) {
      return next();
    }

    // Check if the user has the required permission
    const userPermissions = ctx.user.permissions as string[] || [];
    
    if (!userPermissions.includes(requiredPermission)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `You don't have ${requiredPermission} permission for this operation`,
      });
    }
  }

  return next();
});

// Create procedures with permission requirements
const viewProcedure = t.procedure.use(checkPermission).meta({ requiredPermission: "VIEW" });
const editProcedure = t.procedure.use(checkPermission).meta({ requiredPermission: "EDIT" });
const deleteProcedure = t.procedure.use(checkPermission).meta({ requiredPermission: "DELETE" });

export const todoRouter = t.router({
  // VIEW permission required
  getTodos: viewProcedure.query(async ({ ctx }) => {
    return ctx.prisma.todo.findMany({
      include: { user: true },
    });
  }),

  // EDIT permission required
  addTodo: editProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        completed: z.boolean().default(false),
        tags: z.string().optional(),
        deadline: z.string().optional(),
        reminder: z.string().optional(),
        userId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          title: input.title,
          description: input.description,
          completed: input.completed,
          tags: input.tags,
          deadline: input.deadline ? new Date(input.deadline) : null,
          reminder: input.reminder ? new Date(input.reminder) : null,
          user: {
            connect: { id: input.userId },
          },
        },
      });
    }),

  // EDIT permission required
  editTodo: editProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        completed: z.boolean(),
        tags: z.string().optional(),
        deadline: z.string().optional(),
        reminder: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          completed: input.completed,
          tags: input.tags,
          deadline: input.deadline ? new Date(input.deadline) : null,
          reminder: input.reminder ? new Date(input.reminder) : null,
        },
      });
    }),

  // EDIT permission required
  toggleTodo: editProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.prisma.todo.findUnique({ where: { id: input } });
      if (!todo) throw new TRPCError({ 
        code: "NOT_FOUND",
        message: "Todo not found" 
      });

      return ctx.prisma.todo.update({
        where: { id: input },
        data: { completed: !todo.completed },
      });
    }),

  // DELETE permission required
  deleteTodo: deleteProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.todo.delete({ where: { id: input } });
    }),
});

export type AppRouter = typeof todoRouter;