import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Appbar from "../assets/Appbar.jsx"

import BigBackground from "../assets/img/BigBackground.png"

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
