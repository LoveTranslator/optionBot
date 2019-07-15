process.env.NTBA_FIX_319 = 1

var TelegramBot = require('node-telegram-bot-api');

// Устанавливаем токен, который выдавал нам бот.
var token = '893848783:AAHAgAwkPcLsrQdyeneWnsbAD6Twhu_X9O8';

// Включить опрос сервера
var bot = new TelegramBot(token, { polling: true });

var user = [];

function test() {
    console.log('123');
}

/* var menu = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{
                text: 'Перезапустить опрос',
                callback_data: test()
            }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    })
}; */

var questions = [{
    title: 'Вашему аккаунту больше года?',
    buttons: [
        [{ text: 'Да', callback_data: '0_1' }],
        [{ text: 'Нет', callback_data: '0_2' }],
    ],
    right_answer: 1
},
{
    title: 'К Вашему аккаунту привязана действующая почта и мобильный телефон?',
    buttons: [
        [{ text: 'Да', callback_data: '1_1' }],
        [{ text: 'Нет', callback_data: '1_2' }],
    ],
    right_answer: 1
},
{
    title: 'Ваш аккаунт заполнен (содержит информацию об учебе или работе, есть фото, друзья, записи на стене)?',
    buttons: [
        [{ text: 'Да', callback_data: '2_1' }],
        [{ text: 'Нет', callback_data: '2_2' }],
    ],
    right_answer: 1
},
{
    title: 'Вы проявляли социальную активность(отметки "нравится", комментарии, прохождение моментальных игр, репосты записей сообществ на свою страницу) на аккаунте в течении всего его существования?',
    buttons: [
        [{ text: 'Да', callback_data: '3_1' }],
        [{ text: 'Нет', callback_data: '3_2' }],
    ],
    right_answer: 1
},
{
    title: 'Есть ли у Вас возможность проявлять социальную активность(отметки "нравится", комментарии, прохождение моментальных игр, репосты записей сообществ на свою страницу) с мобильного устройства во время аренды аккаунта?',
    buttons: [
        [{ text: 'Да', callback_data: '4_1' }],
        [{ text: 'Нет', callback_data: '4_2' }],
    ],
    right_answer: 1
},
{
    title: 'Согласны ли Вы на изменение пароля во время аренды аккаунта? (Это делается по техническим причинам, так как Facebook периодически просит о смене пароля для безопасности; новый пароль будет согласован с Вами)',
    buttons: [
        [{ text: 'Да', callback_data: '5_1' }],
        [{ text: 'Нет', callback_data: '5_2' }],
    ],
    right_answer: 1
},
];

function newQuestion(msg) {
    chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    var arr;
    for (let i = 0; i < user.length; i++) {
        if (user[i].id === chat) {
            arr = questions[user[i].answerNumber];
        }
    }
    var text = arr.title;
    var options = {
        reply_markup: JSON.stringify({
            inline_keyboard: arr.buttons,
            parse_mode: 'Markdown'
        })
    };

    for (let i = 0; i < user.length; i++) {
        if (user[i].id === msg.from.id && user[i].answerNumber < questions.length) {
            user[i].answerNumber++;
        }
    }
    
    bot.sendMessage(chat, text, options);
}

bot.onText(/\/start/, function (msg, match) {
    user.push({ id: msg.from.id, answerNumber: 0, countRightAnswer: 0 })
    bot.sendMessage(msg.from.id, `Мы – команда молодых SMM-специалистов. Недавно мы начали развивать направление Facebook Ads и столкнулись с проблемой ограниченных рекламных возможностей в этой социальной сети. К сожалению, Facebook запрещает создавать рекламные объявления со свежих аккаунтов, а также ограничивает создание объявлений с одного аккаунта. В связи с этим мы проделываем следующие этапы:

  1. арендуем аккаунты у людей 
  2. используем рекламные возможности аккаунтов 
       (1 неделя – 3+ месяца) 
  3. возвращаем социальный аккаунт в целости и сохранности. 
  
Безопасно ли это? 
Да! Мы подписываем с Вами договор при личной встрече в 2х экземплярах. У Вас всегда будет полноценный доступ к аккаунту. Никаких постов от вашего имени и спама – Ваши друзья не догадаются, что вы зарабатываете на своей страничке. Мы будем комментировать и делать репосты новостей с популярных СМИ, но эти посты никто кроме вас не будет видеть. Мы не будем изменять Ваш логин. Пароль может быть изменен, но после предупреждения и согласования нового с Вами. Это делается по техническим причинам, так как Facebook периодически просит о смене пароля для безопасности. 
  
Пройдите небольшой опрос, чтобы мы могли узнать больше о Вашем аккаунте: 
  `);


    setTimeout(newQuestion.bind(this, msg), 2000);
});

bot.on('callback_query', function (msg) {
    var answer = msg.data.split('_');
    var index = answer[0]; // номер вопроса
    var button = answer[1]; // кнопка ответа 0 || 1
    if (questions[index].right_answer == button) {
        for (let i = 0; i < user.length; i++) {
            if (user[i].id === msg.from.id) {
                user[i].countRightAnswer++;
            }
        }
    }
    for (let i = 0; i < user.length; i++) {
        if (user[i].id === msg.from.id && user[i].answerNumber === questions.length) {
            endPoll(msg);
        }
    }
    console.log(user);
    newQuestion(msg);
});

function endPoll(msg) {
    for (let i = 0; i < user.length; i++) {
        if (user[i].id === msg.from.id && user[i].countRightAnswer === questions.length) {
            bot.sendMessage(841422237, `Ёу хокаге, у нас новый генин, он успешно прошёл экзамен - @${msg.from.username}`); //230431843 - hokage, newHokage - 841422237
            bot.sendMessage(msg.from.id, "Спасибо, наш менеджер скоро с вами свяжется:)");
            user.splice(i, 1);
            break;
        } else {
            bot.sendMessage(msg.from.id, "К сожалению вы нам не подходите, попробуйте в следующий раз.");
            user.splice(i, 1);
            break;
        }
    }
}