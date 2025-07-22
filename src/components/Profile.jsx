import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 个人中心组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.isLogin - 是否已登录
 * @param {string} props.currentAvatar - 当前用户头像
 * @param {Object} props.currentUser - 当前用户信息
 * @param {Function} props.onLogout - 退出登录回调函数
 * @returns {JSX.Element} 个人中心页面
 */
function Profile({ isLogin, currentAvatar, currentUser, onLogout }) {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [orders, setOrders] = useState([])
  const [showOrders, setShowOrders] = useState(false)

  // 获取用户订单
  const fetchOrders = async () => {
    if (!currentUser?.id) return
    
    try {
      const response = await fetch(`http://localhost:7001/blind-box/orders/${currentUser.id}`)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('获取订单列表失败:', error)
    }
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isLogin || !currentUser || !currentUser.id) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('当前用户信息:', currentUser);
        const Response = await fetch(`http://127.0.0.1:7001/user/info?uid=${currentUser.username}`);
        const response = await Response.json();

        console.log('获取用户信息响应:', response);

        if (response.success) {
          setUserInfo(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        console.error('获取用户信息失败:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [isLogin, currentUser])

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
    <div style={{ padding: '20px' }}>
      <h2>个人中心</h2>
      {loading ? (
        <div>加载中...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div>
          <img src={currentAvatar} alt="头像" style={{ width: 80, borderRadius: '50%', marginBottom: '10px' }} />
          <div style={{ marginBottom: '10px' }}>用户名：{currentUser.username}</div>
          {userInfo && (
            <div style={{ marginBottom: '20px' }}>
              <div>创建时间：{new Date(userInfo.createdAt).toLocaleString()}</div>
              <div>更新时间：{new Date(userInfo.updatedAt).toLocaleString()}</div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => {
              setShowOrders(!showOrders)
              if (!showOrders) {
                fetchOrders()
              }
            }}>
              {showOrders ? '关闭订单' : '我的订单'}
            </button>
            <button>我的消息</button>
            <button>我的贴子</button>
          </div>

          {/* 订单列表 */}
          {showOrders && (
            <div style={{ marginBottom: '20px' }}>
              <h3>我的订单</h3>
              {orders.length === 0 ? (
                <p>暂无订单</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {orders.map(order => (
                    <div 
                      key={order.id} 
                      style={{
                        border: '1px solid #ddd',
                        padding: '10px',
                        borderRadius: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <img 
                          src={order.item.imageUrl} 
                          alt={order.item.name} 
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                        />
                        <div>
                          <h4 style={{ margin: '0 0 10px 0' }}>{order.blindBox.name}</h4>
                          <p style={{ margin: '0 0 5px 0' }}>抽中物品：{order.item.name}</p>
                          <p style={{ margin: '0 0 5px 0' }}>价格：￥{order.blindBox.price}</p>
                          <p style={{ margin: '0', color: '#666' }}>
                            购买时间：{new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={onLogout}
            style={{
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  )
}

export default Profile