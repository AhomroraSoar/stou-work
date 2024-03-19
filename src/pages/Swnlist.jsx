import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import {
  TablePagination,
} from "@mui/material";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Appbar from "../assets/Appbar.jsx";

import BigBackground from "../assets/img/BigBackground.png";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function Page() {
  const [data, setData] = useState([]);
  const initialRowsPerPage = parseInt(localStorage.getItem('rowsPerPage') || 7, 10);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/swn"); // Adjust the endpoint based on your API
        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const addSWN = async () => {
    try {
      const result = await withReactContent(Swal).fire({
        title: (
          <Typography>เพิ่มรายชื่อศูนย์วิทยบริการและชุมชนสัมพันธ์</Typography>
        ),
        input: "text",
        inputValue: "ศูนย์วิทยาบริการและชุมชนสัมพันธ์ มสธ.",
        confirmButtonText: "เพิ่ม",
        cancelButtonText: "ยกเลิก",
        showCancelButton: true,
        allowOutsideClick: false,
        preConfirm: (value) => {
          if (!value || value.trim() === "") {
            withReactContent(Swal).fire({
              title: (
                <Typography sx={{ fontSize: 20 }}>
                  กรุณากรอกชื่อให้ถูกต้อง
                </Typography>
              ),
              icon: "error",
              showConfirmButton: false,
              timer: 1200,
            });
            throw new Error("กรุณากรอกชื่อศูนย์วิทยาบริการและชุมชนสัมพันธ์"); // This is needed to prevent closing the modal on error
          }
          return value.trim();
        },
      });

      if (result.dismiss === Swal.DismissReason.cancel) {
        return; // Cancelled by clicking outside or pressing cancel button
      }

      const response = await fetch("http://localhost:4000/createswn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ swn_name: result.value }),
      });

      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "เสร็จสิ้น",
          text: responseData.message,
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload(); // Refresh the page upon success
        });
      } else {
        Swal.fire({
          title: "Error",
          text: responseData.message || "Failed to add SWN",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error adding SWN:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to add SWN",
        icon: "error",
      });
    }
  };

  const editSWN = async (swn_id, swn_name) => {
    try {
      const result = await withReactContent(Swal).fire({
        title: (
          <Typography>แก้ไขรายชื่อศูนย์วิทยบริการและชุมชนสัมพันธ์</Typography>
        ),
        input: "text",
        inputValue: swn_name,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        showCancelButton: true,
        allowOutsideClick: false,
        preConfirm: (value) => {
          if (!value || value.trim() === "") {
            withReactContent(Swal).fire({
              title: (
                <Typography sx={{ fontSize: 20 }}>
                  กรุณากรอกชื่อให้ถูกต้อง
                </Typography>
              ),
              icon: "error",
              showConfirmButton: false,
              timer: 1200,
            });
            throw new Error("กรุณากรอกชื่อศูนย์วิทยาบริการและชุมชนสัมพันธ์");
          }
          return value.trim();
        },
      });

      if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }

      const response = await fetch("http://localhost:4000/updateswn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ swn_id: swn_id, swn_name: result.value }),
      });

      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "แก้ไขเสร็จสิ้น",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload(); // Refresh the page upon success
        });
      } else {
        Swal.fire({
          title: "มีบางอย่างผิดพลาดกับการแก้ไข",
          text: responseData.message || "Failed to update SWN",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating SWN:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update SWN",
        icon: "error",
      });
    }
  };

  const SWNdelete = (swn_id, swn_name) => {
    withReactContent(Swal)
      .fire({
        title: (
          <Typography variant="h6">
            ยืนยันว่าจะลบ <br /> {swn_name} ?
          </Typography>
        ),
        html: (
          <div>
            <span style={{ color: "red" }}>
              หากยืนยันแล้วคุณจะไม่สามารถย้อนกลับได้!!
            </span>
          </div>
        ),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก",
      })
      .then((result) => {
        if (result.isConfirmed) {
          const data = {
            swn_id: swn_id,
          };
          fetch("http://localhost:4000/deleteswn", {
            method: "DELETE",
            headers: {
              Accept: "application/form-data",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((res) => res.json())
            .then((rows) => {
              if (rows["status"] === "ok") {
                Swal.fire({
                  icon: "success",
                  title: "เสร็จสิ้น",
                  text: rows["message"],
                  showConfirmButton: false,
                  timer: 1250,
                }).then(() => {
                  window.location.reload();
                });
              }
            });
        }
      });
  };

  useEffect(() => {
    localStorage.setItem('rowsPerPage', rowsPerPage);
  }, [rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const role = JSON.parse(localStorage.getItem("userData"));

  if (role.role_id === 3) {
    return (
      <Appbar>
        <Box
          sx={{
            justifyContent: "center",
            flexGrow: 1,
            backgroundImage: `url(${BigBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
          }}
        >
          <Grid container sx={{ display: "flex", alignItems: "center" }}>
            <Grid
              item
              textAlign="center"
              sx={{ justifyContent: "center", display: "flex", mt: 5 }}
              xs={12}
            >
              <Paper
                elevation={8}
                sx={{
                  width: 800,
                  height: 75,
                  background: "#C9A66D",
                  borderRadius: "0px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 20,
                    textAlign: "center",
                    pt: 2.25,
                    fontFamily: "THSarabunNew",
                  }}
                >
                  รายชื่อศูนย์วิทยบริการและชุมชนสัมพันธ์มหาวิทยาลัยสุโขทัยธรรมาธิราช
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              sx={{ pb: 15, justifyContent: "center", display: "flex" }}
              xs={12}
            >
              <Paper
                elevation={8}
                sx={{
                  width: 800,
                  height: 1,
                  background: "#FFF6E1",
                  borderRadius: "0px",
                  display: "block",
                  pb: 0.5,
                  pt: 0.5,
                }}
              >
                {(rowsPerPage > 0
                      ? data.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : data
                    ).map((swn) => (
                  <Grid key={swn.swn_id}>
                    <Button
                      component={Link}
                      to={`/swn/${swn.swn_id}`}
                      sx={{ width: 625, height: 50, fontSize: 20, mb: 0.5 }}
                      key={swn.swn_id}
                    >
                      <Typography sx={{ color: "#05383B", fontSize: 20 }}>
                        {swn.swn_name}
                      </Typography>
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      onClick={() => editSWN(swn.swn_id, swn.swn_name)}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => SWNdelete(swn.swn_id, swn.swn_name)}
                    >
                      ลบ
                    </Button>
                  </Grid>
                ))}
                <TablePagination
                rowsPerPageOptions={[7, 14, 25, { label: "All", value: -1 }]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
                <Button onClick={addSWN} sx={{ width: 800, height: 50 }}>
                  <AddRoundedIcon style={{ color: "black" }} />
                  <Typography sx={{ color: "#05383B", fontSize: 20 }}>
                    เพิ่มรายชื่อศูนย์วิทยบริการและชุมชนสัมพันธ์
                  </Typography>
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Appbar>
    );
  } else {
    return (
      <Appbar>
        <Box
          sx={{
            justifyContent: "center",
            flexGrow: 1,
            backgroundImage: `url(${BigBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
          }}
        >
          <Grid container sx={{ display: "flex", alignItems: "center" }}>
            <Grid
              item
              textAlign="center"
              sx={{ justifyContent: "center", display: "flex", mt: 5 }}
              xs={12}
            >
              <Paper
                elevation={8}
                sx={{
                  width: 644,
                  height: 75,
                  background: "#C9A66D",
                  borderRadius: "0px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 20,
                    textAlign: "center",
                    pt: 2.25,
                    fontFamily: "THSarabunNew",
                  }}
                >
                  รายชื่อศูนย์วิทยบริการและชุมชนสัมพันธ์มหาวิทยาลัยสุโขทัยธรรมาธิราช
                </Typography>
              </Paper>
            </Grid>

            <Grid
              item
              textAlign="center"
              sx={{ pb: 15, justifyContent: "center", display: "flex" }}
              xs={12}
            >
              <Paper
                elevation={8}
                sx={{
                  width: 644,
                  height: 1,
                  background: "#FFF6E1",
                  borderRadius: "0px",
                  display: "block",
                  pb: 0.5,
                  pt: 0.5,
                }}
              >
                {(rowsPerPage > 0
                      ? data.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : data
                    ).map((swn) => (
                  <Button
                    component={Link}
                    to={`/swn/${swn.swn_id}`}
                    sx={{
                      width: 644,
                      height: 50,
                      color: "#222831",
                      fontSize: 20,
                      mt: 0,
                      mb: 0.5,
                    }}
                    key={swn.swn_id}
                  >
                    <Typography sx={{ color: "#05383B", fontSize: 20 }}>
                      {swn.swn_name}
                    </Typography>
                  </Button>
                ))}
                <TablePagination
                rowsPerPageOptions={[7, 14, 25, { label: "All", value: -1 }]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Appbar>
    );
  }
}
