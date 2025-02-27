// import { useState, useMemo,useEffect } from "react";
// import { trpc } from "@/utils/trpc";
// import styles from "@/styles/TodoList.module.css";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Grid,
//   FormControl,InputLabel,Stack
// } from "@mui/material";
// import { SelectChangeEvent } from "@mui/material";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// // Define the type for Todo
// type Todo = {
//   id: string;
//   userId: string;
//   title: string;
//   description: string;
//   dueDate: string;
//   priority: "Low" | "Medium" | "High";
//   status: "Pending" | "In Progress" | "Completed";
//   completed: boolean;
// };

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// export default function TodoList() {
//   const { data: todos, refetch } = trpc.todo.getTodos.useQuery<Todo[]>();

//   const toggleTodo = trpc.todo.toggleTodo.useMutation({
//     onSuccess: () => refetch(),
//   });

//   const deleteTodo = trpc.todo.deleteTodo.useMutation({
//     onSuccess: () => refetch(),
//   });

//   const editTodo = trpc.todo.editTodo.useMutation({
//     onSuccess: () => {
//       setEditingTodo(null);
//       refetch();
//     },
//   });

//   const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
//    const [formData, setFormData] = useState<Omit<Todo, "id" | "completed">>({
//     title: "",
//     description: "",
//     dueDate: "",
//     priority: "Medium",
//     status: "Pending",
//   });

//   const handleEditClick = (todo: Todo) => {
//     setEditingTodo(todo);
//     setFormData({
//       title: todo.title,
//       description: todo.description,
//       dueDate: todo.dueDate,
//       priority: todo.priority,
//       status: todo.status,
//     });
//   };
//  // Get logged-in user ID from localStorage
//  const [userId, setUserId] = useState<string | null>(null);

//  useEffect(() => {
//    const storedUserId = localStorage.getItem("userId");
//    setUserId(storedUserId);
//  }, []);

//  // Filter todos for the logged-in user
//  const userTodos = useMemo(() => {
//    return todos?.filter((todo) => todo.userId === userId) || [];
//  }, [todos, userId]);

//   const handleInputChange = (
//     e:
//       | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//       | SelectChangeEvent
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingTodo) {
//       editTodo.mutate({ id: editingTodo.id, ...formData });
//     }
//   };

//   // Process data for Recharts
//   const statusData = useMemo(() => {
//     const statusCount = { Pending: 0, "In Progress": 0, Completed: 0 };
//     userTodos?.forEach((todo) => {
//       statusCount[todo.status]++;
//     });
//     return Object.entries(statusCount).map(([status, count]) => ({
//       status,
//       count,
//     }));
//   }, [userTodos]);

//   const priorityData = useMemo(() => {
//     const priorityCount = { Low: 0, Medium: 0, High: 0 };
//     userTodos?.forEach((todo) => {
//       priorityCount[todo.priority]++;
//     });
//     return Object.entries(priorityCount).map(([priority, count]) => ({
//       name: priority,
//       value: count,
//     }));
//   }, [userTodos]);

//   return (
//     <div className={styles.container}>
//       <Typography variant="h4" className={styles.title}>
//         Todo List
//       </Typography>

//       <Grid container spacing={3}>
//         {userTodos?.map((todo) => (
//           <Grid item xs={12} sm={6} md={4} key={todo.id}>
//             <Card className={styles.card}>
//               <CardContent>
//                 {editingTodo?.id === todo.id ? (
//                   <form onSubmit={handleEditSubmit} className={styles.form}>
//                   <Stack spacing={2}>
//                     <TextField
//                       label="Title"
//                       name="title"
//                       value={formData.title}
//                       onChange={handleInputChange}
//                       fullWidth
//                       required
//                     />
//                     <TextField
//                       label="Description"
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       fullWidth
//                       multiline
//                       rows={3}
//                     />
//                     <TextField
//                       type="date"
//                       name="dueDate"
//                       value={formData.dueDate}
//                       onChange={handleInputChange}
//                       fullWidth
//                       required
//                       InputLabelProps={{ shrink: true }} // Ensures label stays when selecting a date
//                     />
//                     <FormControl fullWidth>
//                       <InputLabel>Priority</InputLabel>
//                       <Select
//                        label="priority"
//                         name="priority"
//                         value={formData.priority}
//                         onChange={handleInputChange}
//                       >
//                         <MenuItem value="Low">Low</MenuItem>
//                         <MenuItem value="Medium">Medium</MenuItem>
//                         <MenuItem value="High">High</MenuItem>
//                       </Select>
//                     </FormControl>

//                     <FormControl fullWidth>
//                       <InputLabel>Status</InputLabel>
//                       <Select
//                         label="status"
//                         name="status"
//                         value={formData.status}
//                         onChange={handleInputChange}
//                       >
//                         <MenuItem value="Pending">Pending</MenuItem>
//                         <MenuItem value="In Progress">In Progress</MenuItem>
//                         <MenuItem value="Completed">Completed</MenuItem>
//                       </Select>
//                     </FormControl>

//                     <div className={styles.buttonContainer}>
//                       <Button type="submit" variant="contained" color="primary">
//                         Save
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         color="secondary"
//                         onClick={() => setEditingTodo(null)}
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </Stack>
//                 </form>

//                 ) : (
//                   <>
//                     <Typography variant="h6" sx={{ textAlign: "left" }}>
//                       {todo.title}
//                     </Typography>
//                     <Typography
//                       variant="body1"
//                       className={styles.description}
//                       sx={{ textAlign: "left" }}
//                     >
//                       {todo.description}
//                     </Typography>
//                     <Typography variant="body2" sx={{ textAlign: "left" }}>
//                       Due Date: {todo.dueDate}
//                     </Typography>
//                     <Typography variant="body2" sx={{ textAlign: "left" }}>
//                       Priority: {todo.priority}
//                     </Typography>
//                     <Typography variant="body2" sx={{ textAlign: "left" }}>
//                       Status: {todo.status}
//                     </Typography>

//                     <div className={styles.buttonContainer}>
//                       <Button
//                         variant="contained"
//                         color={todo.completed ? "secondary" : "success"}
//                         onClick={() => toggleTodo.mutate(todo.id)}
//                       >
//                         {todo.completed ? "Undo" : "Complete"}
//                       </Button>
//                       <Button
//                         variant="outlined"
//                         color="primary"
//                         onClick={() => handleEditClick(todo)}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         variant="contained"
//                         color="error"
//                         onClick={() => deleteTodo.mutate(todo.id)}
//                       >
//                         Delete
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Charts Section */}
//       <Grid container spacing={3} className={styles.chartsContainer}>
//         <Grid item xs={12} md={6}>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={statusData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="status" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count">
//       {statusData.map((entry, index) => {
//         let color = "#8884d8"; // Default color
//         if (entry.status === "Pending") color = "#0088FE"; // Blue
//         else if (entry.status === "In Progress") color = "#00C49F"; // Green
//         else if (entry.status === "Completed") color = "#FFBB28"; // Yellow
//         return <Cell key={index} fill={color} />;
//       })}
//     </Bar>            </BarChart>
//           </ResponsiveContainer>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={priorityData} dataKey="value" nameKey="name">
//                 {priorityData.map((_, index) => (
//                   <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </Grid>
//       </Grid>
//     </div>
//   );
// }



"use client"

import React, { useState, useEffect } from "react"
import { trpc } from "@/utils/trpc"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  Button, 
  Chip,
  Container,
  IconButton,
  Badge,
  Avatar,
  Divider
} from "@mui/material"
import { 
  Edit, 
  Delete, 
  CheckCircle, 
  Undo, 
  AccessTime, 
  LocalOffer, 
  Event,
  DragIndicator
} from "@mui/icons-material"
import { alpha } from "@mui/material/styles"

// Define the type for Todo
type Todo = {
  id: string
  userId: string
  title: string
  description: string | null
  completed: boolean
  tags: string | null
  deadline: string | null
  reminder: string | null
}

type TodoListProps = {
  todos: Todo[]
  refetch: () => void
}

export default function TodoList({ todos, refetch }: TodoListProps) {
  const toggleTodo = trpc.todo.toggleTodo.useMutation({
    onSuccess: async () => {
      await refetch()
    },
  })
  const deleteTodo = trpc.todo.deleteTodo.useMutation({
    onSuccess: async () => {
      await refetch()
    },
  })
  const editTodo = trpc.todo.editTodo.useMutation({
    onSuccess: () => {
      setEditingTodo(null)
      refetch()
    },
  })

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [formData, setFormData] = useState<Omit<Todo, "id" | "userId">>({
    title: "",
    description: "",
    tags: "",
    deadline: "",
    reminder: "",
    completed: false,
  })

  const [userId, setUserId] = useState<string | null>(null)
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    setUserId(storedUserId)
  }, [])

  const [tasks, setTasks] = useState<Todo[]>([])
  useEffect(() => {
    if (todos) {
      setTasks(
        todos
          .filter((todo) => todo.userId === userId)
          .map((todo) => ({
            id: todo.id,
            userId: todo.userId,
            title: todo.title,
            description: todo.description ?? "",
            tags: todo.tags ?? "",
            deadline: todo.deadline ?? "",
            reminder: todo.reminder ?? "",
            completed: todo.completed,
          })),
      )
    }
  }, [todos, userId])

  const handleEditClick = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      description: todo.description ?? "",
      tags: todo.tags ?? "",
      deadline: todo.deadline ?? "",
      reminder: todo.reminder ?? "",
      completed: todo.completed,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTodo) {
      editTodo.mutate({
        id: editingTodo.id,
        title: formData.title || "",
        description: formData.description || "",
        tags: formData.tags || "",
        deadline: formData.deadline || "",
        reminder: formData.reminder || "",
        completed: formData.completed,
      })
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    
    const { source, destination } = result
    
    // Get the category from the droppable ID
    const sourceCategory = source.droppableId
    const destinationCategory = destination.droppableId
    
    // Create a copy of the tasks
    const tasksCopy = Array.from(tasks)
    
    // Get the task that was dragged
    const [draggedTask] = tasksCopy.splice(source.index, 1)
    
    // Handle status change if moved between categories
    if (sourceCategory !== destinationCategory) {
      if (destinationCategory === "Completed" && !draggedTask.completed) {
        draggedTask.completed = true
        toggleTodo.mutate(draggedTask.id)
      } else if (destinationCategory === "Pending" && draggedTask.completed) {
        draggedTask.completed = false
        toggleTodo.mutate(draggedTask.id)
      }
    }
    
    // Insert the task at the destination
    tasksCopy.splice(destination.index, 0, draggedTask)
    
    // Update state
    setTasks(tasksCopy)
  }

  // Get category colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "All Tasks":
        return "#6366f1" // Indigo
      case "Pending":
        return "#f59e0b" // Amber
      case "Completed":
        return "#10b981" // Emerald
      default:
        return "#6366f1" // Indigo
    }
  }

  // Helper function to filter tasks for each category
  const getFilteredTasks = (category: string) => {
    if (category === "All Tasks") return tasks
    if (category === "Pending") return tasks.filter(task => !task.completed)
    if (category === "Completed") return tasks.filter(task => task.completed)
    return []
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        align="center"
        sx={{ 
          fontFamily:"raleway,serif",
          mb: 4, 
          fontWeight: "bold",
          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
          backgroundClip: "text",
          textFillColor: "transparent",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Task Board
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={3}>
          {["All Tasks", "Pending", "Completed"].map((category) => {
            const filteredTasks = getFilteredTasks(category)
            const categoryColor = getCategoryColor(category)

            return (
              <Grid item xs={12} md={4} key={category}>
                <Card 
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: alpha(categoryColor, 0.2),
                    overflow: 'visible'
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid',
                      borderColor: alpha(categoryColor, 0.1),
                      position: 'relative',
                      overflow: 'visible',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        bottom: -3,
                        width: '100%',
                        height: 3,
                        background: `linear-gradient(90deg, ${categoryColor} 0%, ${alpha(categoryColor, 0.3)} 100%)`
                      }
                    }}
                  >
                    <Typography variant="h6" component="h2" fontWeight={600}>
                      {category}
                    </Typography>
                    <Badge 
                      badgeContent={filteredTasks.length} 
                      color={
                        category === "All Tasks" ? "primary" : 
                        category === "Pending" ? "warning" : "success"
                      }
                      showZero
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: alpha(categoryColor, 0.1),
                          color: categoryColor,
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {filteredTasks.length}
                      </Avatar>
                    </Badge>
                  </Box>

                  <Droppable droppableId={category}>
                    {(provided) => (
                      <Box 
                        ref={provided.innerRef} 
                        {...provided.droppableProps} 
                        sx={{ 
                          p: 2,
                          flexGrow: 1,
                          minHeight: 300,
                          bgcolor: alpha(categoryColor, 0.02)
                        }}
                      >
                        {filteredTasks.length === 0 ? (
                          <Box 
                            sx={{ 
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              align="center"
                              sx={{ 
                                fontFamily:"raleway,serif",
                                p: 2,
                                border: '1px dashed',
                                borderColor: 'divider',
                                borderRadius: 1
                              }}
                            >
                              {category === "All Tasks" 
                                ? "No tasks yet" 
                                : category === "Pending" 
                                  ? "No pending tasks" 
                                  : "No completed tasks"}
                            </Typography>
                          </Box>
                        ) : (
                          filteredTasks.map((todo, index) => (
                            <Draggable key={todo.id} draggableId={todo.id} index={index}>
                              {(provided) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  sx={{
                                    mb: 2,
                                    borderRadius: 1.5,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s',
                                    borderLeft: '3px solid',
                                    borderColor: todo.completed ? '#10b981' : categoryColor,
                                    '&:hover': {
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                      transform: 'translateY(-2px)'
                                    },
                                    bgcolor: todo.completed ? alpha('#10b981', 0.05) : 'background.paper'
                                  }}
                                >
                                  <CardContent sx={{ p: 0 }}>
                                    <Box 
                                      {...provided.dragHandleProps}
                                      sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        p: 1,
                                        cursor: 'grab',
                                        '&:active': { cursor: 'grabbing' },
                                        bgcolor: alpha(categoryColor, 0.05),
                                        borderBottom: '1px solid',
                                        borderColor: 'divider'
                                      }}
                                    >
                                      <DragIndicator fontSize="small" color="action" />
                                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1,fontFamily:"raleway,serif",fontWeight:"bold" }}>
                                        Drag to reorder
                                      </Typography>
                                    </Box>

                                    {editingTodo?.id === todo.id ? (
                                      <Box component="form" onSubmit={handleEditSubmit} sx={{ p: 2 }}>
                                        <TextField
                                          name="title"
                                          value={formData.title}
                                          onChange={handleInputChange}
                                          fullWidth
                                          label="Title"
                                          variant="outlined"
                                          size="small"
                                          sx={{ mb: 2, }}
                                        />
                                        <TextField
                                          name="description"
                                          value={formData.description}
                                          onChange={handleInputChange}
                                          fullWidth
                                          label="Description"
                                          variant="outlined"
                                          size="small"
                                          multiline
                                          rows={3}
                                          sx={{ mb: 2 }}
                                        />
                                        <TextField
                                          name="tags"
                                          value={formData.tags}
                                          onChange={handleInputChange}
                                          fullWidth
                                          label="Tags (comma separated)"
                                          variant="outlined"
                                          size="small"
                                          sx={{ mb: 2 }}
                                        />
                                        <TextField
                                          name="deadline"
                                          type="date"
                                          value={formData.deadline}
                                          onChange={handleInputChange}
                                          fullWidth
                                          label="Deadline"
                                          variant="outlined"
                                          size="small"
                                          InputLabelProps={{ shrink: true }}
                                          sx={{ mb: 2 }}
                                        />
                                        <TextField
                                          name="reminder"
                                          type="datetime-local"
                                          value={formData.reminder}
                                          onChange={handleInputChange}
                                          fullWidth
                                          label="Reminder"
                                          variant="outlined"
                                          size="small"
                                          InputLabelProps={{ shrink: true }}
                                          sx={{ mb: 2 }}
                                        />

                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                          <Button 
                                            variant="outlined" 
                                            onClick={() => setEditingTodo(null)}
                                            size="small"
                                            sx={{fontFamily:"raleway,serif",fontWeight:"bold"}}
                                          >
                                            Cancel
                                          </Button>
                                          <Button 
                                            type="submit" 
                                            variant="contained" 
                                            color="primary"
                                            size="small"
                                            sx={{fontFamily:"raleway,serif",fontWeight:"bold"}}

                                          >
                                            Save Changes
                                          </Button>
                                        </Box>
                                      </Box>
                                    ) : (
                                      <Box sx={{ p: 2 }}>
                                        <Typography 
                                          variant="subtitle1" 
                                          component="h3"
                                          fontWeight={600}
                                          gutterBottom
                                          sx={{fontFamily:"raleway,serif"}}
                                        >
                                          {todo.title}
                                        </Typography>
                                        
                                        {todo.description && (
                                          <Typography 
                                            variant="body2" 
                                            color="text.secondary"
                                            paragraph
                                            sx={{ mb: 2,fontFamily:"raleway,serif" }}
                                          >
                                            {todo.description}
                                          </Typography>
                                        )}
                                        
                                        <Box sx={{ mb: 2 }}>
                                          {todo.tags && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                              <LocalOffer 
                                                fontSize="small" 
                                                color="action" 
                                                sx={{ mr: 0.5, fontSize: 16, }}
                                              />
                                              <Typography variant="caption" color="text.secondary">
                                                {todo.tags.split(',').map((tag, i) => (
                                                  <Chip
                                                    key={i}
                                                    label={tag.trim()}
                                                    size="small"
                                                    sx={{ 
                                                      mr: 0.5, 
                                                      mb: 0.5,
                                                      bgcolor: alpha(categoryColor, 0.1),
                                                      color: 'text.primary',
                                                      fontWeight: 500,fontFamily:"raleway,serif"
                                                    }}
                                                  />
                                                ))}
                                              </Typography>
                                            </Box>
                                          )}
                                          
                                          {todo.deadline && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                              <Event 
                                                fontSize="small" 
                                                color="action" 
                                                sx={{ mr: 0.5, fontSize: 16 }}
                                              />
                                              <Typography variant="caption" color="text.secondary" sx={{fontFamily:"raleway,serif",fontWeight:"bold"}}>
                                                Due: {new Date(todo.deadline).toLocaleDateString()}
                                              </Typography>
                                            </Box>
                                          )}
                                          
                                          {todo.reminder && (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                              <AccessTime 
                                                fontSize="small" 
                                                color="action" 
                                                sx={{ mr: 0.5, fontSize: 16 }}
                                              />
                                              <Typography variant="caption" color="text.secondary" sx={{fontFamily:"raleway,serif",fontWeight:"bold"}}>
                                                Reminder: {new Date(todo.reminder).toLocaleString()}
                                              </Typography>
                                            </Box>
                                          )}
                                        </Box>
                                        
                                        <Divider sx={{ mb: 2 }} />
                                        
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            color={todo.completed ? "success" : "primary"}
                                            onClick={() => toggleTodo.mutate(todo.id)}
                                            startIcon={todo.completed ? <Undo /> : <CheckCircle />}
                                            sx={{
                                              fontFamily:"raleway,serif",fontWeight:"bold",
                                              textTransform: 'none',
                                              boxShadow: 'none',
                                              '&:hover': {
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                              }
                                            }}
                                          >
                                            {todo.completed ? "Undo" : "Complete"}
                                          </Button>
                                          
                                          <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleEditClick(todo)}
                                            startIcon={<Edit />}
                                            sx={{fontFamily:"raleway,serif",fontWeight:"bold",
                                              textTransform: 'none',
                                              borderColor: alpha(categoryColor, 0.5),
                                              color: categoryColor,
                                              '&:hover': {
                                                borderColor: categoryColor,
                                                bgcolor: alpha(categoryColor, 0.05)
                                              }
                                            }}
                                          >
                                            Edit
                                          </Button>
                                          
                                          <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => deleteTodo.mutate(todo.id)}
                                            sx={{
                                              ml: 'auto',
                                              '&:hover': {
                                                bgcolor: alpha('#ef4444', 0.1)
                                              }
                                            }}
                                          >
                                            <Delete fontSize="small" />
                                          </IconButton>
                                        </Box>
                                      </Box>
                                    )}
                                  </CardContent>
                                </Card>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </DragDropContext>
    </Container>
  )
}