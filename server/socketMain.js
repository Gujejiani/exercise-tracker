// mostly cluster code here


const socketMain = (io)=>{
    io.on("connection", (socket) => {
        const auth = socket.handshake.auth;
        if(auth.token === '23wdxsaxsa23wadsdssa'){
            // valid nodeClient
            socket.join('nodeClient') // this client is a nodeClient
        } else if (auth.token ==='sdsdssdsxs'){
            // valid react client 
            socket.join('reactClient') // this client is a reactClient
        }else {
            console.log('You have been disconected')
            socket.disconnect(true)
            
        }
        console.log('token ', auth.token)
        console.log(`Worker ${process.pid} socket ${socket.id} connected`)
        io.emit("welcome", "Welcome to socket io server");
        socket.on("perfData", (data) => {   
            console.log('Tick...')
            console.log(data)

            io.to('reactClient').emit('perfData', data)


        })
        /* ... */
      });
}

module.exports = socketMain;