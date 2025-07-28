import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 登录组件
 * @param {Object} props - 组件属性
 * @param {Function} props.setIsLogin - 设置登录状态的函数
 * @param {Function} props.setCurrentUser - 设置当前用户的函数
 * @param {Function} props.setCurrentAvatar - 设置当前头像的函数
 * @param {Array} props.avatarList - 头像列表
 * @returns {JSX.Element} 登录表单
 */
function Login({ setIsLogin, setCurrentUser, setCurrentAvatar, avatarList }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [avatar, setAvatar] = useState(avatarList ? avatarList[0] : '') // 默认头像

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://127.0.0.1:7001/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log(data)
        // 保存登录状态和用户信息
        setIsLogin(true)
        setCurrentUser(data.user)
        setCurrentAvatar(data.user.avatar)
        // 保存用户ID到localStorage
        localStorage.setItem('userId', data.user.id)
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
        successMessage.textContent = `登录成功，欢迎：${data.user.username}`;
        document.body.appendChild(successMessage);
        
        // 3秒后移除提示
        setTimeout(() => {
          document.body.removeChild(successMessage);
        }, 3000);
        navigate('/profile')
      } else {
        alert(data.message)
      }
    } catch (error) {
      if (error.response) {
        // 服务器返回错误状态码
        alert(data.message || '请求失败')
      } else if (error.request) {
        // 请求发送失败
        alert('网络连接失败，请检查网络设置')
      } else {
        // 其他错误
        alert('发生错误：' + error.message)
      }
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
        marginBottom: '25px',
        fontSize: '28px',
        fontWeight: '600'
      }}>欢迎回来</h2>
      
      <form onSubmit={handleLogin} style={{ 
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
            placeholder="用户名"
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
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
            placeholder="密码"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
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
          登录
        </button>
      </form>
      
      <div style={{ marginTop: '25px', color: '#666', fontSize: '14px' }}>
        还没有账号？ 
        <span 
          onClick={() => navigate('/register')} 
          style={{ 
            color: '#646cff', 
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          立即注册
        </span>
      </div>
    </div>
  )
}

export default Login