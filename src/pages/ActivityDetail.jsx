import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";

import Swal from "sweetalert2";

import Appbar from "../assets/Appbar.jsx";

import BigBackground from "../assets/img/BigBackground.png";

export default function Page() {
  const [data, setData] = useState([]);
  const [paticipantdata, setParticipantData] = useState([]);
  const { activity_id } = useParams();
  const [participantsCounts, setParticipantsCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/activitydetail/${activity_id}`
        );
        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData);
        } else {
          console.error("Failed to fetch activity");
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    fetchData();
  }, [activity_id]);

  useEffect(() => {
    const fetchParticipantsCounts = async () => {
      const counts = {};
      for (const activity of data) {
        try {
          const response = await fetch(
            `http://localhost:4000/activity/${activity.activity_id}`
          );
          if (response.ok) {
            const jsonData = await response.json();
            counts[activity.activity_id] = jsonData.length;
          } else {
            console.error(
              `Failed to fetch participants count for activity ${activity.activity_id}`
            );
          }
        } catch (error) {
          console.error(
            `Error fetching participants count for activity ${activity.activity_id}:`,
            error
          );
        }
      }
      setParticipantsCounts(counts);
    };

    if (data.length > 0) {
      fetchParticipantsCounts();
    }
  }, [data]);

  useEffect(() => {
    const fetchpaticipantdata = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/activity/${activity_id}`
        );
        if (response.ok) {
          const jsonData = await response.json();
          setParticipantData(jsonData);
        } else {
          console.error("Failed to fetch activity");
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    fetchpaticipantdata();
  }, [activity_id]);

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleRegisterClick = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));

      if (!userData || !userData.user_id) {
        throw new Error("User data or user ID not found in local storage");
      }

      const userId = userData.user_id;

      const swalResult = await Swal.fire({
        title: "ยืนยัน",
        text: `ยืนยันที่จะลงทะเบียนเข้าร่วม ${
          data.length > 0 ? data[0].activity_name : ""
        }`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      });

      if (swalResult.isConfirmed) {
        const response = await fetch(
          `http://localhost:4000/activity/${activity_id}/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              user: JSON.stringify({ user_id: userId }),
            },
          }
        );

        const result = await response.json();

        console.log("Result status:", result.status);

        if (result.status === "ok") {
          console.log("Inside error block");
          Swal.fire({
            icon: "success",
            title: "ลงทะเบียนเรียบร้อย",
            text: result.message,
            showConfirmButton: false,
            timerProgressBar: false,
          });
        } else if (result.status === "registered") {
          console.log("Inside error block");
          Swal.fire({
            icon: "error",
            title: "ไม่สามารถลงทะเบียนได้",
            text: result.message,
            showConfirmButton: false,
            timerProgressBar: false,
          });
        }
      }
    } catch (error) {
      console.error("Error registering user to the club:", error);
    }
  };

  const UpdateActivity = (activity_id) => {
    window.location = "/updateactivity/" + activity_id;
  };

  const role = JSON.parse(localStorage.getItem("user"));
  if (role.role_id === 3) {
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
          <Grid container>
            <Grid item xs={12}>
              <Grid
                item
                textAlign="center"
                sx={{ justifyContent: "center", display: "flex", mt: 3 }}
                xs={12}
              >
                <Paper
                  elevation={8}
                  sx={{ background: "#C9A66D", borderRadius: "5px" }}
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
                    กิจกรรม {data.length > 0 && `${data[0].activity_name}`}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Grid
              container
              sx={{ display: "flex", justifyContent: "center", mt: 5 }}
            >
              <Grid item xs={5}>
                <Grid item sx={{ ml: 5 }}>
                  <Paper
                    elevation={8}
                    sx={{
                      width: "90%",
                      height: 75,
                      background: "#C9A66D",
                      borderRadius: "2px",
                      pb: 0.5,
                      pt: 0.5,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 20, textAlign: "center", pt: 2.25 }}
                    >
                      รายระเอียดกิจกรรม
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={8}
                    sx={{
                      width: "90%",
                      background: "#FFF6E1",
                      borderRadius: "2px",
                      pt: 0.5,
                    }}
                  >
                    {data.map((activity) => (
                      <Grid container key={activity.activity_id}>
                        <Grid item xs={12}>
                          <Typography
                            sx={{ fontSize: 20, ml: 6, pt: 1.5, pb: 1.5 }}
                            key={activity.activity_id}
                          >
                            <span style={{ color: "#4341d1" }}>
                              ชื่อกิจกรรม{" "}
                            </span>
                            {activity.activity_name}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{ color: "#4341d1" }}>
                              จำนวนผู้เข้าร่วม{" "}
                            </span>
                            {participantsCounts[activity_id]}&nbsp;
                            <span style={{ color: "#4341d1" }}>คน </span>
                            <br />
                            <span style={{ color: "#4341d1" }}>
                              ลักษณะกิจกรรม:{" "}
                            </span>
                            {activity.activity_type_name}
                            <br />
                            <span style={{ color: "#4341d1" }}>สถานที่: </span>
                            {activity.location}&nbsp;
                            <span style={{ color: "#4341d1" }}>จังหวัด: </span>
                            {activity.province}
                            <br />
                            <span style={{ color: "#4341d1" }}>Facebook: </span>
                            {activity.facebook_contact}
                            <br />
                            <span style={{ color: "#4341d1" }}>Line: </span>
                            {activity.line_contact}
                            <br />
                            <span style={{ color: "green" }}> เริ่ม: </span>
                            {formatDate(activity.start_date)}
                            <span style={{ color: "red" }}> สิ้นสุด: </span>
                            {formatDate(activity.finish_date)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 1 }}>
                          <Button
                            variant="contained"
                            sx={{ width: "100%", borderRadius: 0, p: 1.5 }}
                            onClick={() => UpdateActivity(activity.activity_id)}
                          >
                            แก้ไขข้อมูลกิจกรรม
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                  </Paper>
                </Grid>

                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    width: "84.5%",
                    height: 100,
                    fontSize: "30px",
                    borderRadius: 2,
                    mt: 2,
                    ml: 5,
                  }}
                  onClick={handleRegisterClick}
                >
                  สมัครเข้าร่วมกิจกรรม
                </Button>
              </Grid>

              <Grid item xs={7}>
                <Paper
                  elevation={8}
                  sx={{
                    width: "90%",
                    height: 75,
                    background: "#C9A66D",
                    borderRadius: "2px",
                    ml: 5,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 20, textAlign: "center", pt: 2.25 }}
                  >
                    รายชื่อผู้เข้าร่วมกิจกรรม
                    {data.length > 0 && `${data[0].activity_name}`}
                  </Typography>
                </Paper>

                <Paper
                  elevation={8}
                  sx={{
                    width: "90%",
                    background: "#FFF6E1",
                    borderRadius: "2px",
                    pb: 0.5,
                    ml: 5,
                  }}
                >
                  <Grid item xs={12} sx={{ width: "100%" }}>
                    <TableContainer>
                      <Table>
                        <TableHead
                          sx={{ backgroundColor: "#003D98", borderBottom: 2 }}
                        >
                          <TableRow>
                            <TableCell
                              sx={{ textAlign: "center", color: "#ffffff" }}
                            >
                              รหัสประจำตัว
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "center", color: "#ffffff" }}
                            >
                              ชื่อ - นามสกุล
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paticipantdata.slice(0, 10).map((user, index) => (
                            <TableRow
                              key={user.user_id}
                              className={index % 2 === 0 ? "even" : "odd"}
                            >
                              <TableCell sx={{ textAlign: "center" }}>
                                {user.user_id}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user.user_name}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Paper>
              </Grid>
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
            backgroundRepeat: "repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "92.8vh",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Grid
                item
                textAlign="center"
                sx={{ justifyContent: "center", display: "flex", mt: 3 }}
                xs={12}
              >
                <Paper
                  elevation={8}
                  sx={{ background: "#C9A66D", borderRadius: "5px" }}
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
                    กิจกรรม {data.length > 0 && `${data[0].activity_name}`}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Grid
              container
              sx={{ display: "flex", justifyContent: "center", mt: 5 }}
            >
              <Grid item xs={5}>
                <Grid item sx={{ ml: 5 }}>
                  <Paper
                    elevation={8}
                    sx={{
                      width: "90%",
                      height: 75,
                      background: "#C9A66D",
                      borderRadius: "2px",
                      pb: 0.5,
                      pt: 0.5,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 20, textAlign: "center", pt: 2.25 }}
                    >
                      รายระเอียดกิจกรรม
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={8}
                    sx={{
                      width: "90%",
                      background: "#FFF6E1",
                      borderRadius: "2px",
                      pt: 0.5,
                    }}
                  >
                    {data.map((activity) => (
                      <Grid container key={activity.activity_id}>
                        <Grid item xs={12}>
                          <Typography
                            sx={{ fontSize: 20, ml: 6, pt: 1.5, pb: 1.5 }}
                            key={activity.activity_id}
                          >
                            <span style={{ color: "#4341d1" }}>
                              ชื่อกิจกรรม{" "}
                            </span>
                            {activity.activity_name}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{ color: "#4341d1" }}>
                              จำนวนผู้เข้าร่วม{" "}
                            </span>
                            {participantsCounts[activity_id]}&nbsp;
                            <span style={{ color: "#4341d1" }}>คน </span>
                            <br />
                            <span style={{ color: "#4341d1" }}>
                              ลักษณะกิจกรรม:{" "}
                            </span>
                            {activity.activity_type_name}
                            <br />
                            <span style={{ color: "#4341d1" }}>สถานที่: </span>
                            {activity.location}&nbsp;
                            <span style={{ color: "#4341d1" }}>จังหวัด: </span>
                            {activity.province}
                            <br />
                            <span style={{ color: "#4341d1" }}>Facebook: </span>
                            {activity.facebook_contact}
                            <br />
                            <span style={{ color: "#4341d1" }}>Line: </span>
                            {activity.line_contact}
                            <br />
                            <span style={{ color: "green" }}> เริ่ม: </span>
                            {formatDate(activity.start_date)}
                            <span style={{ color: "red" }}> สิ้นสุด: </span>
                            {formatDate(activity.finish_date)}
                          </Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </Paper>
                </Grid>

                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    width: "84.5%",
                    height: 100,
                    fontSize: "30px",
                    borderRadius: 2,
                    mt: 2,
                    ml: 5,
                  }}
                  onClick={handleRegisterClick}
                >
                  สมัครเข้าร่วมกิจกรรม
                </Button>
              </Grid>

              <Grid item xs={7}>
                <Paper
                  elevation={8}
                  sx={{
                    width: "90%",
                    height: 75,
                    background: "#C9A66D",
                    borderRadius: "2px",
                    ml: 5,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 20, textAlign: "center", pt: 2.25 }}
                  >
                    รายชื่อผู้เข้าร่วมกิจกรรม
                    {data.length > 0 && `${data[0].activity_name}`}
                  </Typography>
                </Paper>

                <Paper
                  elevation={8}
                  sx={{
                    width: "90%",
                    background: "#FFF6E1",
                    borderRadius: "2px",
                    pb: 0.5,
                    ml: 5,
                  }}
                >
                  <Grid item xs={12} sx={{ width: "100%" }}>
                    <TableContainer>
                      <Table>
                        <TableHead
                          sx={{ backgroundColor: "#003D98", borderBottom: 2 }}
                        >
                          <TableRow>
                            <TableCell
                              sx={{ textAlign: "center", color: "#ffffff" }}
                            >
                              รหัสประจำตัว
                            </TableCell>
                            <TableCell
                              sx={{ textAlign: "center", color: "#ffffff" }}
                            >
                              ชื่อ - นามสกุล
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paticipantdata.slice(0, 10).map((user, index) => (
                            <TableRow
                              key={user.user_id}
                              className={index % 2 === 0 ? "even" : "odd"}
                            >
                              <TableCell sx={{ textAlign: "center" }}>
                                {user.user_id}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                {user.user_name}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Appbar>
    );
  }
}
