import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import avatar1 from './assets/avatars/sea.jpg'
import avatar2 from './assets/avatars/flower.jpg'
import avatar3 from './assets/avatars/snow.jpg'
import avatar4 from './assets/avatars/moon.jpg'
import './App.css'
const avatarList = [avatar1, avatar2, avatar3, avatar4]
function Login({ setIsLogin, setCurrentUser, setCurrentAvatar, avatarList }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState(avatarList ? avatarList[0] : '') // 默认头像
  const handleLogin = (e) => {
    e.preventDefault()
    // 这里只是演示，实际登录需要和后端交互
    setIsLogin(true)
    setCurrentUser(username)
    setCurrentAvatar(avatar) // 设置当前用户头像
    // 登录成功提示
    alert(`登录成功，欢迎：${username}`)
    navigate('/profile') // 登录后跳转到个人中心
  }
  return (
    <form onSubmit={handleLogin} style={{ margin: 20 }}>
      <h2>登录</h2>
      <div>
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">登录</button>
    </form>
  )
}

function Register({ setIsLogin, setCurrentUser, setCurrentAvatar, avatarList }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState(avatarList[0]) // 默认头像
  const handleRegister = (e) => {
    e.preventDefault()
    // 这里只是演示，实际注册需要和后端交互
    setIsLogin(true)
    setCurrentUser(username)
    setCurrentAvatar(avatar) // 设置当前用户头像
    // 注册成功提示
    alert(`注册成功，欢迎 ${username} ੭ ᐕ)੭*⁾⁾`)
    navigate('/login')
  }
  return (
    <form onSubmit={handleRegister} style={{ margin: 20 }}>
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
            onClick={() => setAvatar(img)}
          />
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="用户名"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">注册</button>
    </form>
  )
}
//四个界面组件
function Home() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>首页</div>
      <div>
        <a href="https://vite.dev" target="_self">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_self">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
function Goods() {
  return <div>商品</div>
}
function Community() {
  return <div>玩家秀</div>
}
function Profile({ isLogin, currentAvatar, currentUser }) {
  const navigate = useNavigate()
  if (!isLogin) {
    return (
      <>
        <div>个人中心</div>
        <button onClick={() => navigate('/login')}>登录</button>
        <button onClick={() => navigate('/register')}>注册</button>
      </>
    )
  }

  return (
    <div>
      <h2>个人中心</h2>
      <img src={currentAvatar} alt="头像" style={{ width: 80, borderRadius: '50%' }} />
      <div>用户名：{currentUser}</div>
      <button>我的订单</button>
      <button>我的消息</button>
      <button>我的贴子</button>
    </div>
  )

}

//导航按钮组件
function NavButtons() {
  const navigate = useNavigate()
  return (
    <div style={{ marginBottom: '20px' }}>
      <button onClick={() => navigate('/')}>首页</button>
      <button onClick={() => navigate('/goods')}>商品</button>
      <button onClick={() => navigate('/community')}>社区</button>
      <button onClick={() => navigate('/profile')}>个人中心</button>
    </div>
  )
}
function App() {
  const [count, setCount] = useState(0)
  const [isLogin, setIsLogin] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [currentAvatar, setCurrentAvatar] = useState(avatarList[0])
  return (
    <>
      <Router>
        <h1>盲盒抽奖机</h1>
        <NavButtons />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/goods" element={<Goods />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={
            <Profile
              isLogin={isLogin}
              currentAvatar={currentAvatar}
              currentUser={currentUser}
            />
          } />
          <Route path="/login" element={
            <Login
              setIsLogin={setIsLogin}
              setCurrentUser={setCurrentUser}
              setCurrentAvatar={setCurrentAvatar}
              avatarList={avatarList}
            />
          } />
          <Route path="/register" element={
            <Register
              setIsLogin={setIsLogin}
              setCurrentUser={setCurrentUser}
              setCurrentAvatar={setCurrentAvatar}
              avatarList={avatarList}
            />
          } />
        </Routes>
      </Router>

    </>
  )
}

export default App
