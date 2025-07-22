import { useState, useEffect, useRef } from 'react';
import { request } from '../utils/axios';
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
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const fileInputRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false); // 管理员状态

  // 获取帖子列表
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await request.get('/api/posts');
      setPosts(response.data.sort((a, b) => b.likes - a.likes)); // 按点赞数排序
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
    try {
      const response = await request.get('/api/user/status');
      setIsAdmin(response.data.isAdmin);
    } catch (err) {
      console.error('获取用户状态失败:', err);
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
      setIsLoading(true);
      const formData = new FormData();
      formData.append('content', newPost.content);
      if (newPost.image) {
        formData.append('image', newPost.image);
      }

      await request.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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
      await request.post(`/api/posts/${postId}/like`);
      fetchPosts(); // 刷新帖子列表以更新点赞数
    } catch (err) {
      console.error('点赞失败:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  // 切换评论显示状态
  const toggleComments = async (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    if (!showComments[postId]) {
      try {
        const response = await request.get(`/api/posts/${postId}/comments`);
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { ...post, comments: response.data };
          }
          return post;
        }));
      } catch (err) {
        console.error('获取评论失败:', err);
      }
    }
  };

  // 发表评论
  const handleComment = async (postId) => {
    if (!comment.trim()) {
      alert('请输入评论内容');
      return;
    }
    try {
      const payload = { content: comment };
      if (replyTo) {
        payload.parentId = replyTo.id;
        payload.replyToUsername = replyTo.author.username;
      }
      await request.post(`/api/posts/${postId}/comments`, payload);
      setComment('');
      setReplyTo(null);
      const response = await request.get(`/api/posts/${postId}/comments`);
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return { ...post, comments: response.data };
        }
        return post;
      }));
    } catch (err) {
      console.error('发表评论失败:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  // 处理回复
  const handleReply = (comment) => {
    setReplyTo(comment);
    setComment(`回复 @${comment.author.username}: `);
  };

  // 取消回复
  const cancelReply = () => {
    setReplyTo(null);
    setComment('');
  };

  // 置顶/取消置顶帖子
  const handleToggleSticky = async (postId) => {
    try {
      await request.post(`/api/posts/${postId}/sticky`);
      fetchPosts();
    } catch (err) {
      console.error('操作失败:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* 发帖表单 */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow p-6">
        <textarea
          value={newPost.content}
          onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
          placeholder="分享你的开箱体验..."
          className="w-full p-4 border rounded-lg mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex items-center justify-between">
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
            className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {newPost.image ? '更换图片' : '上传图片'}
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? '发布中...' : '发布'}
          </button>
        </div>
        {newPost.image && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">已选择图片: {newPost.image.name}</p>
          </div>
        )}
      </form>

      {/* 帖子列表 */}
      <div className="space-y-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
        )}
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow p-6">
            {post.isSticky && (
              <div className="text-orange-500 font-semibold mb-2">📌 置顶</div>
            )}
            <div className="flex items-start space-x-4">
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{post.author.username}</h3>
                  <span className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-gray-800">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="帖子图片"
                    className="mt-4 rounded-lg max-h-96 object-cover"
                  />
                )}
                <div className="mt-4 flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 ${post.hasLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{post.likes}</span>
                  </button>
                  <button 
                     onClick={() => toggleComments(post.id)}
                     className="text-gray-500 hover:text-blue-500 transition-colors flex items-center space-x-1"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                     </svg>
                     <span>{post.comments?.length || 0}</span>
                   </button>
                   {isAdmin && (
                     <button
                       onClick={() => handleToggleSticky(post.id)}
                       className="text-gray-500 hover:text-yellow-500 transition-colors"
                     >
                       <svg className="w-5 h-5" fill={post.isSticky ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                       </svg>
                     </button>
                   )}
                 </div>

                 {/* 评论区域 */}
                 {showComments[post.id] && (
                   <div className="mt-4 border-t pt-4">
                     <div className="mb-4">
                       <div className="relative">
                          {replyTo && (
                            <div className="absolute -top-6 left-0 flex items-center space-x-2 text-sm text-gray-500">
                              <span>回复 @{replyTo.author.username}</span>
                              <button
                                onClick={cancelReply}
                                className="text-red-500 hover:text-red-600"
                              >
                                取消回复
                              </button>
                            </div>
                          )}
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={replyTo ? `回复 @${replyTo.author.username}...` : '发表评论...'}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleComment(post.id)}
                            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            {replyTo ? '回复' : '发表评论'}
                          </button>
                        </div>
                     </div>
                     <div className="space-y-4">
                       {post.comments?.map(comment => (
                         <div key={comment.id} className="flex items-start space-x-3">
                           <img
                             src={comment.author.avatar}
                             alt={comment.author.username}
                             className="w-8 h-8 rounded-full"
                           />
                           <div className="flex-1">
                             <div className="flex items-center justify-between">
                               <span className="font-medium text-sm">{comment.author.username}</span>
                               <span className="text-gray-500 text-xs">{new Date(comment.createdAt).toLocaleString()}</span>
                             </div>
                             <p className="text-sm mt-1">
                                {comment.replyToUsername && (
                                  <span className="text-blue-500">@{comment.replyToUsername} </span>
                                )}
                                {comment.content}
                              </p>
                              <div className="mt-2 flex items-center space-x-4 text-xs">
                                <button
                                  onClick={() => handleReply(comment)}
                                  className="text-gray-500 hover:text-blue-500 transition-colors"
                                >
                                  回复
                                </button>
                              </div>
                            </div>
                          </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             </div>
           </div>
         ))}
       </div>
     </div>
   );
}

export default Community;