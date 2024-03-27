import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
} from "@mui/material";

import Appbar from "../assets/Appbar.jsx";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import BigBackground from "../assets/img/BigBackground.png";

import "../css/Teachersearch.css";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function Teachersearch() {
  const [teacher, setTeacher] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetch("http://localhost:4000/teacherlist")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTeacher(data);
        } else {
          console.error("Teacher data is not an array");
          // Handle the situation when teacher is not an array
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTeacher = Array.isArray(teacher)
    ? teacher.filter((teacher) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          teacher.advisor_name.toLowerCase().includes(searchTermLower) ||
          teacher.advisor_id.toLowerCase().includes(searchTermLower) ||
          teacher.department.toLowerCase().includes(searchTermLower) ||
          teacher.club_name.toLowerCase().includes(searchTermLower)
        );
      })
    : [];

  const addAdvisor = async () => {
    try {
      const clublist = await fetch("http://localhost:4000/clublist");
      const clublistData = await clublist.json();

      const result = await withReactContent(Swal).fire({
        title: <Typography>เพิ่มอาจารย์ที่ปรึกษา</Typography>,
        html: `<input id="advisor_id" class="swal2-input" placeholder="รหัสประจำตัว">
               <input id="advisor_name" class="swal2-input" placeholder="ชื่อ-สกุล">
               <input id="department" class="swal2-input" placeholder="สาชาวิชา">
               <input id="advisor_tel" class="swal2-input" placeholder="เบอร์โทรศัพท์">
               <input id="line_contact" class="swal2-input" placeholder="Line ID">
               <select id="club_id" class="swal2-select">
                <option value="">--กรุณาเลือกชมรมที่เป็นที่ปรึกษา--</option> <!-- Empty option -->
                 ${clublistData
                   .map(
                     (club) =>
                       `<option value="${club.club_id}">${club.club_name}</option>`
                   )
                   .join("")}
               </select>`,
        confirmButtonText: "เพิ่ม",
        cancelButtonText: "ยกเลิก",
        showCancelButton: true,
        allowOutsideClick: false,
        preConfirm: () => {
          const advisor_id = document.getElementById("advisor_id").value;
          const advisor_name = document.getElementById("advisor_name").value;
          const department = document.getElementById("department").value;
          const advisor_tel = document.getElementById("advisor_tel").value;
          const line_contact = document.getElementById("line_contact").value;
          const club_id = document.getElementById("club_id").value;

          if (
            !advisor_id.trim() ||
            !advisor_name.trim() ||
            !department.trim() ||
            !advisor_tel.trim() ||
            !line_contact.trim() ||
            !club_id.trim()
          ) {
            withReactContent(Swal).fire({
              title: (
                <Typography sx={{ fontSize: 20 }}>
                  กรุณากรอกข้อมูลให้ครบถ้วน
                </Typography>
              ),
              icon: "error",
              showConfirmButton: false,
              timer: 1200,
            });
            throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
          }

          return {
            advisor_id,
            advisor_name,
            department,
            advisor_tel,
            line_contact,
            club_id,
          };
        },
      });

      if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }

      const response = await fetch(`http://localhost:4000/advisorregister`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          advisor_id: result.value.advisor_id,
          advisor_name: result.value.advisor_name,
          department: result.value.department,
          advisor_tel: result.value.advisor_tel,
          line_contact: result.value.line_contact,
          club_id: result.value.club_id,
        }),
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
          text: responseData.message || "Failed to add advisor",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error adding advisor:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to add advisor",
        icon: "error",
      });
    }
  }; 

  return (
    <Appbar>
      <Box
        sx={{
          justifyContent: "center",
          flexGrow: 1,
          backgroundImage: `url(${BigBackground})`,
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "92.8vh",
        }}
      >
        <Grid
          container
          sx={{
            pt: 5,
            pb: 5,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Paper sx={{ width: "80%", backgroundColor: "#FFF9EB" }}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}
            >
              <Typography
                sx={{
                  fontSize: 26,
                  textAlign: "center",
                  pl: 10,
                  pr: 10,
                  pt: 1.5,
                  pb: 1.5,
                }}
              >
                ค้นหารายชื่ออาจารย์ที่ปรึกษา
              </Typography>
            </Grid>

            <hr
              style={{
                backgroundColor: "black",
                height: "0.5px",
                width: "40%",
              }}
            />

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 3 }}
            >
              <TextField
                label="กรุณากรอกข้อมูลอาจารย์ที่ต้องการค้นหา"
                variant="filled"
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: "60%" }}
              />
            </Grid>

            <hr
              style={{
                backgroundColor: "black",
                height: "0.5px",
                width: "100%",
              }}
            />

            <Grid item xs={12} sx={{ mb: 5, mt: 3, ml: 7, width: "90%" }}>
              <TableContainer sx={{ border: 2 }}>
                <Table>
                  <TableHead
                    sx={{ backgroundColor: "#003D98", borderBottom: 2 }}
                  >
                    <TableRow>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'10%' }}>
                        {" "}
                        รหัสประจำตัว
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'30%' }}>
                        ชื่อ - นามสกุล
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'10%' }}>
                        สาขาวิชา
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'13%' }}>
                        เบอร์โทรศัพท์
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'8%' }}>
                        Line ID
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'30%' }}>
                        {" "}
                        ที่ปรึกษา
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? filteredTeacher.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : filteredTeacher
                    ).map((club_advisor, index) => (
                      <TableRow
                        key={club_advisor.advisor_id}
                        className={index % 2 === 0 ? "even" : "odd"}
                      >
                        <TableCell sx={{ textAlign: "center" }}>
                          {club_advisor.advisor_id || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {club_advisor.advisor_name || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {club_advisor.department || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {club_advisor.advisor_tel || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {club_advisor.line_contact || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {club_advisor.club_name || ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                component="div"
                count={filteredTeacher.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <Button
                sx={{ width: "100%", pt: 1, pb: 1 }}
                onClick={() => addAdvisor()}
              >
                <AddRoundedIcon style={{ color: "black" }} />
                <Typography sx={{ color: "#05383B", fontSize: 16 }}>
                  เพิ่มอาจารย์ที่ปรึกษา
                </Typography>
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Box>
    </Appbar>
  );
}
