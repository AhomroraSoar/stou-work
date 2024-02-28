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

import LoginBackground from "../assets/img/login-background.png";

export default function UserCreate() {
  const handleSubmit = (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var data = {
      user_id: user_id,
      user_name: user_name,
      user_age: parseInt(user_age),
      user_career: user_career,
      user_address: user_address,
      department: department,
      program: program,
      email: email,
      password: password,
      user_tel: user_tel,
    };
    fetch("http://localhost:4000/register", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result["status"] === "ok") {
          Swal.fire({
            icon: "success",
            title: "สร้าง Account เสร็จสิ้น",
            text: result["message"],
            showConfirmButton: true,
            timerProgressBar: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
        } else if (result["status"] === "registered") {
          Swal.fire({
            icon: "error",
            title: "Email registered",
            text: result["message"],
            showConfirmButton: false,
            position: "top-end",
            toast: true,
            timer: 2500,
            timerProgressBar: true,
          });
        }
      });
  };

  const [user_id, setUser_id] = useState("");
  const [user_name, setUser_name] = useState("");
  const [user_age, setUser_age] = useState("");
  const [user_career, setUser_career] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [user_address, setUser_address] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_tel, setUser_tel] = useState("");
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (event, setState, minLength, maxLength) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, ''); // Remove non-numeric characters
    if (/^\d*$/.test(inputValue) && numericValue.length >= minLength && numericValue.length <= maxLength) {
      setState(inputValue);
      setValues({ ...values, password: inputValue }); // Update password in values object
    }
  };

  const validateEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChangePassword = (event) => {
    const inputValue = event.target.value;
    setPassword(inputValue);
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
          md={6}
          sx={{
            backgroundImage: `url(${LoginBackground})`,
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
          md={6}
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
              <Grid
                display="flex"
                container
                sx={{ mt: 1, border: 0 }}
                spacing={2}
              >
                <Grid item xs={12} sx={{ mb: 2, border: 0 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="user_id"
                    label="รหัสประจำตัว"
                    sx={{ width: 490 }}
                    value={user_id}
                    onChange={(e) => handleChange(e, setUser_id, 0, 13)}
                    inputProps={{
                      inputMode: "numeric",
                    }}
                    error={
                      user_id.length > 0 &&
                      (!/^\d*$/.test(user_id) || user_id.length !== 13)
                    }
                    helperText={
                      user_id.length > 0 &&
                      (!/^\d*$/.test(user_id) || user_id.length !== 13)
                        ? "กรุณากรอกรหัสประจำตัวให้ครบ 13 หลัก"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2, border: 0 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="user_name"
                    label="ชื่อ-นามสกุล"
                    sx={{ width: 490 }}
                    onChange={(e) => setUser_name(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    sx={{ mr: 5.5 }}
                    variant="outlined"
                    required
                    id="user_age"
                    label="อายุ"
                    value={user_age}
                    onChange={(e) => handleChange(e, setUser_age, 0, 3)}
                    inputProps={{
                      inputMode: "numeric",
                    }}
                  />
                  <TextField
                    variant="outlined"
                    required
                    id="user_career"
                    label="อาชีพ"
                    onChange={(e) => setUser_career(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    sx={{ mr: 5.5 }}
                    variant="outlined"
                    required
                    id="department"
                    label="สาขาวิชา"
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    required
                    id="program"
                    label="หลักสูตร"
                    onChange={(e) => setProgram(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="user_address"
                    label="ที่อยู่ที่ติดต่อได้"
                    sx={{ width: 490 }}
                    onChange={(e) => setUser_address(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="user_email"
                    label="Email"
                    sx={{ width: 490 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => {
                      if (email.trim() !== "" && !validateEmail(email)) {
                        // If the email is not empty and is invalid, reset the email state
                        setEmail("");
                      }
                    }}
                    error={email.trim() !== "" && !validateEmail(email)}
                    helperText={
                      email.trim() !== "" && !validateEmail(email)
                        ? "Please enter a valid email address"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                <TextField
                  variant="outlined"
                  required
                  id="user_password"
                  label="รหัสผ่าน"
                  type={values.showPassword ? "text" : "password"}
                  value={password} // Use password state directly
                  sx={{ width: 490 }}
                  onChange={handleChangePassword} // Use the new handleChangePassword function
                  error={
                    password.length > 0 &&
                    (password.length < 8 || password.length > 25)
                  }
                  helperText={
                    password.length > 0 &&
                    (password.length < 8 || password.length > 25)
                      ? `Password must be between 8 and 25 characters`
                      : ""
                  }
                  InputProps={{
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

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="user_tel"
                    label="เบอร์โทรศัพท์"
                    sx={{ width: 490 }}
                    value={user_tel}
                    onChange={(e) => handleChange(e, setUser_tel, 0, 10)}
                    inputProps={{
                      inputMode: "numeric",
                    }}
                    error={
                      user_tel.length > 0 &&
                      (!/^\d*$/.test(user_tel) || user_tel.length !== 10)
                    }
                    helperText={
                      user_tel.length > 0 &&
                      (!/^\d*$/.test(user_tel) || user_tel.length !== 10)
                        ? "กรุณากรอกหมายเลขโทรศัพท์ให้ครบ 10 หลัก"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ width: 150, height: 40, mr: 8 }}
                  >
                    ยืนยัน
                  </Button>
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
