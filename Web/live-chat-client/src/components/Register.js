import React, { useState, useEffect } from 'react'
import logo from "../img/logo.png"
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

function Register() {
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [birth, setBirth] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
          alert("Mật khẩu và mật khẩu xác nhận không khớp!");
          return;
        }
        try {
          // Gửi yêu cầu đăng ký tới API
          const response = await axios.post('http://localhost:8800/api/auth/register', {
            username: username,
            password: password,
            phonenumber: phoneNumber,

            gender: gender,
            birth: birth
          });
          // Xử lý phản hồi từ server nếu cần
          console.log('Phản hồi từ server:', response.data);
          setSuccessMessage('Đăng ký thành công!');
        } catch (error) {
          // Xử lý lỗi nếu có
          console.error('Lỗi khi đăng ký:', error);
        }
      };
    useEffect(() => {
        if (successMessage) {
            alert(successMessage);
                navigate('/login');
        }
    }, [successMessage, navigate]);



    const handlePhoneNumberChange = (e) => {
      const inputPhoneNumber = e.target.value;
      // Kiểm tra xem inputPhoneNumber có phải là số và có 10 ký tự không
      if (/^[0-9]*$/.test(inputPhoneNumber) && inputPhoneNumber.length <= 10) {
          // Nếu hợp lệ, cập nhật state phoneNumber
          setPhoneNumber(inputPhoneNumber);
      }
  };

  const handlePasswordChange = (e) => {
      const inputPassword = e.target.value;
      const isValidPassword = inputPassword.length >= 6 && inputPassword.trim() !== '';
      setPassword(inputPassword);
      setIsValid(isValidPassword);
  };
  const handleUsernameChange = (e) => {
    const inputUsername = e.target.value;
    const isValidUsername = inputUsername.trim().length >= 3;
    setUsername(inputUsername);
    setIsValid(isValidUsername);
};


  return (
    <div className='register-container'>
        <div className='image-container'>
            <img src={logo} alt='Logo' className='welcom-logo'></img>
        </div>


        <form className="register-form">
        <TextField 
            id='username'
            label="Tên người dùng"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            error={!isValid}
            helperText={!isValid ? 'Tên người dùng không hợp lệ' : ''}
            variant='outlined'
            fullWidth
            margin='normal'
        />
      <TextField 
        id='phoneNumber'
        label="Số điện thoại"
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        variant='outlined'
        fullWidth
        margin='normal'
      />
      <TextField 
                        id='password'
                        label="Mật khẩu"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        error={!isValid}
                        helperText={!isValid ? 'Mật khẩu không hợp lệ' : ''}
                        variant='outlined'
                        fullWidth
                        margin='normal'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {!isValid && <span style={{ color: 'red' }}>❌</span>}
                                    {isValid && <span style={{ color: 'green' }}>✔️</span>}
                                </InputAdornment>
                ),
            }}
        />
      <TextField 
        id='confirmPassword'
        label="Xác nhận mật khẩu"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        variant='outlined'
        fullWidth
        margin='normal'
      />
      
      {/* <TextField 
            id='avatarPicture'
            label="Hình đại diện"
            type="file"
            onChange={(e) => setAvatarPicture(e.target.files[0])}
            variant='outlined'
            fullWidth
            margin='normal'
            InputLabelProps={{
                shrink: true,
            }}
        /> */}
      <FormControl variant="outlined" fullWidth margin='normal'>
        <InputLabel id="gender-label">Giới tính</InputLabel>
        <Select
          labelId="gender-label"
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          label="Giới tính"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={'0'}>Nam</MenuItem>
          <MenuItem value={'1'}>Nữ</MenuItem>
        </Select>
      </FormControl>
      <TextField 
        id='birth'
        label="Ngày sinh"
        type="date"
        value={birth}
        onChange={(e) => setBirth(e.target.value)}
        variant='outlined'
        fullWidth
        margin='normal'
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button 
        onClick={handleSubmit}
        variant="contained" 
        color="primary"
        fullWidth>
        Đăng ký
      </Button>
      <div className=''>
        <p>Bạn đã có tài khoản?</p>
          <Button variant='outlined' style={{fontSize: 8,  color: '#38abf'}} onClick={()=>  navigate("/")}>Đăng nhập</Button>
      </div>
        
    </form>


        {/* <div className='register-box'>
            <p style={{fontSize: 20, color: '#2a8067'}}>Register your Account</p>
            <TextField 
                id='standard-basic' 
                label="Nhập vào user" 
                variant='outlined'
            />
            <TextField 
                id='outlined-password-input' 
                label="Password" 
                type='password'
                autoComplete='current-password'
            />
            <TextField 
                id='standard-basic' 
                label="Nhập vào phonenumber" 
                variant='outlined'
            />
            <TextField
                id='standard-basic'
                variant='outlined'
                type="file"
               
            />
            <TextField 
                id='standard-basic' 
                label="Nhập vào gender" 
                variant='outlined'
            />
            <TextField 
                id='standard-basic' 
                label="Nhập vào birth" 
                variant='outlined'
            />
            <Button variant='outlined'>Đăng ký</Button>
            <p>Bạn đã có tài khoản?</p>
            <Button variant='outlined' style={{fontSize: 8,  color: '#38abf'}}>Đăng nhập</Button>
          
           
        </div> */}
        
    </div>
  )
}

export default Register

