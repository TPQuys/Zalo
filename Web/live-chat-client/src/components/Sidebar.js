import React, {useContext, useState, useEffect } from 'react'
import axios from 'axios'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SearchIcon from '@mui/icons-material/Search';
// import FaceIcon from '@mui/icons-material/Face';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { v4 as uuidv4 } from "uuid";

import { useParams, Link } from 'react-router-dom';

import { UserContext } from '../context/UserContext';
import ListFriendItem from './ListFriendItem';
import { GroupContext } from '../context/GroupContext';
import ListGroupItem from './ListGroupItem';

function Sidebar({onGoToUser, onGoToProfile,onGoToGroup, onListFriendClick, onListGroupChatClick, selectedItem}) {
  const {user} = useContext(UserContext);
  // const {group} = useContext(GroupContext);
  const navigate =  useNavigate();
  const [listGroups,setListGroups] = useState([])
  const [showFriendsView, setShowFriendsView] = useState(true);
  const [list, setList] = useState([])

  const handleGoToProfile = () => {
    onGoToProfile(); 
  };
  const handleGoToUser = () => {
    onGoToUser();
  };
  const handleGoToGroup = () => {
    onGoToGroup();
  };

  const listfriend = user.friends;

  const [listfriends, setListfriends] = useState([]);

  useEffect(() => {
    let mounted = true;

    const datafriends = async () => {
        try {
            const requests = listfriend.map(async (friendId) => {
                const response = await axios.post('http://localhost:8800/api/users/user', {
                    userId: friendId
                });
                return response.data;
            });
            const friendsData = await Promise.all(requests);
            if (mounted) {
                setListfriends(friendsData);
            }
        } catch (error) {
            alert('Error getting data friends');
        }
    };

    datafriends();

    return () => {
        mounted = false;
    };
}, []);

useEffect(() => {
  const getList = async () => {
      try {
          const response = await axios.post('http://localhost:8800/api/users/friends/', { phonenumber: user.phonenumber });
          // const responseGrops = await axios.post(IP+'/api/group/list',{userId:response.data._id.toString()})
          // console.log('Phản hồi từ server:', response);
          setList(response.data)
      } catch (error) {
          console.error('Lỗi lẫy danh sách bạn bè:', error);
          // setFriend(null)
      }
  };
  // Gọi fetchData() mỗi khi search thay đổi
  getList();
}, [])


useEffect(() => {
  const searchUser = async () => {
      try {
          const response = await axios.post('http://localhost:8800/api/users/phonenumber', { phonenumber: user.phonenumber });
          // console.log('Phản hồi từ server:', response.data);
          const responsegroup = await axios.post('http://localhost:8800/api/group/list', { userId: response.data._id.toString() });
          console.log(responsegroup.data)
          setListGroups(responsegroup.data)
      } catch (error) {
          console.error('Lỗi tìm user:', error);
          
      }
  };
  // Gọi fetchData() mỗi khi search thay đổi
  searchUser();
}, [])

const handleToggleView = (boolean) => {
  setShowFriendsView(boolean);
};

  return (
    <div className='sideBar-container'>
      <div className='sb-header'>
        <div>
          <IconButton onClick={handleGoToProfile}>
            <AccountCircleIcon/>
            <p style={{fontSize: 15, fontWeight: 'bolder'}}>{user.username}</p>
          </IconButton>
         
        </div>
        <div>
          <IconButton 
            onClick={handleGoToUser}>
            <PersonAddIcon/>
          </IconButton>
          
          
          <IconButton onClick={handleGoToGroup}>
            <GroupAddIcon/>
          </IconButton>

          {/* <IconButton >
            <AddCircleIcon/>  
          </IconButton> */}

          <IconButton onClick={() => {navigate("/")}}>
            <LogoutIcon/>
          </IconButton>
        </div>
        
        
      </div>
      <div className='sb-search'>
        <IconButton>
          <SearchIcon/>
        </IconButton>
       
        <input placeholder='Tìm kiếm' className='search-box'/>
      </div>
      <div className='sb-conversations'>
      <p style={{fontWeight: 'bold', display: 'flex'}}>Bạn bè</p>
        {listfriends.map((item) =>{
          return (
            <div key={item._id} 
                onClick={() => onListFriendClick(item)}
            >
              <ListFriendItem props={item}
              key={item._id}
                selected={selectedItem && selectedItem._id === item._id}>
              </ListFriendItem>            
            </div>
          )
        })}
      </div>
      <div className='sb-conversations'>
      <p style={{fontWeight: 'bold', display: 'flex'}}>Nhóm</p>
        {listGroups.map((item) =>{
          return (
            <div key={item._id} 
                onClick={() => onListGroupChatClick(item)}
            >
              <ListGroupItem props={item}
              key={item._id}
                selected={selectedItem && selectedItem._id === item._id}>
              </ListGroupItem>            
            </div>
          )
        })}
      </div>
    </div>

  )
}

export default Sidebar
