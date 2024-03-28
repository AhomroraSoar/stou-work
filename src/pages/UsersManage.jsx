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
  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetch("http://localhost:4000/userlist")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUser(data);
        } else {
          console.error("Teacher data is not an array");
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

  const filteredUser = Array.isArray(user)
  ? user.filter((user) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (user.user_uid && user.user_uid.toLowerCase().includes(searchTermLower)) ||
        (user.name && user.name.toLowerCase().includes(searchTermLower)) ||
        ((user.age && user.age.toString().toLowerCase().includes(searchTermLower))) ||
        (user.fac_name && user.fac_name.toLowerCase().includes(searchTermLower)) ||
        (user.curriculum_code && user.curriculum_code.toLowerCase().includes(searchTermLower)) ||
        (user.curriculum_name && user.curriculum_name.toLowerCase().includes(searchTermLower)) ||
        (user.role_name && user.role_name.toLowerCase().includes(searchTermLower))
      );
    })
  : [];

  // const addUsers = async () => {
  //   try {
  //     const rolelist = await fetch("http://localhost:4000/rolelist");
  //     const rolelistData = await rolelist.json();

  //     const result = await withReactContent(Swal).fire({
  //       title: <Typography>เพิ่มอาจารย์ที่ปรึกษา</Typography>,
  //       html: `<input id="advisor_id" class="swal2-input" placeholder="รหัสประจำตัว">
  //              <input id="advisor_name" class="swal2-input" placeholder="ชื่อ-สกุล">
  //              <input id="department" class="swal2-input" placeholder="สาชาวิชา">
  //              <input id="advisor_tel" class="swal2-input" placeholder="เบอร์โทรศัพท์">
  //              <input id="line_contact" class="swal2-input" placeholder="Line ID">
  //              <select id="club_id" class="swal2-select">
  //               <option value="">--กรุณาเลือกบทบาทของผู้ใช้งาน--</option> <!-- Empty option -->
  //                ${rolelistData
  //                  .map(
  //                    (role) =>
  //                      `<option value="${role.role_id}">${role.role_name}</option>`
  //                  )
  //                  .join("")}
  //              </select>`,
  //       confirmButtonText: "เพิ่ม",
  //       cancelButtonText: "ยกเลิก",
  //       showCancelButton: true,
  //       allowOutsideClick: false,
  //       preConfirm: () => {
  //         const advisor_id = document.getElementById("advisor_id").value;
  //         const advisor_name = document.getElementById("advisor_name").value;
  //         const department = document.getElementById("department").value;
  //         const advisor_tel = document.getElementById("advisor_tel").value;
  //         const line_contact = document.getElementById("line_contact").value;
  //         const club_id = document.getElementById("club_id").value;

  //         if (
  //           !advisor_id.trim() ||
  //           !advisor_name.trim() ||
  //           !department.trim() ||
  //           !advisor_tel.trim() ||
  //           !line_contact.trim() ||
  //           !club_id.trim()
  //         ) {
  //           withReactContent(Swal).fire({
  //             title: (
  //               <Typography sx={{ fontSize: 20 }}>
  //                 กรุณากรอกข้อมูลให้ครบถ้วน
  //               </Typography>
  //             ),
  //             icon: "error",
  //             showConfirmButton: false,
  //             timer: 1200,
  //           });
  //           throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
  //         }

  //         return {
  //           advisor_id,
  //           advisor_name,
  //           department,
  //           advisor_tel,
  //           line_contact,
  //           club_id,
  //         };
  //       },
  //     });

  //     if (result.dismiss === Swal.DismissReason.cancel) {
  //       return;
  //     }

  //     const response = await fetch(`http://localhost:4000/register`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         advisor_id: result.value.advisor_id,
  //         advisor_name: result.value.advisor_name,
  //         department: result.value.department,
  //         advisor_tel: result.value.advisor_tel,
  //         line_contact: result.value.line_contact,
  //         club_id: result.value.club_id,
  //       }),
  //     });

  //     const responseData = await response.json();

  //     if (response.ok) {
  //       Swal.fire({
  //         title: "เสร็จสิ้น",
  //         text: responseData.message,
  //         icon: "success",
  //         showConfirmButton: false,
  //         timer: 1000,
  //       }).then(() => {
  //         window.location.reload(); // Refresh the page upon success
  //       });
  //     } else {
  //       Swal.fire({
  //         title: "Error",
  //         text: responseData.message || "Failed to add advisor",
  //         icon: "error",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error adding advisor:", error);
  //     Swal.fire({
  //       title: "Error",
  //       text: error.message || "Failed to add advisor",
  //       icon: "error",
  //     });
  //   }
  // }; 

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
          <Paper sx={{ width: "93%", backgroundColor: "#FFF9EB" }}>
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
                จัดการรายชื่อผู้ใช้งาน
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
                label="กรุณากรอกข้อมูลผู้ใช้งานที่ต้องการค้นหา"
                variant="filled"
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: "70%" }}
              />
            </Grid>

            <hr
              style={{
                backgroundColor: "black",
                height: "0.5px",
                width: "100%",
              }}
            />

            <Grid item xs={12} sx={{ mb: 5, mt: 3, ml: 3.75, width: "96%" }}>
              <TableContainer sx={{ border: 2 }}>
                <Table>
                  <TableHead
                    sx={{ backgroundColor: "#003D98", borderBottom: 2 }}
                  >
                    <TableRow>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'1%' }}>
                        {" "}
                        รหัสประจำตัว
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'20%' }}>
                        ชื่อ - นามสกุล
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'1%' }}>
                        อายุ
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'1%' }}>
                        อาชีพ
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'10%' }}>
                        สาขาวิชา
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'10%' }}>
                        {" "}
                        รหัสหลักสูตร
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'30%' }}>
                        {" "}
                        หลักสูตร
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'30%' }}>
                        {" "}
                        ที่อยู่
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'1%' }}>
                        {" "}
                        เบอร์มือถือ
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'1%' }}>
                        {" "}
                        ไลน์
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff",width:'1%' }}>
                        {" "}
                        บทบาท
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? filteredUser.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : filteredUser
                    ).map((users, index) => (
                      <TableRow
                        key={users.user_uid}
                        className={index % 2 === 0 ? "even" : "odd"}
                      >
                        <TableCell sx={{ textAlign: "center" }}>
                          {users.user_uid || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {users.name || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {users.age || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {users.career || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {users.fac_name || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {users.curriculum_code || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {users.curriculum_name || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {users.address || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {users.tel || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {users.line_contact || ""}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {users.role_name || ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25,100,200]}
                component="div"
                count={filteredUser.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <Button
                sx={{ width: "100%", pt: 1, pb: 1 }}
                // onClick={() => addAdvisor()}
              >
                <AddRoundedIcon style={{ color: "black" }} />
                <Typography sx={{ color: "#05383B", fontSize: 16 }}>
                  เพิ่มผู้ใช้งาน
                </Typography>
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Box>
    </Appbar>
  );
}
