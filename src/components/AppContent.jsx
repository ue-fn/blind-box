import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { avatarList } from '../constants'
import NavButtons from './NavButtons'
import Goods from './Goods'
import BestSellers from './BestSellers'
import Community from './Community'
import Profile from './Profile'
import Login from './Login'
import Register from './Register'
import AdminGoods from './AdminGoods'
import AdminOrders from './AdminOrders'

/**
 * 应用主内容组件
 * @returns {JSX.Element} 应用主要内容和路由
 */
function AppContent() {
  const navigate = useNavigate()
  // 从 localStorage 初始化状态
  const [isLogin, setIsLogin] = useState(() => localStorage.getItem('isLogin') === 'true')
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [currentAvatar, setCurrentAvatar] = useState(() => {
    const savedAvatar = localStorage.getItem('currentAvatar')
    return savedAvatar || avatarList[0]
  })
  const [isAdmin, setIsAdmin] = useState(false)

  // 监听状态变化，更新 localStorage
  useEffect(() => {
    localStorage.setItem('isLogin', isLogin)
    localStorage.setItem('currentUser', currentUser ? JSON.stringify(currentUser) : '')
    localStorage.setItem('currentAvatar', currentAvatar)
    localStorage.setItem('isAdmin', isAdmin)
  }, [isLogin, currentUser, currentAvatar, isAdmin])
  
  // 检查管理员权限
  useEffect(() => {
    const userId = parseInt(localStorage.getItem('userId'))
    setIsAdmin(userId === 11)
  }, [isLogin])

  const handleLogout = () => {
    // 清除所有登录相关的状态和存储
    setIsLogin(false)
    setCurrentUser(null)
    setCurrentAvatar(avatarList[0])
    localStorage.removeItem('isLogin')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('currentAvatar')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('userId')
    navigate('/')
  }

  return (
    <>
      <h1>盲盒抽奖机🪄</h1>
      <NavButtons />
      <Routes>
        <Route path="/" element={<Goods />} />
        <Route path="/bestsellers" element={<BestSellers />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={
          <Profile
            isLogin={isLogin}
            currentAvatar={currentAvatar}
            currentUser={currentUser}
            onLogout={handleLogout}
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
        {/*路由注册*/}
        <Route path="/admin/goods" element={<AdminGoods isAdmin={isAdmin} />} />
        <Route path="/admin/orders" element={<AdminOrders isAdmin={isAdmin} />} />
      </Routes>
    </>
  )
}

export default AppContent