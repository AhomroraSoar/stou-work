import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import Appbar from "../assets/Appbar.jsx"

import BigBackground from "../assets/img/BigBackground.png"

export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/swn'); // Adjust the endpoint based on your API
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
  }, []);

  return (
    <Appbar>
    <Box sx={{
      justifyContent: 'center',
      flexGrow: 1,
      backgroundImage: `url(${BigBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight:'100vh'
    }}>
      <Grid container sx={{ display: 'flex',alignItems:'center' }}>

        <Grid item textAlign='center' sx={{ justifyContent: "center", display: 'flex',mt:5 }} xs={12}>
          <Paper elevation={8} sx={{ width: 644, height: 75, background: "#C9A66D", borderRadius: '0px' }}>
            <Typography sx={{ fontSize: 20, textAlign: 'center', pt: 2.25,fontFamily:'THSarabunNew' }}>
              รายชื่อศูนย์วิทยบริการและชุมชนสัมพันธ์มหาวิทยาลัยสุโขทัยธรรมาธิราช
            </Typography>
          </Paper>
        </Grid>

        <Grid item textAlign='center' sx={{ pb: 15, justifyContent: "center", display: 'flex' }} xs={12}>
          <Paper elevation={8} sx={{ width: 644, height: 1, background: "#FFF6E1", borderRadius: '0px', display: 'block', pb: 0.5, pt: 0.5 }}>
            {data.map(swn => (
              <Button component={Link} to={`/swn/${swn.swn_id}`} sx={{ width: 644, height: 50, color: "#222831", fontSize: 20,mt:0,mb:0.5 }} key={swn.swn_id}>
                <Typography sx={{ color: '#05383B', fontSize: 20 }}>
                  {swn.swn_name}
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
