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
  const [boxItems, setBoxItems] = useState([])

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

  // 获取盲盒详情
  const fetchBoxDetail = async (boxId) => {
    try {
      const response = await fetch(`http://localhost:7001/blind-box/${boxId}`)
      const data = await response.json()
      console.log('获取盲盒详情:', data)
      if (data.success && data.data.items) {
        setBoxItems(data.data.items)
      }
    } catch (error) {
      console.error('获取盲盒详情失败:', error)
    }
  }

  // 打开商品详情并获取款式
  const handleOpenDetail = (box) => {
    setModalGood(box)
    fetchBoxDetail(box.id)
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
      
      // 刷新盲盒列表
      await fetchBlindBoxes()
      
      // 如果当前有打开的盲盒详情，更新其信息
      if (modalGood && modalGood.id === boxId) {
        // 从刷新后的列表中找到当前盲盒
        const updatedBox = blindBoxes.find(box => box.id === boxId);
        if (updatedBox) {
          setModalGood(updatedBox);
        }
      }
      
      // 显示结果
      setResultModal(revealData)
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
            onClick={() => handleOpenDetail(box)}
          >
            <img src={box.imageUrl} alt={box.name} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
            <div className="goods-name">{box.name}</div>
            <div className="goods-price">￥{box.price}</div>
            <div className="goods-stock">库存：{box.stock}</div>
          </div>
        ))}
      </div>

      {/* 商品详情弹窗 - 修改为左右布局 */}
      {modalGood && (
        <div
          className="goods-modal-mask"
          onClick={() => setModalGood(null)}
        >
          <div
            className="goods-modal"
            onClick={e => e.stopPropagation()}
            style={{ width: '800px', maxWidth: '90vw', padding: '20px' }}
          >
            {/* 左右布局容器 */}
            <div style={{ display: 'flex', marginBottom: '20px' }}>
              {/* 左侧图片 */}
              <div style={{ flex: '0 0 300px', marginRight: '20px' }}>
                <img
                  src={modalGood.imageUrl}
                  alt={modalGood.name}
                  style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>

              {/* 右侧信息 */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                    <button
                      className="close-btn"
                      onClick={() => setModalGood(null)}
                      style={{ padding: '5px 10px' }}
                    >返回</button>
                  </div>
                  <h3 style={{ margin: '10px 0', fontSize: '24px' }}>{modalGood.name}</h3>
                  <div style={{ color: 'red', fontWeight: 'bold', fontSize: '20px', margin: '10px 0' }}>￥{modalGood.price}</div>
                  <div style={{ margin: '10px 0' }}>库存：{modalGood.stock}</div>
                  <p style={{ margin: '15px 0', lineHeight: '1.5' }}>{modalGood.description}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                  {modalGood.stock > 0 ? (
                    <button
                      onClick={() => handlePurchase(modalGood.id)}
                      disabled={loading}
                      style={{ width: '180px', padding: '10px 0' }}
                    >
                      {loading ? '购买中...' : '购买'}
                    </button>
                  ) : (
                    <button
                      disabled
                      style={{
                        backgroundColor: '#cccccc',
                        cursor: 'not-allowed',
                        width: '180px',
                        padding: '10px 0'
                      }}
                    >
                      已售罄
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 底部款式预览区域 */}
            {boxItems.length > 0 && (
              <div className="items-preview" style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>可能获得的款式：</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'flex-start' }}>
                  {boxItems.map(item => (
                    <div key={item.id} style={{ textAlign: 'center', width: '100px' }}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                      <div style={{ fontSize: '12px', marginTop: '5px' }}>{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 抽取结果弹窗 */}
      {resultModal && (
        <div
          className="goods-modal-mask"
          onClick={() => {
            setResultModal(null);
            // 关闭结果弹窗时，如果当前有打开的盲盒详情，刷新其信息
            if (modalGood) {
              fetchBoxDetail(modalGood.id);
              // 更新当前打开的盲盒信息
              const updatedBox = blindBoxes.find(box => box.id === modalGood.id);
              if (updatedBox) {
                setModalGood(updatedBox);
              }
            }
          }}
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
              onClick={() => {
                setResultModal(null);
                // 关闭结果弹窗时，如果当前有打开的盲盒详情，刷新其信息
                if (modalGood) {
                  fetchBoxDetail(modalGood.id);
                  // 更新当前打开的盲盒信息
                  const updatedBox = blindBoxes.find(box => box.id === modalGood.id);
                  if (updatedBox) {
                    setModalGood(updatedBox);
                  }
                }
              }}
            >关闭</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Goods