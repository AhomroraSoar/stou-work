import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Appbar from "../assets/Appbar.jsx"

export default function Page() {
  const [data, setData] = useState([]);
  const [teacherdata,setTeacherdata] = useState([]);
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
          console.error('Failed to fetch club data');
        }
      } catch (error) {
        console.error('Error fetching club data:', error);
      }
    };
  
    fetchData();
  }, [club_id]);

  useEffect(() => {
    const fetchParticipantsCounts = async () => {
      const counts = {};
      for (const activity of data) {
        try {
          const response = await fetch(`http://localhost:4000/activity/${activity.activity_id}`);
          if (response.ok) {
            const jsonData = await response.json();
            // Assuming the response contains an array of participants
            counts[activity.activity_id] = jsonData.length;
          } else {
            console.error(`Failed to fetch participants count for activity ${activity.activity_id}`);
          }
        } catch (error) {
          console.error(`Error fetching participants count for activity ${activity.activity_id}:`, error);
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
        const response = await fetch(`http://localhost:4000/club/${club_id}/teacher`);
        if (response.ok) {
          const jsonData = await response.json();
          setTeacherdata(jsonData);
        } else {
          console.error('Failed to fetch teacher data');
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };
  
    fetchTeacherData();
  }, [club_id]);

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <Appbar>
      <Box sx={{
        justifyContent: 'center',
        flexGrow: 1,
        backgroundImage: 'url(https://cdn.discordapp.com/attachments/1193822007729602610/1193822181214408755/8.jpg?ex=65ae1c8c&is=659ba78c&hm=db294314a43f939a1d55fae2b42db61f4ba5f2faa4d6fe7ffd517e085f437550&)',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '92.8vh',
      }}>
        <Grid container >
          <Grid item xs={12}>
            <Grid item textAlign='center' sx={{ justifyContent: "center", display: 'flex', mt: 3 }} xs={12}>
              <Paper elevation={8} sx={{ background: "#C9A66D", borderRadius: '5px' }}>
                <Typography sx={{ fontSize: 26, textAlign: 'center', pl: 10, pr: 10, pt: 1.5, pb: 1.5 }}>
                  {data.length > 0 && `${data[0].club_name}`}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container xs={12} sx={{ display: 'flex', justifyContent: 'center',mt:5 }}>

            <Grid item>
              <Button variant='contained' color='success' sx={{ width: 450, height: 100 }}>
                สมัครสมาชิก
              </Button>
              
              <Grid item sx={{ mt: 2 }}>
                <Paper elevation={8} sx={{ width: 450, height: 75, background: "#C9A66D", borderRadius: '2px' }}>
                  <Typography sx={{ fontSize: 20, textAlign: 'center', pt: 2.25 }}>
                    รายชื่ออาจารย์ที่ปรึกษา {data.length > 0 && `${data[0].club_name}`}
                  </Typography>
                </Paper>

                <Paper elevation={8} sx={{ width: 450, background: "#FFF6E1", borderRadius: '2px', pb: 0.5, pt: 0.5, textAlign: 'center' }}>
                  <Grid container  >
                    {teacherdata.map(user => (
                      <React.Fragment key={user.user_id}>
                        <Grid item xs={6}  >
                          <Typography sx={{ fontSize: 20, textAlign:'left',ml:7 }}>
                            {user.user_id}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} >
                          <Typography sx={{ fontSize: 20, textAlign:'left' }}>
                            {user.user_name}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item sx={{mt:2}}>              
                  <Paper elevation={8} sx={{ width: 450, height: 75, background: "#C9A66D", borderRadius: '2px' }}>
                    <Typography sx={{ fontSize: 20, textAlign: 'center', pt: 2.25 }}>
                      รายชื่อคณะกรรมการ {data.length > 0 && `${data[0].club_name}`}
                    </Typography>
                  </Paper>

                  <Paper elevation={8} sx={{ width: 450, background: "#FFF6E1", borderRadius: '2px', pb: 0.5, pt: 0.5 }}>
                  <Typography>
                      test กรรมการ
                    </Typography>
                  </Paper>
              </Grid>
            </Grid>

            <Grid item xs={8} >              
                <Paper elevation={8} sx={{ width: '90%', height: 75, background: "#C9A66D", borderRadius: '2px',ml:5 }}>
                  <Typography sx={{ fontSize: 20, textAlign: 'center', pt: 2.25 }}>
                    รายชื่อกิจกรรมภายใน{data.length > 0 && `${data[0].club_name}`}
                  </Typography>
                </Paper>

                <Paper elevation={8} sx={{ width: '90%', background: "#FFF6E1", borderRadius: '2px', pb: 0.5, pt: 0.5,ml:5 }}>
                  {data.map(activity => (
                    <Button component={Link} to={`/activity/${activity.activity_id}`} sx={{ width: "100%", color: "#222831", fontSize: 20 }} key={activity.activity_id}>
                      <Typography sx={{ fontSize: 20 }}>
                        <span style={{ color: '#4341d1' }}>ชื่อกิจกรรม </span>
                        {activity.activity_name}
                        <span style={{ color: '#4341d1' }}> จำนวนผู้เข้าร่วม: </span>
                        <span >{participantsCounts[activity.activity_id]} คน</span>
                        <br />
                        <span style={{ color: 'green' }}> เริ่ม: </span>
                        {formatDate(activity.start_date)}
                        <span style={{ color: 'red' }}> สิ้นสุด: </span>
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
