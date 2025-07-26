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
  const initialForm = {
    name: '',
    price: '',
    imageUrl: '',
    stock: '',
    description: '',
    items: [{
      name: '',
      description: '',
      imageUrl: '',
      quantity: ''
    }]
  }
  
  const [form, setForm] = useState(good || initialForm)
  const [imagePreview, setImagePreview] = useState(good?.imageUrl || '')
  const [itemImagePreviews, setItemImagePreviews] = useState((good?.items || []).map(item => item.imageUrl || ''))
  
  // 确保items数组存在
  if (!form.items) {
    setForm(prev => ({
      ...prev,
      items: [{
        name: '',
        description: '',
        imageUrl: '',
        quantity: ''
      }]
    }))
    setItemImagePreviews([''])
  }
  
  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 表单验证
    if (!form.name.trim()) {
      alert('请输入盲盒名称')
      return
    }
    
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      alert('请输入有效的价格')
      return
    }
    
    if (!form.imageUrl.trim()) {
      alert('请输入图片URL')
      return
    }
    
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) {
      alert('请输入有效的库存数量')
      return
    }
    
    // 验证款式信息
    if (!form.items || form.items.length === 0) {
      alert('请至少添加一个款式')
      return
    }
    
    // 验证每个款式的必填字段
    for (let i = 0; i < form.items.length; i++) {
      const item = form.items[i]
      if (!item.name.trim()) {
        alert(`款式${i+1}：请输入款式名称`)
        return
      }
      if (!item.description.trim()) {
        alert(`款式${i+1}：请输入款式描述`)
        return
      }
      if (!item.imageUrl.trim()) {
        alert(`款式${i+1}：请输入图片URL`)
        return
      }
      if (!item.quantity || isNaN(item.quantity) || Number(item.quantity) <= 0) {
        alert(`款式${i+1}：请输入有效的数量`)
        return
      }
    }
    
    // 提交表单
    onSave({
      ...form,
      id: good?.id,
      price: Number(form.price),
      stock: Number(form.stock),
      items: form.items.map(item => ({
        ...item,
        quantity: Number(item.quantity)
      }))
    })
  }
  
  // 处理图片URL变化，更新预览
  const handleImageUrlChange = (url) => {
    setForm({ ...form, imageUrl: url })
    setImagePreview(url)
  }
  
  // 处理款式图片URL变化，更新预览
  const handleItemImageUrlChange = (index, url) => {
    const newItems = [...form.items]
    newItems[index].imageUrl = url
    setForm({ ...form, items: newItems })
    
    const newPreviews = [...itemImagePreviews]
    newPreviews[index] = url
    setItemImagePreviews(newPreviews)
  }
  
  // 处理款式字段变化
  const handleItemChange = (index, field, value) => {
    const newItems = [...form.items]
    newItems[index][field] = value
    setForm({ ...form, items: newItems })
  }
  
  // 添加新款式
  const addItem = () => {
    const newItems = [...form.items, {
      name: '',
      description: '',
      imageUrl: '',
      quantity: ''
    }]
    setForm({ ...form, items: newItems })
    setItemImagePreviews([...itemImagePreviews, ''])
  }
  
  // 删除款式
  const removeItem = (index) => {
    if (form.items.length <= 1) {
      alert('至少保留一个款式')
      return
    }
    
    const newItems = [...form.items]
    newItems.splice(index, 1)
    setForm({ ...form, items: newItems })
    
    const newPreviews = [...itemImagePreviews]
    newPreviews.splice(index, 1)
    setItemImagePreviews(newPreviews)
  }
  
  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    boxSizing: 'border-box'
  }
  
  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '10px'
  }
  
  return (
    <div className="goods-modal-mask" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="goods-modal" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
          {type === 'add' ? '新增盲盒' : '编辑盲盒'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>盲盒名称</label>
            <input 
              style={inputStyle}
              placeholder="请输入盲盒名称" 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>价格</label>
            <input 
              style={inputStyle}
              placeholder="请输入价格" 
              type="number" 
              min="0"
              step="0.01"
              value={form.price} 
              onChange={e => setForm({ ...form, price: e.target.value })} 
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>图片URL</label>
            <input 
              style={inputStyle}
              placeholder="请输入图片URL" 
              value={form.imageUrl} 
              onChange={e => handleImageUrlChange(e.target.value)} 
            />
            {imagePreview && (
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="预览图" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }} 
                  onError={() => setImagePreview('')}
                />
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>库存</label>
            <input 
              style={inputStyle}
              placeholder="请输入库存数量" 
              type="number" 
              min="0"
              value={form.stock} 
              onChange={e => setForm({ ...form, stock: e.target.value })} 
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>描述</label>
            <textarea 
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              placeholder="请输入盲盒描述" 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
            />
          </div>
          
          {/* 款式管理 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '18px' }}>盲盒款式</label>
              <button 
                type="button"
                onClick={addItem}
                style={{ 
                  backgroundColor: '#4CAF50', 
                  color: 'white', 
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                添加款式
              </button>
            </div>
            
            {form.items.map((item, index) => (
              <div key={index} style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '15px', 
                marginBottom: '15px',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>款式 {index + 1}</h4>
                  <button 
                    type="button"
                    onClick={() => removeItem(index)}
                    style={{ 
                      backgroundColor: '#f44336', 
                      color: 'white', 
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    删除
                  </button>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>款式名称</label>
                  <input 
                    style={inputStyle}
                    placeholder="请输入款式名称" 
                    value={item.name} 
                    onChange={e => handleItemChange(index, 'name', e.target.value)} 
                  />
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>款式描述</label>
                  <textarea 
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder="请输入款式描述" 
                    value={item.description} 
                    onChange={e => handleItemChange(index, 'description', e.target.value)} 
                  />
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>图片URL</label>
                  <input 
                    style={inputStyle}
                    placeholder="请输入图片URL" 
                    value={item.imageUrl} 
                    onChange={e => handleItemImageUrlChange(index, e.target.value)} 
                  />
                  {itemImagePreviews[index] && (
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                      <img 
                        src={itemImagePreviews[index]} 
                        alt="款式预览图" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '150px', 
                          objectFit: 'contain',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }} 
                        onError={() => {
                          const newPreviews = [...itemImagePreviews]
                          newPreviews[index] = ''
                          setItemImagePreviews(newPreviews)
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>数量</label>
                  <input 
                    style={inputStyle}
                    placeholder="请输入数量" 
                    type="number" 
                    min="1"
                    value={item.quantity} 
                    onChange={e => handleItemChange(index, 'quantity', e.target.value)} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="button"
              onClick={onClose} 
              style={{ ...buttonStyle, backgroundColor: '#f5f5f5', color: '#333' }}
            >
              取消
            </button>
            <button 
              type="submit"
              style={{ ...buttonStyle, backgroundColor: '#4CAF50', color: 'white' }}
            >
              保存
            </button>
          </div>
        </form>
        
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default GoodEditModal