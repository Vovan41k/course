require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TOKEN
const bot = new TelegramBot(token, { polling: true })
const course = require('./course.json')
const { getSession, updateSession } = require('./lib/session')
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Какой курс', {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text:'Создание Telegram бота на Node.js',
                        callback_data:'f',
                    }
                ],
                [
                    {
                        text:'Другой',
                        callback_data:'a'
                    }
                ]
            ]
        }
    })
})
bot.on('callback_query', (query)=>{
    const [prefix] = query.data
    const chatId = query.message.chat.id
    const {number} = getSession(chatId)
    if(prefix==='f'){
        bot.sendMessage(chatId, `Вы на уроке номер ${number}`)
    } else if(prefix==='a'){
        bot.sendMessage(chatId, 'Других курсов пока нет.')
    }
})
bot.onText(/\/info/, (msg) => {
    const {number} = getSession(msg.chat.id)
    const lesson = course.lessons.find(lesson => lesson.number === number)
    bot.sendMessage(msg.chat.id, `Вы на уроке ${lesson.number}. Тема урока: "${lesson.theme}".`)
})
bot.onText(/\/video/, (msg) => {
    const {number} = getSession(msg.chat.id)
    const lesson = course.lessons.find(lesson => lesson.number === number)
    bot.sendMessage(msg.chat.id, lesson.url)
})
bot.onText(/\/task/, (msg) => {
    const {number} = getSession(msg.chat.id)
    const lesson = course.lessons.find(lesson => lesson.number === number)
    bot.sendMessage(msg.chat.id, lesson.task)
})
bot.onText(/\/prev/, (msg)=>{
    let {number} = getSession(msg.chat.id)
    if(number !== 1){
        number-=1
        updateSession(msg.chat.id, {number})
        bot.sendMessage(msg.chat.id, `Вы на уроке номер ${number}`)
    } else {
        bot.sendMessage(msg.chat.id, 'Вы на первом уроке.')
    }
})
bot.onText(/\/next/, (msg)=>{
    try {        
        let {number} = getSession(msg.chat.id)
        if(number<course.lessons.length){
            number+=1
            updateSession(msg.chat.id, {number})
            bot.sendMessage(msg.chat.id, `Вы на уроке номер ${number}`)
        } else {
        bot.sendMessage(msg.chat.id, 'Вы на последнем уроке, курс окончен.')
    }
} catch (error) {
    console.log(error)
}
})