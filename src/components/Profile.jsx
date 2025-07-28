import { useState, useEffect } from 'react'
import axios from 'axios'
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
  const [posts, setPosts] = useState([])
  const [showPosts, setShowPosts] = useState(false)

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

  // 获取用户帖子
  const fetchUserPosts = async () => {
    if (!currentUser?.id) return

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:7001/posts/user/${currentUser.id}`)
      const data = await response.json()
      console.log('获取用户帖子响应:', data)
      console.log('获取用户帖子:', data)
      if (data.success) {
        setPosts(data.data || [])
      } else {
        console.error('获取用户帖子失败:', data.message)
      }
    } catch (error) {
      console.error('获取用户帖子失败:', error)
    } finally {
      setLoading(false)
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

  // 更新订单状态
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch('http://localhost:7001/blind-box/updateOrderStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          status
        })
      })
      const data = await response.json()
      if (data.success) {
        // 更新本地订单状态
        setOrders(orders => orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        ))
        alert('订单状态更新成功')
      } else {
        alert(data.message || '更新订单状态失败')
      }
    } catch (error) {
      console.error('更新订单状态失败:', error)
      alert('更新订单状态失败，请稍后重试')
    }
  }

  // 删除帖子
  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:7001/posts/cancel/${postId}`)
      const data = await response.json()
      if (data.success) {
        // 删除成功后更新帖子列表
        setPosts(posts => posts.filter(post => post.id !== postId))
        alert('帖子删除成功')
      } else {
        alert(data.message || '删除帖子失败')
      }
    } catch (error) {
      console.error('删除帖子失败:', error)
      alert('删除帖子失败，请稍后重试')
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
        const Response = await fetch(`http://localhost:7001/user/info?uid=${currentUser.username}`);
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        minHeight: '60vh',
        background: '#ffffff',
        borderRadius: '12px',
        margin: '20px auto',
        maxWidth: '800px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '15px'
          }}>个人中心</h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            maxWidth: '400px',
            margin: '0 auto'
          }}>登录或注册账号以访问您的个人信息、订单和帖子</p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          width: '100%',
          maxWidth: '320px'
        }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: '#646cff',
              color: 'white',
              border: 'none',
              padding: '14px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(100, 108, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            登录账号
          </button>

          <button
            onClick={() => navigate('/register')}
            style={{
              backgroundColor: 'white',
              color: '#646cff',
              border: '2px solid #646cff',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0ff'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            创建新账号
          </button>
        </div>

        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f0f2ff',
          border: '2px solid #646cff',
          borderRadius: '8px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            登录后即可享受以下功能：
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#646cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span style={{ fontSize: '12px', color: '#666' }}>订单管理</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#646cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span style={{ fontSize: '12px', color: '#666' }}>社区互动</span>
            </div>

          </div>
        </div>
      </div>
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
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => {
              setShowOrders(!showOrders)
              setShowPosts(false)
              if (!showOrders) {
                fetchOrders()
              }
            }}>
              {showOrders ? '关闭订单' : '我的订单'}
            </button>

            <button onClick={() => {
              setShowPosts(!showPosts)
              setShowOrders(false)
              if (!showPosts) {
                fetchUserPosts()
              }
            }}>
              {showPosts ? '关闭帖子' : '我的帖子'}
            </button>
            {currentUser && currentUser.id === 11 && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => navigate('/admin/goods')}
                  style={{
                    backgroundColor: '#1890ff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  管理盲盒
                </button>
                <button
                  onClick={() => navigate('/admin/orders')}
                  style={{
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  管理订单
                </button>
              </div>
            )}
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
                          <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                            购买时间：{new Date(order.purchaseTime).toLocaleString()}
                          </p>
                          <p style={{
                            margin: '0',
                            fontWeight: 'bold',
                            color: order.status === 0 ? '#ff9800' :
                              order.status === 1 ? '#2196f3' :
                                order.status === 2 ? '#4caf50' : '#666'
                          }}>
                            订单状态：{order.status === 0 ? '未发货' :
                              order.status === 1 ? '待收货' :
                                order.status === 2 ? '已完成' : '未知状态'}
                          </p>
                        </div>
                      </div>
                      <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '10px' }}>
                        {/* 管理员可以更新订单状态 */}
                        {currentUser && currentUser.id === 11 && (
                          <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                            <select
                              value={order.status !== undefined ? order.status : 0}
                              onChange={(e) => handleUpdateOrderStatus(order.id, Number(e.target.value))}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '4px',
                                border: '1px solid #d9d9d9',
                                backgroundColor: '#fff',
                                fontSize: '14px'
                              }}
                            >
                              <option value="0">未发货</option>
                              <option value="1">待收货</option>
                              <option value="2">已完成</option>
                            </select>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('确定要删除这个订单吗？')) {
                              handleDeleteOrder(order.id)
                            }
                          }}
                          style={{
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 帖子列表 */}
          {showPosts && (
            <div style={{ marginBottom: '20px' }}>
              <h3>我的帖子</h3>
              {loading ? (
                <div>加载中...</div>
              ) : posts.length === 0 ? (
                <p>暂无帖子</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '1000px' }}>
                  {posts.map(post => (
                    <div
                      key={post.id}
                      style={{
                        border: '1px solid #ddd',
                        padding: '20px 20px 50px 20px',
                        borderRadius: '8px',
                        position: 'relative',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ marginBottom: '10px' }}>
                        <span style={{ color: '#666' }}>{new Date(post.createdAt).toLocaleString()}</span>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 15px 0', fontSize: '16px' }}>{post.content}</p>
                        {post.image && (
                          <div style={{ marginBottom: '15px' }}>
                            <img
                              src={`http://localhost:7001${post.image}`}
                              alt="帖子图片"
                              style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                              onClick={() => window.open(`http://localhost:7001${post.image}`, '_blank')}
                            />
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ff4d4f' }}>
                            <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span>{post.likeCount || 0}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('确定要删除这个帖子吗？')) {
                            handleDeletePost(post.id)
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
                        删除帖子
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