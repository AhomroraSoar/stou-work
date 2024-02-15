import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import Swal from "sweetalert2";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function ResetPassword() {
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (password !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Passwords do not match",
          text: "Please make sure your passwords match.",
        });
        return;
      }
  
      try {
        const response = await fetch("http://localhost:4000/reset-password", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword: password }), // use password here
        });
  
        const result = await response.json();
  
        if (result.status === "ok") {
          Swal.fire({
            icon: "success",
            title: "การรีเซ็ตรหัสผ่านเสร็จสิ้น",
            timer: 2000,
            showConfirmButton: false,
          });
          window.setTimeout(function () {
            window.location.href = "/";
          }, 1500);
        } else if (result.status === "error") {
          Swal.fire({
            icon: "error",
            title: "การรีเซ็ตรหัสผ่านมีปัญหา",
            text: result.message,
          });
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        Swal.fire({
          icon: "error",
          title: "Error resetting password",
          text: "An error occurred while resetting the password.",
        });
      }
    };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [values, setValues] = useState({
    showPassword: false,
    showConfirmPassword:false
  });

  const handleClickShowPassword = () => {
    setValues((prevState) => ({ ...prevState, showPassword: !prevState.showPassword }));
  };

  const handleClickShowConfirmPassword = () => {
    setValues((prevState) => ({ ...prevState, showConfirmPassword: !prevState.showConfirmPassword }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#142454",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ minHeight: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          md={7}
          sx={{
            backgroundImage:
              "url(https://cdn.discordapp.com/attachments/1193822007729602610/1194188498509504573/sign-in-background-draft3.png?ex=65af71b4&is=659cfcb4&hm=d08d945fb9182dd9150f378e4a2dc1b702558e083dbfbb5ab4eb50352fb820be&)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          align="center"
          xs={12}
          md={5}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
              mb: 2,
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mt: 1, mb: 1 }}>
              ลงทะเบียน
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid display="flex" container sx={{ mt: 1, border: 0 }} spacing={2}>
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="user_email"
                    label="Email"
                    sx={{ width: 490 }}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="user_password"
                    label="รหัสผ่าน"
                    type={values.showPassword ? "text" : "password"}
                    value={password}
                    sx={{ width: 490 }}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="confirm_password"
                    label="ยืนยันรหัสผ่าน"
                    type={values.showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    sx={{ width: 490 }}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {values.showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ width: 150, height: 40 }}
                  >
                    ยืนยัน
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    href="/"
                    color="error"
                    sx={{ width: 150, height: 40 }}
                  >
                    ยกเลิก
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
