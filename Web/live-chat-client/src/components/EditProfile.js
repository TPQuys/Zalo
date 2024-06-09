import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

function EditProfile() {
  const { phoneNumber } = useParams();
  
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    gender: '',
  });

  useEffect(() => {
    // Fetch user data based on phoneNumber when component mounts
    async function fetchUserData() {
      try {
        const response = await axios.post('http://localhost:8800/api/users/phonenumber', {
          phonenumber: phoneNumber
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, [phoneNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      // Send PUT request to API to update user profile
      await axios.put(`http://localhost:8800/api/users/${phoneNumber}`, formData);
      
      // After updating, navigate back to profile page
      navigate('/profile');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <div className='form-container'>
      <Typography variant="h3" style={{ fontWeight: 'bold', marginLeft: '250px' }}>Sửa thông tin người dùng</Typography>
      <form className="register-form">
        <TextField
          name="username"
          label="Tên người dùng"
          fullWidth
          margin="normal"
          value={formData.username}
          onChange={handleChange}
        />
        {/* <TextField
          name="password"
          label="Mật khẩu"
          fullWidth
          margin="normal"
          type="password"
          value={formData.password}
          onChange={handleChange}
        /> */}
        <FormControl variant="outlined" fullWidth margin='normal'>
          <InputLabel id="gender-label">Giới tính</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            label="Giới tính"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={'0'}>Nam</MenuItem>
            <MenuItem value={'1'}>Nữ</MenuItem>
          </Select>
        </FormControl>
        {/* <TextField
          name="birth"
          label="Ngày sinh"
          fullWidth
          margin="normal"
          type="date"
          value={formData.birth}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        /> */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          style={{ marginTop: '16px' }}
        >
          Lưu thay đổi
        </Button>
      </form>
    </div>
  );
}

export default EditProfile;
