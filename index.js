process.env.NTBA_FIX_319 = 1

var TelegramBot = require('node-telegram-bot-api');

// Устанавливаем токен, который выдавал нам бот.

var token = '933664978:AAG1_0xHSTk0wBVUERvHpK6z5z363WynyqE'; // 922777706:AAGQU6l-8l2UMJ9qRVaQRyo59gQAzHGxrik  766599402:AAGMExKVovquBJq8QA0RDkVqq2yQT7G4PmI

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
        title: 'Вашему аккаунту Facebook больше 6 месяцев?',
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
        title: 'К Вашему аккаунту привязана действующая почта и действующий мобильный телефон?',
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
        title: 'Ваш аккаунт Facebook заполнен (содержит информацию об учебе или работе, есть фото, друзья, записи на стене)?',
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
        title: 'Вы проявляли социальную активность на аккаунте Facebook в течении всего его существования (лайки, комментарии, добавление фотографий)?',
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
        title: 'Вы сдавали ранее аккаунт Facebook в аренду?',
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
            bot.sendMessage(841422237, `Ёу хокаге, у нас новый генин, он успешно прошёл экзамен - @${msg.from.username}.(id ${msg.from.id}). Instagram login - ${user.instaLogin}`); //230431843 - hokage, newHokage - 841422237, my - 273352112
            user.splice(i, 1);
            break;
        }
    }
});

function endPoll(msg) {
    for (let i = 0; i < user.length; i++) {
        if (user[i].id === msg.from.id && user[i].countRightAnswer === questions.length) {
            bot.sendMessage(msg.from.id, "Спасибо за пройденный опрос! Оставьте логин на свой Instagram или ссылку на любую другую социальную сеть для связи с Вами, также укажите город проживания.");
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
    bot.sendMessage(msg.from.id, `Добрый день :) 
    Мы – команда молодых SMM-специалистов. Недавно мы начали развивать направление Facebook Ads и столкнулись с проблемой ограниченных рекламных возможностей в этой социальной сети. К сожалению, Facebook запрещает создавать рекламные объявления со свежих аккаунтов, а также ограничивает создание объявлений с одного аккаунта. В связи с этим мы проделываем следующие этапы:     
1) Берем аккаунты Facebook у людей.
2) Используем рекламные возможности аккаунтов Facebook.

Безопасно ли это? 
Да! Никаких постов от вашего имени и спама – Ваши друзья не догадаются, что вы зарабатываете на своей страничке Facebook. 
    
Пройдите небольшой опрос, который займет меньше 1 минуты, чтобы мы могли узнать больше об аккаунте Facebook: 
  `, menu);
    setTimeout(newQuestion.bind(this, msg), 2000);
}
