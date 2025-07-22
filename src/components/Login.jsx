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
        alert(`登录成功，欢迎：${data.user.username}`)
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
    <form onSubmit={handleLogin} style={{ margin: 20 }}>
      <h2>登录</h2>
      <div>
        <input
          type="text"
          placeholder="用户名"
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="密码"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <button type="submit">登录</button>
    </form>
  )
}

export default Login