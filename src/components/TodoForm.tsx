// import { useState, useEffect } from "react";
// import { trpc } from "@/utils/trpc";
// import styles from "@/styles/TodoForm.module.css";
// import { TextField, MenuItem, Button, Typography, Box } from "@mui/material";

// export default function TodoForm({ todo, onSave }: { todo?: any; onSave?: () => void }) {
//   const [title, setTitle] = useState(todo?.title || "");
//   const [description, setDescription] = useState(todo?.description || "");
//   const [dueDate, setDueDate] = useState(todo?.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : "");
//   const [priority, setPriority] = useState<"Low" | "Medium" | "High">(todo?.priority || "Medium");
//   const [status, setStatus] = useState<"Pending" | "In Progress" | "Completed">(todo?.status || "Pending");
//   const [userId, setUserId] = useState<string | null>(null);

//   // ✅ Fetch userId from localStorage on the client side
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedUserId = localStorage.getItem("userId");
//       if (storedUserId) {
//         setUserId(storedUserId);
//       } else {
//         console.error("🚨 User ID is missing from localStorage!");
//       }
//     }
//   }, []);

//   const addTodo = trpc.todo.addTodo.useMutation({
//     onSuccess: () => {
//       setTitle("");
//       setDescription("");
//       setDueDate("");
//       setPriority("Medium");
//       setStatus("Pending");
//       if (onSave) onSave();
//     },
//   });

//   const editTodo = trpc.todo.editTodo.useMutation({
//     onSuccess: () => {
//       if (onSave) onSave();
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // ✅ Ensure userId is available before making API calls
//     if (!userId) {
//       console.error("🚨 User ID is missing! Please log in.");
//       return;
//     }

//     const todoData = { title, description, dueDate, priority, status, userId };
//     console.log("📝 Sending todo data:", todoData);

//     if (todo) {
//       editTodo.mutate({ id: todo.id, ...todoData });
//     } else {
//       addTodo.mutate(todoData);
//     }
//   };

//   return (
//     <Box className={styles.formContainer}>
//       <Typography variant="h4" className={styles.heading}>
//         {todo ? "Edit Task" : "Create a New Task"}
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField className={styles.textField} label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
//         <TextField className={styles.textField} label="Description" variant="outlined" multiline minRows={3} value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
//         <TextField className={styles.textField} type="date" label="Due Date" InputLabelProps={{ shrink: true }} variant="outlined" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required fullWidth />
//         <TextField className={styles.textField} select label="Priority" variant="outlined" value={priority} onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")} fullWidth>
//           <MenuItem value="Low">Low</MenuItem>
//           <MenuItem value="Medium">Medium</MenuItem>
//           <MenuItem value="High">High</MenuItem>
//         </TextField>
//         <TextField className={styles.textField} select label="Status" variant="outlined" value={status} onChange={(e) => setStatus(e.target.value as "Pending" | "In Progress" | "Completed")} fullWidth>
//           <MenuItem value="Pending">Pending</MenuItem>
//           <MenuItem value="In Progress">In Progress</MenuItem>
//           <MenuItem value="Completed">Completed</MenuItem>
//         </TextField>
//         <Box className={styles.buttonContainer}>
//           <Button type="submit" variant="contained" className={styles.submitButton}>
//             {todo ? "Update Task" : "Add Task"}
//           </Button>
//         </Box>
//       </form>
//     </Box>
//   );
// }


import { useState, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import styles from "@/styles/TodoForm.module.css";
import { TextField, Button, Typography, Box, FormControlLabel, Checkbox, CircularProgress } from "@mui/material";

export default function TodoForm({ todo, onSave }: { todo?: any; onSave?: () => void }) {
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [completed, setCompleted] = useState(todo?.completed || false);
  const [tags, setTags] = useState(todo?.tags || "");
  const [deadline, setDeadline] = useState(todo?.deadline ? new Date(todo.deadline).toISOString().split("T")[0] : "");
  const [reminder, setReminder] = useState(todo?.reminder ? new Date(todo.reminder).toISOString().split("T")[0] : "");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.error("🚨 User ID is missing from localStorage!");
      }
    }
  }, []);

  const addTodo = trpc.todo.addTodo.useMutation({
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setCompleted(false);
      setTags("");
      setDeadline("");
      setReminder("");
      if (onSave) onSave();
    },
  });

  const editTodo = trpc.todo.editTodo.useMutation({
    onSuccess: () => {
      if (onSave) onSave();
    },
  });

  const isLoading = addTodo.isLoading || editTodo.isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      console.error("🚨 User ID is missing! Please log in.");
      return;
    }

    const todoData = { title, description, completed, tags, deadline, reminder, userId };
    console.log("📝 Sending todo data:", todoData);

    if (todo) {
      editTodo.mutate({ id: todo.id, ...todoData });
    } else {
      addTodo.mutate(todoData);
    }
  };

  return (
    <Box className={styles.formContainer}>
      <Typography variant="h4" className={styles.heading}>
        {todo ? "Edit Task" : "Create a New Task"}
      </Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField className={styles.textField} label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth/>
        <TextField className={styles.textField} label="Description" variant="outlined" multiline minRows={3} value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
        
        <FormControlLabel 
          control={<Checkbox checked={completed} onChange={(e) => setCompleted(e.target.checked)} />}
          label="Mark as Completed"
          className={styles.checkbox}
        />

        <TextField className={styles.textField} label="Tags" variant="outlined" value={tags} onChange={(e) => setTags(e.target.value)} fullWidth />
        <TextField className={styles.textField} type="date" label="Deadline" InputLabelProps={{ shrink: true }} variant="outlined" value={deadline} onChange={(e) => setDeadline(e.target.value)} fullWidth />
        <TextField className={styles.textField} type="date" label="Reminder" InputLabelProps={{ shrink: true }} variant="outlined" value={reminder} onChange={(e) => setReminder(e.target.value)} fullWidth />

        <Box className={styles.buttonContainer}>
          <Button type="submit" variant="contained" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              todo ? "Update Task" : "Add Task"
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
