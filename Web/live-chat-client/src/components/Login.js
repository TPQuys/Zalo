import React, {useContext, useState } from 'react';
import logo from "../img/logo.png";
import { Button, InputAdornment, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

function Login() {
    const [phoneNumber, setPhoneNumber] = useState('0348333253');
    const [password, setPassword] = useState('123456');
    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate();
    const {updateUser} = useContext(UserContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validatePhoneNumber(phoneNumber)) {
            alert('Số điện thoại không hợp lệ!');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8800/api/auth/login', {
                phonenumber: phoneNumber,
                password: password
            });
            updateUser(response.data)
            console.log('Phản hồi từ server:', response.data);
            navigate('app/'+response.data.phonenumber);
        } catch (error) {
            console.error('Lỗi khi đăng nhập:', error);
            if (error.response.status === 401) {
                alert('Số điện thoại hoặc mật khẩu không chính xác!');
            } else {
                alert('Đã xảy ra lỗi khi đăng nhập!');
            }
        }
    };

    const validatePhoneNumber = (phone) => {
        // Regex để kiểm tra số điện thoại , 10 chữ số không chứa ký tự đặc biệt
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

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


    return (
        <div className='login-container'>
            <div className='image-container'>
                <img src={logo} alt='Logo' className='welcom-logo'></img>
            </div>
            <div className='form-container'>
                <form onSubmit={handleSubmit} className="login-form">
                    <TextField 
                        id='phonenumber'
                        label="Số điện thoại"
                        type="text"
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
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        fullWidth
                    >
                        Đăng nhập
                    </Button>
                    <div className='nouser-container' >
                        <p>Bạn chưa có tài khoản?</p>
                        <Button variant='outlined' style={{fontSize: 8,  color: '#38abf'}} onClick={()=>  navigate("/register")}>Đăng ký</Button>
                    </div>
                    <div className='nouser-container' onClick={()=>  navigate("/forgotpassword") }>
                        
                        <a href='/ForgotPassword' style={{color: 'blue', fontWeight: 'bolder', fontSize:10}}> Quên mật khẩu?</a>
                    </div>
                </form>
                
            </div>
        </div>
    );
}

export default Login;
