import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

import Appbar from "../assets/Appbar.jsx"

import BigBackground from "../assets/img/BigBackground.png"

import "../css/Teachersearch.css"

export default function Page() {
  const [teacher, setTeacher] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/teacherlist')
      .then(response => response.json())
      .then(data => setTeacher(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTeacher = teacher.filter(teacher =>
    teacher.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
     <Grid container sx={{pt:5,display:'flex', justifyContent:'center',alignContent:'center'}}>

      <Paper sx={{width:'70%',backgroundColor:'#FFF9EB'}}>

      <Grid item xs={12} sx={{display:'flex', justifyContent:'center',mt:1.5}}>
          <Typography sx={{ fontSize: 26, textAlign: 'center', pl: 10, pr: 10, pt: 1.5, pb: 1.5 }}>
            ค้นหารายชื่ออาจารย์ที่ปรึกษา
          </Typography>
      </Grid>

      <hr style={{ backgroundColor: 'black', height: '0.5px', width: '40%' }} />


      <Grid item xs={12} sx={{display:'flex', justifyContent:'center',mt:3,mb:3}}>
        <TextField
         label="กรุณาใส่ชื่ออาจารย์ที่ต้องการค้นหา"
         variant="filled"
         type="search"
         value={searchTerm}
         onChange={handleSearchChange}
         sx={{width:"60%"}}
         />
      </Grid>

      <hr style={{ backgroundColor: 'black', height: '0.5px', width: '100%' }} />

      <Grid item xs={12} sx={{mb:5,mt:3,ml:7,width:'90%'}}>
        <TableContainer sx={{border:2}}>
          <Table>
            <TableHead sx={{backgroundColor:'#003D98',borderBottom:2}}>
              <TableRow>
                <TableCell sx={{ textAlign: 'center', color:'#ffffff' }} >ชื่อ - นามสกุล</TableCell>
                <TableCell sx={{ textAlign: 'center', color:'#ffffff' }} >สาขาวิชา</TableCell>
                <TableCell sx={{ textAlign: 'center', color:'#ffffff' }} >เบอร์โทรศัพท์</TableCell>
                <TableCell sx={{ textAlign: 'center', color:'#ffffff' }} >Line ID</TableCell>
                <TableCell sx={{ textAlign: 'center', color:'#ffffff' }} > ที่ปรึกษา</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeacher.slice(0,20).map((user, index) => (
                <TableRow key={user.user_id} className={index % 2 === 0 ? 'even' : 'odd'}>
                  <TableCell sx={{ textAlign: 'center' }}>{user.user_name}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{user.department}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{user.user_tel}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{user.lineID}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{user.club_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
       </Paper>
    </Grid>
    </Box>
    </Appbar>
  );
}
