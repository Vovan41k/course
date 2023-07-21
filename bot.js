require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TOKEN
const bot = new TelegramBot(token, { polling: true })
const course = require('./course.json')
const { getSession, updateSession } = require('./lib/session')
const getCourseButtons = (number, course)=>{
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: (number!=1)?'<':'-' ,
                        callback_data: 'p'
                    },
                    {
                        text: 'Инфо',
                        callback_data: 'i',
                    },
                    {
                        text: (number!=course.lessons.length)?'>':'-',
                        callback_data: 'n',
                    }
                ].filter(button=> button.text !== '-'),
                [
                    {
                        text: 'Задание',
                        callback_data: 't',
                    },
                    {
                        text: 'Видео',
                        callback_data: 'v',
                    }
                ]
            ]
        }
    }
}
bot.onText(/\/start/, (msg) => {
    let { number } = getSession(msg.chat.id)
    // const firstRow = []
    // if(number!=1){
    //     firstRow.push({
    //         text: '<',
    //         callback_data: 'p'
    //     })
    // }
    bot.sendMessage(msg.chat.id, 'Создание Telegram бота на Node.js', getCourseButtons(number, course))
})
bot.on('callback_query', (query) => {
    try {
        const [prefix] = query.data
        const chatId = query.message.chat.id
        let { number } = getSession(chatId)
        const lesson = course.lessons.find(lesson => lesson.number === number)
        if (prefix === 'i') {
            bot.sendMessage(chatId, `Вы на уроке ${lesson.number}. Тема урока: "${lesson.theme}".`)
        } else if (prefix === 't') {
            bot.sendMessage(chatId, lesson.task)
        } else if (prefix === 'v') {
            bot.sendMessage(chatId, lesson.url)
        } else if (prefix === 'n') {
            if (number < course.lessons.length) {
                number += 1
                updateSession(chatId, { number })
                bot.sendMessage(chatId, `Вы на уроке номер ${number}`, getCourseButtons(number, course))
            } else {
                bot.sendMessage(chatId, 'Вы на последнем уроке, курс окончен.')
            }
        } else if (prefix === 'p') {
            if (number !== 1) {
                number -= 1
                updateSession(chatId, { number })
                bot.sendMessage(chatId, `Вы на уроке номер ${number}`, getCourseButtons(number, course))
            } else {
                bot.sendMessage(chatId, 'Вы на первом уроке.')
            }
        }
    } catch (error) {
        console.log(error)
    }
})
bot.onText(/\/start2/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Других курсов пока нет')
})
bot.onText(/\/info/, (msg) => {
    try {
        const { number } = getSession(msg.chat.id)
        const lesson = course.lessons.find(lesson => lesson.number === number)
        bot.sendMessage(msg.chat.id, `Вы на уроке ${lesson.number}. Тема урока: "${lesson.theme}".`)
    } catch (error) {
        console.log(error)
    }
})
bot.onText(/\/video/, (msg) => {
    try {
        const { number } = getSession(msg.chat.id)
        const lesson = course.lessons.find(lesson => lesson.number === number)
        bot.sendMessage(msg.chat.id, lesson.url)
    } catch (error) {
        console.log(error)
    }
})
bot.onText(/\/task/, (msg) => {
    try {
        const lesson = course.lessons.find(lesson => lesson.number === number)
        const { number } = getSession(msg.chat.id)
        if(lesson.buttons){
            const cButtons = [...lesson.buttons]
            const buttons = cButtons.map((str, i) => {
                bot.sendMessage(msg.chat.id, {reply_markup:{
                    inline_keyboard:[
                        [
                            {
                                text: str,
                                callback_data:'a'
                            }
                        ]
                    ]
                }
                })
            })
        }
        bot.sendMessage(msg.chat.id, lesson.task)
    } catch (error) {
        console.log(error)
    }
})
bot.onText(/\/prev/, (msg) => {
    try {
        let { number } = getSession(msg.chat.id)
        if (number !== 1) {
            number -= 1
            updateSession(msg.chat.id, { number })
            bot.sendMessage(msg.chat.id, `Вы на уроке номер ${number}`)
        } else {
            bot.sendMessage(msg.chat.id, 'Вы на первом уроке.')
        }
    } catch (error) {
        console.log(error)
    }
})
bot.onText(/\/next/, (msg) => {
    try {
        let { number } = getSession(msg.chat.id)
        if (number < course.lessons.length) {
            number += 1
            updateSession(msg.chat.id, { number })
            bot.sendMessage(msg.chat.id, `Вы на уроке номер ${number}`)
        } else {
            bot.sendMessage(msg.chat.id, 'Вы на последнем уроке, курс окончен.')
        }
    } catch (error) {
        console.log(error)
    }
})