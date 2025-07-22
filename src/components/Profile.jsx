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
      console.log('获取用户订单:', data)
      setOrders(data.data)
    } catch (error) {
      console.error('获取订单列表失败:', error)
    }
  }

  // 删除订单
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:7001/blind-box/deleteOrder/${orderId}`)
      const data = await response.json()
      if (data.success) {
        // 删除成功后刷新订单列表
        setOrders(orders => orders.filter(order => order.id !== orderId))
        fetchOrders()
        alert('订单删除成功')
      } else {
        alert(data.message || '删除订单失败')
      }
    } catch (error) {
      console.error('删除订单失败:', error)
      alert('删除订单失败，请稍后重试')
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
    <div style={{ padding: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '1000px' }}>
                  {orders.map(order => (
                    <div
                      key={order.id}
                      style={{
                        border: '1px solid #ddd',
                        padding: '20px 20px 50px 20px',
                        borderRadius: '8px',
                        position: 'relative',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px' }}>
                        <img
                          src={order.item.imageUrl}
                          alt={order.item.name}
                          style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>{order.box.name}</h4>
                          <p style={{ margin: '0 0 8px 0', fontSize: '16px' }}>抽中物品：{order.item.name}</p>
                          <p style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#ff4d4f' }}>价格：￥{order.box.price}</p>
                          <p style={{ margin: '0', color: '#666' }}>
                            购买时间：{new Date(order.purchaseTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('确定要删除这个订单吗？')) {
                            handleDeleteOrder(order.id)
                          }
                        }}
                        style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          backgroundColor: '#ff4d4f',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        删除订单
                      </button>
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