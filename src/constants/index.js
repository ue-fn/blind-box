import avatar1 from '../assets/avatars/sea.jpg'
import avatar2 from '../assets/avatars/flower.jpg'
import avatar3 from '../assets/avatars/snow.jpg'
import avatar4 from '../assets/avatars/moon.jpg'

import txz19 from '../assets/goods/txz19.jpg'
import txz26 from '../assets/goods/txz26.jpg'
import txz27 from '../assets/goods/txz27.jpg'
import txz31 from '../assets/goods/txz31.jpg'
import txzyj from '../assets/goods/txzyj.jpg'

// 头像列表
export const avatarList = [avatar1, avatar2, avatar3, avatar4]

// 商品列表
export const goodsList = [
  { id: 1, name: '通行证19.0', price: 25, img: txz19, stock: 100, desc: '通行证19.0！' },
  { id: 2, name: '通行证26.0', price: 25, img: txz26, stock: 100, desc: '通行证26.0' },
  { id: 3, name: '通行证27.0', price: 25, img: txz27, stock: 100, desc: '通行证27.0' },
  { id: 4, name: '通行证31.0', price: 25, img: txz31, stock: 100, desc: '通行证31.0' },
  { id: 5, name: '通行证遗君', price: 25, img: txzyj, stock: 100, desc: '通行证遗君' },
]

// 订单状态映射
export const OrderStatusMap = {
  0: '未发货',
  1: '待收货',
  2: '已完成'
}