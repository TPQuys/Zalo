import { Checkbox, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import logo from '../img/logo.png'
import {useSelector } from 'react-redux';
import {motion} from "framer-motion";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Link, useNavigation, useParams } from 'react-router-dom';
import Users from './Users';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';

function Groups({ history }) {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [_id, setUser] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [invalidPhone, setInvalidPhone] = useState(false);
    const [noUserFound, setNoUserFound] = useState(false);
    const { phoneNumber } = useParams();
    const [selectedItems, setSelectedItems] = useState([]);
    const [group, setGroup] = useState([]);


// Hàm xử lý khi người dùng tích chọn một mục
// const handleCheckboxChange = (item) => {
//   const index = selectedItems.indexOf(item);
//   if (index === -1) {
//     // Nếu mục chưa được chọn, thêm vào danh sách các mục đã chọn
//     setSelectedItems([...selectedItems, item]);
//   } else {
//     // Nếu mục đã được chọn, loại bỏ khỏi danh sách các mục đã chọn
//     const updatedItems = [...selectedItems];
//     updatedItems.splice(index, 1);
//     setSelectedItems(updatedItems);
//   }
// };

const toggleItemSelection = (itemId) => {
  console.log(selectedItems)
  let updatedSelection = [...selectedItems];
  if (updatedSelection.includes(itemId)) {
      updatedSelection = updatedSelection.filter((id) => id !== itemId);
  } else {
      updatedSelection.push(itemId);
  }
  console.log(updatedSelection)
  setSelectedItems(updatedSelection);
};

// Hàm xử lý khi người dùng thêm các mục đã chọn vào nhóm
const addToGroup = () => {
  setGroup([...group, ...selectedItems]);
  setSelectedItems([]); // Reset danh sách các mục đã chọn sau khi thêm vào nhóm
};
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


    const createGroup = async () => {
      try {
        const response = await axios.post('http://localhost:8800/api/group/', {
          groupname: name,
          grouppicture: "https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645.jpg",
          members: [...selectedItems, _id],
          createby: _id ? _id.toString() : ''
        });
        // Xử lý phản hồi từ server nếu cần
        
        console.log('Phản hồi từ server:', response.data);
      } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi khi đăng ký:', error);
      }
    };
  return (
    <div className='list-container'>
      <div className='ug-header-group'>
        <p style={{fontSize:20, fontFamily:'bold', marginLeft: '15px'}}>Tạo nhóm</p>
      </div>
      <div style={{backgroundColor:'red' , flex: 1}}></div>
      <div className='ug-header'>
        <IconButton >
          <CameraAltIcon />
        </IconButton>
        <input 
          placeholder='Nhập tên nhóm' 
          className='search-box' 
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className='sb-search'>
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <input 
          placeholder='Nhập tên, số điện thoại, hoặc danh sách số điện thoại' 
          className='search-box' 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='ug-list-group'>
          {invalidPhone ? (
              <p>Số điện thoại không hợp lệ</p>
          ) : noUserFound ? (
              <p>Số điện thoại này chưa đăng kí tài khoản</p> 
          ) : (
              users.map(user => {
                  const checked = selectedItems.includes(user._id.toString());
                  return (
                      <div className='list-item' key={user._id}>
                          <div className='list-info'>
                              <img src={user.avatarpicture} alt="Avatar" className='con-icon' />
                              <p className='con-title'>{user.username}</p>
                              <div style={{ marginLeft: '600px' }}>
                                  <Checkbox
                                      status={checked ? 'checked' : 'unchecked'}
                                      onClick={() => toggleItemSelection(user._id.toString())}
                                  />
                              </div>
                          </div>
                      </div>
                  );
              })
          )}
      </div>

      <div className='ug-header-group-button'>
        <IconButton >
          <p style={{fontSize:18}}>Hủy</p>
          <CancelIcon />
        </IconButton>
        <IconButton onClick={() => {
                    if (name.trim() !== "") {
                        if(selectedItems.length>=2)
                        {
                        alert("tạo nhóm thành công")
                        createGroup()
                        }else{
                            alert("Hãy chọn ít nhất 2 thành viên để tạo nhóm")
                        }
                    }
                    else {
                        alert("Hãy nhập tên nhóm")
                    }
                }}>
          <p style={{fontSize:18}} >Tạo nhóm</p>
          <AddCircleIcon />
        </IconButton>
      </div>
      
    
    </div>
  )
}

export default Groups