import React, { useState } from 'react';

const MemberList = ({ members }) => {
  const [showForm, setShowForm] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupImg, setGroupImg] = useState('');

  const handleAddFriendClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Xử lý dữ liệu từ biểu mẫu ở đây, ví dụ: gửi yêu cầu API để thêm bạn vào nhóm
    console.log('Tên bạn:', friendName);
    console.log('Tên nhóm:', groupName);
    console.log('Link hình ảnh:', groupImg);
    // Sau khi xử lý xong, bạn có thể đặt lại showForm thành false để ẩn biểu mẫu
    setShowForm(false);
  };
  if (!members) {
    return <div>Loading...</div>;
  }

  return (
    <div className="member-list">
      <h2>Thành viên</h2>
      <ul>
        {members.map((member, index) => (
          <li key={index}>{member.username}</li>
        ))}
      </ul>
      <button onClick={handleAddFriendClick}>+ Thêm bạn</button>
      {showForm && (
        <form onSubmit={handleFormSubmit}>
          <label>
            Tên bạn:
            <input type="text" value={friendName} onChange={(e) => setFriendName(e.target.value)} />
          </label>
          <label>
            Tên nhóm:
            <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          </label>
          <label>
            Link hình ảnh:
            <input type="text" value={groupImg} onChange={(e) => setGroupImg(e.target.value)} />
          </label>
          <button type="submit">Thêm</button>
        </form>
      )}
    </div>
  );
};

export default MemberList;
