// 导入axios配置
import './utils/axios'
import { BrowserRouter as Router } from 'react-router-dom'
import AppContent from './components/AppContent'
import './App.css'
/**
 * 主应用组件
 * 使用Router包装AppContent组件，提供路由功能
 * @returns {JSX.Element} 应用根组件
 */

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
