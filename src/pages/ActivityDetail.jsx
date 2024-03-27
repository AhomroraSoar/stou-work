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
  TablePagination,
  Card,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import { useParams } from "react-router-dom";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Appbar from "../assets/Appbar.jsx";

import BigBackground from "../assets/img/BigBackground.png";

export default function Page() {
  const [data, setData] = useState([]);
  const [paticipantdata, setParticipantData] = useState([]);
  const { activity_id } = useParams();
  const [participantsCounts, setParticipantsCounts] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [images, setImages] = useState([]);
  const [currentDate] = useState(new Date());

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
        const userData = JSON.parse(localStorage.getItem("userData"));

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
                Swal.fire({
                    icon: "success",
                    title: "ลงทะเบียนเรียบร้อย",
                    text: result.message,
                    showConfirmButton: false,
                    timerProgressBar: false,
                });
            } else if (result.status === "registered") {
                Swal.fire({
                    icon: "error",
                    title: "ไม่สามารถลงทะเบียนได้",
                    text: result.message,
                    showConfirmButton: false,
                    timerProgressBar: false,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "An unexpected error occurred",
                    showConfirmButton: false,
                    timerProgressBar: false,
                });
            }
        }
    } catch (error) {
        console.error("Error registering user to the club:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "An unexpected error occurred",
            showConfirmButton: false,
            timerProgressBar: false,
        });
    }
};


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/images/${activity_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [activity_id]);

  const UpdateActivity = (activity_id) => {
    window.location = "/updateactivity/" + activity_id;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImageUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a file",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("picture", file);

      const response = await fetch(
        `http://localhost:4000/pictureupload/${activity_id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      const pictureUrl = data.url;

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "File uploaded successfully",
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error uploading picture:", error);
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถอัพโหลดไฟล์ที่เลือกได้",
      });
    }
  };

  const IMGdelete = (img_id) => {
    withReactContent(Swal)
      .fire({
        title: <Typography variant="h6">ยืนยันว่าจะลบรูปภาพนี้ ?</Typography>,
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
          fetch(`http://localhost:4000/deleteimage/${img_id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error("Failed to delete image");
              }
              return res.json();
            })
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
            })
            .catch((error) => {
              console.error("Error deleting image:", error);
              Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถลบรูปภาพได้",
              });
            });
        }
      });
  };

  const handleCancel = () => {
    setFile(null);
    setImageUrl(null);
  };

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  const isRegistrationDisabled = () => {
    if (data.length > 0 && formatDate(data[0].start_date) < currentDate) {
      return true;
    }
    return false;
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
            backgroundRepeat: "repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "92.8vh",
          }}
        >
          <Grid container sx={{ mb: 5 }}>
            <Grid item xs={12}>
              <Grid
                item
                textAlign="center"
                sx={{ justifyContent: "center", display: "flex", mt: 3 }}
                xs={12}
              >
                <Paper
                  elevation={8}
                  sx={{
                    background: "#C9A66D",
                    borderRadius: "5px",
                    maxWidth: 1400,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 26,
                      textAlign: "center",
                      pl: 10,
                      pr: 10,
                      pt: 1.5,
                      pb: 1.5,
                      wordWrap: "break-word",
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
                      รายละเอียดกิจกรรม
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
                              ชื่อกิจกรรม:
                            </span>
                            <span
                              style={{
                                maxWidth: "450px",
                                wordWrap: "break-word",
                                display: "inline-block",
                                verticalAlign: "top",
                              }}
                            >
                              {activity.activity_name}
                            </span>
                            <br />
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
                  disabled={isRegistrationDisabled()}
                >
                  สมัครเข้าร่วมกิจกรรม
                </Button>
              </Grid>

              <Grid item xs={7} >
                <Paper
                  elevation={8}
                  sx={{
                    width: "90%",
                    background: "#C9A66D",
                    borderRadius: "2px",
                    ml: 5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 20,
                      textAlign: "center",
                      pt: 2.25,
                      wordWrap: "break-word",
                    }}
                  >
                    รายชื่อผู้เข้าร่วมกิจกรรม
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 20,
                      textAlign: "center",
                      wordWrap: "break-word",
                      pb:2,
                      pl:2,
                      pr:2
                    }}
                  >
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
                          {(rowsPerPage > 0
                            ? paticipantdata.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                            : paticipantdata
                          ).map((user, index) => (
                            <TableRow
                              key={user.user_id}
                              className={index % 2 === 0 ? "even" : "odd"}
                            >
                              <TableCell
                                sx={{ textAlign: "center", width: "50%" }}
                              >
                                {user.user_id}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", width: "50%" }}
                              >
                                {user.name}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TablePagination
                            rowsPerPageOptions={[
                              10,
                              15,
                              25,
                              { label: "All", value: -1 },
                            ]}
                            component="div"
                            count={paticipantdata.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid container sx={{ display: "flex", justifyContent: "center" }}>
            {images.map((image) => (
              <Grid
                item
                key={image.img_id}
                xs={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: "100%",
                    p: 1,
                    m: 2,
                    raised: true,
                  }}
                  style={{
                    borderRadius: 10,
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      handleImageClick(image.img_url.replace(/\\/g, "/"))
                    }
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: "100%",
                        height: 400,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                      image={image.img_url.replace(/\\/g, "/")}
                    />
                  </CardActionArea>
                  <Grid sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ mt: 1, mb: 1, width: 100 }}
                      onClick={() => IMGdelete(image.img_id)}
                    >
                      ลบ
                    </Button>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 5,
                mb: 5,
                maxWidth: "25%",
                backgroundColor: "white",
                borderRadius: 3,
              }}
            >
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {imageUrl ? (
                  <CardMedia
                    component="img"
                    src={imageUrl}
                    alt="Preview"
                    sx={{ mr: 1.75 }}
                  />
                ) : (
                  <Typography>กรุณาเลือกรูปภาพที่ต้องการอัพโหลด</Typography>
                )}
              </Grid>
              <Grid item sx={{ pb: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="contained" component="span">
                    เลือกไฟล์
                  </Button>
                </label>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!file}
                >
                  อัพโหลด
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                  disabled={!file}
                >
                  ยกเลิก
                </Button>
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
                      รายละเอียดกิจกรรม
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
                  disabled={isRegistrationDisabled()}
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
                              sx={{
                                textAlign: "center",
                                color: "#ffffff",
                                width: "50%",
                              }}
                            >
                              รหัสประจำตัว
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                                color: "#ffffff",
                                width: "50%",
                              }}
                            >
                              ชื่อ - นามสกุล
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(rowsPerPage > 0
                            ? paticipantdata.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                            : paticipantdata
                          ).map((user, index) => (
                            <TableRow
                              key={user.user_id}
                              className={index % 2 === 0 ? "even" : "odd"}
                            >
                              <TableCell
                                sx={{ textAlign: "center", width: "50%" }}
                              >
                                {user.user_id}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", width: "50%" }}
                              >
                                {user.name}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TablePagination
                            rowsPerPageOptions={[
                              10,
                              15,
                              25,
                              { label: "All", value: -1 },
                            ]}
                            component="div"
                            count={paticipantdata.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid container sx={{ display: "flex", justifyContent: "center" }}>
            {images.map((image) => (
              <Grid
                item
                key={image.img_id}
                xs={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: "100%",
                    p: 1,
                    m: 2,
                    raised: true,
                  }}
                  style={{
                    borderRadius: 10,
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      handleImageClick(image.img_url.replace(/\\/g, "/"))
                    }
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: "100%",
                        height: 400,
                        borderRadius: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                      image={image.img_url.replace(/\\/g, "/")}
                    />
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Appbar>
    );
  }
}
