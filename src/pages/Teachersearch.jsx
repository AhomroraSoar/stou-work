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
} from "@mui/material";

import Appbar from "../assets/Appbar.jsx";

import BigBackground from "../assets/img/BigBackground.png";

import "../css/Teachersearch.css";

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

  // Check if teacher is an array before filtering
  const filteredTeacher = Array.isArray(teacher)
    ? teacher.filter((teacher) =>
        teacher.advisor_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
            pb:5,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Paper sx={{ width: "70%", backgroundColor: "#FFF9EB" }}>
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
                label="กรุณาใส่ชื่ออาจารย์ที่ต้องการค้นหา"
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
                      <TableCell sx={{ textAlign: "center", color: "#ffffff" }}>
                        {" "}
                        รหัสประจำตัว
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff" }}>
                        ชื่อ - นามสกุล
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff" }}>
                        สาขาวิชา
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff" }}>
                        เบอร์โทรศัพท์
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff" }}>
                        Line ID
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", color: "#ffffff" }}>
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
            </Grid>
          </Paper>
        </Grid>
      </Box>
    </Appbar>
  );
}
