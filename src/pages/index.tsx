// import { useState } from "react";
// import { Box, Button, Container, Typography } from "@mui/material";
// // import Navbar from "../components/Navbar";
// import TodoList from "../components/TodoList";
// import TodoForm from "../components/TodoForm";

// export default function Home() {
//   const [showForm, setShowForm] = useState(false);

//   return (
//     <Container>
//       {/* <Navbar /> */}

//       <Box textAlign="center" my={10}>
//         <Typography variant="h4">Todo Management</Typography>
//         <Button 
//           variant="contained" 
//           color="primary" 
//           onClick={() => setShowForm(!showForm)} 
//           sx={{ marginTop: 2 }}
//         >
//           {showForm ? "Back to List" : "Add New Todo"}
//         </Button>
//       </Box>

//       {showForm ? <TodoForm onSave={() => setShowForm(false)} /> : <TodoList />}
//     </Container>
//   );
// }


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { Box, Button, Container, Typography, CircularProgress } from "@mui/material";
import TodoList from "../components/TodoList";
import TodoForm from "../components/TodoForm";
import Navbar from "@/components/Navbar";
import styles from "@/styles/Dashboard.module.css";
export default function Home() {
  const router = useRouter();
  const { data: todos, isLoading, error, refetch } = trpc.todo.getTodos.useQuery();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (!token) {
      setIsAuthenticated(false);
      router.push("/login");
    } else {
      setUser({ name: name || "User", email: email || "No email provided" });
    }
  }, [router]);

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setShowForm(!showForm);
      setButtonLoading(false);
    }, 1000);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className={styles.container}>
      <Navbar />
      <Box className={styles.welcomeSection}>
        <Box>
          <Typography variant="h5" className={styles.userName}>Welcome, {user?.name}</Typography>
          <Typography variant="body2" className={styles.userEmail}>{user?.email}</Typography>
        </Box>
      </Box>

      <Box className={styles.todoHeader}>
        <Typography variant="h4">Todo Management</Typography>
        <Button 
          variant="contained" 
          className={styles.addButton}
          onClick={handleButtonClick}
          disabled={buttonLoading} 
        >
          {buttonLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} /> 
          ) : showForm ? "Back to List" : "Add New Todo"}
        </Button>
      </Box>

      <Box className={styles.contentWrapper}>
        {isLoading && <CircularProgress className={styles.loader} sx={{ color: "#1976d2" }} />}
        {error && <Typography className={styles.errorMessage}>Error loading todos: {error.message}</Typography>}

        {showForm ? (
          <TodoForm onSave={() => { setShowForm(false); refetch(); }} />
        ) : (
          <TodoList todos={todos || []} refetch={refetch} />
        )}
      </Box>
    </Container>
  );
}
