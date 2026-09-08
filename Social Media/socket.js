const client=io("http://127.0.0.1:3001",{
    auth:{
        authorization:"hello from handshake",
    },
})

client.on("connect",()=>{
    console.log("server is established connection successfully")
})

client.emit("say hi","hello from socket",(res)=>{
    console.log(res)
})

client.on("product",(data,callback)=>
{
    console.log(data)
    callback("I received your message")
})