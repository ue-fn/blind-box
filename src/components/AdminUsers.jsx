import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 管理员用户管理页面
 * @param {Object} props - 组件属性
 * @param {boolean} props.isAdmin - 是否是管理员
 * @returns {JSX.Element} 管理员用户管理页面
 */
function AdminUsers({ isAdmin }) {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  // 在组件挂载时检查是否是管理员
  useEffect(() => {
    if (parseInt(localStorage.getItem('userId')) !== 11) {
      navigate('/profile')
    } else {
      fetchUsers()
    }
  }, [navigate])

  // 获取所有用户
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:7001/user/all')
      const data = await response.json()
      if (data.success) {
        setUsers(data.data)
      } else {
        setError(data.message || '获取用户列表失败')
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
      setError('获取用户列表失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 删除用户
  const handleDeleteUser = async (username) => {
    if (!confirm(`确定要删除用户 ${username} 吗？`)) return

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:7001/user/delete?username=${username}`)
      const data = await response.json()
      if (data.success) {
        alert('删除成功')
        fetchUsers() // 重新获取列表
      } else {
        alert(data.message || '删除失败')
      }
    } catch (error) {
      console.error('删除用户失败:', error)
      alert('删除失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 搜索过滤
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>用户管理</h2>

      {/* 搜索栏 */}
      <div style={{ marginBottom: '20px', width: '100%', maxWidth: '800px' }}>
        <input
          type="text"
          placeholder="搜索用户名"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
            fontSize: '14px'
          }}
        />
      </div>

      {loading ? (
        <div>加载中...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>ID</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>用户名</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>头像</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>注册时间</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid #e8e8e8' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '12px 8px', textAlign: 'center' }}>暂无用户数据</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid #e8e8e8' }}>{user.id}</td>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid #e8e8e8' }}>{user.username}</td>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid #e8e8e8' }}>
                      <img 
                        src={user.avatar} 
                        alt={user.username} 
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
                      />
                    </td>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid #e8e8e8' }}>
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid #e8e8e8' }}>
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        style={{
                          backgroundColor: '#ff4d4f',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                        disabled={user.id === 11} // 禁止删除管理员账号
                      >
                        {user.id === 11 ? '管理员' : '删除'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminUsers