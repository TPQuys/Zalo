import React from 'react'



function MessageLeft({img, isseen, content, username }) {
  function isImageUrl(content) {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp']; // Các định dạng ảnh có thể mở rộng thêm nếu cần
    const urlPattern = /^(http(s)?:\/\/[^\s]+\.(png|jpg|jpeg|gif|bmp))/i; // Một pattern để kiểm tra URL
  
    if (typeof content !== 'string') {
      return false; // Nếu không phải là chuỗi, không phải URL hình ảnh
    }
  
    // Kiểm tra xem chuỗi có khớp với pattern không
    const match = urlPattern.test(content);
  
    if (!match) {
      return false; // Không phải là một URL hợp lệ
    }
  
    // Kiểm tra xem đuôi file có phù hợp không
    const extension = content.slice(content.lastIndexOf('.')).toLowerCase(); // Lấy phần đuôi file và chuyển về lowercase
  
    if (!imageExtensions.includes(extension)) {
      return false; // Đuôi file không hợp lệ
    }
  
    return true; // Chuỗi là một URL hình ảnh hợp lệ
  }
  return (
    <div className='messageLeft-container'>
    
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flexDirection: 'column' }}>
      <p style={{ margin:0}}>{username}</p>
      <img style={{ margin:0 }} className='imgLeft-container' src={img} alt="Avatar"></img>
      </div>
      {isImageUrl(content) ? (
        <img style={{ alignSelf:'flex-end', margin:0,marginLeft:5 }} className='contentLeft-container' src={content} alt="Content"></img>
      ) : (
        <p style={{ alignSelf:'flex-end' ,margin:0,marginLeft:5}} className='contentLeft-container'>{content}</p>
      )}
    </div>
    <p className='isseen-container'>{isseen}</p>
  </div>
);
}

export default MessageLeft