import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GoodEditModal from './GoodEditModal'
import '../App.css' // 引入全局样式
import './AdminGoods.css' // 引入组件样式

/**
 * 管理员商品管理组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.isAdmin - 是否是管理员
 * @returns {JSX.Element} 商品管理界面
 */
function AdminGoods({ isAdmin }) {
  const navigate = useNavigate()
  const [goods, setGoods] = useState([])
  const [modalType, setModalType] = useState(null) // 'add' or 'edit'
  const [editGood, setEditGood] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  // 在组件挂载时检查是否是管理员
  useEffect(() => {
    if (parseInt(localStorage.getItem('userId')) !== 11) {
      navigate('/')
    } else {
      fetchBlindBoxes()
    }
  }, [navigate])

  const fetchBlindBoxes = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:7001/blind-box/all')
      const data = await response.json()
      console.log('获取盲盒列表:', data)
      setGoods(data.data)
    } catch (error) {
      console.error('获取盲盒列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 权限检查已经在useEffect中处理，这里不再需要额外的检查
  // if (!isAdmin) return <div>无权限</div>

  // 删除盲盒
  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个盲盒吗？')) return

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:7001/blind-box/delete/${id}`, {
        method: 'Post'
      })
      const data = await response.json()
      if (data.success) {
        alert('删除成功')
        fetchBlindBoxes() // 重新获取列表
      } else {
        alert(data.message || '删除失败')
      }
    } catch (error) {
      console.error('删除盲盒失败:', error)
      alert('删除失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 打开弹窗
  const openModal = (type, good = null) => {
    setModalType(type)
    setEditGood(good)
  }

  // 保存盲盒
  const handleSave = async (formData) => {
    try {
      setLoading(true)

      let url = 'http://localhost:7001/blind-box';
      let method = 'POST';
      
      // 如果是编辑模式，使用PUT请求更新盲盒
      if (modalType === 'edit' && formData.id) {
        url = `http://localhost:7001/blind-box/${formData.id}`;
        method = 'PUT';
        console.log('更新盲盒:', formData.id);
      }

      // 将formData转换为JSON格式发送
      console.log('发送的数据:', JSON.stringify(formData));
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        alert(modalType === 'add' ? '添加成功' : '更新成功');
        fetchBlindBoxes(); // 重新获取列表
      } else {
        alert(data.message || (modalType === 'add' ? '添加失败' : '更新失败'));
      }
    } catch (error) {
      console.error('保存盲盒失败:', error);
      alert('操作失败，请稍后重试');
    } finally {
      setLoading(false);
      setModalType(null);
      setEditGood(null);
    }
  }

  // 搜索过滤
  const filteredGoods = goods.filter(box =>
    box.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-goods-container">
      <div className="admin-header">
        <h2 className="admin-title">盲盒管理</h2>
        <div className="admin-controls">
          {/* 搜索栏 */}
          <input
            type="text"
            placeholder="搜索盲盒"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <button
            onClick={() => openModal('add')}
            className="add-button"
          >
            新增盲盒
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <p className="loading-text">加载中...</p>
        </div>
      ) : (
        <div className="goods-list">
          {filteredGoods.map(box => (
            <div key={box.id} className="goods-card">
              <img src={box.imageUrl} alt={box.name} />
              <div className="goods-name">{box.name}</div>
              <div className="goods-price">￥{box.price}</div>
              <div className="goods-stock">库存：{box.stock}</div>
              <div className="goods-description">{box.description}</div>

              <div className="goods-actions">
                <button
                  className="edit-button"
                  onClick={() => openModal('edit', box)}
                >
                  编辑
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(box.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default AdminGoods