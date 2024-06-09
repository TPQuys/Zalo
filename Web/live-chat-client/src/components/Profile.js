// Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';

function Profile() {
    const { phoneNumber } = useParams();

    const navigate = useNavigate();
    
    const goback = ()=>{
      navigate(-1)
    }
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleEditProfile = () => {
        // Chuyển hướng đến trang chỉnh sửa thông tin cá nhân
        navigate('/edit-profile/'+ phoneNumber);
      };
      useEffect(() => {
        // Fetch user information from the server upon component mount
        async function fetchUserInfo() {
            try {
                const response = await axios.post('http://localhost:8800/api/users/phonenumber', {
                    phonenumber: phoneNumber
                });
                setUserInfo(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user information:', error);
                // Handle error, such as redirecting to login page if user is not authenticated
            }
        }

        fetchUserInfo();
    }, []);
    if (loading) {
      return <div>Loading...</div>;
    }
    const formatDate = (dateString) => {
      const dateObject = new Date(dateString);
      const day = dateObject.getDate();
      const month = dateObject.getMonth() + 1;
      const year = dateObject.getFullYear();
      return `${day}/${month}/${year}`;
    };
  return (
    <Box sx={{ textAlign: 'center', mt: 4, flex: 0.7 }}>
      <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }} />
      <Typography variant="h5" component="h2" gutterBottom>
        Họ và tên: {userInfo.username}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Giới tính: {userInfo.gender === 0 ? 'Nam' : 'Nữ'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Ngày tháng năm sinh: {formatDate(userInfo.birth)}
      </Typography> 
      <Typography variant="body1" gutterBottom>
        Số điện thoại: {userInfo.phonenumber}
      </Typography>
      <div className='button-profile'>
        <Button 
                variant="contained" 
                color="primary"
                onClick={handleEditProfile} // Định nghĩa hàm xử lý khi nhấp vào nút
                >
                Chỉnh sửa thông tin
            </Button>
            <Button style={{marginLeft: '10px'}}
                variant="contained" 
                color="primary"
                onClick={goback} // Định nghĩa hàm xử lý khi nhấp vào nút
                >
                Xong
            </Button>
            {/* <Button 
                variant="contained" 
                color="primary"
                onClick={goback()} 
                >
                xong
            </Button> */}
      </div>
        
    </Box>
  );
}

export default Profile;
