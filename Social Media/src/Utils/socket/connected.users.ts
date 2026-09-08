const connectedUsers= new Map<string, Set<string>>()

export const addconnection=(userId:string, socketId:string):boolean =>{
    const sockets=connectedUsers.get(userId)

    if(!sockets){
        connectedUsers.set(userId, new Set ([socketId]))

        return true
    }
    sockets.add(socketId)

    return false;

}

export const removeConnection= (userId:string, socketId:string):boolean =>{
    const sockets=connectedUsers.get(userId)

    if(!sockets)
        return true

    sockets.delete(socketId)
    if(sockets.size >0) return false
    connectedUsers.delete(userId)
    return true


}

export const isuseronline =(userId:string):boolean =>{
    return connectedUsers.has(userId)
}

export const getOnlineUserIds =():string[]=>{
    return [...connectedUsers.keys()]
}

export const getusersocketcount=(userId:string):number=>{
        return connectedUsers.get(userId)?.size ?? 0;


}
