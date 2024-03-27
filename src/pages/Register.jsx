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
      user_uid: user_uid,
      name: name,
      email: email,
      password: password,
      age: parseInt(age),
      curriculum_id: parseInt(curriculum_id),
      faculty_id: parseInt(faculty_id),
      tel: tel,
      address: address,
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

  const [user_uid, setUser_uid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [career, setCareer] = useState("");
  const [faculty_id, setFaculty_id] = useState("");
  const [tel, setTel] = useState("");
  const [curriculum_id, setCurriculum_id] = useState("");
  const [address, setAddress] = useState("");
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
  });
  const [errors, setErrors] = useState({
    user_uid: false,
    email: false,
    password: false,
    tel: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (event, setState, minLength, maxLength, errorType) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, ''); 
    if (/^\d*$/.test(inputValue) && numericValue.length >= minLength && numericValue.length <= maxLength) {
      setState(inputValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [errorType]: false,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [errorType]: true,
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChangePassword = (event) => {
    const inputValue = event.target.value;
    setPassword(inputValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: inputValue.length > 0 && (inputValue.length < 8),
    }));
  };

  const hasErrors =
  Object.values(errors).some((error) => error) || // Check if any field has errors
  email.trim() !== "" && !validateEmail(email) || 
  password.length > 0 && (password.length < 8 ) ||
  user_uid.length !== 10 ||
  tel.length !== 10 ||
  [user_uid, email, password, name, age, career, faculty_id, curriculum_id, tel, address].some(field => field.trim() === "");



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
                    id="user_uid"
                    label="รหัสประจำตัว"
                    sx={{ width: 490 }}
                    value={user_uid}
                    onChange={(e) => handleChange(e, setUser_uid, 0, 10)}
                    inputProps={{
                      inputMode: "numeric",
                    }}
                    error={
                      user_uid.length > 0 &&
                      (!/^\d*$/.test(user_uid) || user_uid.length !== 10)
                    }
                    helperText={
                      user_uid.length > 0 &&
                      (!/^\d*$/.test(user_uid) || user_uid.length !== 10)
                        ? "กรุณากรอกรหัสประจำตัวให้ครบ 10 หลัก"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2, border: 0 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="name"
                    label="ชื่อ-นามสกุล"
                    sx={{ width: 490 }}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    sx={{ mr: 5.5 }}
                    variant="outlined"
                    required
                    id="age"
                    label="อายุ"
                    value={age}
                    onChange={(e) => handleChange(e, setAge, 0, 3)}
                    inputProps={{
                      inputMode: "numeric",
                    }}
                  />
                  <TextField
                    variant="outlined"
                    required
                    id="career"
                    label="อาชีพ"
                    onChange={(e) => setCareer(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    sx={{ mr: 5.5 }}
                    variant="outlined"
                    required
                    id="faculty_id"
                    label="สาขาวิชา"
                    onChange={(e) => setFaculty_id(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    required
                    id="curriculum_id"
                    label="หลักสูตร"
                    onChange={(e) => setCurriculum_id(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="address"
                    label="ที่อยู่ที่ติดต่อได้"
                    sx={{ width: 490 }}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="email"
                    label="Email"
                    sx={{ width: 490 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => {
                      if (email.trim() !== "" && !validateEmail(email)) {
                        // If the email is not empty and is invalid, reset the email state
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
                  id="password"
                  label="รหัสผ่าน"
                  type={values.showPassword ? "text" : "password"}
                  value={password} // Use password state directly
                  sx={{ width: 490 }}
                  onChange={handleChangePassword} // Use the new handleChangePassword function
                  error={errors.password}
                  helperText={errors.password
                    ? `Password must be more than 8 characters`
                    : ""}
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
                    id="tel"
                    label="เบอร์โทรศัพท์"
                    sx={{ width: 490 }}
                    value={tel}
                    onChange={(e) => handleChange(e, setTel, 0, 10)}
                    inputProps={{
                      inputMode: "numeric",
                    }}
                    error={
                      tel.length > 0 &&
                      (!/^\d*$/.test(tel) || tel.length !== 10)
                    }
                    helperText={
                      tel.length > 0 &&
                      (!/^\d*$/.test(tel) || tel.length !== 10)
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
                    disabled={hasErrors}
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
