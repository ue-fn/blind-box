import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 注册组件
 * @param {Object} props - 组件属性
 * @param {Function} props.setIsLogin - 设置登录状态的函数
 * @param {Function} props.setCurrentUser - 设置当前用户的函数
 * @param {Function} props.setCurrentAvatar - 设置当前头像的函数
 * @param {Array} props.avatarList - 头像列表
 * @returns {JSX.Element} 注册表单
 */
function Register({ setIsLogin, setCurrentUser, setCurrentAvatar, avatarList }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    avatar: avatarList[0] // 默认头像
  })
  const [avatar, setAvatar] = useState(avatarList[0].toString()) // 默认头像，确保是字符串
  
  const handleRegister = async (e) => {
    e.preventDefault()

    // 输入验证
    if (!formData.username.trim()) {
      alert('请输入用户名')
      return
    }
    if (formData.username.length < 3 || formData.username.length > 20) {
      alert('用户名长度必须在3-20个字符之间')
      return
    }
    if (!formData.password) {
      alert('请输入密码')
      return
    }
    if (formData.password.length < 6) {
      alert('密码长度不能少于6个字符')
      return
    }

    try {
      console.log('注册请求数据:', formData)
      const response = await fetch('http://127.0.0.1:7001/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          avatar: formData.avatar
        }),
      });
      
      const data = await response.json();
      console.log('注册响应数据:', data);

      if (data.success) {
        // 注册成功后自动登录
        const loginResponse = await fetch('http://127.0.0.1:7001/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });
        
        const loginData = await loginResponse.json();
        
        if (loginData.success) {
          // 保存登录状态和用户信息
          setIsLogin(true);
          setCurrentUser(loginData.user);
          setCurrentAvatar(loginData.user.avatar);
          // 保存用户ID到localStorage
          localStorage.setItem('userId', loginData.user.id);
          
          // 使用带蓝色边框的提示替代alert
          const successMessage = document.createElement('div');
          successMessage.style.padding = '10px';
          successMessage.style.border = '2px solid #646cff';
          successMessage.style.borderRadius = '5px';
          successMessage.style.backgroundColor = '#f0f2ff';
          successMessage.style.color = '#333';
          successMessage.style.position = 'fixed';
          successMessage.style.top = '20px';
          successMessage.style.left = '50%';
          successMessage.style.transform = 'translateX(-50%)';
          successMessage.style.zIndex = '1000';
          successMessage.textContent = `注册成功并已登录，欢迎：${loginData.user.username}`;
          document.body.appendChild(successMessage);
          
          // 3秒后移除提示
          setTimeout(() => {
            document.body.removeChild(successMessage);
          }, 3000);
          
          navigate('/profile');
        } else {
          alert('注册成功，请重新登录');
          navigate('/login');
        }
      } else {
        alert(data.message || '注册失败');
      }
    } catch (error) {
      console.error('注册错误:', error);
      alert('注册失败：网络错误或服务不可用');
    }
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '30px',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      margin: '40px auto',
      width: '100%',
      maxWidth: '380px'
    }}>
      <h2 style={{ 
        color: '#646cff', 
        marginBottom: '20px',
        fontSize: '28px',
        fontWeight: '600'
      }}>创建账号</h2>
      
      <p style={{ 
        color: '#666', 
        marginBottom: '20px',
        fontSize: '15px'
      }}>选择一个喜欢的头像</p>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '15px', 
        margin: '0 0 25px 0' 
      }}>
        {avatarList.map((img, idx) => (
          <div 
            key={idx} 
            style={{
              position: 'relative',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              padding: '3px',
              background: avatar === img ? 'linear-gradient(45deg, #646cff, #a5a9ff)' : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <img
              src={img}
              alt={`头像${idx + 1}`}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                cursor: 'pointer',
                border: '2px solid white',
                boxSizing: 'border-box',
                transition: 'transform 0.2s ease'
              }}
              onClick={() => {
                setAvatar(img.toString());
                setFormData({ ...formData, avatar: img.toString() })
              }}
            />
          </div>
        ))}
      </div>
      
      <form onSubmit={handleRegister} style={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px' 
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            left: '15px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#646cff'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <input
            type="text"
            placeholder="用户名 (3-20个字符)"
            value={formData.username}
            onChange={e => {
              setFormData({ ...formData, username: e.target.value })
            }}
            required
            style={{
              width: '100%',
              padding: '12px 12px 12px 45px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            left: '15px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#646cff'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <input
            type="password"
            placeholder="密码 (至少6个字符)"
            value={formData.password}
            onChange={e => {
              setFormData({ ...formData, password: e.target.value })
            }}
            required
            style={{
              width: '100%',
              padding: '12px 12px 12px 45px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <button 
          type="submit"
          style={{
            backgroundColor: '#646cff',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            marginTop: '10px',
            boxShadow: '0 4px 6px rgba(100, 108, 255, 0.2)'
          }}
        >
          注册
        </button>
      </form>
      
      <div style={{ marginTop: '25px', color: '#666', fontSize: '14px' }}>
        已有账号？ 
        <span 
          onClick={() => navigate('/login')} 
          style={{ 
            color: '#646cff', 
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          立即登录
        </span>
      </div>
    </div>
  )
}

export default Register