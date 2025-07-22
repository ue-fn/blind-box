import { useState } from 'react'

/**
 * 商品编辑弹窗组件
 * @param {Object} props - 组件属性
 * @param {string} props.type - 弹窗类型 ('add' 或 'edit')
 * @param {Object} props.good - 商品信息
 * @param {Function} props.onSave - 保存回调函数
 * @param {Function} props.onClose - 关闭回调函数
 * @returns {JSX.Element} 商品编辑弹窗
 */
function GoodEditModal({ type, good, onSave, onClose }) {
  const [form, setForm] = useState(
    good || { name: '', price: '', img: '', stock: '', desc: '' }
  )
  
  return (
    <div className="goods-modal-mask">
      <div className="goods-modal" style={{ minWidth: 400 }}>
        <h3>{type === 'add' ? '新增盲盒' : '编辑盲盒'}</h3>
        <input 
          placeholder="名称" 
          value={form.name} 
          onChange={e => setForm({ ...form, name: e.target.value })} 
        />
        <input 
          placeholder="价格" 
          type="number" 
          value={form.price} 
          onChange={e => setForm({ ...form, price: e.target.value })} 
        />
        <input 
          placeholder="图片URL" 
          value={form.img} 
          onChange={e => setForm({ ...form, img: e.target.value })} 
        />
        <input 
          placeholder="库存" 
          type="number" 
          value={form.stock} 
          onChange={e => setForm({ ...form, stock: e.target.value })} 
        />
        <input 
          placeholder="描述" 
          value={form.desc} 
          onChange={e => setForm({ ...form, desc: e.target.value })} 
        />
        <button onClick={() => onSave({ ...form, id: good?.id || Date.now() })}>保存</button>
        <button onClick={onClose} className="close-btn">取消</button>
      </div>
    </div>
  )
}

export default GoodEditModal