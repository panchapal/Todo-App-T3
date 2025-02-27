import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemText,
  Box,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    setIsLoggedIn(false);
    router.push("/login");
  };

  const menuItems = [{ text: "Dashboard", href: "/" }];

  return (
    <>
      {/* Top Navbar */}
      <AppBar position="fixed" className={styles.navbar}>
        <Toolbar className={styles.toolbar}>
          {/* Mobile Menu Button */}
          <IconButton
            edge="start"
            className={styles.menuButton}
            color="inherit"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo / Title */}
          <Typography variant="h6" className={styles.title}>
            Todo App
          </Typography>

          {/* Centered Menu Items */}
          <Box className={styles.menuItems}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                className={styles.navButton}
                onClick={() => handleNavigate(item.href)}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Auth Buttons */}
          <Box className={styles.authButtons}>
            {isLoggedIn ? (
              <Button color="inherit" className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button color="inherit" onClick={() => handleNavigate("/register")} className={styles.registerButton}>
                  Register
                </Button>
                <Button color="inherit" onClick={() => handleNavigate("/login")} className={styles.registerButton}>
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        <List className={styles.drawerList}>
          {menuItems.map((item) => (
            <ListItemButton key={item.text} onClick={() => handleNavigate(item.href)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
          {isLoggedIn ? (
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          ) : (
            <>
              <ListItemButton onClick={() => handleNavigate("/register")}>
                <ListItemText primary="Register" />
              </ListItemButton>
              <ListItemButton onClick={() => handleNavigate("/login")}>
                <ListItemText primary="Login" />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
