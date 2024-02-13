import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

export default function UserCreate() {
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
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
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
          container
          justifyContent="center"
          xs={12}
          sm={8}
          md={5}
          component={Paper}
        >
          <Grid
            item
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar style={avatarStyle} sx={{ height: 55, width: 55 }}>
              <ErrorRoundedIcon sx={{ height: 50, width: 50 }} />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mt: 3}}>
              ไม่พบหน้าที่ท่านกำลังตามหา
            </Typography>

            <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
              กรุณากลับสู่หน้าเข้าสู่ระบบ
            </Typography>

            <Button
              type="submit"
              variant="contained"
              href="/"
              sx={{ width: 150, height: 50, mt: 3 }}
            >
              ตกลง
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
