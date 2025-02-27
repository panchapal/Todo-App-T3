import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import styles from "@/styles/Login.module.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
});

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: yupResolver(schema) });
  const router = useRouter();
  const loginMutation = trpc.auth.login.useMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginForm) => {
    setErrorMessage(null);
    try {
      const response = await loginMutation.mutateAsync(data);

      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("name", response.name);
      localStorage.setItem("email", response.email);

      router.push("/");
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <Box className={styles.loginPage}>
        <Grid container className={styles.loginContainer}>
          <Box className={styles.loginImage}></Box>

          <Container maxWidth="xs" className={styles.loginFormContainer}>
            <Box className={styles.formBox}>
              <Typography
                variant="h4"
                component="h1"
                className={styles.loginHeading}
              >
                Login
              </Typography>
              {errorMessage && (
                <Typography variant="body2" className={styles.errorMessage}>
                  {errorMessage}
                </Typography>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={styles.loginButton}
                  fullWidth
                  disabled={loginMutation.isLoading}
                >
                  {loginMutation.isLoading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Login"
                  )}
                </Button>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "Raleway, serif", mt: 1, textAlign: "center" }}
                >
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className={styles.registerLink}>
                    Register
                  </Link>
                </Typography>
              </form>
            </Box>
          </Container>
        </Grid>
      </Box>
    </>
  );
}


// import { useState } from "react";
// import { useRouter } from "next/router";
// import { signIn } from "next-auth/react";
// import { useForm } from "react-hook-form";
// import {
//   Container,
//   Grid,
//   Box,
//   TextField,
//   Button,
//   Typography,
// } from "@mui/material";
// import styles from "@/styles/Login.module.css";
// import Link from "next/link";
// import Navbar from "@/components/Navbar";

// interface LoginForm {
//   email: string;
//   password: string;
// }

// export default function Login() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginForm>();

//   const router = useRouter();
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const onSubmit = async (data: LoginForm) => {
//     setErrorMessage(null);

//     console.log("Logging in with:", data);

//     const result = await signIn("credentials", {
//       redirect: false,
//       email: data.email,
//       password: data.password,
//     });

//     console.log("Login Response:", result);

//     if (result?.error) {
//       setErrorMessage(result.error); // Show error message
//     } else {
//       router.push("/dashboard"); // Redirect after login
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <Box className={styles.loginPage}>
//         <Grid container className={styles.loginContainer}>
//           {/* Left Side - Image */}
//           <Box className={styles.loginImage}></Box>

//           {/* Right Side - Login Form */}
//           <Container maxWidth="xs" className={styles.loginFormContainer}>
//             <Box className={styles.formBox}>
//               <Typography variant="h4" component="h1" className={styles.loginHeading}>
//                 Login
//               </Typography>

//               {errorMessage && (
//                 <Typography variant="body2" className={styles.errorMessage}>
//                   {errorMessage}
//                 </Typography>
//               )}

//               <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
//                 <TextField
//                   fullWidth
//                   label="Email"
//                   type="email"
//                   variant="outlined"
//                   margin="normal"
//                   {...register("email", { required: "Email is required" })}
//                   error={!!errors.email}
//                   helperText={errors.email?.message}
//                 />
//                 <TextField
//                   fullWidth
//                   label="Password"
//                   type="password"
//                   variant="outlined"
//                   margin="normal"
//                   {...register("password", { required: "Password is required" })}
//                   error={!!errors.password}
//                   helperText={errors.password?.message}
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   className={styles.loginButton}
//                   fullWidth
//                 >
//                   Login
//                 </Button>

//                 <Typography
//                   variant="body2"
//                   sx={{ fontFamily: "Raleway, serif", mt: 1, textAlign: "center" }}
//                 >
//                   Don&apos;t have an account?{" "}
//                   <Link href="/register" className={styles.registerLink}>
//                     Register
//                   </Link>
//                 </Typography>
//               </form>
//             </Box>
//           </Container>
//         </Grid>
//       </Box>
//     </>
//   );
// }
