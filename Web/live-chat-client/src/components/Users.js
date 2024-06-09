import { useContext, useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import logo from '../img/logo.png';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function Users() {
  const [users, setUsers] = useState([]);
  const [_id, setUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [noUserFound, setNoUserFound] = useState(false);
  const [invalidPhone, setInvalidPhone] = useState(false);
  const { phoneNumber } = useParams();
  const [requests, setRequests] = useState([])
  const {user} = useContext(UserContext);

  useEffect(() => {
    const fetchUsername = async () => {
        try {
            const response = await axios.post('http://localhost:8800/api/users/phonenumber', {
                phonenumber: phoneNumber
            });
            setUser(response.data._id);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
    };

    if (phoneNumber) {
      fetchUsername();
    }
}, [phoneNumber]);

  console.log(_id);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (searchTerm.length === 0) {
          const response = await axios.get('http://localhost:8800/api/users/all');
          const filteredUsers = response.data.filter(user => user.phonenumber !== phoneNumber);
          setUsers(filteredUsers);
        } else if (searchTerm.length === 10) {
          const response = await axios.get(`http://localhost:8800/api/users/all`);
          const filteredUsers = response.data.filter(user => user.phonenumber === searchTerm);
          if (filteredUsers.length > 0  ) {
            setUsers(filteredUsers);
          } else {
            setUsers([]);
            setNoUserFound(true); 
            console.log('Số điện thoại này chưa đăng kí tài khoản.');
          }
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm người dùng:', error);
      }
    };

    fetchUsers();
  }, [searchTerm, phoneNumber]);

  const handleSearch = () => {
    if (searchTerm.length === 10 || searchTerm.length === 0) {
      setSearchTerm(searchTerm);
    } else {
      setInvalidPhone(true);
      console.log('Số điện thoại không hợp lệ.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:8800/api/requestAddFriend/list', {
                recieveid: phoneNumber,
            });
            console.log('Phản hồi từ server:', response.data);
            const requests = response.data.map(async (item) => {
                try {
                    console.log(item)
                    const userResponse = await axios.post('http://localhost:8800/api/users/phonenumber' ,{phonenumber:item.senderid});
                    console.log('Phản hồi từ server 2:', userResponse.data);
                    return userResponse.data;
                } catch (error) {
                    console.error('null:', error);
                    return null;
                }
            });
            const userList = await Promise.all(requests);
            setRequests(userList.filter(user => user !== null));
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    fetchData();
},[] );
const setFriend = async (item) => {
    console.log(item);
    try {
        const updateRequestAddFriend = axios.put('http://localhost:8800/api/requestAddFriend/update', {
            senderid: item.phonenumber,
            recieveid: phoneNumber
        });

        const updateUserAddFriend = axios.put('http://localhost:8800/api/users/update/addFriend', {
            uphonenumber: phoneNumber,
            fphonenumber: item.phonenumber
        });

        await Promise.all([updateRequestAddFriend, updateUserAddFriend]);
        alert("Kết bạn thành công")
        console.log('Both requests have been completed successfully.');
    } catch (error) {
        console.error('Lỗi khi thực hiện yêu cầu:', error);
        // Xử lý lỗi nếu cần thiết
    }
};


const rejectFriendRequest = async (item) => {
  try {
      const deleteRequestAddFriend = axios.delete('http://localhost:8800/api/requestAddFriend/delete', {
          data: {
              senderid: item.phonenumber,
              recieveid: phoneNumber
          }
      });
      await deleteRequestAddFriend;
      const updatedRequests = requests.filter(request => request.phonenumber !== item.phonenumber);
      setRequests(updatedRequests);
      console.log('Yêu cầu kết bạn đã được từ chối.');
  } catch (error) {
      console.error('Lỗi khi từ chối yêu cầu kết bạn:', error);
      // Xử lý lỗi nếu cần thiết
  }
};


  return (
    <div className='list-container'>
      <div className='ug-header'>
        <img src={logo} style={{ height: "2rem", width: "2rem", marginLeft: "10px" }} alt="Logo" />
        <p className='ug-title'>Online Users</p>
      </div>
      <p></p>
      <div className='sb-search'>
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <input 
          placeholder='Search' 
          className='search-box' 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='ug-list'>
        {invalidPhone ? (
            <p>Số điện thoại không hợp lệ</p>
        ) : noUserFound ? (
            <p>Số điện thoại này chưa đăng kí tài khoản</p> 
        ) : (
            users.map(user => (
                <Link to={`/profileById/`+ user._id} className='list-item' key={user._id}>
                    <div className='list-info'>
                        <img src={user.avatarpicture} alt="Avatar" className='con-icon' />
                        <p className='con-title'>{user.username}</p>
                    </div>
                    {/* <div className='list-button'>
                        <button onClick={() => handleAddFriend(user)}><p>Kết bạn</p></button>
                    </div> */}
                </Link>
            ))
        )}
      </div>
      <div className='ug-list'>
      {requests.map((item) =>
                    <div >
                            <div className='list-info'>
                                <img src={item.avatarpicture} alt="Avatar" className='con-icon' />
                                <p style={{ fontSize: 18, fontWeight: 600 }}>{item.username}</p>
                            </div>
                            <div className='list-button'>
                                <button style={{ alignSelf: "center", backgroundColor: "lightgrey", padding: 7, borderRadius: 7, margin: 10 }}
                                  onClick={()=>{
                                    setFriend(item)
                                  }}
                                >
                                  <p>Đồng ý</p>
                                </button>
                                <button style={{ alignSelf: "center", backgroundColor: "lightgrey", padding: 7, borderRadius: 7, margin: 10 }}
                                  onClick={() => {
                                    rejectFriendRequest(item);
                                  }}
                                >
                                  <p>Không đồng ý</p>
                                </button>
                            </div>
                        </div>
                        
                )}
      </div>
    </div>
  );
}

export default Users;
