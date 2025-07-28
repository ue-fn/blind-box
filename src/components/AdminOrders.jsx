import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrderStatusMap } from '../constants'

/**
 * 管理员订单管理页面
 * @param {Object} props - 组件属性
 * @param {boolean} props.isAdmin - 是否是管理员
 * @returns {JSX.Element} 管理员订单管理页面
 */
function AdminOrders({ isAdmin }) {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeStatus, setActiveStatus] = useState(null) // null 表示显示所有订单
  const [orderCounts, setOrderCounts] = useState({ total: 0, 0: 0, 1: 0, 2: 0 }) // 各状态订单数量

  // 在组件挂载时检查是否是管理员
  useEffect(() => {
    if (parseInt(localStorage.getItem('userId')) !== 11) {
      navigate('/profile')
    }
  }, [isAdmin, navigate])

  // 获取所有订单
  const fetchAllOrders = async (status = null) => {
    try {
      setLoading(true)
      let url = 'http://localhost:7001/blind-box/all-orders'
      if (status !== null) {
        url += `?status=${status}`
      }
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
      if (data.success) {
        setOrders(data.data)
        
        // 计算各状态订单数量
        const allOrdersResponse = await fetch('http://localhost:7001/blind-box/all-orders')
        const allOrdersData = await allOrdersResponse.json()
        
        if (allOrdersData.success) {
          const allOrders = allOrdersData.data
          const counts = {
            total: allOrders.length,
            0: allOrders.filter(order => order.status === 0).length,
            1: allOrders.filter(order => order.status === 1).length,
            2: allOrders.filter(order => order.status === 2).length
          }
          setOrderCounts(counts)
        }
      } else {
        setError(data.message || '获取订单失败')
      }
    } catch (error) {
      console.error('获取订单列表失败:', error)
      setError('获取订单列表失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 组件挂载时获取所有订单
  useEffect(() => {
    // 权限检查已经在上面的useEffect中处理，这里不再需要额外的检查
    fetchAllOrders(activeStatus)
  }, [activeStatus])

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
        setOrders(orders => {
          const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status } : order
          )
          
          // 更新订单数量统计
          const newCounts = {
            total: updatedOrders.length,
            0: updatedOrders.filter(order => order.status === 0).length,
            1: updatedOrders.filter(order => order.status === 1).length,
            2: updatedOrders.filter(order => order.status === 2).length
          }
          setOrderCounts(newCounts)
          
          return updatedOrders
        })
        alert('订单状态更新成功')
      } else {
        alert(data.message || '更新订单状态失败')
      }
    } catch (error) {
      console.error('更新订单状态失败:', error)
      alert('更新订单状态失败，请稍后重试')
    }
  }

  // 删除订单
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:7001/blind-box/deleteOrder/${orderId}`)
      const data = await response.json()
      if (data.success) {
        // 删除成功后刷新订单列表
        setOrders(orders => {
          const updatedOrders = orders.filter(order => order.id !== orderId)
          
          // 更新订单数量统计
          const newCounts = {
            total: updatedOrders.length,
            0: updatedOrders.filter(order => order.status === 0).length,
            1: updatedOrders.filter(order => order.status === 1).length,
            2: updatedOrders.filter(order => order.status === 2).length
          }
          setOrderCounts(newCounts)
          
          return updatedOrders
        })
        alert('订单删除成功')
      } else {
        alert(data.message || '删除订单失败')
      }
    } catch (error) {
      console.error('删除订单失败:', error)
      alert('删除订单失败，请稍后重试')
    }
  }

  // 获取状态对应的中文描述
  const getStatusText = (status) => {
    return status === 0 ? '未发货' :
      status === 1 ? '待收货' :
        status === 2 ? '已完成' : '未知状态'
  }

  // 获取状态对应的颜色
  const getStatusColor = (status) => {
    return status === 0 ? '#ff9800' :
      status === 1 ? '#2196f3' :
        status === 2 ? '#4caf50' : '#666'
  }

  return (
    <div style={{ padding: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>订单管理</h2>

      {/* 状态筛选按钮 */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveStatus(null)}
          style={{
            backgroundColor: activeStatus === null ? '#1890ff' : '#f0f0f0',
            color: activeStatus === null ? 'white' : '#333',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          全部订单 ({orderCounts.total})
        </button>
        <button
          onClick={() => setActiveStatus(0)}
          style={{
            backgroundColor: activeStatus === 0 ? '#ff9800' : '#f0f0f0',
            color: activeStatus === 0 ? 'white' : '#333',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          未发货 ({orderCounts[0]})
        </button>
        <button
          onClick={() => setActiveStatus(1)}
          style={{
            backgroundColor: activeStatus === 1 ? '#2196f3' : '#f0f0f0',
            color: activeStatus === 1 ? 'white' : '#333',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          待收货 ({orderCounts[1]})
        </button>
        <button
          onClick={() => setActiveStatus(2)}
          style={{
            backgroundColor: activeStatus === 2 ? '#4caf50' : '#f0f0f0',
            color: activeStatus === 2 ? 'white' : '#333',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          已完成 ({orderCounts[2]})
        </button>
      </div>

      {/* 订单列表 */}
      {loading ? (
        <div>加载中...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : orders.length === 0 ? (
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
                  <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                    用户：{order.user.username} (ID: {order.user.id})
                  </p>
                  <p style={{
                    margin: '0',
                    fontWeight: 'bold',
                    color: getStatusColor(order.status)
                  }}>
                    订单状态：{getStatusText(order.status)}
                  </p>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '10px' }}>
                {/* 更新订单状态 */}
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
  )
}

export default AdminOrders