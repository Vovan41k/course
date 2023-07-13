const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '../session.json')
const jsonText = fs.readFileSync(filePath)
const dSessions = JSON.parse(jsonText)
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
    fs.writeFileSync(filePath, JSON.stringify(dSessions, null, 2))
}
module.exports ={
    getSession,
    updateSession
}