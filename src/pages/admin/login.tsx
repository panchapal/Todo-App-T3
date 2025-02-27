// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// const AdminLogin = () => {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     if (res.ok) {
//       const data = await res.json();
//       localStorage.setItem("adminToken", data.token);
//       router.push("/admin/dashboard");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
//       <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default AdminLogin;

// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Box, Button, Container, Grid, TextField, Typography, CircularProgress, InputAdornment } from "@mui/material";
// import { Email, Lock } from "@mui/icons-material";
// import styles from "./AdminLogin.module.css"; 

// const AdminLogin = () => {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false); // Loader state

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true); // Show loader

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         localStorage.setItem("adminToken", data.token);
//         router.push("/admin/dashboard");
//       }
//     } catch (error) {
//       console.error("Login failed", error);
//     } finally {
//       setLoading(false); // Hide loader
//     }
//   };

//   return (
//     <Box className={styles.registerPage}>
//       <Grid container className={styles.registerContainer}>
//         {/* Left Side - Welcome Text */}
//         <Grid item xs={12} md={6} className={styles.registerText}>
//           <Typography variant="h4" className={styles.title}>
//             Welcome Back, Admin!
//           </Typography>
//           <Typography variant="body1" className={styles.description}>
//             Securely log in to manage the admin panel.
//           </Typography>
//         </Grid>

//         {/* Right Side - Login Form */}
//         <Grid item xs={12} md={6}>
//           <Container maxWidth="sm" className={styles.registerForm}>
//             <Box className={styles.registerFormBox}>
//               <Typography variant="h4" gutterBottom>
//                 Admin Login
//               </Typography>
//               <form onSubmit={handleSubmit} className={styles.form}>
//                 {/* Email Field with Icon */}
//                 <TextField
//                   label="Email"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
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
//                   label="Password"
//                   type="password"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
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

//                 {/* Login Button with Loader */}
//                 <Button 
//                   variant="contained" 
//                   color="primary" 
//                   fullWidth 
//                   type="submit" 
//                   className={styles.button}
//                   disabled={loading} // Disable button when loading
//                 >
//                   {loading ? <CircularProgress size={24} color="secondary" /> : "Login"}
//                 </Button>
//               </form>
//             </Box>
//           </Container>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default AdminLogin;


// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Box, Button, Container, Grid, TextField, Typography, CircularProgress, InputAdornment } from "@mui/material";
// import { Email, Lock } from "@mui/icons-material";
// import styles from "./AdminLogin.module.css"; 

// const AdminLogin = () => {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(""); // Store error messages

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(""); // Clear previous errors

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || "Login failed. Please try again.");
//       } else {
//         localStorage.setItem("adminToken", data.token);
//         router.push("/admin/dashboard");
//       }
//     } catch (error) {
//       setError("An unexpected error occurred. Please try again.");
//       console.error("Login failed", error);
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
//             Welcome Back, Admin!
//           </Typography>
//           <Typography variant="body1" className={styles.description}>
//             Securely log in to manage the admin panel.
//           </Typography>
//         </Grid>

//         {/* Right Side - Login Form */}
//         <Grid item xs={12} md={6}>
//           <Container maxWidth="sm" className={styles.registerForm}>
//             <Box className={styles.registerFormBox}>
//               <Typography variant="h4" gutterBottom>
//                 Admin Login
//               </Typography>

//               {error && (
//                 <Typography color="error" variant="body2" className={styles.errorText}>
//                   {error}
//                 </Typography>
//               )}

//               <form onSubmit={handleSubmit} className={styles.form}>
//                 {/* Email Field with Icon */}
//                 <TextField
//                   label="Email"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
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
//                   label="Password"
//                   type="password"
//                   variant="outlined"
//                   fullWidth
//                   margin="normal"
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

//                 {/* Login Button with Loader */}
//                 <Button 
//                   variant="contained" 
//                   color="primary" 
//                   fullWidth 
//                   type="submit" 
//                   className={styles.button}
//                   disabled={loading}
//                 >
//                   {loading ? <CircularProgress size={24} color="secondary" /> : "Login"}
//                 </Button>
//               </form>
//             </Box>
//           </Container>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default AdminLogin;

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Container, Grid, TextField, Typography, CircularProgress, InputAdornment } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import styles from "./AdminLogin.module.css"; 

const AdminLogin = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials and try again.");
      } else {
        localStorage.setItem("adminToken", data.token);
        // Redirect based on role if needed
        router.push("/admin/dashboard");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.registerPage}>
      <Grid container className={styles.registerContainer}>
        {/* Left Side - Welcome Text */}
        <Grid item xs={12} md={6} className={styles.registerText}>
          <Typography variant="h4" className={styles.title}>
            Admin & Subadmin Portal
          </Typography>
          <Typography variant="body1" className={styles.description}>
            Secure login for authorized personnel only
          </Typography>
        </Grid>

        {/* Right Side - Login Form */}
        <Grid item xs={12} md={6}>
          <Container maxWidth="sm" className={styles.registerForm}>
            <Box className={styles.registerFormBox}>
              <Typography variant="h4" gutterBottom>
                Administrator Login
              </Typography>

              {error && (
                <Typography color="error" variant="body2" className={styles.errorText}>
                  {error}
                </Typography>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <TextField
                  label="Institutional Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
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

                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
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

                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  type="submit" 
                  className={styles.button}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="secondary" />
                  ) : (
                    "Authenticate"
                  )}
                </Button>
              </form>

              {/* Additional Security Info */}
              <Box mt={2}>
                <Typography variant="caption" color="textSecondary">
                  Note: Access restricted to authorized admins and subadmins only.
                  <br />
                  All login attempts are monitored and logged.
                </Typography>
              </Box>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminLogin;
