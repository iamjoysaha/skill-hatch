import { Server } from 'socket.io'
import dotenv from 'dotenv'
dotenv.config()

let io = null
function configSocketIO(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    })

    const userSocketMap = {}

    io.on('connection', (socket) => {
        console.log(`::: User connected! Socket ID: ${socket.id}`)

        socket.on('join', ({ userId }) => {
            if (!userId) {
                console.warn(`⚠️  Received 'join' with null or undefined userId from socket ${socket.id}`)
                return
            }

            userSocketMap[userId] = socket.id
            console.log(`\n✅ User ${userId} joined with socket ID: ${socket.id}\n`)
        })

        socket.on('send_message', ({ from, to, text, timestamp }) => {
            if (!from || !to) 
                return

            const receiverSocketId = userSocketMap[to]
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receive_message', { from, to, text, timestamp })
            }
        })

        socket.on('typing', ({ from, to }) => {
            const receiverSocketId = userSocketMap[to]
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('typing', { from })
            }
        })

        socket.on('stop_typing', ({ from, to }) => {
            const receiverSocketId = userSocketMap[to]
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('stop_typing', { from })
            }
        })

        socket.on('disconnect', () => {
            Object.keys(userSocketMap).forEach(userId => {
                if (userSocketMap[userId] === socket.id) {
                    delete userSocketMap[userId]
                }
            })
            console.log(`::: User disconnected: ${socket.id}`)
        })
    })
}

export {
    configSocketIO,
    io,
}
