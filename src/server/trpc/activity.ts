// import { z } from "zod";
// import { router, protectedProcedure } from "./trpc";
// import { TRPCError } from "@trpc/server";

// export const adminRouter = router({
//     getUsers: protectedProcedure.query(({ ctx }) => {
//         return ctx.prisma.user.findMany({
//             include: {
//                 todos: true,
//                 activities: true,
//             },
//         });
//     }),

//     updateUserRole: protectedProcedure
//         .input(
//             z.object({
//                 userId: z.string(),
//                 role: z.enum(["USER", "SUBADMIN", "ADMIN"]),
//                 permissions: z.array(z.nativeEnum(PermissionType)),
//             })
//         )
//         .mutation(async ({ ctx, input }) => {
//             const currentUser = ctx.user;
//             if (!currentUser) {
//                 throw new TRPCError({
//                     code: "UNAUTHORIZED",
//                     message: "Unauthorized request",
//                 });
//             }

//             if (input.role === "ADMIN" && currentUser.role !== "ADMIN") {
//                 throw new TRPCError({
//                     code: "FORBIDDEN",
//                     message: "Only admins can promote users to admin.",
//                 });
//             }

//             if (currentUser.role === "SUBADMIN" && input.role === "ADMIN") {
//                 throw new TRPCError({
//                     code: "FORBIDDEN",
//                     message: "Subadmins cannot promote users to admin.",
//                 });
//             }

//             const updatedUser = await ctx.prisma.user.update({
//                 where: { id: input.userId },
//                 data: {
//                     role: input.role,
//                     permissions: { set: [], create: input.permissions.map(type => ({ type, userId: input.userId })) },
//                 },
//             });

//             await ctx.prisma.activity.create({
//                 data: {
//                     userId: currentUser.id,
//                     action: `Updated role of ${updatedUser.email} to ${input.role} with permissions: ${input.permissions.join(", ")}`,
//                 },
//             });

//             return updatedUser;
//         }),

//     deleteTask: protectedProcedure
//         .input(z.object({ taskId: z.string() }))
//         .mutation(async ({ ctx, input }) => {
//             const currentUser = ctx.user;
//             if (!currentUser) {
//                 throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized request" });
//             }

//             const existingTask = await ctx.prisma.todo.findUnique({ where: { id: input.taskId } });
//             if (!existingTask) {
//                 throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
//             }
//             await ctx.prisma.todo.delete({ where: { id: input.taskId } });

//             await ctx.prisma.activity.create({
//                 data: {
//                     userId: currentUser.id,
//                     action: `Deleted task with ID: ${input.taskId}`,
//                 },
//             });
//             return { message: "Task deleted successfully" };
//         }),

//     getUserPermissions: protectedProcedure
//         .input(z.object({ userId: z.string() }))
//         .query(async ({ ctx, input }) => {
//             const user = await ctx.prisma.user.findUnique({
//                 where: { id: input.userId },
//                 select: { permissions: true },
//             });
//             if (!user) {
//                 throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
//             }
//             return user.permissions;
//         }),

//     getActivityLogs: protectedProcedure.query(({ ctx }) => {
//         return ctx.prisma.activity.findMany({
//             orderBy: { createdAt: "desc" },
//         });
//     }),
// });
