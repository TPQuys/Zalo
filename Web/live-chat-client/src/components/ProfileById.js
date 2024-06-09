import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { UserContext } from '../context/UserContext';

function ProfileById() {
  const [users, setUser] = useState(null);
  const { _id, user_id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [check, setCheck] = useState(-1);
  const {user} = useContext(UserContext);

  console.log(user_id);
  console.log(user.phonenumber);
  console.log(users);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(`http://localhost:8800/api/users/user`,{
          userId: user_id,
        });
        setUser(response.data);
        setIsLoading(false); 
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (user_id) {
      fetchUser();
    }
  }, [_id, user_id]);


  useEffect(() => {
    const checkU = async () => {
        try {
            const response = await axios.post('http://localhost:8800/api/requestAddFriend/check', {
                senderid: user.phonenumber,
                recieveid: users.phonenumber
            });
            setCheck(response.data);
            console.log('Phản hồi từ server:', response.data);
        } catch (error) {
            // console.error('Lỗi kết bạn:', error);
            setCheck(-1);
        }
    }
    if (users && user) {
      checkU();
    }
  }, [users, user]);

  // Kiểm tra xem có đang tải hay không
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Kiểm tra xem user đã tải xong hay không
  if (!users) {
    return <div>User not found</div>;
  }

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const addFriend = async () => {
    try {
        const response = await axios.post('http://localhost:8800/api/requestAddFriend/', {
            senderid: user.phonenumber,
            recieveid: users.phonenumber
        });
        setCheck(0);
        console.log('Phản hồi từ server:', response.data);
    } catch (error) {
        console.error('Lỗi khi kết bạn:', error);
        setCheck(-1)
    }
  };

  const unFriend = async (event) => {
    // alert(user.phonenumber)
    event.preventDefault();
    try {
        const response = await axios.put('http://localhost:8800/api/requestAddFriend/update/unfriend', {
            friendId: users.phonenumber,
            userId: user.phonenumber
        });
        setCheck(response.data)
    } catch (error) {
        console.error('Lỗi khi xóa kết bạn:', error);
        setCheck(-1)
    }
  };

  const cancelFriendRequest = async () => {
    try {
        const response = await axios.delete('http://localhost:8800/api/requestAddFriend/delete', {
            data: {
                senderid: user.phonenumber,
                recieveid: users.phonenumber
            }
        });
        setCheck(-1); // Đặt lại trạng thái check về mặc định (-1)
        console.log('Lời mời kết bạn đã được thu hồi.');
    } catch (error) {
        console.error('Lỗi khi thu hồi lời mời kết bạn:', error);
        // Xử lý lỗi nếu cần thiết
    }
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }} />
      <Typography variant="h5" component="h2" gutterBottom>
        Họ và tên: {users.username}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Giới tính: {users.gender === 0 ? 'Nam' : 'Nữ'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Ngày tháng năm sinh: {formatDate(users.birth)}
      </Typography> 
      <Typography variant="body1" gutterBottom>
        Số điện thoại: {users.phonenumber}
      </Typography>
      {check === -1 ?
                        <Button variant="contained" color="secondary"
                          onClick={addFriend}
                        >
                            Kết bạn
                        </Button> :
                        (check === 0 ? (
                            <Button variant="contained" color="secondary" onClick={cancelFriendRequest}>Thu hồi lời mời kết bạn</Button>
                          ):
                            <Button variant="contained" color="secondary"
                              onClick={unFriend}
                            >
                                Hủy kết bạn
                            </Button>
                        )
                    }
    </Box>
  );
}

export default ProfileById;
