import { useState } from 'react'
import { goodsList } from '../constants'
import GoodEditModal from './GoodEditModal'

/**
 * 管理员商品管理组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.isAdmin - 是否是管理员
 * @returns {JSX.Element} 商品管理界面
 */
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

export default AdminGoods