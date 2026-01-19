import { io } from 'socket.io-client'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000'

let socket = null

export const connectSocket = (token) => {
  if (!socket) {
    socket = io(WS_URL, {
      auth: { token }
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected')
    })

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })

    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket

export default { connectSocket, disconnectSocket, getSocket }
