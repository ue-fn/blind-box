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
          alert(`注册成功并已登录，欢迎：${loginData.user.username}`);
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
    <form onSubmit={handleRegister} style={{ margin: '20px auto', width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <h2>注册</h2>
      <div style={{ display: 'flex', gap: 10, margin: '10px 0' }}>
        {avatarList.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`头像${idx + 1}`}
            style={{
              width: 50,
              height: 50,
              border: avatar === img ? '2px solid #646cff' : '2px solid transparent',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
            onClick={() => {
              setAvatar(img.toString());
              setFormData({ ...formData, avatar: img.toString() })
            }}
          />
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="用户名"
          value={formData.username}
          onChange={e => {
            setFormData({ ...formData, username: e.target.value })
          }}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="密码"
          value={formData.password}
          onChange={e => {
            setFormData({ ...formData, password: e.target.value })
          }}
          required
        />
      </div>
      <button type="submit">注册</button>
    </form>
  )
}

export default Register