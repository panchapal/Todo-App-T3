// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { trpc } from "../utils/trpc";
// import { Box, Button, Container, Typography } from "@mui/material";
// import TodoList from "../components/TodoList";
// import TodoForm from "../components/TodoForm";
// import Navbar from "@/components/Navbar";
// import styles from "@/styles/Dashboard.module.css";

// export default function Dashboard() {
//   const router = useRouter();
//   const { data: todos, isLoading, error, refetch } = trpc.todo.getTodos.useQuery();
//   const [user, setUser] = useState<{ name: string; email: string } | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const name = localStorage.getItem("name");
//     const email = localStorage.getItem("email");

//     if (!token) {
//       setIsAuthenticated(false);
//       router.push("/login");
//     } else {
//       setUser({ name: name || "User", email: email || "No email provided" });
//     }
//   }, [router]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("name");
//     localStorage.removeItem("email");
//     router.push("/login");
//   };

//   if (!isAuthenticated) {
//     return null; // Prevent rendering if user is not authenticated
//   }

//   return (
//     <Container className={styles.container}>
//       <Navbar />
      
//       <Box className={styles.welcomeSection}>
//         <Box>
//           <Typography variant="h5">Welcome, {user?.name}</Typography>
//           <Typography variant="body2">{user?.email}</Typography>
//         </Box>
//         <Button 
//           variant="contained" 
//           className={styles.logoutButton}
//           onClick={handleLogout}
//         >
//           Logout
//         </Button>
//       </Box>

//       <Box className={styles.todoHeader}>
//         <Typography variant="h4">Todo Management</Typography>
//         <Button 
//           variant="contained" 
//           className={styles.addButton}
//           onClick={() => setShowForm(!showForm)}
//         >
//           {showForm ? "Back to List" : "Add New Todo"}
//         </Button>
//       </Box>

//       {isLoading && <Typography className={styles.loadingMessage}>Loading todos...</Typography>}
//       {error && <Typography className={styles.errorMessage}>Error loading todos: {error.message}</Typography>}

//       {showForm ? <TodoForm onSave={() => { setShowForm(false); refetch(); }} /> : <TodoList todos={todos || []} refetch={refetch} />}
//     </Container>
//   );
// }
