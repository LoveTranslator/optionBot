process.env.NTBA_FIX_319 = 1

var TelegramBot = require('node-telegram-bot-api');

// Устанавливаем токен, который выдавал нам бот.

var token = '766599402:AAGMExKVovquBJq8QA0RDkVqq2yQT7G4PmI'; // 922777706:AAGQU6l-8l2UMJ9qRVaQRyo59gQAzHGxrik

// Включить опрос сервера
var bot = new TelegramBot(token, {
    polling: true
});

var user = [];

user.nick = undefined;

var menu = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{
                text: 'Перезапустить опрос'
            }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    })
};

var questions = [{
        title: 'Вашему аккаунту больше года?',
        buttons: [
            [{
                text: 'Да',
                callback_data: '0_1'
            }],
            [{
                text: 'Нет',
                callback_data: '0_2'
            }],
        ],
        right_answer: 1
    },
    {
        title: 'К Вашему аккаунту привязана действующая почта и мобильный телефон?',
        buttons: [
            [{
                text: 'Да',
                callback_data: '1_1'
            }],
            [{
                text: 'Нет',
                callback_data: '1_2'
            }],
        ],
        right_answer: 1
    },
    {
        title: 'Ваш аккаунт заполнен (содержит информацию об учебе или работе, есть фото, друзья, записи на стене)?',
        buttons: [
            [{
                text: 'Да',
                callback_data: '2_1'
            }],
            [{
                text: 'Нет',
                callback_data: '2_2'
            }],
        ],
        right_answer: 1
    },
    {
        title: 'Вы проявляли социальную активность(отметки "нравится", комментарии, прохождение моментальных игр, репосты записей сообществ на свою страницу) на аккаунте в течении всего его существования?',
        buttons: [
            [{
                text: 'Да',
                callback_data: '3_1'
            }],
            [{
                text: 'Нет',
                callback_data: '3_2'
            }],
        ],
        right_answer: 1
    },
    {
        title: 'Запускалась ли реклама с Вашего аккаунта?',
        buttons: [
            [{
                text: 'Да',
                callback_data: '4_1'
            }],
            [{
                text: 'Нет',
                callback_data: '4_2'
            }],
        ],
        right_answer: 2
    },
    {
        title: 'Вы сдавали ранее аккаунт в аренду?',
        buttons: [
            [{
                text: 'Да',
                callback_data: '5_1'
            }],
            [{
                text: 'Нет',
                callback_data: '5_2'
            }],
        ],
        right_answer: 2
    },
    {
        title: 'Согласны ли Вы на изменение пароля при передаче аккаунта?',
        buttons: [
            [{
                text: 'Да',
                callback_data: '6_1'
            }],
            [{
                text: 'Нет',
                callback_data: '6_2'
            }],
        ],
        right_answer: 1 
    }
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

bot.on('callback_query', function onCallbackQuery(msg) {
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

    newQuestion(msg);
});

bot.on('message', function (msg) {
    for (let i = 0; i < user.length; i++) {
        if (user[i].id === msg.from.id && user[i].countRightAnswer === questions.length) {
            user.instaLogin = msg.text;
            bot.sendMessage(msg.from.id, "Отлично, скоро с вами свяжутся:)");
            bot.sendMessage(841422237, `Ёу хокаге, у нас новый генин, он успешно прошёл экзамен - @${msg.from.username}.(id ${msg.from.id}). Instagram login - ${user.instaLogin}`); //230431843 - hokage, newHokage - 841422237
            user.splice(i, 1);
            break;
        }
    }
});

function endPoll(msg) {
    for (let i = 0; i < user.length; i++) {
        if (user[i].id === msg.from.id && user[i].countRightAnswer === questions.length) {
            bot.sendMessage(msg.from.id, "Спасибо за пройденный опрос, оставьте ваше имя пользователя от аккаунта Instagram, и наш менеджер скоро с вами свяжется:)");
        } else {
            bot.sendMessage(msg.from.id, "К сожалению вы нам не подходите, попробуйте в следующий раз.");
            user.splice(i, 1);
            break;
        }
    }
}

bot.onText(/\/start/, function (msg, match) {
    myStart(msg);
});

bot.onText(/\Перезапустить опрос/, (msg, match) => {
    myStart(msg);
});

function myStart(msg) {
    for (let i = 0; i < user.length; i++) {
        if (user[i].id === msg.from.id) {
            user.splice(i, 1);
        }
    }

    user.push({
        id: msg.from.id,
        answerNumber: 0,
        countRightAnswer: 0,
        answerNumberWithAccount: 0,
        instaLogin: null
    })
    bot.sendMessage(msg.from.id, `Мы – команда молодых SMM-специалистов. Недавно мы начали развивать направление Facebook Ads и столкнулись с проблемой ограниченных рекламных возможностей в этой социальной сети. К сожалению, Facebook запрещает создавать рекламные объявления со свежих аккаунтов, а также ограничивает создание объявлений с одного аккаунта. В связи с этим мы проделываем следующие этапы: 
1) Берем аккаунты у людей 
2) Используем рекламные возможности аккаунтов

Безопасно ли это? 
- Да! Никаких постов от вашего имени и спама – Ваши друзья не догадаются, что вы зарабатываете на своей страничке. 
    
Пройдите небольшой опрос, чтобы мы могли узнать больше о Вашем аккаунте:
  `, menu);
    setTimeout(newQuestion.bind(this, msg), 2000);
}