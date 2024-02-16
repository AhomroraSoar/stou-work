import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';

import Appbar from "../assets/Appbar.jsx"

export default function Page() {
  const [data, setData] = useState([]);
  const { club_id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/club/${club_id}`);
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
  }, [club_id]);

  return (
    <Appbar>
    <Box sx={{
      justifyContent: 'center',
      flexGrow: 1,
      backgroundImage: 'url(https://cdn.discordapp.com/attachments/1193822007729602610/1193822181214408755/8.jpg?ex=65ae1c8c&is=659ba78c&hm=db294314a43f939a1d55fae2b42db61f4ba5f2faa4d6fe7ffd517e085f437550&)',
      backgroundRepeat: 'repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight:'92.8vh',
    }}>
      <Grid container >
        <Grid item textAlign='center' sx={{ justifyContent: "center", display: 'flex',mt:3}} xs={12}>
            <Paper elevation={8} sx={{ width: 644, height: 75, background: "#C9A66D", borderRadius: '0px' }}>
              <Typography sx={{ fontSize: 20, textAlign: 'center', pt: 2.25 }}>
                {data.length > 0 && `${data[0].club_name}`}
              </Typography>
            </Paper>
          </Grid>
      </Grid>

      <Grid container sx={{ display: 'flex',alignItems:'center',justifyContent:'center' }}>

        <Grid item sx={{ mt:3}} xs={6}>
          <Paper elevation={8} sx={{ width: 644, height: 75, background: "#C9A66D", borderRadius: '0px' }}>
            <Typography sx={{ fontSize: 20, textAlign: 'center', pt: 2.25 }}>
              รายชื่อกิจกรรมภายใน{data.length > 0 && `${data[0].club_name}`}
            </Typography>
          </Paper>
        
          <Paper elevation={8} sx={{ width: 644, height: 1, background: "#FFF6E1", borderRadius: '0px', display: 'block', pb: 0.5, pt: 0.5 }}>
            {data.map(activity => (
              <Button sx={{ width: 644, height: 50, color: "#222831", fontSize: 20 }} key={activity.activity_id}>
                <Typography sx={{ color: '#05383B', fontSize: 20 }}>
                  {activity.activity_name}
                </Typography>
              </Button>
            ))}
          </Paper>
        </Grid>

        <Grid item sx={{ mt:3 }} xs={6}>

          <Paper elevation={8} sx={{ width: 644, height: 75, background: "#C9A66D", borderRadius: '0px' }}>
            <Typography sx={{ fontSize: 20, textAlign: 'center', pt: 2.25 }}>
              รายชื่อกิจกรรมภายใน{data.length > 0 && `${data[0].club_name}`}
            </Typography>
          </Paper>
    
          <Paper elevation={8} sx={{ width: 644, height: 1, background: "#FFF6E1", borderRadius: '0px', display: 'block', pb: 0.5, pt: 0.5 }}>
            {data.map(activity => (
              <Button sx={{ width: 644, height: 50, color: "#222831", fontSize: 20 }} key={activity.activity_id}>
                <Typography sx={{ color: '#05383B', fontSize: 20 }}>
                  {activity.activity_name}
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
