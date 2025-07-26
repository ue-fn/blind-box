import React, { useState, useEffect, useRef } from 'react';
import './Community.css';
import { useNavigate } from 'react-router-dom';

/**
 * 社区组件（玩家秀）
 * @returns {JSX.Element} 社区页面
 */
function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: '', image: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const fileInputRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false); // 管理员状态

  // 获取帖子列表
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:7001/posts', {
        method: 'GET'
      });
      const RESdata = await response.json();
      console.log('获取后端:', RESdata);
      // 按点赞数排序，不再考虑置顶状态
      const data = RESdata.data.posts
      setPosts(data.sort((a, b) => b.likes - a.likes));
    } catch (err) {
      setError('获取帖子失败');
      console.error('获取帖子失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    checkAdminStatus();
  }, []);

  // 检查管理员状态
  const checkAdminStatus = async () => {
    setIsAdmin(false)
    // 从localStorage获取userId
    const userId = localStorage.getItem('userId')
    if (userId === '11') {
      setIsAdmin(true)
    }
  };

  // 处理图片上传
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 限制
        alert('图片大小不能超过 5MB');
        return;
      }
      setNewPost(prev => ({ ...prev, image: file }));
    }
  };

  // 发布帖子
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim() && !newPost.image) {
      alert('请输入内容或上传图片');
      return;
    }

    try {

      const userId = localStorage.getItem('userId')
      if (!userId) {
        alert('请先登录')
        return
      }

      setIsLoading(true);

      console.log('发布帖子:', {
        userId: parseInt(userId),
        content: newPost.content,
        image: newPost.image
      })
      const formData = new FormData();

      // 2. 添加文本字段
      formData.append('userId', parseInt(userId));
      formData.append('content', newPost.content);

      // 3. 添加文件
      // file是从input[type="file"]元素获取的File对象
      if (newPost.image) {
        formData.append('image', newPost.image);
      }

      // 4. 发送请求 - 重要：不要手动设置Content-Type
      await fetch('http://127.0.0.1:7001/posts', {
        method: 'POST',
        body: formData
        // 不要设置Content-Type，让浏览器自动设置带boundary的multipart/form-data
      });

      setNewPost({ content: '', image: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchPosts(); // 刷新帖子列表
    } catch (err) {
      setError('发布失败');
      console.error('发布失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 点赞功能
  const handleLike = async (postId) => {
    try {
      // 先在本地更新点赞状态，提供即时反馈


      // 然后发送请求到服务器
      const response = await fetch(`http://127.0.0.1:7001/posts/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId, userId: parseInt(localStorage.getItem('userId')) })
      });
      const data = await response.json();
      console.log('响应:', data);
      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post.id === postId) {
            // 如果已经点赞，则不增加点赞数，只保持状态
            // 如果未点赞，则增加点赞数并更新状态
            const newLikeCount = data.success ? post.likeCount + 1 : post.likeCount;
            return { ...post, hasLiked: true, likeCount: newLikeCount };
          }
          return post;
        });
      });
      // 不再每次点赞后都刷新所有帖子
      // fetchPosts(); 
    } catch (err) {
      console.error('点赞失败:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };


  return (
    <div className="community-container">
      {/* 右侧功能按钮组 - 真正的悬浮按钮 */}
      <div className="floating-button" style={{ right: '10%' }}>
        <div>
          {/* 发帖按钮 */}
          <button
            onClick={() => setShowPostModal(true)}
            className="post-button"
          >
            <span className="button-icon">➕️</span>
            <span>发帖</span>
          </button>

          {/* 刷新按钮 */}
          <button
            onClick={() => window.location.reload()}
            className="refresh-button"
          >
            <span className="button-icon">🔄</span>
            <span>刷新</span>
          </button>

          {/* 回到顶部按钮 */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="top-button"
          >
            <span className="button-icon">⬆️</span>
            <span>回到顶部</span>
          </button>
        </div>
      </div>

      {/* 发帖弹窗 */}
      {showPostModal && (
        <div
          className="goods-modal-mask"
          onClick={() => setShowPostModal(false)}
        >
          <div
            className="goods-modal"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '600px', width: '90%' }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>发布新帖子</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
              setShowPostModal(false);
            }}>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="分享你的开箱体验..."
                style={{ width: '100%', minHeight: '200px', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{newPost.image ? '更换图片' : '上传图片'}</span>
                </label>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ backgroundColor: '#4a90e2', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>{isLoading ? '发布中...' : '发布'}</span>
                </button>
              </div>
              {newPost.image && (
                <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>已选择图片: {newPost.image.name}</p>
                </div>
              )}
            </form>
            <button
              className="close-btn"
              onClick={() => setShowPostModal(false)}
            >×</button>
          </div>
        </div>
      )}

      {/* 帖子列表 */}
      <div className="posts-container">
        {error && (
          <div className="error-message">{error}</div>
        )}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">加载中...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-container">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2 2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="empty-text">还没有人发帖，快来分享你的开箱体验吧！</p>
            <button
              onClick={() => setShowPostModal(true)}
              className="create-post-button"
            >
              发布第一个帖子
            </button>
          </div>
        ) : posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-content">
              <div className="post-header">
                <img
                  src={post.author.avatar}
                  alt={post.author.username}
                  className="post-avatar"
                />
                <div className="post-author-info">
                  <h3 className="post-author-name">{post.author.username}</h3>
                  <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="post-content-body">
                <p className="post-text">{post.content}</p>
                {post.image && (
                  <div className="post-image-container">
                    <img
                      src={`http://localhost:7001${post.image}`}
                      alt="帖子图片"
                      className="post-image"
                      onClick={() => window.open(post.image, '_blank')}
                    />
                  </div>
                )}
                <div className="post-actions">
                  <div className="post-actions-group">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`like-button ${post.hasLiked ? 'active' : ''}`}
                    >
                      <svg className="action-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{post.likeCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;