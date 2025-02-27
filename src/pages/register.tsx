import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { Container, Grid, Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "@/styles/Register.module.css"; // Import external CSS
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Validation schema using Yup
const schema = yup.object().shape({
  name: yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
});

export default function Register() {
  const router = useRouter();
  const registerMutation = trpc.auth?.register.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { name: string; email: string; password: string }) => {
    try {
      const response = await registerMutation.mutateAsync(data);
      console.log("Registration successful:", response);
      alert("User registered successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please check the API.");
    }
  };

  return (
    <>
      <Navbar />
      <Box className={styles.registerPage}>
        <Grid className={styles.registerContainer}>
          <Box className={styles.registerImage} />

          <Container maxWidth="sm" className={styles.registerForm}>
            <Box className={styles.registerFormBox}>
              <Typography variant="h4" gutterBottom>
                Register
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.registerButton}
                    disabled={registerMutation.isLoading}
                    fullWidth
                  >
                    {registerMutation.isLoading ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Register"
                    )}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ textAlign: "center", fontFamily: "raleway, serif", mt: 2 }}>
                    Already have an account?{" "}
                    <Link href="/login" className={styles.loginLink}>
                      Log in
                    </Link>
                  </Typography>
                </Grid>
              </form>
            </Box>
          </Container>
        </Grid>
      </Box>
    </>
  );
}
