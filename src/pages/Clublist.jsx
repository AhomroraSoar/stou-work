import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Appbar from "../assets/Appbar.jsx"

import BigBackground from "../assets/img/BigBackground.png"

import AddRoundedIcon from '@mui/icons-material/AddRounded';

export default function Page() {
  const [data, setData] = useState([]);
  const { swn_id } = useParams();
  const [clubmemberCounts, setClubmemberCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/swn/${swn_id}`);
        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [swn_id]);

  useEffect(() => {
    const fetchClubmemberCounts = async () => {
      const counts = {};
      for (const club of data) {
        try {
          const response = await fetch(`http://localhost:4000/clubmember/${club.club_id}`);
          if (response.ok) {
            const jsonData = await response.json();
            counts[club.club_id] = jsonData.length;
          } else {
            console.error(`Failed to fetch participants count for activity ${club.club_id}`);
          }
        } catch (error) {
          console.error(`Error fetching participants count for activity ${club.club_id}:`, error);
        }
      }
      setClubmemberCounts(counts);
    };

    if (data.length > 0) {
      fetchClubmemberCounts();
    }
  }, [data]);

  const addClub = async (swn_id) => {
    try {
      const result = await withReactContent(Swal).fire({
        title: <Typography>เพิ่มชมรม</Typography>,
        input: 'text',
        inputValue: 'ชมรม ',
        confirmButtonText: 'เพิ่ม',
        cancelButtonText: 'ยกเลิก',
        showCancelButton: true,
        allowOutsideClick: false,
        preConfirm: (value) => {
          if (!value || value.trim() === '') {
            withReactContent(Swal).fire({
              title: <Typography sx={{fontSize:20}}>กรุณากรอกชื่อให้ถูกต้อง</Typography>,
              icon: 'error',
              showConfirmButton:false,
              timer:1200,
            });
            throw new Error('กรุณากรอกชื่อชมรม');
          }
          return value.trim();
        }
      });
  
      if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
  
      const response = await fetch(`http://localhost:4000/createclub/${swn_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ club_name: result.value })
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        Swal.fire({
          title: 'เสร็จสิ้น',
          text: responseData.message,
          icon: 'success',
          showConfirmButton:false,
          timer:1000,
        }).then(() => {
          window.location.reload(); // Refresh the page upon success
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: responseData.message || 'Failed to add club',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error adding SWN:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to add club',
        icon: 'error'
      });
    }
  };

  const editClub = async (club_id, club_name) => {
    try {
      const result = await withReactContent(Swal).fire({
        title: <Typography>แก้ไขรายชื่อชมรม</Typography>,
        input: 'text',
        inputValue: club_name,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        showCancelButton: true,
        allowOutsideClick: false,
        preConfirm: (value) => {
          if (!value || value.trim() === '') {
            withReactContent(Swal).fire({
              title: <Typography sx={{fontSize:20}}>กรุณากรอกชื่อให้ถูกต้อง</Typography>,
              icon: 'error',
              showConfirmButton:false,
              timer:1200,
            });
            throw new Error('กรุณากรอกชื่อชมรม');
          }
          return value.trim();
        }
      });
  
      if (result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
  
      const response = await fetch('http://localhost:4000/updateclub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ club_id: club_id, club_name: result.value })
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        Swal.fire({
          title: 'แก้ไขเสร็จสิ้น',
          icon: 'success',
          showConfirmButton:false,
          timer:1000,
        }).then(() => {
          window.location.reload(); // Refresh the page upon success
        });
      } else {
        Swal.fire({
          title: 'มีบางอย่างผิดพลาดกับการแก้ไข',
          text: responseData.message || 'Failed to update club',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating club:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to update club',
        icon: 'error'
      });
    }
  };

  const deleteClub = (club_id, club_name) => {
    withReactContent(Swal).fire({
      title: <Typography variant='h6'>ยืนยันว่าจะลบ <br/> {club_name} ?</Typography>,
      html: (
        <div>
          <span style={{ color: 'red' }}>หากยืนยันแล้วคุณจะไม่สามารถย้อนกลับได้!!</span>
        </div>
      ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "ลบ",
      cancelButtonText:"ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          club_id: club_id,
        };
        fetch("http://localhost:4000/deleteclub", {
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
    <Box sx={{
      justifyContent: 'center',
      flexGrow: 1,
      backgroundImage: `url(${BigBackground})`,
      backgroundRepeat: 'repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight:'92.8vh',
    }}>
      <Grid container sx={{ display: 'flex',alignItems:'center' }}>

        <Grid item textAlign='center' sx={{ justifyContent: "center", display: 'flex',mt:5 }} xs={12}>
          <Paper elevation={8} sx={{ width: 800, height: 75, background: "#C9A66D", borderRadius: '0px' }}>
            <Typography sx={{ fontSize: 20, textAlign: 'center', pt: 2.25 }}>
              รายชื่อชมรมภายใน{data.length > 0 && `${data[0].swn_name}`}
            </Typography>
          </Paper>
        </Grid>

        <Grid item textAlign='center' sx={{  justifyContent: "center", display: 'flex' }} xs={12}>
          <Paper elevation={8} sx={{ width: 800, height: 1, background: "#FFF6E1", borderRadius: '0px', display: 'block', pb: 0.5, pt: 0.5 }}>
            {data.map(club => (
              <Grid key={club.club_id}> 
                <Button component={Link} to={`/club/${club.club_id}`} sx={{ width: 625, height: 50, color: "#222831", fontSize: 20,mt:1,mb:1 }} key={club.club_id}>
                  <Typography sx={{ color: '#05383B', fontSize: 20 }}>
                    {club.club_name}
                    <div style={{ display: 'block' }}>
                      <span style={{ color: '#4341d1' }}>จำนวนสมาชิก: </span>
                      <span>{clubmemberCounts[club.club_id]} คน</span>
                    </div>
                  </Typography>
                </Button>
                <Button 
                variant='contained' 
                sx={{mr:1}}
                onClick={() => editClub(club.club_id,club.club_name)}
                >
                  แก้ไข
                </Button>
                <Button 
                variant='contained' 
                color='error'
                onClick={() => deleteClub(club.club_id,club.club_name)}
                >
                  ลบ
                </Button>
              </Grid>
            ))}
            <Button onClick={() => addClub(swn_id)} sx={{ width: 800, height: 50 }} >
              <AddRoundedIcon style={{ color:'black' }} />
              <Typography sx={{ color: '#05383B', fontSize: 20 }}>
                เพิ่มชมรมนักศึกษา
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
    <Box sx={{
      justifyContent: 'center',
      flexGrow: 1,
      backgroundImage: `url(${BigBackground})`,
      backgroundRepeat: 'repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight:'92.8vh',
    }}>
      <Grid container sx={{ display: 'flex',alignItems:'center' }}>

        <Grid item textAlign='center' sx={{ justifyContent: "center", display: 'flex',mt:5 }} xs={12}>
          <Paper elevation={8} sx={{ width: 644, height: 75, background: "#C9A66D", borderRadius: '0px' }}>
            <Typography sx={{ fontSize: 20, textAlign: 'center', pt: 2.25 }}>
              รายชื่อชมรมภายใน{data.length > 0 && `${data[0].swn_name}`}
            </Typography>
          </Paper>
        </Grid>

        <Grid item textAlign='center' sx={{  justifyContent: "center", display: 'flex' }} xs={12}>
          <Paper elevation={8} sx={{ width: 644, height: 1, background: "#FFF6E1", borderRadius: '0px', display: 'block', pb: 0.5, pt: 0.5 }}>
            {data.map(club => (
              <Button component={Link} to={`/club/${club.club_id}`} sx={{ width: 644, height: 50, color: "#222831", fontSize: 20,mt:1,mb:1 }} key={club.club_id}>
                <Typography sx={{ color: '#05383B', fontSize: 20 }}>
                  {club.club_name}
                  <div style={{ display: 'block' }}>
                    <span style={{ color: '#4341d1' }}>จำนวนสมาชิก: </span>
                    <span>{clubmemberCounts[club.club_id]} คน</span>
                  </div>
                </Typography>
              </Button>
            ))}
          </Paper>
        </Grid>

      </Grid>
    </Box>
    </Appbar>
  );
  }
}
