import React from 'react'
import FaceIcon from '@mui/icons-material/Face';


function MessageRight({img, isseen, content}) {
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
    <div className='messageRight-container'>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <img className='imgRight-container' src={img} alt="Avatar"></img>
      {isImageUrl(content) ? (
        <img className='contentRight-container' src={content} alt="Content"></img>
      ) : (
        <p className='contentRight-container'>{content}</p>
      )}
    </div>
    <p className='issend-container'>{isseen}</p>
  </div>
  )
}

export default MessageRight