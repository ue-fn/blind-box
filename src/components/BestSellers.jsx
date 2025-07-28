import { useState, useEffect } from 'react'
import axios from '../utils/axios'
import './BestSellers.css' // 引入热销榜组件样式

/**
 * 热销榜组件
 * @returns {JSX.Element} 热销榜列表
 */
function BestSellers() {
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalGood, setModalGood] = useState(null)
  const [resultModal, setResultModal] = useState(null)
  const [purchaseLoading, setPurchaseLoading] = useState(false)

  // 获取热销榜数据
  useEffect(() => {
    fetchBestSellers()
  }, [])

  const fetchBestSellers = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:7001/blind-box/best-sellers')
      const data = await response.json()
      console.log('获取热销榜:', data)
      if (data.success) {
        setBestSellers(data.data)
      } else {
        console.error('获取热销榜失败:', data.message)
      }
    } catch (error) {
      console.error('获取热销榜失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 购买盲盒
  const handlePurchase = async (boxId) => {
    try {
      setPurchaseLoading(true)
      // 从localStorage获取用户ID
      const userId = localStorage.getItem('userId')
      if (!userId) {
        alert('请先登录')
        return
      }

      // 购买盲盒
      const purchaseResponse = await fetch('http://localhost:7001/blind-box/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          boxId
        })
      })
      const purchaseData = await purchaseResponse.json()
      console.log('已购买', purchaseData, purchaseData.data.orderId)
      
      // 获取订单ID并立即揭晓
      const orderId = purchaseData.data.orderId
      const revealResponse = await fetch('http://localhost:7001/blind-box/reveal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId
        })
      })
      const revealData = await revealResponse.json()
      console.log('揭晓结果:', revealData)
      
      // 显示结果
      setResultModal(revealData)
      // 刷新热销榜
      fetchBestSellers()
    } catch (error) {
      console.error('购买失败:', error)
    } finally {
      setPurchaseLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">加载热销榜中...</div>
  }

  return (
    <div className="bestsellers-container">
      <h2 className="bestsellers-title">🏆 热销榜 TOP 10</h2>
      
      {/* 热销榜列表 */}
      <div className="bestsellers-list">
        {bestSellers.map((item) => (
          <div 
            key={item.id} 
            className="bestseller-item"
            onClick={() => setModalGood(item)}
          >
            <div className="bestseller-rank">{item.rank}</div>
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="bestseller-image" 
            />
            <div className="bestseller-info">
              <div className="bestseller-name">{item.name}</div>
              <div className="bestseller-price">￥{item.price}</div>
              <div className="bestseller-sales">销量: {item.salesCount}</div>
            </div>
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
            <img src={modalGood.imageUrl} alt={modalGood.name} style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
            <h3>{modalGood.name}</h3>
            <div style={{ color: 'red', fontWeight: 'bold' }}>￥{modalGood.price}</div>
            <div>销量：{modalGood.salesCount}</div>
            <button
              onClick={() => handlePurchase(modalGood.id)}
              disabled={purchaseLoading}
            >
              {purchaseLoading ? '购买中...' : '购买'}
            </button>
            <button
              className="close-btn"
              onClick={() => setModalGood(null)}
            >关闭</button>
          </div>
        </div>
      )}

      {/* 抽取结果弹窗 */}
      {resultModal && (
        <div
          className="goods-modal-mask"
          onClick={() => setResultModal(null)}
        >
          <div
            className="goods-modal result-modal"
            onClick={e => e.stopPropagation()}
          >
            <h2>恭喜您抽中了</h2>
            <img src={resultModal.item.imageUrl} alt={resultModal.item.name} style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
            <h3>{resultModal.item.name}</h3>
            <p>{resultModal.item.description}</p>
            <button
              className="close-btn"
              onClick={() => setResultModal(null)}
            >关闭</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BestSellers