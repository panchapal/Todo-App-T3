// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { trpc } from "@/utils/trpc"
// import styles from "@/styles/TodoList.module.css"
// import { Typography, Button, TextField, Card, CardContent, Grid, Box, Chip } from "@mui/material"
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
// import { Edit, Delete, CheckCircle, Undo } from "@mui/icons-material"
// import { alpha } from "@mui/material/styles"
// // Define the type for Todo
// type Todo = {
//   id: string
//   userId: string
//   title: string
//   description: string | null
//   completed: boolean
//   tags: string | null
//   deadline: string | null
//   reminder: string | null
// }

// type TodoListProps = {
//   todos: Todo[]
//   refetch: () => void
// }

// export default function TodoList({ todos, refetch }: TodoListProps) {
//   const toggleTodo = trpc.todo.toggleTodo.useMutation({
//     onSuccess: async () => {
//       await refetch()
//     },
//   })
//   const deleteTodo = trpc.todo.deleteTodo.useMutation({
//     onSuccess: async () => {
//       await refetch()
//     },
//   })
//   const editTodo = trpc.todo.editTodo.useMutation({
//     onSuccess: () => {
//       setEditingTodo(null)
//       refetch()
//     },
//   })

//   const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
//   const [formData, setFormData] = useState<Omit<Todo, "id" | "userId">>({
//     title: "",
//     description: "",
//     tags: "",
//     deadline: "",
//     reminder: "",
//     completed: false,
//   })

//   const [userId, setUserId] = useState<string | null>(null)
//   useEffect(() => {
//     const storedUserId = localStorage.getItem("userId")
//     setUserId(storedUserId)
//   }, [])

//   const [tasks, setTasks] = useState<Todo[]>([])
//   useEffect(() => {
//     if (todos) {
//       setTasks(
//         todos
//           .filter((todo) => todo.userId === userId)
//           .map((todo) => ({
//             id: todo.id,
//             userId: todo.userId,
//             title: todo.title,
//             description: todo.description ?? "",
//             tags: todo.tags ?? "",
//             deadline: todo.deadline ?? "",
//             reminder: todo.reminder ?? "",
//             completed: todo.completed,
//           })),
//       )
//     }
//   }, [todos, userId])

//   const handleEditClick = (todo: Todo) => {
//     setEditingTodo(todo)
//     setFormData({
//       title: todo.title,
//       description: todo.description ?? "",
//       tags: todo.tags ?? "",
//       deadline: todo.deadline ?? "",
//       reminder: todo.reminder ?? "",
//       completed: todo.completed,
//     })
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleEditSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (editingTodo) {
//       editTodo.mutate({
//         id: editingTodo.id,
//         title: formData.title || "",
//         description: formData.description || "",
//         tags: formData.tags || "",
//         deadline: formData.deadline || "",
//         reminder: formData.reminder || "",
//         completed: formData.completed,
//       })
//     }
//   }

//   const onDragEnd = (result: any) => {
//     if (!result.destination) return

//     const updatedTasks = Array.from(tasks)
//     const [movedTask] = updatedTasks.splice(result.source.index, 1)

//     if (result.destination.droppableId === "Completed" && !movedTask.completed) {
//       movedTask.completed = true
//       toggleTodo.mutate(movedTask.id)
//     } else if (result.destination.droppableId === "Pending" && movedTask.completed) {
//       movedTask.completed = false
//       toggleTodo.mutate(movedTask.id)
//     }

//     updatedTasks.splice(result.destination.index, 0, movedTask)
//     setTasks(updatedTasks)
//   }

  

//   return (
//     <Box className={styles.container}>
//       <Typography variant="h2" className={styles.title}>
//         Kanban Todo List
//       </Typography>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Grid container spacing={3} className={styles.kanbanBoard}>
//           {["All Tasks", "Pending", "Completed"].map((category) => {
//             const filteredTasks =
//               category === "All Tasks"
//                 ? tasks
//                 : category === "Pending"
//                   ? tasks.filter((task) => !task.completed)
//                   : tasks.filter((task) => task.completed)

//             return (
//               <Grid item xs={12} md={4} key={category}>
//                 <Card className={styles.kanbanColumn}>
//                   <CardContent>
//                     <Typography variant="h5" className={styles.columnTitle}>
//                       {category}
//                     </Typography>
//                     <Droppable droppableId={category}>
//                       {(provided) => (
//                         <div ref={provided.innerRef} {...provided.droppableProps} className={styles.taskList}>
//                           {filteredTasks.length === 0 ? (
//                             <Typography variant="body2" className={styles.emptyMessage}>
//                               {category === "Pending" ? "No pending tasks" : "No completed tasks"}
//                             </Typography>
//                           ) : (
//                             filteredTasks.map((todo, index) => (
//                               <Draggable key={todo.id} draggableId={todo.id} index={index}>
//                                 {(provided) => (
//                                   <Card
//                                     ref={provided.innerRef}
//                                     {...provided.draggableProps}
//                                     {...provided.dragHandleProps}
//                                     className={styles.taskCard}
//                                   >
//                                     <CardContent>
//                                       {editingTodo?.id === todo.id ? (
//                                         <form onSubmit={handleEditSubmit} className={styles.editForm}>
//                                           <TextField
//                                             name="title"
//                                             value={formData.title}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             label="Title"
//                                             variant="outlined"
//                                             margin="normal"
//                                           />
//                                           <TextField
//                                             name="description"
//                                             value={formData.description}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             label="Description"
//                                             variant="outlined"
//                                             margin="normal"
//                                             multiline
//                                             rows={3}
//                                           />
//                                           <TextField
//                                             name="tags"
//                                             value={formData.tags}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             label="Tags"
//                                             variant="outlined"
//                                             margin="normal"
//                                           />
//                                           <TextField
//                                             name="deadline"
//                                             type="date"
//                                             value={formData.deadline}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             label="Deadline"
//                                             variant="outlined"
//                                             margin="normal"
//                                             InputLabelProps={{ shrink: true }}
//                                           />
//                                           <TextField
//                                             name="reminder"
//                                             type="datetime-local"
//                                             value={formData.reminder}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             label="Reminder"
//                                             variant="outlined"
//                                             margin="normal"
//                                             InputLabelProps={{ shrink: true }}
//                                           />
//                                           <Box className={styles.buttonGroup}>
//                                             <Button type="submit" variant="contained" color="primary">
//                                               Save
//                                             </Button>
//                                             <Button variant="outlined" onClick={() => setEditingTodo(null)}>
//                                               Cancel
//                                             </Button>
//                                           </Box>
//                                         </form>
//                                       ) : (
//                                         <>
//                                           <Typography variant="h6" className={styles.taskTitle}>
//                                             {todo.title}
//                                           </Typography>
//                                           <Typography variant="body2" className={styles.taskDescription}>
//                                             {todo.description}
//                                           </Typography>

//                                           <Box className={styles.taskMeta}>
//                                             <Chip sx={{fontFamily:"raleway,serif",fontWeight:"bold"}} label={`Tags: ${todo.tags}`} size="small" />
//                                             <Chip sx={{fontFamily:"raleway,serif",fontWeight:"bold"}}
//                                               label={`Deadline: ${new Date(todo.deadline || "").toLocaleDateString()}`}
//                                               size="small"
//                                             />
//                                             <Chip sx={{fontFamily:"raleway,serif",fontWeight:"bold"}}
//                                               label={`Reminder: ${new Date(todo.reminder || "").toLocaleDateString()}`}
//                                               size="small"
//                                             />
//                                           </Box>
//                                           <Box className={styles.buttonGroup}>
//                                             <Button
//                                               variant="contained"
//                                               color={todo.completed ? "secondary" : "primary"}
//                                               onClick={() => toggleTodo.mutate(todo.id)}
//                                               startIcon={todo.completed ? <Undo /> : <CheckCircle />}
//                                             >
//                                               {todo.completed ? "Undo" : "Complete"}
//                                             </Button>
//                                             <Button
//                                               variant="outlined"
//                                               onClick={() => handleEditClick(todo)}
//                                               startIcon={<Edit />}
//                                             >
//                                               Edit
//                                             </Button>
//                                             <Button
//                                               variant="outlined"
//                                               color="error"
//                                               onClick={() => deleteTodo.mutate(todo.id)}
//                                               startIcon={<Delete />}
//                                             >
//                                               Delete
//                                             </Button>
//                                           </Box>
//                                         </>
//                                       )}
//                                     </CardContent>
//                                   </Card>
//                                 )}
//                               </Draggable>
//                             ))
//                           )}
//                           {provided.placeholder}
//                         </div>
//                       )}
//                     </Droppable>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             )
//           })}
//         </Grid>
//       </DragDropContext>
//     </Box>
//   )
// }



// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   AppBar,
//   Box,
//   CssBaseline,
//   Drawer,
//   IconButton,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   Typography,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Divider,
//   Grid,
//   Card,
//   CardContent,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import { trpc } from "@/utils/trpc";
// import styles from "./AdminDashboard.module.css";

// const drawerWidth = 250;

// interface UserType {
//   id: string;
//   name: string;
//   email: string;
//   role: "USER" | "ADMIN";
// }

// interface TodoType {
//   id: string;
//   title: string;
//   description: string | null;
//   completed: boolean;
//   tags?: string | null;
//   deadline?: string | null;
//   reminder?: string | null;
//   userId: string;
// }

// const AdminDashboard = () => {
//   const router = useRouter();
//   const [admin, setAdmin] = useState<UserType | null>(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [editTodo, setEditTodo] = useState<TodoType | null>(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [editUserRole, setEditUserRole] = useState<{
//     id: string;
//     role: string;
//   } | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) return router.push("/admin/login");

//     fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => res.json())
//       .then((data: UserType) => setAdmin(data))
//       .catch(() => router.push("/admin/login"));
//   }, [router]);

//   const {
//     data: users,
//     isLoading: usersLoading,
//     refetch: refetchUsers,
//   } = trpc.auth.getAllUsers.useQuery<UserType[]>();
//   const {
//     data: todos,
//     isLoading: todosLoading,
//     refetch,
//   } = trpc.todo.getTodos.useQuery();

//   const updateTodoMutation = trpc.todo.editTodo.useMutation({
//     onSuccess: () => refetch(),
//   });
//   const deleteTodoMutation = trpc.todo.deleteTodo.useMutation({
//     onSuccess: () => refetch(),
//   });
//   const updateUserRoleMutation = trpc.auth.updateUserRole.useMutation({
//     onSuccess: () => refetchUsers(),
//   });

//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     router.push("/admin/login");
//   };

//   const handleEdit = (todo: TodoType) => {
//     setEditTodo({
//       ...todo,
//       description: todo.description ?? "",
//       tags: todo.tags ?? "",
//       deadline: todo.deadline ?? "",
//       reminder: todo.reminder ?? "",
//     });
//     setOpenDialog(true);
//   };

//   const handleSave = () => {
//     if (editTodo) {
//       updateTodoMutation.mutate({
//         ...editTodo,
//         description: editTodo.description ?? undefined,
//         tags: editTodo.tags ?? undefined,
//         deadline: editTodo.deadline ?? undefined,
//         reminder: editTodo.reminder ?? undefined,
//       });
//       setOpenDialog(false);
//     }
//   };

//   const handleDelete = (id: string) => {
//     deleteTodoMutation.mutate(id);
//   };
//   const handleRoleChange = (userId: string, newRole: string) => {
//     setEditUserRole({ id: userId, role: newRole });
//     updateUserRoleMutation.mutate({
//       userId,
//       role: newRole.toUpperCase() as "USER" | "ADMIN",
//     });
//   };

//   const drawer = (
//     <Box className={styles.sidebar}>
//       <Toolbar className={styles.toolbar}>
//         <Typography variant="h6" sx={{ fontFamily: "raleway,serif" }}>
//           Admin Panel
//         </Typography>
//       </Toolbar>
//       <Divider />
//       <List>
//         <ListItemButton
//           onClick={() => setActiveTab("dashboard")}
//           selected={activeTab === "dashboard"}
//         >
//           <ListItemIcon>
//             <DashboardIcon />
//           </ListItemIcon>
//           <ListItemText primary="Dashboard" />
//         </ListItemButton>
//         <ListItemButton
//           onClick={() => setActiveTab("users")}
//           selected={activeTab === "users"}
//         >
//           <ListItemIcon>
//             <PeopleIcon />
//           </ListItemIcon>
//           <ListItemText primary="Users" />
//         </ListItemButton>
//       </List>
//       <Divider />
//       <ListItemButton onClick={handleLogout} className={styles.logoutButton}>
//         <ListItemIcon>
//           <ExitToAppIcon />
//         </ListItemIcon>
//         <ListItemText primary="Logout" />
//       </ListItemButton>
//     </Box>
//   );

//   return (
//     <Box className={styles.mainContainer}>
//       <CssBaseline />
//       <AppBar position="fixed" className={styles.appBar}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             edge="start"
//             onClick={handleDrawerToggle}
//             className={styles.menuButton}
//           >
//             <MenuIcon />
//           </IconButton>
//           {/* <Typography variant="h6">Admin Dashboard</Typography> */}
//           {admin && (
//             <Typography className={styles.adminName}>
//               Welcome, {admin.name}
//             </Typography>
//           )}
//         </Toolbar>
//       </AppBar>

//       <nav>
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{ keepMounted: true }}
//           sx={{
//             display: { xs: "block", md: "none" },
//             "& .MuiDrawer-paper": {
//               width: drawerWidth,
//               color: "white",
//             },
//           }}
//         >
//           {drawer}
//         </Drawer>

//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: "none", md: "block" },
//             "& .MuiDrawer-paper": {
//               width: drawerWidth,
//               color: "white",
//             },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </nav>

//       <Box component="main" className={styles.content}>
//         <Toolbar />
//         {activeTab === "dashboard" && (
//           <Typography
//             variant="h5"
//             sx={{ fontFamily: "raleway,serif", fontWeight: "bold" }}
//           >
//             Admin: {admin?.name} ({admin?.email})
//           </Typography>
//         )}
//         {activeTab === "users" && (
//           <>
//             <Grid container spacing={2} className={styles.statsContainer}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6">Total Users</Typography>
//                     <Typography variant="h4">{users?.length ?? 0}</Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6">Total Todos</Typography>
//                     <Typography variant="h4">{todos?.length ?? 0}</Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             </Grid>
//             <Typography variant="h5" className={styles.tableTitle}>
//               Users List
//             </Typography>
//             {usersLoading ? (
//               <CircularProgress />
//             ) : (
//               <TableContainer
//                 component={Paper}
//                 className={styles.tableContainer}
//               >
//                 <Table>
//                   <TableHead>
//                     <TableRow className={styles.tableHeader}>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Email</TableCell>
//                       <TableCell>Todos</TableCell>
//                       <TableCell>Role</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {users?.map((user) => {
//                       const userTodos =
//                         todos?.filter((todo) => todo.userId === user.id) || [];

//                       return (
//                         <TableRow key={user.id}>
//                           <TableCell
//                             sx={{
//                               fontFamily: "raleway,serif",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {user.name}
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontFamily: "raleway,serif",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {user.email}
//                           </TableCell>
//                           <TableCell>
//                             {todosLoading ? (
//                               <CircularProgress />
//                             ) : userTodos.length > 0 ? (
//                               <Table>
//                                 <TableBody>
//                                   {userTodos.map((todo) => (
//                                     <TableRow key={todo.id}>
//                                       <TableCell
//                                         sx={{
//                                           fontFamily: "raleway,serif",
//                                           fontWeight: "bold",
//                                         }}
//                                       >
//                                         {todo.title}
//                                       </TableCell>
//                                       <TableCell
//                                         sx={{
//                                           fontFamily: "raleway,serif",
//                                           fontWeight: "bold",
//                                         }}
//                                       >
//                                         {todo.completed ? "✅" : "❌"}
//                                       </TableCell>
//                                       <TableCell>
//                                         <Button
//                                           onClick={() => handleEdit(todo)}
//                                           className={styles.editButton}
//                                         >
//                                           Edit
//                                         </Button>
//                                         <Button
//                                           onClick={() => handleDelete(todo.id)}
//                                           className={styles.deleteButton}
//                                         >
//                                           Delete
//                                         </Button>
//                                       </TableCell>
//                                     </TableRow>
//                                   ))}
//                                 </TableBody>
//                               </Table>
//                             ) : (
//                               <Typography
//                                 color="textSecondary"
//                                 variant="body2"
//                                 sx={{
//                                   fontFamily: "raleway,serif",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 No Todos Available
//                               </Typography>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <Select
//                               value={user.role}
//                               onChange={(e) =>
//                                 handleRoleChange(
//                                   user.id,
//                                   e.target.value as "USER" | "ADMIN"
//                                 )
//                               }
//                             >
//                               <MenuItem
//                                 value="USER"
//                                 sx={{
//                                   fontFamily: "raleway,serif",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 User
//                               </MenuItem>
//                               <MenuItem
//                                 value="ADMIN"
//                                 sx={{
//                                   fontFamily: "raleway,serif",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 Admin
//                               </MenuItem>
//                             </Select>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </>
//         )}
//       </Box>
//       <Dialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Edit Todo</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Title"
//             fullWidth
//             value={editTodo?.title || ""}
//             onChange={(e) =>
//               setEditTodo((prev) =>
//                 prev ? { ...prev, title: e.target.value } : prev
//               )
//             }
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button onClick={handleSave} disabled={!editTodo}>
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default AdminDashboard;


// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   AppBar,
//   Box,
//   CssBaseline,
//   Drawer,
//   IconButton,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   Typography,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Divider,
//   Grid,
//   Card,
//   CardContent,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Switch,
//   FormControlLabel,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import SecurityIcon from "@mui/icons-material/Security";
// import { trpc } from "@/utils/trpc";
// import styles from "./AdminDashboard.module.css";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// const drawerWidth = 250;

// interface UserType {
//   id: string;
//   name: string;
//   email: string;
//   role: "USER" | "ADMIN" | "SUBADMIN";
//   permissions?: string[];
// }

// interface TodoType {
//   id: string;
//   title: string;
//   description: string | null;
//   completed: boolean;
//   tags?: string | null;
//   deadline?: string | null;
//   reminder?: string | null;
//   userId: string;
// }

// const AdminDashboard = () => {
//   const router = useRouter();
//   const [admin, setAdmin] = useState<UserType | null>(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [editTodo, setEditTodo] = useState<TodoType | null>(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [openSubadminDialog, setOpenSubadminDialog] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [userPermissions, setUserPermissions] = useState({
//     canManageUsers: false,
//     canManageTodos: false,
//     canViewDashboard: false,
//   });
//   const [editUserRole, setEditUserRole] = useState<{
//     id: string;
//     role: string;
//   } | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) return router.push("/admin/login");

//     fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => res.json())
//       .then((data: UserType) => setAdmin(data))
//       .catch(() => router.push("/admin/login"));
//   }, [router]);

//   const {
//     data: users,
//     isLoading: usersLoading,
//     refetch: refetchUsers,
//   } = trpc.auth.getAllUsers.useQuery<UserType[]>();
//   const {
//     data: todos,
//     isLoading: todosLoading,
//     refetch,
//   } = trpc.todo.getTodos.useQuery();

//   const updateTodoMutation = trpc.todo.editTodo.useMutation({
//     onSuccess: () => refetch(),
//   });
//   const deleteTodoMutation = trpc.todo.deleteTodo.useMutation({
//     onSuccess: () => refetch(),
//   });
//   const updateUserRoleMutation = trpc.auth.updateUserRole.useMutation({
//     onSuccess: () => refetchUsers(),
//   });
//   const updateUserPermissionsMutation = trpc.auth.updateUserPermissions.useMutation({
//     onSuccess: () => refetchUsers(),
//   });

//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     router.push("/admin/login");
//   };

//   const handleEdit = (todo: TodoType) => {
//     setEditTodo({
//       ...todo,
//       description: todo.description ?? "",
//       tags: todo.tags ?? "",
//       deadline: todo.deadline ?? "",
//       reminder: todo.reminder ?? "",
//     });
//     setOpenDialog(true);
//   };

//   const handleSave = () => {
//     if (editTodo) {
//       updateTodoMutation.mutate({
//         ...editTodo,
//         description: editTodo.description ?? undefined,
//         tags: editTodo.tags ?? undefined,
//         deadline: editTodo.deadline ?? undefined,
//         reminder: editTodo.reminder ?? undefined,
//       });
//       setOpenDialog(false);
//     }
//   };

//   const handleDelete = (id: string) => {
//     deleteTodoMutation.mutate(id);
//   };

//   const handleRoleChange = (userId: string, newRole: string) => {
//     setEditUserRole({ id: userId, role: newRole });
//     updateUserRoleMutation.mutate({
//       userId,
//       role: newRole as "USER" | "ADMIN" | "SUBADMIN",
//     });
//   };

//   const handleMakeSubadmin = (user: UserType) => {
//     setSelectedUser(user);
//     // Initialize permissions based on user's existing ones if they're already a SUBADMIN
//     if (user.role === "SUBADMIN" && user.permissions) {
//       setUserPermissions({
//         canManageUsers: user.permissions.includes("MANAGE_USERS"),
//         canManageTodos: user.permissions.includes("MANAGE_TODOS"),
//         canViewDashboard: user.permissions.includes("VIEW_DASHBOARD"),
//       });
//     } else {
//       // Default permissions for new SUBADMIN
//       setUserPermissions({
//         canManageUsers: false,
//         canManageTodos: true,
//         canViewDashboard: true,
//       });
//     }
//     setOpenSubadminDialog(true);
//   };

//   const handleSavePermissions = () => {
//     if (selectedUser) {
//       // Convert permissions object to array
//       const permissionsArray = [];
//       if (userPermissions.canManageUsers) permissionsArray.push("MANAGE_USERS");
//       if (userPermissions.canManageTodos) permissionsArray.push("MANAGE_TODOS");
//       if (userPermissions.canViewDashboard) permissionsArray.push("VIEW_DASHBOARD");

//       // Update role to SUBADMIN and save permissions
//       updateUserRoleMutation.mutate({
//         userId: selectedUser.id,
//         role: "SUBADMIN",
//       });
      
//       updateUserPermissionsMutation.mutate({
//         userId: selectedUser.id,
//         permissions: permissionsArray,
//       });
      
//       setOpenSubadminDialog(false);
//     }
//   };

//   // Prepare data for charts
//   const prepareBarChartData = () => {
//     if (!users || !todos) return [];
    
//     return users.map(user => {
//       const userTodos = todos.filter(todo => todo.userId === user.id);
//       return {
//         name: user.name,
//         todos: userTodos.length,
//       };
//     });
//   };

//   const preparePieChartData = () => {
//     if (!todos) return [];
    
//     const completed = todos.filter(todo => todo.completed).length;
//     const uncompleted = todos.length - completed;
    
//     return [
//       { name: 'Completed', value: completed },
//       { name: 'Pending', value: uncompleted },
//     ];
//   };

//   const COLORS = ['#4CAF50', '#F44336'];

//   const drawer = (
//     <Box className={styles.sidebar}>
//       <Toolbar className={styles.toolbar}>
//         <Typography variant="h6" sx={{ fontFamily: "raleway,serif" }}>
//           Admin Panel
//         </Typography>
//       </Toolbar>
//       <Divider />
//       <List>
//         <ListItemButton
//           onClick={() => setActiveTab("dashboard")}
//           selected={activeTab === "dashboard"}
//         >
//           <ListItemIcon>
//             <DashboardIcon />
//           </ListItemIcon>
//           <ListItemText primary="Dashboard" />
//         </ListItemButton>
//         <ListItemButton
//           onClick={() => setActiveTab("users")}
//           selected={activeTab === "users"}
//         >
//           <ListItemIcon>
//             <PeopleIcon />
//           </ListItemIcon>
//           <ListItemText primary="Users" />
//         </ListItemButton>
//         {admin?.role === "ADMIN" && (
//           <ListItemButton
//             onClick={() => setActiveTab("permissions")}
//             selected={activeTab === "permissions"}
//           >
//             <ListItemIcon>
//               <SecurityIcon />
//             </ListItemIcon>
//             <ListItemText primary="Manage Permissions" />
//           </ListItemButton>
//         )}
//       </List>
//       <Divider />
//       <ListItemButton onClick={handleLogout} className={styles.logoutButton}>
//         <ListItemIcon>
//           <ExitToAppIcon />
//         </ListItemIcon>
//         <ListItemText primary="Logout" />
//       </ListItemButton>
//     </Box>
//   );

//   // Check if current user has appropriate permissions
//   const canViewDashboard = admin?.role === "ADMIN" || 
//     (admin?.role === "SUBADMIN" && admin.permissions?.includes("VIEW_DASHBOARD"));
  
//   const canManageUsers = admin?.role === "ADMIN" || 
//     (admin?.role === "SUBADMIN" && admin.permissions?.includes("MANAGE_USERS"));

//   return (
//     <Box className={styles.mainContainer}>
//       <CssBaseline />
//       <AppBar position="fixed" className={styles.appBar}>
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             edge="start"
//             onClick={handleDrawerToggle}
//             className={styles.menuButton}
//           >
//             <MenuIcon />
//           </IconButton>
//           {admin && (
//             <Typography className={styles.adminName}>
//               Welcome, {admin.name} ({admin.role})
//             </Typography>
//           )}
//         </Toolbar>
//       </AppBar>

//       <nav>
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{ keepMounted: true }}
//           sx={{
//             display: { xs: "block", md: "none" },
//             "& .MuiDrawer-paper": {
//               width: drawerWidth,
//               color: "white",
//             },
//           }}
//         >
//           {drawer}
//         </Drawer>

//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: "none", md: "block" },
//             "& .MuiDrawer-paper": {
//               width: drawerWidth,
//               color: "white",
//             },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </nav>

//       <Box component="main" className={styles.content}>
//         <Toolbar />
//         {activeTab === "dashboard" && canViewDashboard && (
//           <>
//             <Typography
//               variant="h5"
//               sx={{ fontFamily: "raleway,serif", fontWeight: "bold", mb: 3 }}
//             >
//               {admin?.role === "ADMIN" ? "Admin" : "Sub-Admin"}: {admin?.name} ({admin?.email})
//             </Typography>
            
//             {/* Charts */}
//             <Grid container spacing={3}>
//               {/* Bar Chart */}
//               <Grid item xs={12} md={6}>
//                 <Card sx={{ height: '100%', minHeight: 400 }}>
//                   <CardContent>
//                     <Typography variant="h6" sx={{ mb: 2 ,fontFamily: "raleway,serif", fontWeight: "bold"}}>
//                       Todos Per User
//                     </Typography>
//                     {!usersLoading && !todosLoading ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <BarChart
//                           data={prepareBarChartData()}
//                           margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
//                         >
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
//                           <YAxis />
//                           <Tooltip />
//                           <Legend />
//                           <Bar dataKey="todos" fill="#2196F3" name="Number of Todos" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
//                         <CircularProgress />
//                       </Box>
//                     )}
//                   </CardContent>
//                 </Card>
//               </Grid>
              
//               {/* Pie Chart */}
//               <Grid item xs={12} md={6}>
//                 <Card sx={{ height: '100%', minHeight: 400 }}>
//                   <CardContent>
//                     <Typography variant="h6" sx={{ mb: 2, fontFamily: "raleway,serif",fontWeight:"bold" }}>
//                       Todo Completion Status
//                     </Typography>
//                     {!todosLoading ? (
//                       <ResponsiveContainer width="100%" height={300}>
//                         <PieChart>
//                           <Pie
//                             data={preparePieChartData()}
//                             cx="50%"
//                             cy="50%"
//                             labelLine={true}
//                             label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                             outerRadius={68}
//                             fill="#8884d8"
//                             dataKey="value"
//                           >
//                             {preparePieChartData().map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Tooltip formatter={(value) => [value, 'Todos']} />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     ) : (
//                       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
//                         <CircularProgress />
//                       </Box>
//                     )}
//                   </CardContent>
//                 </Card>
//               </Grid>
              
//               {/* Stats Cards */}
//               <Grid container spacing={2} className={styles.statsContainer1}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6">Total Users</Typography>
//                     <Typography variant="h4">{users?.length ?? 0}</Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6">Total Todos</Typography>
//                     <Typography variant="h4">{todos?.length ?? 0}</Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6">Completed Todos</Typography>
//                     <Typography variant="h4">
//                       {todos?.filter(todo => todo.completed).length ?? 0}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6">Pending Todos</Typography>
//                     <Typography variant="h4">
//                       {todos?.filter(todo => !todo.completed).length ?? 0}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//               </Grid>
//             </Grid>
//           </>
//         )}
//         {activeTab === "users" && (
//           <>
//             <Grid container spacing={2} className={styles.statsContainer}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6">Total Users</Typography>
//                     <Typography variant="h4">{users?.length ?? 0}</Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6">Total Todos</Typography>
//                     <Typography variant="h4">{todos?.length ?? 0}</Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             </Grid>
//             <Typography variant="h5" className={styles.tableTitle}>
//               Users List
//             </Typography>
//             {usersLoading ? (
//               <CircularProgress />
//             ) : (
//               <TableContainer
//                 component={Paper}
//                 className={styles.tableContainer}
//               >
//                 <Table>
//                   <TableHead>
//                     <TableRow className={styles.tableHeader}>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Email</TableCell>
//                       <TableCell>Todos</TableCell>
//                       <TableCell>Role</TableCell>
//                       {admin?.role === "ADMIN" && <TableCell>Actions</TableCell>}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {users?.map((user) => {
//                       const userTodos =
//                         todos?.filter((todo) => todo.userId === user.id) || [];

//                       return (
//                         <TableRow key={user.id}>
//                           <TableCell
//                             sx={{
//                               fontFamily: "raleway,serif",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {user.name}
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               fontFamily: "raleway,serif",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {user.email}
//                           </TableCell>
//                           <TableCell>
//                             {todosLoading ? (
//                               <CircularProgress />
//                             ) : userTodos.length > 0 ? (
//                               <Table>
//                                 <TableBody>
//                                   {userTodos.map((todo) => (
//                                     <TableRow key={todo.id}>
//                                       <TableCell
//                                         sx={{
//                                           fontFamily: "raleway,serif",
//                                           fontWeight: "bold",
//                                         }}
//                                       >
//                                         {todo.title}
//                                       </TableCell>
//                                       <TableCell
//                                         sx={{
//                                           fontFamily: "raleway,serif",
//                                           fontWeight: "bold",
//                                         }}
//                                       >
//                                         {todo.completed ? "✅" : "❌"}
//                                       </TableCell>
//                                       <TableCell>
//                                         <Button
//                                           onClick={() => handleEdit(todo)}
//                                           className={styles.editButton}
//                                         >
//                                           Edit
//                                         </Button>
//                                         <Button
//                                           onClick={() => handleDelete(todo.id)}
//                                           className={styles.deleteButton}
//                                         >
//                                           Delete
//                                         </Button>
//                                       </TableCell>
//                                     </TableRow>
//                                   ))}
//                                 </TableBody>
//                               </Table>
//                             ) : (
//                               <Typography
//                                 color="textSecondary"
//                                 variant="body2"
//                                 sx={{
//                                   fontFamily: "raleway,serif",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 No Todos Available
//                               </Typography>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <Select
//                               value={user.role}
//                               onChange={(e) =>
//                                 handleRoleChange(
//                                   user.id,
//                                   e.target.value as string
//                                 )
//                               }
//                               disabled={!canManageUsers}
//                             >
//                               <MenuItem
//                                 value="USER"
//                                 sx={{
//                                   fontFamily: "raleway,serif",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 User
//                               </MenuItem>
//                               <MenuItem
//                                 value="SUBADMIN"
//                                 sx={{
//                                   fontFamily: "raleway,serif",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 Sub-Admin
//                               </MenuItem>
//                               {admin?.role === "ADMIN" && (
//                                 <MenuItem
//                                   value="ADMIN"
//                                   sx={{
//                                     fontFamily: "raleway,serif",
//                                     fontWeight: "bold",
//                                   }}
//                                 >
//                                   Admin
//                                 </MenuItem>
//                               )}
//                             </Select>
//                           </TableCell>
//                           {admin?.role === "ADMIN" && (
//                             <TableCell>
//                               <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={() => handleMakeSubadmin(user)}
//                                 disabled={user.role === "ADMIN"}
//                               >
//                                 {user.role === "SUBADMIN" ? "Edit Permissions" : "Make Sub-Admin"}
//                               </Button>
//                             </TableCell>
//                           )}
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </>
//         )}
//         {activeTab === "permissions" && admin?.role === "ADMIN" && (
//           <>
//             <Typography variant="h5" className={styles.tableTitle}>
//               Manage Sub-Admin Permissions
//             </Typography>
//             {usersLoading ? (
//               <CircularProgress />
//             ) : (
//               <TableContainer
//                 component={Paper}
//                 className={styles.tableContainer}
//               >
//                 <Table>
//                   <TableHead>
//                     <TableRow className={styles.tableHeader}>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Email</TableCell>
//                       <TableCell>Role</TableCell>
//                       <TableCell>Permissions</TableCell>
//                       <TableCell>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {users?.filter(user => user.role === "SUBADMIN").map((user) => (
//                       <TableRow key={user.id}>
//                         <TableCell>{user.name}</TableCell>
//                         <TableCell>{user.email}</TableCell>
//                         <TableCell>{user.role}</TableCell>
//                         <TableCell>
//                           {user.permissions?.join(", ") || "No specific permissions"}
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={() => handleMakeSubadmin(user)}
//                           >
//                             Edit Permissions
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </>
//         )}
//       </Box>
      
//       {/* Todo Edit Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Edit Todo</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Title"
//             fullWidth
//             value={editTodo?.title || ""}
//             onChange={(e) =>
//               setEditTodo((prev) =>
//                 prev ? { ...prev, title: e.target.value } : prev
//               )
//             }
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button onClick={handleSave} disabled={!editTodo}>
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
      
//       {/* Sub-Admin Permissions Dialog */}
//       <Dialog
//         open={openSubadminDialog}
//         onClose={() => setOpenSubadminDialog(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           {selectedUser?.role === "SUBADMIN" 
//             ? `Edit Sub-Admin Permissions for ${selectedUser?.name}`
//             : `Make ${selectedUser?.name} a Sub-Admin`}
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body1" sx={{ mb: 2 }}>
//             Select the permissions this sub-admin should have:
//           </Typography>
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={userPermissions.canManageUsers}
//                 onChange={(e) =>
//                   setUserPermissions((prev) => ({
//                     ...prev,
//                     canManageUsers: e.target.checked,
//                   }))
//                 }
//                 color="primary"
//               />
//             }
//             label="Can Manage Users"
//           />
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={userPermissions.canManageTodos}
//                 onChange={(e) =>
//                   setUserPermissions((prev) => ({
//                     ...prev,
//                     canManageTodos: e.target.checked,
//                   }))
//                 }
//                 color="primary"
//               />
//             }
//             label="Can Manage Todos"
//           />
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={userPermissions.canViewDashboard}
//                 onChange={(e) =>
//                   setUserPermissions((prev) => ({
//                     ...prev,
//                     canViewDashboard: e.target.checked,
//                   }))
//                 }
//                 color="primary"
//               />
//             }
//             label="Can View Dashboard"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenSubadminDialog(false)}>Cancel</Button>
//           <Button onClick={handleSavePermissions} disabled={!selectedUser}>
//             Save Permissions
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default AdminDashboard;