import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import Logo from "../assets/img/logo-th.png";

import Swal from "sweetalert2";

const pages = ["ค้นหารายชื่ออาจารย์ที่ปรึกษา", "จัดการผู้ใช้"];

export default function Layout({ children }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    Swal.fire({
      icon: "success",
      title: "Logout!",
      text: "logged out successfully",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });

    window.setTimeout(function () {
      window.location.href = "/";
    }, 1500);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, color: "#C9A66D" }}>
        <AppBar position="static" sx={{ bgcolor: "#C9A66D" }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <a
                href="http://localhost:3000/swnlist"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={Logo} style={{ width: 50, marginRight: 2 }} />
                <Typography
                  variant="h6"
                  noWrap
                  component="span"
                  sx={{
                    mr: 2,
                    fontFamily: "THsarabun",
                    fontWeight: 700,
                    color: "#004D1F",
                  }}
                >
                  ระบบกิจการนักศึกษา
                </Typography>
              </a>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="#004D1F"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                    color: "#004D1F",
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center" sx={{ color: "#004D1F" }}>
                        {page}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page, index) =>
                  page === "จัดการผู้ใช้" && userData.role_id !== 3 ? null : (
                    <Grid key={page}>
                      <Button
                        component={Link}
                        to={
                          index === 0
                            ? "http://localhost:3000/teachersearch"
                            : "http://localhost:3000/manageusers"
                        }
                        sx={{ my: 2, color: "#004D1F", display: "block" }}
                      >
                        {page}
                      </Button>
                    </Grid>
                  )
                )}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Typography
                      sx={{
                        mr: 2,
                        color: "white",
                        display: "block",
                        fontSize: "24px",
                      }}
                    >
                      {userData.name}
                    </Typography>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    ออกจากระบบ
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      {children}
    </>
  );
}
