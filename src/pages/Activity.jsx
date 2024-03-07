import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Appbar from "../assets/Appbar.jsx";

import BigBackground from "../assets/img/BigBackground.png";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function Page() {
  const [data, setData] = useState([]);
  const [clubdata, setClubdata] = useState([]);
  const [teacherdata, setTeacherdata] = useState([]);
  const [committeedata, setCommitteedata] = useState([]);
  const { club_id } = useParams();
  const [participantsCounts, setParticipantsCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/club/${club_id}`);
        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData);
        } else {
          console.error("Failed to fetch club data");
        }
      } catch (error) {
        console.error("Error fetching club data:", error);
      }
    };

    fetchData();
  }, [club_id]);

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
    const fetchTeacherData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/club/${club_id}/teacher`
        );
        if (response.ok) {
          const jsonData = await response.json();
          setTeacherdata(jsonData);
        } else {
          console.error("Failed to fetch teacher data");
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacherData();
  }, [club_id]);

  useEffect(() => {
    const fetchCommitteeData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/club/${club_id}/committee`
        );
        if (response.ok) {
          const jsonData = await response.json();
          setCommitteedata(jsonData);
        } else {
          console.error("Failed to fetch teacher data");
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchCommitteeData();
  }, [club_id]);

  useEffect(() => {
    const fetchClubdata = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/clubname/${club_id}`
        );
        if (response.ok) {
          const jsonData = await response.json();
          setClubdata(jsonData);
        } else {
          console.error("Failed to fetch club data");
        }
      } catch (error) {
        console.error("Error fetching club data:", error);
      }
    };

    fetchClubdata();
  }, [club_id]);

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
          data.length > 0 ? data[0].club_name : ""
        }`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      });

      if (swalResult.isConfirmed) {
        const response = await fetch(
          `http://localhost:4000/club/${club_id}/register`,
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

  const deleteActivity = (activity_id, activity_name) => {
    withReactContent(Swal)
      .fire({
        title: (
          <Typography variant="h6">
            ยืนยันว่าจะลบ <br /> {activity_name} ?
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
            activity_id: activity_id,
          };
          fetch("http://localhost:4000/deleteactivity", {
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
                    {clubdata && clubdata.club_name}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Grid
              container
              sx={{ display: "flex", justifyContent: "center", mt: 5 }}
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    width: 450,
                    height: 100,
                    fontSize: "30px",
                    borderRadius: 2,
                  }}
                  onClick={handleRegisterClick}
                >
                  สมัครสมาชิก
                </Button>

                <Grid item sx={{ mt: 2 }}>
                  <Paper
                    elevation={8}
                    sx={{
                      width: 450,
                      height: 75,
                      background: "#C9A66D",
                      borderRadius: "2px",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 18, textAlign: "center", pt: 1.5 }}
                    >
                      รายชื่ออาจารย์ที่ปรึกษา <br />
                      {clubdata && clubdata.club_name}
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={8}
                    sx={{
                      width: 450,
                      background: "#FFF6E1",
                      borderRadius: "2px",
                      textAlign: "center",
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
                            {teacherdata.map((user) => (
                              <TableRow key={user.user_id}>
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
                        <Button sx={{ width: "100%", pt: 1, pb: 1 }}>
                          <AddRoundedIcon style={{ color: "black" }} />
                          <Typography sx={{ color: "#05383B", fontSize: 16 }}>
                            เพิ่มอาจารย์ที่ปรึกษา
                          </Typography>
                        </Button>
                      </TableContainer>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item sx={{ mt: 2, mb: 10 }}>
                  <Paper
                    elevation={8}
                    sx={{
                      width: 450,
                      height: 75,
                      background: "#C9A66D",
                      borderRadius: "2px",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 18, textAlign: "center", pt: 1 }}
                    >
                      รายชื่อคณะกรรมการ <br />
                      {clubdata && clubdata.club_name}
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={8}
                    sx={{
                      width: 450,
                      background: "#FFF6E1",
                      borderRadius: "2px",
                      textAlign: "center",
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
                              <TableCell
                                sx={{ textAlign: "center", color: "#ffffff" }}
                              >
                                ตำแหน่ง
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {committeedata.map((user) => (
                              <TableRow key={user.user_id}>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.user_id}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.user_name}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.committee_role_name}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Button sx={{ width: "100%", pt: 1, pb: 1 }}>
                          <AddRoundedIcon style={{ color: "black" }} />
                          <Typography sx={{ color: "#05383B", fontSize: 16 }}>
                            เพิ่มคณะกรรมการ
                          </Typography>
                        </Button>
                      </TableContainer>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>

              <Grid item xs={8}>
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
                    รายชื่อกิจกรรมภายใน{clubdata && clubdata.club_name}
                  </Typography>
                </Paper>

                <Paper
                  elevation={8}
                  sx={{
                    width: "90%",
                    background: "#FFF6E1",
                    borderRadius: "2px",
                    pb: 0.5,
                    pt: 0.5,
                    ml: 5,
                  }}
                >
                  {data.map((activity) => (
                    <Grid key={activity.activity_id}>
                      <Button
                        component={Link}
                        to={`/activity/${activity.activity_id}`}
                        sx={{
                          width: 800,
                          color: "#222831",
                          fontSize: 20,
                          pb: 1.5,
                          pt: 1.5,
                        }}
                        key={activity.activity_id}
                      >
                        <Typography sx={{ fontSize: 20 }}>
                          <span style={{ color: "#4341d1" }}>ชื่อกิจกรรม </span>
                          {activity.activity_name}
                          <span style={{ color: "#4341d1" }}>
                            {" "}
                            จำนวนผู้เข้าร่วม:{" "}
                          </span>
                          <span>
                            {participantsCounts[activity.activity_id]} คน
                          </span>
                          <br />
                          <span style={{ color: "green" }}> เริ่ม: </span>
                          {formatDate(activity.start_date)}
                          <span style={{ color: "red" }}> สิ้นสุด: </span>
                          {formatDate(activity.finish_date)}
                        </Typography>
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          deleteActivity(
                            activity.activity_id,
                            activity.activity_name
                          )
                        }
                        sx={{ ml: 2.75 }}
                      >
                        ลบ
                      </Button>
                    </Grid>
                  ))}
                  <Button
                    component={Link}
                    to={`/createActivity/${club_id}`}
                    sx={{ width: "100%", pt: 1, pb: 1 }}
                  >
                    <AddRoundedIcon style={{ color: "black" }} />
                    <Typography sx={{ color: "#05383B", fontSize: 16 }}>
                      เพิ่มกิจกรรม
                    </Typography>
                  </Button>
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
                    {clubdata && clubdata.club_name}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Grid
              container
              sx={{ display: "flex", justifyContent: "center", mt: 5 }}
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    width: 450,
                    height: 100,
                    fontSize: "30px",
                    borderRadius: 2,
                  }}
                  onClick={handleRegisterClick}
                >
                  สมัครสมาชิก
                </Button>

                <Grid item sx={{ mt: 2 }}>
                  <Paper
                    elevation={8}
                    sx={{
                      width: 450,
                      height: 75,
                      background: "#C9A66D",
                      borderRadius: "2px",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 18, textAlign: "center", pt: 1.5 }}
                    >
                      รายชื่ออาจารย์ที่ปรึกษา <br />
                      {clubdata && clubdata.club_name}
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={8}
                    sx={{
                      width: 450,
                      background: "#FFF6E1",
                      borderRadius: "2px",
                      textAlign: "center",
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
                            {teacherdata.map((user) => (
                              <TableRow key={user.user_id}>
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

                <Grid item sx={{ mt: 2, mb: 10 }}>
                  <Paper
                    elevation={8}
                    sx={{
                      width: 450,
                      height: 75,
                      background: "#C9A66D",
                      borderRadius: "2px",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 18, textAlign: "center", pt: 1 }}
                    >
                      รายชื่อคณะกรรมการ <br />
                      {clubdata && clubdata.club_name}
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={8}
                    sx={{
                      width: 450,
                      background: "#FFF6E1",
                      borderRadius: "2px",
                      textAlign: "center",
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
                              <TableCell
                                sx={{ textAlign: "center", color: "#ffffff" }}
                              >
                                ตำแหน่ง
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {committeedata.map((user) => (
                              <TableRow key={user.user_id}>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.user_id}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.user_name}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                  {user.committee_role_name}
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

              <Grid item xs={8}>
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
                    รายชื่อกิจกรรมภายใน{clubdata && clubdata.club_name}
                  </Typography>
                </Paper>

                <Paper
                  elevation={8}
                  sx={{
                    width: "90%",
                    background: "#FFF6E1",
                    borderRadius: "2px",
                    pb: 0.5,
                    pt: 0.5,
                    ml: 5,
                  }}
                >
                  {data.map((activity) => (
                    <Button
                      component={Link}
                      to={`/activity/${activity.activity_id}`}
                      sx={{
                        width: "100%",
                        color: "#222831",
                        fontSize: 20,
                        pb: 1.5,
                        pt: 1.5,
                      }}
                      key={activity.activity_id}
                    >
                      <Typography sx={{ fontSize: 20 }}>
                        <span style={{ color: "#4341d1" }}>ชื่อกิจกรรม </span>
                        {activity.activity_name}
                        <span style={{ color: "#4341d1" }}>
                          {" "}
                          จำนวนผู้เข้าร่วม:{" "}
                        </span>
                        <span>
                          {participantsCounts[activity.activity_id]} คน
                        </span>
                        <br />
                        <span style={{ color: "green" }}> เริ่ม: </span>
                        {formatDate(activity.start_date)}
                        <span style={{ color: "red" }}> สิ้นสุด: </span>
                        {formatDate(activity.finish_date)}
                      </Typography>
                    </Button>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Appbar>
    );
  }
}
