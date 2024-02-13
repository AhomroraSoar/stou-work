import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import Swal from "sweetalert2";

import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function UserCreate() {
  const handleSubmit = (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var data = {
      user_id: user_id,
      user_name: user_name,
      user_age:parseInt(user_age),
      user_career:user_career,
      user_address:user_address,
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
            timer: 2000,
            showConfirmButton: false,
          });
          window.location.href = "/swnlist";
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
  const [user_address, setUser_address] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_tel, setUser_tel] = useState("");
  const [values, setValues] = React.useState({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ showPassword: !values.showPassword });
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

  const avatarStyle = { backgroundColor: "#041444" };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{minHeight:"100vh"}}>
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
              mt:2,
              mb:2
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
                    onChange={(e) => setUser_id(e.target.value)}
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
                    variant="outlined"
                    required
                    id="user_age"
                    label="อายุ"
                    sx={{ width: 490 }}
                    onChange={(e) => setUser_age(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="user_career"
                    label="อาชีพ"
                    sx={{ width: 490 }}
                    onChange={(e) => setUser_career(e.target.value)}
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
                    value={values.password}
                    sx={{ width: 490 }}
                    onChange={(e) => setPassword(e.target.value)}
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
                    onChange={(e) => setUser_tel(e.target.value)}
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
                    sx={{ width: 150, height: 40 }}>
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