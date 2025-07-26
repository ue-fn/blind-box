import { useState, useEffect } from 'react'
import axios from '../utils/axios'
import './Goods.css' // 引入商品组件样式

/**
 * 商品组件
 * @returns {JSX.Element} 商品列表和搜索功能
 */
function Goods() {
  const [search, setSearch] = useState('')
  const [modalGood, setModalGood] = useState(null)
  const [blindBoxes, setBlindBoxes] = useState([])
  const [resultModal, setResultModal] = useState(null)
  const [loading, setLoading] = useState(false)

  // 获取盲盒列表
  useEffect(() => {
    fetchBlindBoxes()
  }, [])

  const fetchBlindBoxes = async () => {
    try {
      const response = await fetch('http://localhost:7001/blind-box/all')
      const data = await response.json()
      console.log('获取盲盒列表:', data)
      setBlindBoxes(data.data)
    } catch (error) {
      console.error('获取盲盒列表失败:', error)
    }
  }

  // 购买盲盒
  const handlePurchase = async (boxId) => {
    try {
      setLoading(true)
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
      // 刷新盲盒列表
      fetchBlindBoxes()
    } catch (error) {
      console.error('购买失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 搜索过滤
  const filteredGoods = blindBoxes.filter(box =>
    box.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="goods-container">
      {/* 搜索栏 */}
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="搜索您喜欢的盲盒..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* 商品列表 */}
      <div className="goods-list">
        {filteredGoods.map(box => (
          <div
            key={box.id}
            className="goods-card"
            onClick={() => setModalGood(box)}
          >
            <img src={box.imageUrl} alt={box.name} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
            <div className="goods-name">{box.name}</div>
            <div className="goods-price">￥{box.price}</div>
            <div className="goods-stock">库存：{box.stock}</div>
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
            <div>库存：{modalGood.stock}</div>
            <p>{modalGood.description}</p>
            <button
              onClick={() => handlePurchase(modalGood.id)}
              disabled={loading}
            >
              {loading ? '购买中...' : '购买'}
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

export default Goods