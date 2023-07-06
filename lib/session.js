const dSessions = {

}
const getSession = (chatId)=>{
    if(!dSessions[chatId]){
        dSessions[chatId] = {
            chatId, 
            number:1,
            answers:{},
        }
    }
    return dSessions[chatId]
}
const updateSession = (chatId, params)=>{
    dSessions[chatId] = {
        ...dSessions[chatId],
        ...params,
    }
}
module.exports ={
    getSession,
    updateSession
}