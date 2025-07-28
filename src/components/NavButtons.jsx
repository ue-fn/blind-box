import { useNavigate } from 'react-router-dom'

/**
 * 导航按钮组件
 * @returns {JSX.Element} 导航按钮组
 */
function NavButtons() {
  const navigate = useNavigate()
  
  return (
    <div style={{ marginBottom: '20px', width: '100%', display: 'flex', justifyContent: 'center', gap: '15px' }}>
      <button onClick={() => navigate('/')}>商品首页</button>
      <button onClick={() => navigate('/bestsellers')}>热销榜</button>
      <button onClick={() => navigate('/community')}>玩家秀</button>
      <button onClick={() => navigate('/profile')}>个人中心</button>
    </div>
  )
}

export default NavButtons