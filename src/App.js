
import './App.css';
import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import axios from "axios";

function App() {

  let formValues = { name: "", rollno: "", location: "", error: { name: "", rollno: "", location: "" } }
  const [show, setshow] = useState(false)
  const [formData, setFormData] = useState(formValues);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    async function getData() {
      const result = await axios.get("https://6323fadebb2321cba921f793.mockapi.io/students");
      console.log(result);
      setUserData(result.data);
    }
    getData();
  }, []);
  const handleChange = (e) => {
    let error = { ...formData.error };
    if (e.target.value === "") {
      error[e.target.name] = `${e.target.name} is Required`;
    } else {
      error[e.target.name] = "";
    }
    setFormData({ ...formData, [e.target.name]: e.target.value, error });
  };
  const onPopulateData = (id) => {
    const selectedData = userData.filter((row) => row.id === id)[0];
    setFormData({
      ...formData,
      ...selectedData,
    });
    setshow(true)
  };
  const handleDelete = async (id) => {
    const response = await axios.delete(
      `https://6323fadebb2321cba921f793.mockapi.io/students/${id}`
    );
    console.log(response);
    const user = userData.filter((row) => row.id !== response.data.id);
    setUserData(user);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Delete
    const errKeys = Object.keys(formData).filter((key) => {
      if (formData[key] === "" && key != "error" && key != "id") {
        return key;
      }
    });
    if (errKeys.length >= 1) {
      alert("Please fill all values");
    } else {
      if (formData.id) {
        // Update
        const response = await axios.put(
          `https://6323fadebb2321cba921f793.mockapi.io/students/${formData.id}`,
          {
            name: formData.name,
            rollno: formData.rollno,
            location: formData.location,

          }
        );
        let users = [...userData];
        let index = users.findIndex((row) => row.id === response.data.id);
        users[index] = response.data;
        setUserData(users);
      } else {
        // Create
        const response = await axios.post(
          "https://6323fadebb2321cba921f793.mockapi.io/students",
          {
            name: formData.name,
            rollno: formData.rollno,
            location: formData.location,

          }
        );
        setUserData([...userData, response.data]);
      }
      setFormData(formValues);
    }
    setshow(false)
  };

  const editstyle = {
    display: show ? "block" : "none"
  }



  return (

    <div className="Body">
      <div style={editstyle}>

        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
          onSubmit={(e) => handleSubmit(e)}
        >
          <TextField id="filled-basic" label="Name" variant="filled" value={formData.name}
            name="name"
            onChange={(e) => handleChange(e)} /><br />
          <TextField id="filled-basic" label="Department" variant="filled" value={formData.rollno}
            name="rollno"
            onChange={(e) => handleChange(e)} /><br />
          <TextField id="filled-basic" label="City" variant="filled" value={formData.location}
            name="location"
            onChange={(e) => handleChange(e)} /><br />




          <Button variant="contained" type="submit">
            SUBMIT
          </Button>
        </Box>
      </div>
      <div className="App" style={{ padding: "10px" }}>
        <h1>Student Management System</h1>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 400 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>S.no</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Rollno</strong></TableCell>
                  <TableCell align="center"><strong>Location</strong></TableCell>
                  <TableCell align="center"><strong>Edit Details</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell component="th" scope="row" >
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.rollno}</TableCell>
                    <TableCell align="center">{row.location}</TableCell>

                    <TableCell align="center"><Button style={{ margin: "10px" }} variant="contained" onClick={() => onPopulateData(row.id)} >
                      Edit
                    </Button>
                      <Button variant="contained" onClick={() => handleDelete(row.id)}>
                        Delete
                      </Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}




export default App;


