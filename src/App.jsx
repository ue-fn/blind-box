import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import avatar1 from './assets/avatars/sea.jpg'
import avatar2 from './assets/avatars/flower.jpg'
import avatar3 from './assets/avatars/snow.jpg'
import avatar4 from './assets/avatars/moon.jpg'

import txz19 from './assets/goods/txz19.jpg'
import txz26 from './assets/goods/txz26.jpg'
import txz27 from './assets/goods/txz27.jpg'
import txz31 from './assets/goods/txz31.jpg'
import txzyj from './assets/goods/txzyj.jpg'

import './App.css'
const avatarList = [avatar1, avatar2, avatar3, avatar4]
const goodsList = [
  { id: 1, name: '通行证19.0', price: 25, img: txz19, stock: 100, desc: '通行证19.0！' },
  { id: 2, name: '通行证26.0', price: 25, img: txz26, stock: 100, desc: '通行证26.0' },
  { id: 3, name: '通行证27.0', price: 25, img: txz27, stock: 100, desc: '通行证27.0' },
  { id: 4, name: '通行证31.0', price: 25, img: txz31, stock: 100, desc: '通行证31.0' },
  { id: 5, name: '通行证遗君', price: 25, img: txzyj, stock: 100, desc: '通行证遗君' },
]
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
  const [search, setSearch] = useState('')
  const [modalGood, setModalGood] = useState(null)

  // 搜索过滤
  const filteredGoods = goodsList.filter(good =>
    good.name.includes(search)
  )

  return (
    <div style={{ padding: 20 }}>
      {/* 搜索栏 */}
      <input
        type="text"
        placeholder="搜索商品"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: 300, padding: 8, marginBottom: 20 }}
      />

      {/* 商品列表 */}
      <div className="goods-list">
        {filteredGoods.map(good => (
          <div
            key={good.id}
            className="goods-card"
            onClick={() => setModalGood(good)}
          >
            <img src={good.img} alt={good.name} />
            <div className="goods-name">{good.name}</div>
            <div className="goods-price">￥{good.price}</div>
            <div className="goods-stock">库存：{good.stock}</div>
          </div>
        ))}
      </div>

      {/* 商品详情弹窗 */}
      {modalGood && (
        <div
          className="goods-modal-mask"
          onClick={() => setModalGood(null)}
        >
          <div
            className="goods-modal"
            onClick={e => e.stopPropagation()}
          >
            <img src={modalGood.img} alt={modalGood.name} />
            <h3>{modalGood.name}</h3>
            <div style={{ color: 'red', fontWeight: 'bold' }}>￥{modalGood.price}</div>
            <div>库存：{modalGood.stock}</div>
            <p>{modalGood.desc}</p>
            <button>购买</button>
            <button
              className="close-btn"
              onClick={() => setModalGood(null)}
            >关闭</button>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminGoods({ isAdmin }) {
  const [goods, setGoods] = useState(goodsList)
  const [modalType, setModalType] = useState(null) // 'add' or 'edit'
  const [editGood, setEditGood] = useState(null)

  if (!isAdmin) return <div>无权限</div>

  // 删除盲盒
  const handleDelete = (id) => setGoods(goods.filter(g => g.id !== id))

  // 打开弹窗
  const openModal = (type, good = null) => {
    setModalType(type)
    setEditGood(good)
  }

  // 保存盲盒
  const handleSave = (good) => {
    if (modalType === 'add') {
      setGoods([...goods, { ...good, id: Date.now() }])
    } else if (modalType === 'edit') {
      setGoods(goods.map(g => g.id === good.id ? good : g))
    }
    setModalType(null)
    setEditGood(null)
  }

  return (
    <div>
      <h2>盲盒管理</h2>
      <button onClick={() => openModal('add')}>新增盲盒</button>
      <table>
        <thead>
          <tr>
            <th>图片</th><th>名称</th><th>价格</th><th>库存</th><th>描述</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          {goods.map(good => (
            <tr key={good.id}>
              <td><img src={good.img} alt="" style={{ width: 40 }} /></td>
              <td>{good.name}</td>
              <td style={{ color: 'red' }}>￥{good.price}</td>
              <td>{good.stock}</td>
              <td>{good.desc}</td>
              <td>
                <button onClick={() => openModal('edit', good)}>编辑</button>
                <button onClick={() => handleDelete(good.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 弹窗 */}
      {modalType && (
        <GoodEditModal
          type={modalType}
          good={editGood}
          onSave={handleSave}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  )
}
function GoodEditModal({ type, good, onSave, onClose }) {
  const [form, setForm] = useState(
    good || { name: '', price: '', img: '', stock: '', desc: '' }
  )
  return (
    <div className="goods-modal-mask">
      <div className="goods-modal" style={{ minWidth: 400 }}>
        <h3>{type === 'add' ? '新增盲盒' : '编辑盲盒'}</h3>
        <input placeholder="名称" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="价格" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input placeholder="图片URL" value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} />
        <input placeholder="库存" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
        <input placeholder="描述" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
        <button onClick={() => onSave({ ...form, id: good?.id || Date.now() })}>保存</button>
        <button onClick={onClose} className="close-btn">取消</button>
      </div>
    </div>
  )
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
  const [isAdmin, setIsAdmin] = useState(true) // 是否是管理员
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
          {/*路由注册*/}
          <Route path="/admin/goods" element={<AdminGoods isAdmin={isAdmin} />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
