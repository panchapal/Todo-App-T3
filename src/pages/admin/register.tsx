// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// const AdminRegister = () => {
//   const router = useRouter();
//   const [form, setForm] = useState({ name: "", email: "", password: "" });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch("/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     if (res.ok) router.push("/admin/login");
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
//       <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
//       <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
//       <button type="submit">Register</button>
//     </form>
//   );
// };

// export default AdminRegister;


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Box, Button, Container, TextField, Typography, Grid, CircularProgress, InputAdornment } from "@mui/material";
// import { Email, Lock, Person } from "@mui/icons-material";
// import styles from "./AdminRegister.module.css";

// const AdminRegister = () => {
//   const router = useRouter();
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       if (res.ok) router.push("/admin/login");
//     } catch (error) {
//       console.error("Registration failed", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box className={styles.registerPage}>
//       <Grid container className={styles.registerContainer}>
//         {/* Left Side - Welcome Text */}
//         <Grid item xs={12} md={6} className={styles.registerText}>
//           <Typography variant="h4" className={styles.title}>
//             Welcome to Admin Panel
//           </Typography>
//           <Typography variant="body1" className={styles.description}>
//             Create an account to manage users, products, and more with ease. Secure and fast authentication awaits you.
//           </Typography>
//         </Grid>

//         {/* Right Side - Registration Form */}
//         <Grid item xs={12} md={6}>
//           <Container maxWidth="sm" className={styles.registerForm}>
//             <Box className={styles.registerFormBox}>
//               <Typography variant="h4" gutterBottom>
//                 Register
//               </Typography>
//               <form onSubmit={handleSubmit} className={styles.form}>
//                 {/* Name Field */}
//                 <TextField
//                   fullWidth
//                   label="Name"
//                   variant="outlined"
//                   margin="normal"
//                   onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   required
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Person color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 {/* Email Field with Icon */}
//                 <TextField
//                   fullWidth
//                   label="Email"
//                   variant="outlined"
//                   margin="normal"
//                   type="email"
//                   onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   required
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Email color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 {/* Password Field with Icon */}
//                 <TextField
//                   fullWidth
//                   label="Password"
//                   variant="outlined"
//                   margin="normal"
//                   type="password"
//                   onChange={(e) => setForm({ ...form, password: e.target.value })}
//                   required
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Lock color="primary" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />

//                 {/* Register Button with Loader */}
//                 <Button 
//                   type="submit" 
//                   variant="contained" 
//                   color="primary" 
//                   fullWidth 
//                   className={styles.button}
//                   disabled={loading}
//                 >
//                   {loading ? <CircularProgress size={24} color="secondary" /> : "Register"}
//                 </Button>
//               </form>
//             </Box>
//           </Container>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default AdminRegister;



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Container, TextField, Typography, Grid, CircularProgress, InputAdornment } from "@mui/material";
import { Email, Lock, Person } from "@mui/icons-material";
import styles from "./AdminRegister.module.css";

const AdminRegister = () => {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check if the user is an admin before rendering the page
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/me"); // Fetch current user data
        const data = await res.json();
        
        if (res.ok && data.role === "admin") {
          setIsAuthorized(true);
        } else {
          router.push("/"); // Redirect non-admin users to the home page
        }
      } catch (error) {
        console.error("Access denied", error);
        router.push("/"); // Redirect on error
      }
    };

    checkAdmin();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) router.push("/admin/login");
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Show nothing if not authorized (prevents flashing the form)
  if (!isAuthorized) return null;

  return (
    <Box className={styles.registerPage}>
      <Grid container className={styles.registerContainer}>
        {/* Left Side - Welcome Text */}
        <Grid item xs={12} md={6} className={styles.registerText}>
          <Typography variant="h4" className={styles.title}>
            Welcome to Admin Panel
          </Typography>
          <Typography variant="body1" className={styles.description}>
            Create an account to manage users, products, and more with ease. Secure and fast authentication awaits you.
          </Typography>
        </Grid>

        {/* Right Side - Registration Form */}
        <Grid item xs={12} md={6}>
          <Container maxWidth="sm" className={styles.registerForm}>
            <Box className={styles.registerFormBox}>
              <Typography variant="h4" gutterBottom>
                Register
              </Typography>
              <form onSubmit={handleSubmit} className={styles.form}>
                {/* Name Field */}
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  margin="normal"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Email Field with Icon */}
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  type="email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password Field with Icon */}
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  margin="normal"
                  type="password"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Register Button with Loader */}
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  className={styles.button}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="secondary" /> : "Register"}
                </Button>
              </form>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminRegister;
