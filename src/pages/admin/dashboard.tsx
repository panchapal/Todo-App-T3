// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon,
//   ListItemText, Toolbar, Typography, Button, CircularProgress,
//   Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Card, CardContent, CardActions
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import { trpc } from "@/utils/trpc";

// const drawerWidth = 280;

// interface UserType {
//   id: string;
//   name: string;
//   email: string;
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

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) return router.push("/admin/login");

//     fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => res.json())
//       .then((data: UserType) => setAdmin(data))
//       .catch(() => router.push("/admin/login"));
//   }, [router]);

//   const { data: users, isLoading: usersLoading } = trpc.auth.getAllUsers.useQuery<UserType[]>();
//   const { data: todos, isLoading: todosLoading, refetch } = trpc.todo.getTodos.useQuery();

//   const updateTodoMutation = trpc.todo.editTodo.useMutation({ onSuccess: () => refetch() });
//   const deleteTodoMutation = trpc.todo.deleteTodo.useMutation({ onSuccess: () => refetch() });

//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     router.push("/admin/login");
//   };

//   const handleEdit = (todo: TodoType) => {
//     setEditTodo({
//       ...todo,
//       description: todo.description ?? "", // Converts null to an empty string
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

//   const drawer = (
//     <div>
//       <Toolbar>
//         <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>Admin Panel</Typography>
//       </Toolbar>
//       <Divider />
//       <List>
//         <ListItemButton onClick={() => setActiveTab("dashboard")} selected={activeTab === "dashboard"}>
//           <ListItemIcon><DashboardIcon sx={{ color: "white" }} /></ListItemIcon>
//           <ListItemText primary="Dashboard" sx={{ color: "white" }} />
//         </ListItemButton>
//         <ListItemButton onClick={() => setActiveTab("users")} selected={activeTab === "users"}>
//           <ListItemIcon><PeopleIcon sx={{ color: "white" }} /></ListItemIcon>
//           <ListItemText primary="Users" sx={{ color: "white" }} />
//         </ListItemButton>
//       </List>
//       <Divider sx={{ borderColor: "white" }} />
//       <List>
//         <ListItemButton onClick={handleLogout}>
//           <ListItemIcon><ExitToAppIcon sx={{ color: "white" }} /></ListItemIcon>
//           <ListItemText primary="Logout" sx={{ color: "white" }} />
//         </ListItemButton>
//       </List>
//     </div>
//   );

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
//       <CssBaseline />
//       <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, backgroundColor: "#1e293b" }}>
//         <Toolbar>
//           <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: "none" } }}>
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" sx={{ flexGrow: 1, color: "#fff" }}>Admin Dashboard</Typography>
//           {admin && <Typography variant="body1" sx={{ mr: 2, color: "#fff" }}>Welcome, {admin.name}</Typography>}
//         </Toolbar>
//       </AppBar>
//       <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
//         <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: drawerWidth,  backgroundColor: "#1e293b", color: "white"  } }}>{drawer}</Drawer>
//         <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: drawerWidth, backgroundColor: "#1e293b", color: "white" } }} open>{drawer}</Drawer>
//       </Box>
//       <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
//         <Toolbar />
//         {activeTab === "dashboard" && admin && (
//           <>
//             <Typography variant="h5" sx={{ fontWeight: "bold" }}>Admin: {admin.name} ({admin.email})</Typography>

//           </>
//         )}
//         {activeTab === "users" && (
//           <>
//             <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>Users List</Typography>
//             {usersLoading ? (
//               <CircularProgress />
//             ) : (
//               <Grid container spacing={3}>
//                 {users?.filter(user => user.id !== admin?.id).map(user => (
//                   <Grid item xs={12} sm={6} md={4} key={user.id}>
//                     <Card sx={{ maxWidth: 345, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
//                       <CardContent>
//                         <Typography variant="h6">{user.name}<br/>{user.email}</Typography>
//                         {todosLoading ? (
//                           <CircularProgress />
//                         ) : (
//                           todos?.filter(todo => todo.userId === user.id).map(todo => (
//                             <Box key={todo.id} sx={{ mt: 2 }}>
//                               <Typography variant="body1"><b>Title:</b> {todo.title}</Typography>
//                               <Typography variant="body2">📌 <b>Description:</b> {todo.description}</Typography>
//                               <Typography variant="body2">✅ <b>Status:</b> {todo.completed ? "Completed" : "Pending"}</Typography>
//                               <Typography variant="body2">🏷️ <b>Tags:</b> {Array.isArray(todo.tags) ? todo.tags.join(", ") : "No Tags"}</Typography>
//                               <Typography variant="body2">📅 <b>Deadline:</b> {todo.deadline ? new Date(todo.deadline).toLocaleDateString() : "No Deadline"}</Typography>
//                               <Typography variant="body2">⏰ <b>Reminder:</b> {todo.reminder ? new Date(todo.reminder).toLocaleString() : "No Reminder"}</Typography>
//                               <CardActions>
//                                 <Button onClick={() => handleEdit(todo)} color="primary">Edit</Button>
//                                 <Button color="error" onClick={() => handleDelete(todo.id)}>Delete</Button>
//                               </CardActions>
//                             </Box>
//                           ))
//                         )}
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             )}
//           </>
//         )}
//       </Box>

//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Todo</DialogTitle>
//         <DialogContent>
//           <TextField label="Title" fullWidth value={editTodo?.title || ""} onChange={(e) => setEditTodo((prev) => prev ? { ...prev, title: e.target.value } : prev)} />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button onClick={handleSave} disabled={!editTodo}>Save</Button>
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
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import ExitToAppIcon from "@mui/icons-material/ExitToApp";
// import { trpc } from "@/utils/trpc";
// import styles from "./AdminDashboard.module.css";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
//           <>
//             <Typography
//               variant="h5"
//               sx={{ fontFamily: "raleway,serif", fontWeight: "bold", mb: 3 }}
//             >
//               Admin: {admin?.name} ({admin?.email})
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
// import { PermissionType } from "@prisma/client";

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
//     if (!canManageTodos) {
//       alert("You don't have permission to edit todos");
//       return;
//     }
//     setEditTodo({
//       ...todo,
//       description: todo.description ?? "",
//       tags: todo.tags ?? "",
//       deadline: todo.deadline ?? "",
//       reminder: todo.reminder ?? "",
//     });
//     setOpenDialog(true);
//   };

//   // Modify handleDelete to include permission check
//   const handleDelete = (id: string) => {
//     if (!canManageTodos) {
//       alert("You don't have permission to delete todos");
//       return;
//     }
//     deleteTodoMutation.mutate(id);
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

//   // const handleDelete = (id: string) => {
//   //   deleteTodoMutation.mutate(id);
//   // };

//   const handleRoleChange = (userId: string, newRole: string) => {
//     setEditUserRole({ id: userId, role: newRole });
//     updateUserRoleMutation.mutate({
//       userId,
//       role: newRole as "USER" | "ADMIN" | "SUBADMIN",
//     });
//   };

//   const handleMakeSubadmin = (user: UserType) => {
//     setSelectedUser(user);

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

//   // const handleSavePermissions = () => {
//   //   const token = localStorage.getItem("adminToken");
//   //   if (!token) {
//   //     console.error("No admin token found!");
//   //     return router.push("/admin/login");
//   //   }

//   //   if (selectedUser) {
//   //     const permissionsArray: PermissionType[] = [];

//   //     if (userPermissions.canManageUsers) permissionsArray.push(PermissionType.MANAGE_USERS);
//   //     if (userPermissions.canManageTodos) permissionsArray.push(PermissionType.MANAGE_TODOS);
//   //     if (userPermissions.canViewDashboard) permissionsArray.push(PermissionType.VIEW_DASHBOARD);

//   //     updateUserRoleMutation.mutate(
//   //       { userId: selectedUser.id, role: "SUBADMIN" },
//   //       { context: { headers: { Authorization: `Bearer ${token}` } } }
//   //     );

//   //     updateUserPermissionsMutation.mutate(
//   //       { userId: selectedUser.id, permissions: permissionsArray },
//   //       { context: { headers: { Authorization: `Bearer ${token}` } } }
//   //     );

//   //     setOpenSubadminDialog(false);
//   //   }
//   // };

//   const handleSavePermissions = () => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) {
//       console.error("No admin token found!");
//       return router.push("/admin/login");
//     }

//     if (selectedUser) {
//       const permissionsArray: PermissionType[] = [];

//       if (userPermissions.canManageUsers) permissionsArray.push(PermissionType.MANAGE_USERS);
//       if (userPermissions.canManageTodos) permissionsArray.push(PermissionType.MANAGE_TODOS);
//       if (userPermissions.canViewDashboard) permissionsArray.push(PermissionType.VIEW_DASHBOARD);

//       updateUserRoleMutation.mutate(
//         { userId: selectedUser.id, role: "SUBADMIN" },
//         {
//           context: { headers: { Authorization: `Bearer ${token}` } },
//           onSuccess: () => {
//             updateUserPermissionsMutation.mutate(
//               { userId: selectedUser.id, permissions: permissionsArray },
//               {
//                 context: { headers: { Authorization: `Bearer ${token}` } },
//                 onSuccess: () => {
//                   alert("User successfully made Subadmin!");
//                   router.push("/admin/login");
//                 },
//                 onError: (error) => {
//                   console.error("Failed to update permissions:", error);
//                   alert("Failed to update permissions. Please try again.");
//                 },
//               }
//             );
//           },
//           onError: (error) => {
//             console.error("Failed to update role:", error);
//             alert("Failed to update role. Please try again.");
//           },
//         }
//       );

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
//   (admin?.role === "SUBADMIN" && admin.permissions?.includes("VIEW_DASHBOARD"));

// const canManageTodos = admin?.role === "ADMIN" ||
//   (admin?.role === "SUBADMIN" && admin.permissions?.includes("MANAGE_TODOS"));

// const canManageUsers = admin?.role === "ADMIN" ||
//   (admin?.role === "SUBADMIN" && admin.permissions?.includes("MANAGE_USERS"));

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
//             <Typography className={styles.adminName} sx={{marginLeft:"200px"}}>
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
//                               disabled={!canManageTodos}
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
// import { PermissionType } from "@prisma/client";

// const drawerWidth = 250;

// // interface UserType {
// //   id: string;
// //   name: string;
// //   email: string;
// //   role: "USER" | "ADMIN" | "SUBADMIN";
// //   permissions?: string[];
// // }

// // interface TodoType {
// //   id: string;
// //   title: string;
// //   description: string | null;
// //   completed: boolean;
// //   tags?: string | null;
// //   deadline?: string | null;
// //   reminder?: string | null;
// //   userId: string;
// // }

// interface UserType {
//   id: string;
//   name: string;
//   email: string;
//   role: "USER" | "ADMIN" | "SUBADMIN";
//   permissions?: string[]; // ✅ Permissions stored as JSON array
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

// type PermissionType = "VIEW" | "EDIT" | "DELETE";

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
//     canView: false,
//     canEdit: false,
//     canDelete: false,
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

//   const { data: users, isLoading: usersLoading, refetch: refetchUsers } =
//     trpc.auth.getAllUsers.useQuery<UserType[]>();
//   const { data: todos, isLoading: todosLoading, refetch } =
//     trpc.todo.getTodos.useQuery();

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
//     // if (!canEdit) {
//     //   alert("You don't have permission to edit todos");
//     //   return;
//     // }
//     setEditTodo({
//       ...todo,
//       description: todo.description ?? "",
//       tags: todo.tags ?? "",
//       deadline: todo.deadline ?? "",
//       reminder: todo.reminder ?? "",
//     });
//     setOpenDialog(true);
//   };

//   const handleDelete = (id: string) => {
//     // if (!canDelete) {
//     //   alert("You don't have permission to delete todos");
//     //   return;
//     // }
//     deleteTodoMutation.mutate(id);
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

//   const handleRoleChange = (userId: string, newRole: string) => {
//     setEditUserRole({ id: userId, role: newRole });
//     updateUserRoleMutation.mutate({
//       userId,
//       role: newRole as "USER" | "ADMIN" | "SUBADMIN",
//     });
//   };

//   const handleMakeSubadmin = (user: UserType) => {
//     setSelectedUser(user);

//     if (user.role === "SUBADMIN" && user.permissions) {
//       setUserPermissions({
//         canView: user.permissions.includes("VIEW"),
//         canEdit: user.permissions.includes("EDIT"),
//         canDelete: user.permissions.includes("DELETE"),
//       });
//     } else {
//       setUserPermissions({
//         canView: true,
//         canEdit: false,
//         canDelete: false,
//       });
//     }

//     setOpenSubadminDialog(true);
//   };

  // const handleSavePermissions = () => {
  //   const token = localStorage.getItem("adminToken");
  //   if (!token) {
  //     console.error("No admin token found!");
  //     return router.push("/admin/login");
  //   }

  //   if (selectedUser) {
  //     const permissionsArray: PermissionType[] = [];

  //     if (userPermissions.canView) permissionsArray.push("VIEW");
  //     if (userPermissions.canEdit) permissionsArray.push("EDIT");
  //     if (userPermissions.canDelete) permissionsArray.push("DELETE");

  //     updateUserRoleMutation.mutate(
  //       { userId: selectedUser.id, role: "SUBADMIN" },
  //       {
  //         context: { headers: { Authorization: `Bearer ${token}` } },
  //         onSuccess: () => {
  //           updateUserPermissionsMutation.mutate(
  //             { userId: selectedUser.id, permissions: permissionsArray },
  //             {
  //               context: { headers: { Authorization: `Bearer ${token}` } },
  //               onSuccess: () => {
  //                 alert("User successfully made Subadmin!");
  //                 router.push("/admin/login");
  //               },
  //               onError: (error) => {
  //                 console.error("Failed to update permissions:", error);
  //                 alert("Failed to update permissions. Please try again.");
  //               },
  //             }
  //           );
  //         },
  //         onError: (error) => {
  //           console.error("Failed to update role:", error);
  //           alert("Failed to update role. Please try again.");
  //         },
  //       }
  //     );

  //     setOpenSubadminDialog(false);
  //   }
  // };

//   const canView = admin?.role === "ADMIN" ||
//     (admin?.role === "SUBADMIN" && admin.permissions?.includes("VIEW"));

//   const canEdit = admin?.role === "ADMIN" ||
//     (admin?.role === "SUBADMIN" && admin.permissions?.includes("EDIT"));

//   const canDelete = admin?.role === "ADMIN" ||
//     (admin?.role === "SUBADMIN" && admin.permissions?.includes("DELETE"));
//   (admin?.role === "SUBADMIN" && admin.permissions?.includes("MANAGE_USERS"));

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
//             <Typography className={styles.adminName} sx={{marginLeft:"200px"}}>
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

//       {/* <Box component="main" className={styles.content}>
//         <Toolbar />
//         {activeTab === "dashboard" && canViewDashboard && (
//           <>
//             <Typography
//               variant="h5"
//               sx={{ fontFamily: "raleway,serif", fontWeight: "bold", mb: 3 }}
//             >
//               {admin?.role === "ADMIN" ? "Admin" : "Sub-Admin"}: {admin?.name} ({admin?.email})
//             </Typography>

//             <Grid container spacing={3}>
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
//                               disabled={!canManageTodos}
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
//     </Box> */}
//     <Box component="main" className={styles.content}>
//   <Toolbar />
//   {activeTab === "dashboard" && canView && (
//     <>
//       <Typography
//         variant="h5"
//         sx={{ fontFamily: "raleway,serif", fontWeight: "bold", mb: 3 }}
//       >
//         {admin?.role === "ADMIN" ? "Admin" : "Sub-Admin"}: {admin?.name} ({admin?.email})
//       </Typography>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card sx={{ height: '100%', minHeight: 400 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ mb: 2 ,fontFamily: "raleway,serif", fontWeight: "bold"}}>
//                 Todos Per User
//               </Typography>
//               {!usersLoading && !todosLoading ? (
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart
//                     data={prepareBarChartData()}
//                     margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="todos" fill="#2196F3" name="Number of Todos" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
//                   <CircularProgress />
//                 </Box>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card sx={{ height: '100%', minHeight: 400 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ mb: 2, fontFamily: "raleway,serif",fontWeight:"bold" }}>
//                 Todo Completion Status
//               </Typography>
//               {!todosLoading ? (
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={preparePieChartData()}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={true}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={68}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {preparePieChartData().map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip formatter={(value) => [value, 'Todos']} />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
//                   <CircularProgress />
//                 </Box>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid container spacing={2} className={styles.statsContainer1}>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Total Users</Typography>
//                 <Typography variant="h4">{users?.length ?? 0}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Total Todos</Typography>
//                 <Typography variant="h4">{todos?.length ?? 0}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Completed Todos</Typography>
//                 <Typography variant="h4">
//                   {todos?.filter(todo => todo.completed).length ?? 0}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Pending Todos</Typography>
//                 <Typography variant="h4">
//                   {todos?.filter(todo => !todo.completed).length ?? 0}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Grid>
//     </>
//   )}
//   {activeTab === "users" && (
//     <>
//       <Grid container spacing={2} className={styles.statsContainer}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Total Users</Typography>
//               <Typography variant="h4">{users?.length ?? 0}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6">Total Todos</Typography>
//               <Typography variant="h4">{todos?.length ?? 0}</Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//       <Typography variant="h5" className={styles.tableTitle}>
//         Users List
//       </Typography>
//       {usersLoading ? (
//         <CircularProgress />
//       ) : (
//         <TableContainer
//           component={Paper}
//           className={styles.tableContainer}
//         >
//           <Table>
//             <TableHead>
//               <TableRow className={styles.tableHeader}>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Todos</TableCell>
//                 <TableCell>Role</TableCell>
//                 {admin?.role === "ADMIN" && <TableCell>Actions</TableCell>}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {users?.map((user) => {
//                 const userTodos =
//                   todos?.filter((todo) => todo.userId === user.id) || [];

//                 return (
//                   <TableRow key={user.id}>
//                     <TableCell
//                       sx={{
//                         fontFamily: "raleway,serif",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {user.name}
//                     </TableCell>
//                     <TableCell
//                       sx={{
//                         fontFamily: "raleway,serif",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {user.email}
//                     </TableCell>
//                     <TableCell>
//                       {todosLoading ? (
//                         <CircularProgress />
//                       ) : userTodos.length > 0 ? (
//                         <Table>
//                           <TableBody>
//                             {userTodos.map((todo) => (
//                               <TableRow key={todo.id}>
//                                 <TableCell
//                                   sx={{
//                                     fontFamily: "raleway,serif",
//                                     fontWeight: "bold",
//                                   }}
//                                 >
//                                   {todo.title}
//                                 </TableCell>
//                                 <TableCell
//                                   sx={{
//                                     fontFamily: "raleway,serif",
//                                     fontWeight: "bold",
//                                   }}
//                                 >
//                                   {todo.completed ? "✅" : "❌"}
//                                 </TableCell>
//                                 <TableCell>
//                                   <Button
//                                     onClick={() => handleEdit(todo)}
//                                     className={styles.editButton}
//                                   >
//                                     Edit
//                                   </Button>
//                                   <Button
//                                     onClick={() => handleDelete(todo.id)}
//                                     className={styles.deleteButton}
//                                   >
//                                     Delete
//                                   </Button>
//                                 </TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       ) : (
//                         <Typography
//                           color="textSecondary"
//                           variant="body2"
//                           sx={{
//                             fontFamily: "raleway,serif",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           No Todos Available
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Select
//                         value={user.role}
//                         onChange={(e) =>
//                           handleRoleChange(
//                             user.id,
//                             e.target.value as string
//                           )
//                         }
//                         disabled={!canEdit}
//                       >
//                         <MenuItem
//                           value="USER"
//                           sx={{
//                             fontFamily: "raleway,serif",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           User
//                         </MenuItem>
//                         <MenuItem
//                           value="SUBADMIN"
//                           sx={{
//                             fontFamily: "raleway,serif",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           Sub-Admin
//                         </MenuItem>
//                         {admin?.role === "ADMIN" && (
//                           <MenuItem
//                             value="ADMIN"
//                             sx={{
//                               fontFamily: "raleway,serif",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             Admin
//                           </MenuItem>
//                         )}
//                       </Select>
//                     </TableCell>
//                     {admin?.role === "ADMIN" && (
//                       <TableCell>
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           onClick={() => handleMakeSubadmin(user)}
//                           disabled={user.role === "ADMIN"}
//                         >
//                           {user.role === "SUBADMIN" ? "Edit Permissions" : "Make Sub-Admin"}
//                         </Button>
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </>
//   )}
//   {activeTab === "permissions" && admin?.role === "ADMIN" && (
//     <>
//       <Typography variant="h5" className={styles.tableTitle}>
//         Manage Sub-Admin Permissions
//       </Typography>
//       {usersLoading ? (
//         <CircularProgress />
//       ) : (
//         <TableContainer
//           component={Paper}
//           className={styles.tableContainer}
//         >
//           <Table>
//             <TableHead>
//               <TableRow className={styles.tableHeader}>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Role</TableCell>
//                 <TableCell>Permissions</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {users?.filter(user => user.role === "SUBADMIN").map((user) => (
//                 <TableRow key={user.id}>
//                   <TableCell>{user.name}</TableCell>
//                   <TableCell>{user.email}</TableCell>
//                   <TableCell>{user.role}</TableCell>
//                   <TableCell>
//                     {user.permissions?.join(", ") || "No specific permissions"}
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => handleMakeSubadmin(user)}
//                     >
//                       Edit Permissions
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </>
//   )}
// </Box>

// <Dialog
//   open={openDialog}
//   onClose={() => setOpenDialog(false)}
//   maxWidth="sm"
//   fullWidth
// >
//   <DialogTitle>Edit Todo</DialogTitle>
//   <DialogContent>
//     <TextField
//       label="Title"
//       fullWidth
//       value={editTodo?.title || ""}
//       onChange={(e) =>
//         setEditTodo((prev) =>
//           prev ? { ...prev, title: e.target.value } : prev
//         )
//       }
//     />
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//     <Button onClick={handleSave} disabled={!editTodo}>
//       Save
//     </Button>
//   </DialogActions>
// </Dialog>

// <Dialog
//   open={openSubadminDialog}
//   onClose={() => setOpenSubadminDialog(false)}
//   maxWidth="sm"
//   fullWidth
// >
//   <DialogTitle>
//     {selectedUser?.role === "SUBADMIN"
//       ? `Edit Sub-Admin Permissions for ${selectedUser?.name}`
//       : `Make ${selectedUser?.name} a Sub-Admin`}
//   </DialogTitle>
//   <DialogContent>
//     <Typography variant="body1" sx={{ mb: 2 }}>
//       Select the permissions this sub-admin should have:
//     </Typography>
//     <FormControlLabel
//       control={
//         <Switch
//           checked={userPermissions.canView}
//           onChange={(e) =>
//             setUserPermissions((prev) => ({
//               ...prev,
//               canView: e.target.checked,
//             }))
//           }
//           color="primary"
//         />
//       }
//       label="Can View"
//     />
//     <FormControlLabel
//       control={
//         <Switch
//           checked={userPermissions.canEdit}
//           onChange={(e) =>
//             setUserPermissions((prev) => ({
//               ...prev,
//               canEdit: e.target.checked,
//             }))
//           }
//           color="primary"
//         />
//       }
//       label="Can Edit"
//     />
//     <FormControlLabel
//       control={
//         <Switch
//           checked={userPermissions.canDelete}
//           onChange={(e) =>
//             setUserPermissions((prev) => ({
//               ...prev,
//               canDelete: e.target.checked,
//             }))
//           }
//           color="primary"
//         />
//       }
//       label="Can Delete"
//     />
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={() => setOpenSubadminDialog(false)}>Cancel</Button>
//     <Button onClick={handleSavePermissions} disabled={!selectedUser}>
//       Save Permissions
//     </Button>
//   </DialogActions>
// </Dialog>
// </Box>
//   );
// };

// export default AdminDashboard;

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SecurityIcon from "@mui/icons-material/Security";
import { trpc } from "@/utils/trpc";
import styles from "./AdminDashboard.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { PermissionType } from "@prisma/client";

const drawerWidth = 250;

interface UserType {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "SUBADMIN";
  permissions?: string[]; // ✅ Permissions stored as JSON array
}

interface TodoType {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  tags?: string | null;
  deadline?: string | null;
  reminder?: string | null;
  userId: string;
}

type PermissionType = "VIEW" | "EDIT" | "DELETE";

const AdminDashboard = () => {
  const router = useRouter();
  const [admin, setAdmin] = useState<UserType | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<TodoType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSubadminDialog, setOpenSubadminDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [userPermissions, setUserPermissions] = useState({
    canView: false,
    canEdit: false,
    canDelete: false,
  });

  const [editUserRole, setEditUserRole] = useState<{
    id: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return router.push("/admin/login");

    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data: UserType) => setAdmin(data))
      .catch(() => router.push("/admin/login"));
  }, [router]);

  const {
    data: users,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = trpc.auth.getAllUsers.useQuery<UserType[]>();
  const {
    data: todos,
    isLoading: todosLoading,
    refetch,
  } = trpc.todo.getTodos.useQuery();

  const updateTodoMutation = trpc.todo.editTodo.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteTodoMutation = trpc.todo.deleteTodo.useMutation({
    onSuccess: () => refetch(),
  });

  const updateUserRoleMutation = trpc.auth.updateUserRole.useMutation({
    onSuccess: () => refetchUsers(),
  });

  const updateUserPermissionsMutation =
    trpc.auth.updateUserPermissions.useMutation({
      onSuccess: () => refetchUsers(),
    });

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleEdit = (todo: TodoType) => {
    setEditTodo({
      ...todo,
      description: todo.description ?? "",
      tags: todo.tags ?? "",
      deadline: todo.deadline ?? "",
      reminder: todo.reminder ?? "",
    });
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  const handleSave = () => {
    if (editTodo) {
      updateTodoMutation.mutate({
        ...editTodo,
        description: editTodo.description ?? undefined,
        tags: editTodo.tags ?? undefined,
        deadline: editTodo.deadline ?? undefined,
        reminder: editTodo.reminder ?? undefined,
      });
      setOpenDialog(false);
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setEditUserRole({ id: userId, role: newRole });
    updateUserRoleMutation.mutate({
      userId,
      role: newRole as "USER" | "ADMIN" | "SUBADMIN",
    });
  };

  const handleMakeSubadmin = (user: UserType) => {
    setSelectedUser(user);

    if (user.role === "SUBADMIN" && user.permissions) {
      setUserPermissions({
        canView: user.permissions.includes("VIEW"),
        canEdit: user.permissions.includes("EDIT"),
        canDelete: user.permissions.includes("DELETE"),
      });
    } else {
      setUserPermissions({
        canView: true,
        canEdit: true,
        canDelete: true,
      });
    }

    setOpenSubadminDialog(true);
  };

  const handleSavePermissions = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.error("No admin token found!");
      return router.push("/admin/login");
    }

    if (selectedUser) {
      const permissionsArray: PermissionType[] = [];

      if (userPermissions.canView) permissionsArray.push("VIEW");
      if (userPermissions.canEdit) permissionsArray.push("EDIT");
      if (userPermissions.canDelete) permissionsArray.push("DELETE");

      updateUserRoleMutation.mutate(
        { userId: selectedUser.id, role: "SUBADMIN" },
        {
          context: { headers: { Authorization: `Bearer ${token}` } },
          onSuccess: () => {
            updateUserPermissionsMutation.mutate(
              { userId: selectedUser.id, permissions: permissionsArray },
              {
                context: { headers: { Authorization: `Bearer ${token}` } },
                onSuccess: () => {
                  alert("User successfully made Subadmin!");
                  router.push("/admin/login");
                },
                onError: (error) => {
                  console.error("Failed to update permissions:", error);
                  alert("Failed to update permissions. Please try again.");
                },
              }
            );
          },
          onError: (error) => {
            console.error("Failed to update role:", error);
            alert("Failed to update role. Please try again.");
          },
        }
      );

      setOpenSubadminDialog(false);
    }
  };

  const canView =
    admin?.role === "ADMIN" ||
    (admin?.role === "SUBADMIN" && admin.permissions?.includes("VIEW"));

  const canEdit =
    admin?.role === "ADMIN" ||
    (admin?.role === "SUBADMIN" && admin.permissions?.includes("EDIT"));

  const canDelete =
    admin?.role === "ADMIN" ||
    (admin?.role === "SUBADMIN" && admin.permissions?.includes("DELETE"));
  admin?.role === "SUBADMIN" && admin.permissions?.includes("MANAGE_USERS");

  const prepareBarChartData = () => {
    if (!users || !todos) return [];

    return users.map((user) => {
      const userTodos = todos.filter((todo) => todo.userId === user.id);
      return {
        name: user.name,
        todos: userTodos.length,
      };
    });
  };

  const preparePieChartData = () => {
    if (!todos) return [];

    const completed = todos.filter((todo) => todo.completed).length;
    const uncompleted = todos.length - completed;

    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: uncompleted },
    ];
  };

  const COLORS = ["#4CAF50", "#F44336"];

  const drawer = (
    <Box className={styles.sidebar}>
      <Toolbar className={styles.toolbar}>
        <Typography variant="h6" sx={{ fontFamily: "raleway,serif" }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItemButton
          onClick={() => setActiveTab("dashboard")}
          selected={activeTab === "dashboard"}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton
          onClick={() => setActiveTab("users")}
          selected={activeTab === "users"}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
       
      </List>
      <Divider />
      <ListItemButton onClick={handleLogout} className={styles.logoutButton}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </Box>
  );

  return (
    <Box className={styles.mainContainer}>
      <CssBaseline />
      <AppBar position="fixed" className={styles.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            className={styles.menuButton}
          >
            <MenuIcon />
          </IconButton>
          {admin && (
            <Typography
              className={styles.adminName}
              sx={{ marginLeft: "200px" }}
            >
              Welcome, {admin.name} ({admin.role})
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              color: "white",
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              color: "white",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" className={styles.content}>
        <Toolbar />
        {activeTab === "dashboard" && canView && (
          <>
            <Typography
              variant="h5"
              sx={{ fontFamily: "raleway,serif", fontWeight: "bold", mb: 3 }}
            >
              {admin?.role === "ADMIN" ? "Admin" : "Sub-Admin"}: {admin?.name} (
              {admin?.email})
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: "100%", minHeight: 400 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontFamily: "raleway,serif",
                        fontWeight: "bold",
                      }}
                    >
                      Todos Per User
                    </Typography>
                    {!usersLoading && !todosLoading ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={prepareBarChartData()}
                          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="todos"
                            fill="#2196F3"
                            name="Number of Todos"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 300,
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: "100%", minHeight: 400 }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontFamily: "raleway,serif",
                        fontWeight: "bold",
                      }}
                    >
                      Todo Completion Status
                    </Typography>
                    {!todosLoading ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={preparePieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={68}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {preparePieChartData().map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, "Todos"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 300,
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid container spacing={2} className={styles.statsContainer1}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Total Users</Typography>
                      <Typography variant="h4">{users?.length ?? 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Total Todos</Typography>
                      <Typography variant="h4">{todos?.length ?? 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Completed Todos</Typography>
                      <Typography variant="h4">
                        {todos?.filter((todo) => todo.completed).length ?? 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Pending Todos</Typography>
                      <Typography variant="h4">
                        {todos?.filter((todo) => !todo.completed).length ?? 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        {activeTab === "users" && (
          <>
            <Grid container spacing={2} className={styles.statsContainer}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Users</Typography>
                    <Typography variant="h4">{users?.length ?? 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Total Todos</Typography>
                    <Typography variant="h4">{todos?.length ?? 0}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Typography variant="h5" className={styles.tableTitle}>
              Users List
            </Typography>
            {usersLoading ? (
              <CircularProgress />
            ) : (
              <TableContainer
                component={Paper}
                className={styles.tableContainer}
              >
                <Table>
                  <TableHead>
                    <TableRow className={styles.tableHeader}>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Todos</TableCell>
                      <TableCell>Role</TableCell>
                      {admin?.role === "ADMIN" && (
                        <TableCell>Actions</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.map((user) => {
                      const userTodos =
                        todos?.filter((todo) => todo.userId === user.id) || [];

                      return (
                        <TableRow key={user.id}>
                          <TableCell
                            sx={{
                              fontFamily: "raleway,serif",
                              fontWeight: "bold",
                            }}
                          >
                            {user.name}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontFamily: "raleway,serif",
                              fontWeight: "bold",
                            }}
                          >
                            {user.email}
                          </TableCell>
                          <TableCell>
                            {todosLoading ? (
                              <CircularProgress />
                            ) : userTodos.length > 0 ? (
                              <Table>
                                <TableBody>
                                  {userTodos.map((todo) => (
                                    <TableRow key={todo.id}>
                                      <TableCell
                                        sx={{
                                          fontFamily: "raleway,serif",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {todo.title}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontFamily: "raleway,serif",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {todo.completed ? "✅" : "❌"}
                                      </TableCell>
                                      <TableCell>
                                        <Button
                                          onClick={() => handleEdit(todo)}
                                          className={styles.editButton}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          onClick={() => handleDelete(todo.id)}
                                          className={styles.deleteButton}
                                        >
                                          Delete
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <Typography
                                color="textSecondary"
                                variant="body2"
                                sx={{
                                  fontFamily: "raleway,serif",
                                  fontWeight: "bold",
                                }}
                              >
                                No Todos Available
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  user.id,
                                  e.target.value as string
                                )
                              }
                              disabled={!canEdit}
                            >
                              <MenuItem
                                value="USER"
                                sx={{
                                  fontFamily: "raleway,serif",
                                  fontWeight: "bold",
                                }}
                              >
                                User
                              </MenuItem>
                              <MenuItem
                                value="SUBADMIN"
                                sx={{
                                  fontFamily: "raleway,serif",
                                  fontWeight: "bold",
                                }}
                              >
                                Sub-Admin
                              </MenuItem>
                              {admin?.role === "ADMIN" && (
                                <MenuItem
                                  value="ADMIN"
                                  sx={{
                                    fontFamily: "raleway,serif",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Admin
                                </MenuItem>
                              )}
                            </Select>
                          </TableCell>
                          {admin?.role === "ADMIN" && (
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleMakeSubadmin(user)}
                                disabled={user.role === "ADMIN"}
                              >
                                {user.role === "SUBADMIN"
                                  ? "Edit Permissions"
                                  : "Make Sub-Admin"}
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
        
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={editTodo?.title || ""}
            onChange={(e) =>
              setEditTodo((prev) =>
                prev ? { ...prev, title: e.target.value } : prev
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!editTodo}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSubadminDialog}
        onClose={() => setOpenSubadminDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedUser?.role === "SUBADMIN"
            ? `Edit Sub-Admin Permissions for ${selectedUser?.name}`
            : `Make ${selectedUser?.name} a Sub-Admin`}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Select the permissions this sub-admin should have:
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={userPermissions.canView}
                onChange={(e) =>
                  setUserPermissions((prev) => ({
                    ...prev,
                    canView: e.target.checked,
                  }))
                }
                color="primary"
              />
            }
            label="Can View"
          />
          <FormControlLabel
            control={
              <Switch
                checked={userPermissions.canEdit}
                onChange={(e) =>
                  setUserPermissions((prev) => ({
                    ...prev,
                    canEdit: e.target.checked,
                  }))
                }
                color="primary"
              />
            }
            label="Can Edit"
          />
          <FormControlLabel
            control={
              <Switch
                checked={userPermissions.canDelete}
                onChange={(e) =>
                  setUserPermissions((prev) => ({
                    ...prev,
                    canDelete: e.target.checked,
                  }))
                }
                color="primary"
              />
            }
            label="Can Delete"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubadminDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePermissions} disabled={!selectedUser}>
            Save Permissions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
