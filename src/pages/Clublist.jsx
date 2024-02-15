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
  const { swn_id } = useParams();

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
              <Button sx={{ width: 644, height: 50, color: "#222831", fontSize: 20 }} key={club.club_id}>
                <Typography sx={{ color: '#05383B', fontSize: 20 }}>
                  {club.club_name}
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
