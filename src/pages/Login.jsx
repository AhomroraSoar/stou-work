import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Swal from "sweetalert2";

//icon stuff
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

//image import
import LoginBackground from "../assets/img/login-background.png"
import STOULogowithLabel from "../assets/img/STOU-logo-with-label.png"

const defaultTheme = createTheme();

export default function SignInSide() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      email: data.get("email"),
      password: data.get("password"),
      rememberme: false,
    };

    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data["status"] === "success") {
          Swal.fire({
            icon: "success",
            title: "Login!",
            text: data["message"],
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
          });
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          window.setTimeout(function () {
            window.location.href = "/swnlist";
          }, 1500);
        } else if (data["status"] === "Invalid password") {
          Swal.fire({
            icon: "error",
            title: "เข้าสู่ระบบผิดพลาด",
            text: data["message"],
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        } else if (data["status"] === "error") {
          Swal.fire({
            icon: "error",
            title: "เข้าสู่ระบบผิดพลาด",
            text: data["message"],
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh', display: 'flex', justifyContent: 'center' }}>
        <CssBaseline />
        <Grid
          item
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${LoginBackground})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{pt: 3 }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: 0,
            }}
          >
            <Avatar
              variant="square"
              sx={{ width: 332, height: 150 }}
              src={STOULogowithLabel}
            />
            <Typography component="h1" variant="h6">
              เข้าสู่ระบบ
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2, border: 0 }}
            >
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Grid item sx={{width:"75%"}}>
                  <TextField
                    margin="normal"
                    required
                    name="email"
                    type="username"
                    label="Email address"
                    autoComplete="username"
                    variant="outlined"
                    autoFocus
                    sx={{ mb: 3,width:"100%" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item sx={{width:"75%"}}>
                  <TextField
                    margin="normal"
                    required
                    name="password"
                    label="Password"
                    type={values.showPassword ? "text" : "password"}
                    onChange={handlePasswordChange("password")}
                    value={values.password}
                    id="password"
                    autoComplete="current-password"
                    sx={{ width: "100%" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid container justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4, mb: 2, width: 150, height: 50 }}
                  >
                    เข้าสู่ระบบ
                  </Button>
                </Grid>
                <Grid container>
                  <Grid item xs>
                    <Typography align="center" sx={{ my: 1 }}>
                      ━━━━━━━━ OR ━━━━━━━━{" "}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{display:'flex',justifyContent:'center'}}>
                <Box sx={{justifyContent:'center',display:'flex',mr:10 }}>
                    <Link
                      href="/reset-password"
                      fontSize="36"
                      style={{ color: "#e05414" }}
                    >
                      ลืมรหัสผ่าน
                    </Link>
                </Box>
                <Box sx={{ justifyContent:'center',display:'flex' }}>
                    <Link
                      href="/Register"
                      fontSize="36"
                      style={{ color: "#e05414" }}
                    >
                      ลงทะเบียน
                    </Link>
                </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}