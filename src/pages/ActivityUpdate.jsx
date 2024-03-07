import { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import thLocale from "dayjs/locale/th";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import Swal from "sweetalert2";

import LoginBackground from "../assets/img/login-background.png";

export default function ActivityUpdate() {
  const { activity_id } = useParams();
  const [activityTypes, setActivityTypes] = useState([]);
  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    // Function to fetch activity details
    const fetchActivityDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/activitydetail/${activity_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch activity details");
        }
        const data = await response.json();
        setActivityData(data[0]); // Set the fetched activity data
      } catch (error) {
        console.error("Error fetching activity details:", error);
      }
    };

    // Call the fetchActivityDetails function
    fetchActivityDetails();
  }, [activity_id]);

  useEffect(() => {
    if (activityData) {
      setActivity_name(activityData.activity_name);
      setLocation(activityData.location);
      setProvince(activityData.province);
      // setStart_date(activityData.start_date);
      // setFinish_date(activityData.finish_date);
      setFacebook_contact(activityData.facebook_contact);
      setLine_contact(activityData.line_contact);
      setActivity_type_id(activityData.activity_type_id);
    }
  }, [activityData]);

  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        const response = await fetch("http://localhost:4000/activity_type");
        if (!response.ok) {
          throw new Error("Failed to fetch activity types");
        }
        const data = await response.json();
        setActivityTypes(data);
      } catch (error) {
        console.error("Error fetching activity types:", error);
      }
    };

    fetchActivityTypes();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var data = {
      activity_name: activity_name,
      location: location,
      province: province,
      start_date: start_date,
      finish_date: finish_date,
      facebook_contact: facebook_contact,
      line_contact: line_contact,
      activity_type_id: parseInt(activity_type_id),
    };

    try {
      const res = await fetch(
        `http://localhost:4000/updateactivity/${activity_id}`,
        {
          method: "PUT",
          headers: myHeaders,
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (result.status === "ok") {
        Swal.fire({
          icon: "success",
          title: "แก้ไขกิจกรรมเสร็จสิ้น",
          text: result.message,
          showConfirmButton: true,
          timerProgressBar: false,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `/activity/${activity_id}`;
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
          timer: 2500,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while processing your request",
        showConfirmButton: false,
        position: "top-end",
        toast: true,
        timer: 2500,
        timerProgressBar: true,
      });
    }
  };

  const [activity_name, setActivity_name] = useState("");
  const [location, setLocation] = useState("");
  const [province, setProvince] = useState("");
  const [start_date, setStart_date] = useState("");
  const [finish_date, setFinish_date] = useState("");
  const [facebook_contact, setFacebook_contact] = useState("");
  const [line_contact, setLine_contact] = useState("");
  const [activity_type_id, setActivity_type_id] = useState("");

  const theme = createTheme({
    palette: {
      primary: {
        main: "#142454",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ minHeight: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          md={6}
          sx={{
            backgroundImage: `url(${LoginBackground})`,
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
          md={6}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
              mb: 2,
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mt: 1, mb: 1 }}>
              ลงทะเบียนเพิ่มกิจกรรม
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
                    id="activity_name"
                    label="ชื่อกิจกรรม"
                    value={activityData ? activityData.activity_name : ""}
                    sx={{ width: 490 }}
                    onChange={(e) => setActivity_name(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2, border: 0 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="location"
                    label="สถานที่"
                    value={activityData ? activityData.location : ""}
                    sx={{ width: 490 }}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2, border: 0 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="province"
                    label="จังหวัด"
                    value={activityData ? activityData.province : ""}
                    sx={{ width: 490 }}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </Grid>

                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  locale={thLocale}
                >
                  <Grid
                    container
                    item
                    spacing={5}
                    xs={12}
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Grid item>
                      <DateTimePicker
                        label="เริ่มต้น"
                        value={start_date}
                        sx={{ width: 225 }}
                        viewRenderers={{
                          hours: null,
                          minutes: null,
                          seconds: null,
                        }}
                        onChange={(newValue) => {
                          setStart_date(newValue);
                        }}
                        textField={<TextField variant="outlined" />}
                        format="DD/MM/YYYY HH:mm"
                        mask="__/__/____ __:__"
                        inputFormat={(value) =>
                          dayjs(value).format("DD/MM/YYYY HH:mm")
                        }
                      />
                    </Grid>

                    <Grid item>
                      <DateTimePicker
                        label="สิ้นสุด"
                        value={finish_date}
                        sx={{ width: 225 }}
                        viewRenderers={{
                          hours: null,
                          minutes: null,
                          seconds: null,
                        }}
                        onChange={(newValue) => {
                          setFinish_date(newValue);
                        }}
                        textField={<TextField variant="outlined" />}
                        format="DD/MM/YYYY HH:mm"
                        mask="__/__/____ __:__"
                        inputFormat={(value) =>
                          dayjs(value).format("DD/MM/YYYY HH:mm")
                        }
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="facebook_contact"
                    label="Facebook Page"
                    value={activityData ? activityData.facebook_contact : ""}
                    sx={{ width: 490 }}
                    onChange={(e) => setFacebook_contact(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 0 }}>
                  <TextField
                    variant="outlined"
                    required
                    id="line_contact"
                    label="LineID"
                    value={activityData ? activityData.line_contact : ""}
                    sx={{ width: 490 }}
                    onChange={(e) => setLine_contact(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Autocomplete
                    sx={{ width: 500 }}
                    options={activityTypes}
                    getOptionLabel={(option) => option.activity_type_name || ""} // Handle empty value
                    value={
                      activityTypes.find(
                        (option) => option.activity_type_id === activity_type_id
                      ) || null
                    } // Ensure value matches an option
                    onChange={(event, newValue) => {
                      setActivity_type_id(
                        newValue ? newValue.activity_type_id : ""
                      ); // Set the selected activity type ID
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="กิจกรรมประเภท"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ width: 150, height: 40, mr: 8 }}
                  >
                    ยืนยัน
                  </Button>
                  <Button
                    variant="contained"
                    href={`/activity/${activity_id}`}
                    color="error"
                    sx={{ width: 150, height: 40 }}
                  >
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
