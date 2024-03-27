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
  TablePagination,
} from "@mui/material";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../css/Swal.css";

import Appbar from "../assets/Appbar.jsx";

import BigBackground from "../assets/img/BigBackground.png";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

export default function Page() {
  const [data, setData] = useState([]);
  const [clubdata, setClubdata] = useState([]);
  const [teacherdata, setTeacherdata] = useState([]);
  const [committeedata, setCommitteedata] = useState([]);
  const [participantsCounts, setParticipantsCounts] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [teachpage, setTeachpage] = useState(0);
  const [rowsPerTeachpage, setRowsTeachpage] = useState(5);
  const [actpage, setActpage] = useState(0);
  const [rowsPerActpage, setRowsPerActpage] = useState(10);

  const { club_id } = useParams();

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
      const userData = JSON.parse(localStorage.getItem("userData"));

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

  const editAdvisor = async (advisor_id) => {
    try {
      // Fetch advisor data
      const advisorResponse = await fetch(
        `http://localhost:4000/advisor/${advisor_id}`
      );
      const advisorData = await advisorResponse.json();

      // Check if advisor data is fetched successfully
      if (!advisorResponse.ok || advisorData.length === 0) {
        throw new Error("Failed to fetch advisor data");
      }

      const {
        advisor_id: fetchedAdvisorId,
        advisor_name,
        department,
        advisor_tel,
        line_contact,
      } = advisorData[0];

      // Show Swal modal with pre-filled data
      const result = await withReactContent(Swal).fire({
        title: <Typography>แก้ไขอาจารย์ที่ปรึกษา</Typography>,
        html: `<input id="advisor_id" class="swal2-input" placeholder="รหัสประจำตัว" value="${fetchedAdvisorId}">
               <input id="advisor_name" class="swal2-input" placeholder="ชื่อ-สกุล" value="${advisor_name}">
               <input id="department" class="swal2-input" placeholder="สาชาวิชา" value="${department}">
               <input id="advisor_tel" class="swal2-input" placeholder="เบอร์โทรศัพท์" value="${advisor_tel}">
               <input id="line_contact" class="swal2-input" placeholder="Line ID" value="${line_contact}">
               `,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        showCancelButton: true,
        allowOutsideClick: false,
        preConfirm: () => {
          const editedAdvisorId = document.getElementById("advisor_id").value;
          const advisor_name = document.getElementById("advisor_name").value;
          const department = document.getElementById("department").value;
          const advisor_tel = document.getElementById("advisor_tel").value;
          const line_contact = document.getElementById("line_contact").value;

          if (
            !editedAdvisorId.trim() ||
            !advisor_name.trim() 
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
            advisor_id: editedAdvisorId,
            advisor_name,
            department,
            advisor_tel,
            line_contact,
          };
        },
      });

      if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }

      // Send updated data to server
      const response = await fetch(
        `http://localhost:4000/advisorupdate/${advisor_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result.value),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "แก้ไขเสร็จสิ้น",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          title: "มีบางอย่างผิดพลาดกับการแก้ไข",
          text: responseData.message || "Failed to update advisor",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating advisor:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update advisor",
        icon: "error",
      });
    }
  };

  const deleteAdvisor = (advisor_id, advisor_name) => {
    withReactContent(Swal)
      .fire({
        title: (
          <Typography variant="h6">
            ยืนยันว่าจะลบ <br /> {advisor_name} ?
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
            advisor_id: advisor_id,
          };
          fetch("http://localhost:4000/deleteadvisor", {
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

  const addAdvisor = async (club_id) => {
    try {
      const result = await withReactContent(Swal).fire({
        title: <Typography>เพิ่มอาจารย์ที่ปรึกษา</Typography>,
        html: `<input id="advisor_id" class="swal2-input" placeholder="รหัสประจำตัว">
                 <input id="advisor_name" class="swal2-input" placeholder="ชื่อ-สกุล">
                 <input id="department" class="swal2-input" placeholder="สาชาวิชา">
                 <input id="advisor_tel" class="swal2-input" placeholder="เบอร์โทรศัพท์">
                 <input id="line_contact" class="swal2-input" placeholder="Line ID">
                 `,
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

          if (
            !advisor_id.trim() ||
            !advisor_name.trim()
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
          };
        },
      });

      if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }

      const response = await fetch(
        `http://localhost:4000/advisorregister/club/${club_id}`,
        {
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
            club_id: club_id,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "เสร็จสิ้น",
          text: responseData.message,
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload();
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

  const deleteCommittee = (committee_id, committee_name) => {
    withReactContent(Swal)
      .fire({
        title: (
          <Typography variant="h6">
            ยืนยันว่าจะลบ <br /> {committee_name} ?
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
            committee_id: committee_id,
          };
          fetch("http://localhost:4000/deletecommittee", {
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

  const editCommittee = async (committee_id) => {
    try {
      const committeeRoles = await fetch(
        "http://localhost:4000/committee_role"
      );
      const committeeRolesData = await committeeRoles.json();

      const committeeResponse = await fetch(
        `http://localhost:4000/committee/${committee_id}`
      );
      const committeeData = await committeeResponse.json();

      // Check if advisor data is fetched successfully
      if (!committeeResponse.ok || committeeData.length === 0) {
        throw new Error("Failed to fetch advisor data");
      }

      const {
        committee_name,
        committee_tel,
        committee_line,
        committee_role_id,
        committee_role_name,
      } = committeeData[0];

      const result = await withReactContent(Swal).fire({
        title: <Typography>แก้ไขอาจารย์ที่ปรึกษา</Typography>,
        html: `
               <input id="committee_name" class="swal2-input" placeholder="ชื่อ-สกุล" value="${committee_name}">
               <input id="committee_tel" class="swal2-input" placeholder="สาชาวิชา" value="${committee_tel}">
               <input id="committee_line" class="swal2-input" placeholder="เบอร์โทรศัพท์" value="${committee_line}">
               <select id="committee_role_id" class="swal2-select">
                <option value="${committeeData[0].committee_role_id[0]}" selected>${
                      committeeData[0].committee_role_name
                    }</option> <!-- Previous committee name -->
                ${committeeRolesData
                  .filter(
                    (role) =>
                      !committeeData[0].committee_role_id.includes(role.committee_role_id)
                  )
                  .map(
                    (role) =>
                      `<option value="${role.committee_role_id}">${role.committee_role_name}</option>`
                  )
                  .join("")}
              </select>
               `,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        showCancelButton: true,
        allowOutsideClick: false,
        preConfirm: () => {
          const committee_name =
            document.getElementById("committee_name").value;
          const committee_tel = document.getElementById("committee_tel").value;
          const committee_line =
            document.getElementById("committee_line").value;
          const committee_role_id =
            document.getElementById("committee_role_id").value;

          if (
            !committee_name.trim() ||
            !committee_tel.trim() ||
            !committee_line.trim() ||
            !committee_role_id.trim()
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
            committee_name,
            committee_tel,
            committee_line,
            committee_role_id,
          };
        },
      });

      if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }

      const response = await fetch(
        `http://localhost:4000/committeeupdate/${committee_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result.value),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "แก้ไขเสร็จสิ้น",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          title: "มีบางอย่างผิดพลาดกับการแก้ไข",
          text: responseData.message || "Failed to update committee",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating committee:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update committee",
        icon: "error",
      });
    }
  };

  const addCommittee = async (club_id) => {
    try {
      const committeeRoles = await fetch(
        "http://localhost:4000/committee_role"
      );
      const committeeRolesData = await committeeRoles.json();

      const result = await withReactContent(Swal).fire({
        title: <Typography>เพิ่มคณะกรรมการ</Typography>,
        html: `
          <input id="committee_name" class="swal2-input" placeholder="ชื่อ-สกุล">
          <input id="committee_tel" class="swal2-input" placeholder="เบอร์โทรศัพท์">
          <input id="committee_line" class="swal2-input" placeholder="Line">
          <select id="committee_role_id" class="swal2-select">
          <option value="">กรุณาเลือกตำแหน่ง</option> <!-- Empty option -->
          ${committeeRolesData
            .map(
              (role) =>
                `<option value="${role.committee_role_id}">${role.committee_role_name}</option>`
            )
            .join("")}
          </select>
        `,
        confirmButtonText: "เพิ่ม",
        cancelButtonText: "ยกเลิก",
        showCancelButton: true,
        allowOutsideClick: false,
        preConfirm: () => {
          const committee_name =
            document.getElementById("committee_name").value;
          const committee_tel = document.getElementById("committee_tel").value;
          const committee_line =
            document.getElementById("committee_line").value;
          const committee_role_id =
            document.getElementById("committee_role_id").value;

          if (
            !committee_name.trim() ||
            !committee_tel.trim() ||
            !committee_line.trim() ||
            !committee_role_id.trim()
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
            committee_name,
            committee_tel,
            committee_line,
            committee_role_id,
          };
        },
      });

      if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }

      const response = await fetch(
        `http://localhost:4000/committeeregister/club/${club_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            committee_name: result.value.committee_name,
            committee_tel: result.value.committee_tel,
            committee_line: result.value.committee_line,
            committee_role_id: result.value.committee_role_id,
            club_id: club_id,
          }),
        }
      );

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

  //set rows teacherlist
  const handleChangeTeacherListpage = (event, newPage) => {
    setTeachpage(newPage);
  };
  const handleChangeRowsPerTeacherListPage = (event) => {
    setRowsTeachpage(parseInt(event.target.value, 10)); //parsed as a base-10 (decimal) integer
    setTeachpage(0);
  };

  //set rows committeelist
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //set rows activitylist
  const handleChangeActListpage = (event, newPage) => {
    setActpage(newPage);
  };
  const handleChangeRowsPerActListpage = (event) => {
    setRowsPerActpage(parseInt(event.target.value, 10));
    setActpage(0);
  };

  const showteacherData = (club_advisor) => {
    Swal.fire({
      showConfirmButton: false,
      html: `
        <div>
          <p><strong>รหัสประจำตัว:</strong> ${club_advisor.advisor_id}</p>
          <p><strong>ชื่อ - สกุล:</strong> ${club_advisor.advisor_name}</p>
          <p><strong>เบอร์โทรศัพท์:</strong> ${club_advisor.advisor_tel}</p>
          <p><strong>สาขาวิชา:</strong> ${club_advisor.department}</p>
          <p><strong>Line:</strong> ${club_advisor.line_contact}</p>
        </div>
      `,
    });
  };

  const showcommitteeData = (club_committee) => {
    Swal.fire({
      showConfirmButton: false,
      html: `
        <div>
          <p><strong>ชื่อ - สกุล:</strong> ${club_committee.committee_name}</p>
          <p><strong>เบอร์โทรศัพท์:</strong> ${club_committee.committee_tel}</p>
          <p><strong>Line:</strong> ${club_committee.committee_line}</p>
          <p><strong>ตำแหน่ง:</strong> ${club_committee.committee_role_name}</p>
        </div>
      `,
    });
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
          <Grid container>
            <Grid container xs={12}>
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

            <Grid container sx={{ mt: 3.5 }}>
              <Grid
                container
                spacing={2}
                xs={5}
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
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
                </Grid>

                <Grid item>
                  <Paper
                    elevation={8}
                    sx={{
                      width: 550,
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
                      width: 550,
                      background: "#FFF6E1",
                      borderRadius: "2px",
                      textAlign: "center",
                    }}
                  >
                    <Grid item>
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
                                  width: "20%",
                                }}
                              >
                                รหัสประจำตัว
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  color: "#ffffff",
                                  width: "60%",
                                }}
                              >
                                ชื่อ - นามสกุล
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  color: "#ffffff",
                                  width: "20%",
                                }}
                              ></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(rowsPerTeachpage > 0
                              ? teacherdata.slice(
                                  teachpage * rowsPerTeachpage,
                                  teachpage * rowsPerTeachpage +
                                    rowsPerTeachpage
                                )
                              : teacherdata
                            ).map((club_advisor) => (
                              <TableRow key={club_advisor.advisor_id}>
                                <TableCell
                                  onClick={() => showteacherData(club_advisor)}
                                  style={{ cursor: "pointer" }}
                                  sx={{ textAlign: "center" }}
                                >
                                  {club_advisor.advisor_id}
                                </TableCell>
                                <TableCell
                                  onClick={() => showteacherData(club_advisor)}
                                  style={{ cursor: "pointer" }}
                                  sx={{ textAlign: "center" }}
                                >
                                  {club_advisor.advisor_name}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    sx={{ m: 0.25,width:75 }}
                                    onClick={() =>
                                      editAdvisor(club_advisor.advisor_id)
                                    }
                                  >
                                    แก้ไข
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    sx={{m:0.25,width:75}}
                                    onClick={() =>
                                      deleteAdvisor(
                                        club_advisor.advisor_id,
                                        club_advisor.advisor_name
                                      )
                                    }
                                  >
                                    ลบ
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <TablePagination
                          rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            { label: "All", value: -1 },
                          ]}
                          component="div"
                          count={teacherdata.length}
                          rowsPerPage={rowsPerTeachpage}
                          page={teachpage}
                          onPageChange={handleChangeTeacherListpage}
                          onRowsPerPageChange={
                            handleChangeRowsPerTeacherListPage
                          }
                        />
                        <Button
                          sx={{ width: "100%", pt: 1, pb: 1 }}
                          onClick={() => addAdvisor(club_id)}
                        >
                          <AddRoundedIcon style={{ color: "black" }} />
                          <Typography sx={{ color: "#05383B", fontSize: 16 }}>
                            เพิ่มอาจารย์ที่ปรึกษา
                          </Typography>
                        </Button>
                      </TableContainer>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item>
                  <Paper
                    elevation={8}
                    sx={{
                      width: 550,
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
                      width: 550,
                      background: "#FFF6E1",
                      borderRadius: "2px",
                      textAlign: "center",
                    }}
                  >
                    <Grid item xs={12} sx={{ width: "100%", mb: 5 }}>
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
                                  width: "35%",
                                }}
                              >
                                ชื่อ - นามสกุล
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  color: "#ffffff",
                                  width: "28%",
                                }}
                              >
                                ตำแหน่ง
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: "center",
                                  color: "#ffffff",
                                  width: "30%",
                                }}
                              ></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(rowsPerPage > 0
                              ? committeedata.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                              : committeedata
                            ).map((club_committee) => (
                              <TableRow key={club_committee.committee_id}>
                                <TableCell
                                  onClick={() =>
                                    showcommitteeData(club_committee)
                                  }
                                  style={{ cursor: "pointer" }}
                                  sx={{ textAlign: "center" }}
                                >
                                  {club_committee.committee_name}
                                </TableCell>
                                <TableCell
                                  onClick={() =>
                                    showcommitteeData(club_committee)
                                  }
                                  style={{ cursor: "pointer" }}
                                  sx={{ textAlign: "center" }}
                                >
                                  {club_committee.committee_role_name}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    sx={{ mr: 0.7 }}
                                    onClick={() =>
                                      editCommittee(club_committee.committee_id)
                                    }
                                  >
                                    แก้ไข
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() =>
                                      deleteCommittee(
                                        club_committee.committee_id,
                                        club_committee.committee_name
                                      )
                                    }
                                  >
                                    ลบ
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <TablePagination
                          rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            { label: "All", value: -1 },
                          ]}
                          component="div"
                          count={committeedata.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <Button
                          sx={{ width: "100%", pt: 1, pb: 1 }}
                          onClick={() => addCommittee(club_id)}
                        >
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

              <Grid item xs={7}>
                <Paper
                  elevation={8}
                  sx={{
                    width: "90%",
                    height: 75,
                    background: "#C9A66D",
                    borderRadius: "2px",
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
                  }}
                >
                  {(rowsPerActpage > 0
                    ? data.slice(
                        actpage * rowsPerActpage,
                        actpage * rowsPerActpage + rowsPerActpage
                      )
                    : data
                  ).map((activity) => (
                    <Grid key={activity.activity_id}>
                      <Button
                        component={Link}
                        to={`/activity/${activity.activity_id}`}
                        sx={{
                          width: "87%",
                          color: "#222831",
                          fontSize: 20,
                          pb: 1.5,
                          pt: 1.5,
                        }}
                        key={activity.activity_id}
                      >
                        <Typography sx={{ fontSize: 20 }}>
                          <span style={{ color: "#4341d1" }}>
                            ชื่อกิจกรรม:{" "}
                          </span>
                          <span
                            style={{
                              maxWidth: "440px",
                              wordWrap: "break-word",
                              display: "inline-block",
                              verticalAlign: "top",
                            }}
                          >
                            {activity.activity_name}
                          </span>

                          <br />
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
                      >
                        ลบ
                      </Button>
                    </Grid>
                  ))}
                  <TablePagination
                    rowsPerPageOptions={[
                      10,
                      15,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerActpage}
                    page={actpage}
                    onPageChange={handleChangeActListpage}
                    onRowsPerPageChange={handleChangeRowsPerActListpage}
                  />
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
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 5,
              }}
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
                            {(rowsPerTeachpage > 0
                              ? teacherdata.slice(
                                  teachpage * rowsPerTeachpage,
                                  teachpage * rowsPerTeachpage +
                                    rowsPerTeachpage
                                )
                              : teacherdata
                            ).map((club_advisor) => (
                              <TableRow key={club_advisor.advisor_id}>
                                <TableCell
                                  onClick={() => showteacherData(club_advisor)}
                                  style={{ cursor: "pointer" }}
                                  sx={{ textAlign: "center" }}
                                >
                                  {club_advisor.advisor_id}
                                </TableCell>
                                <TableCell
                                  onClick={() => showteacherData(club_advisor)}
                                  style={{ cursor: "pointer" }}
                                  sx={{ textAlign: "center" }}
                                >
                                  {club_advisor.advisor_name}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          { label: "All", value: -1 },
                        ]}
                        component="div"
                        count={teacherdata.length}
                        rowsPerPage={rowsPerTeachpage}
                        page={teachpage}
                        onPageChange={handleChangeTeacherListpage}
                        onRowsPerPageChange={handleChangeRowsPerTeacherListPage}
                      />
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
                            {(rowsPerPage > 0
                              ? committeedata.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                              : committeedata
                            ).map((club_committee) => (
                              <TableRow key={club_committee.committee_id}>
                                <TableCell
                                  onClick={() =>
                                    showcommitteeData(club_committee)
                                  }
                                  style={{ cursor: "pointer" }}
                                  sx={{ textAlign: "center" }}
                                >
                                  {club_committee.committee_name}
                                </TableCell>
                                <TableCell
                                  onClick={() =>
                                    showcommitteeData(club_committee)
                                  }
                                  style={{ cursor: "pointer" }}
                                  sx={{ textAlign: "center" }}
                                >
                                  {club_committee.committee_role_name}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          { label: "All", value: -1 },
                        ]}
                        component="div"
                        count={committeedata.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Grid>
                  </Paper>
                </Grid>
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
                  {(rowsPerActpage > 0
                    ? data.slice(
                        actpage * rowsPerActpage,
                        actpage * rowsPerActpage + rowsPerActpage
                      )
                    : data
                  ).map((activity) => (
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
                  <TablePagination
                    rowsPerPageOptions={[
                      10,
                      15,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerActpage}
                    page={actpage}
                    onPageChange={handleChangeActListpage}
                    onRowsPerPageChange={handleChangeRowsPerActListpage}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Appbar>
    );
  }
}
