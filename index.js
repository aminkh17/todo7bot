"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TELEGRAM_BOT_TOKEN = "Your bot API TOKEN is here, catch it from @botFather";
var Slimbot = require("slimbot");
var mongodb_1 = require("mongodb");
var slimbot = new Slimbot(TELEGRAM_BOT_TOKEN);
var constr = "mongodb://localhost:27017/todo7bot";
var Task = (function () {
    function Task() {
    }
    return Task;
}());
function sendMessage(element, message) {
    var Buttons = [[
            { text: "Delete", callback_data: "del" },
            { text: "Assign", callback_data: "assign" },
        ]];
    if (!element.Done)
        Buttons[0].push({ text: "Done", callback_data: "done" });
    else
        Buttons[0].push({ text: "unDone", callback_data: "undone" });
    var optionalParams = {
        parse_mode: "Markdown",
        reply_markup: JSON.stringify({
            inline_keyboard: Buttons
        })
    };
    var group = element.group;
    if (!group)
        group = "";
    else
        group = group + ":";
    if (message.chat.title)
        group = "";
    var assign = element.assign;
    if (!assign)
        assign = "";
    else
        assign = " > " + assign;
    var subject = " *" + group + "* " + element.subject.replace("_", "-") + " _" + assign + "_ ";
    slimbot.sendMessage(message.chat.id, subject, optionalParams);
}
function sendHelp(message) {
    var help = "Hi, I am a simple to do bot in Telegram, I can help you to do your tasks in your groups or individually, " +
        " if you have any question contact my dad, Amin: amin.17@gmail.com";
    slimbot.sendMessage(message.chat.id, help);
    help = "Here is a list of Commands to do:";
    slimbot.sendMessage(message.chat.id, help);
    help = "/add [subject] \n To add a new task to do.";
    slimbot.sendMessage(message.chat.id, help);
    help = "/list \n List all tasks ready to do in a group or if you ask bot itself all tasks added by you in all places.";
    slimbot.sendMessage(message.chat.id, help);
    help = "/mine \n List all tasks assigned to you or if you ask bot itself all tasks assigned to you in all places.";
    slimbot.sendMessage(message.chat.id, help);
    help = "/dones \n List all tasks marked as done.";
    slimbot.sendMessage(message.chat.id, help);
    help = "/user [@username] or just type @username: \n List all tasks in group assigned to mentioned username.";
    slimbot.sendMessage(message.chat.id, help);
}
function checkCommand(message, user, command, group) {
    console.log("command:" + command + " user:" + user + " group:" + group);
    if (command === "help" || command === "/help" || command === "/start") {
        sendHelp(message);
    }
    else if (command === "list" || command === "/list" || command === "/list@todo7bot") {
        mongodb_1.MongoClient.connect(constr, function (err, db) {
            if (err) {
                return;
            }
            slimbot.sendMessage(message.chat.id, "List of available tasks to do:");
            var tasks = db.collection("tasks");
            var criteria = { username: user };
            if (group)
                criteria = { group: group };
            var list = tasks.find(criteria).sort({ group: 1 }).toArray(function (err, items) {
                items.forEach(function (element) {
                    if (!element.Done)
                        sendMessage(element, message);
                });
                console.log("End");
                db.close();
            });
        });
        return true;
    }
    else if (command === "dones" || command === "/dones" || command === "/dones@todo7bot") {
        mongodb_1.MongoClient.connect(constr, function (err, db) {
            if (err) {
                return;
            }
            slimbot.sendMessage(message.chat.id, "List of available tasks to do:");
            var tasks = db.collection("tasks");
            var criteria = { username: user };
            if (group)
                criteria = { group: group };
            var list = tasks.find(criteria).sort({ group: 1 }).toArray(function (err, items) {
                items.forEach(function (element) {
                    if (element.Done)
                        sendMessage(element, message);
                });
                db.close();
            });
            console.log(list);
        });
        return true;
    }
    else if (command === "mine" || command === "/mine" || command === "/mine@todo7bot") {
        mongodb_1.MongoClient.connect(constr, function (err, db) {
            if (err)
                return;
            slimbot.sendMessage(message.chat.id, "All your (" + user + ") tasks to do: ");
            var tasks = db.collection("tasks");
            user = "@" + user;
            var criteria = { "assign": user };
            if (group)
                criteria.group = group;
            var mine = tasks.find(criteria).sort({ group: 1 }).toArray(function (err, items) {
                items.forEach(function (element) {
                    if (!element.Done)
                        sendMessage(element, message);
                });
                db.close();
            });
        });
        return true;
    }
    else if (command[0] === "@") {
        mongodb_1.MongoClient.connect(constr, function (err, db) {
            if (err)
                return;
            slimbot.sendMessage(message.chat.id, "All your (" + command + ") tasks to do: ");
            var tasks = db.collection("tasks");
            user = command;
            var criteria = { "assign": user };
            if (group)
                criteria.group = group;
            var mine = tasks.find(criteria).sort({ group: 1 }).toArray(function (err, items) {
                items.forEach(function (element) {
                    if (!element.Done)
                        sendMessage(element, message);
                });
                db.close();
            });
        });
        return true;
    }
    return false;
}
function saveTask(task) {
    console.log("Save");
    console.log(task);
    mongodb_1.MongoClient.connect(constr, function (err, db) {
        if (err) {
            return console.dir(err);
        }
        var tasks = db.collection("tasks");
        tasks.insert(task);
    });
    return true;
}
function findAssignee(subject) {
    var usernames = subject.match(/@.*$/);
    if (usernames !== null) {
        return usernames[0];
    }
    return null;
}
slimbot.on("message", function (message) {
    console.log("msg");
    console.log(message);
    if (message.text[0] !== "/" && message.text[0] !== "@")
        return;
    if (message.reply_to_message) {
        if (message.text[0] === "@") {
            mongodb_1.MongoClient.connect(constr, function (err, db) {
                if (err) {
                    return;
                }
                var tasks = db.collection("tasks");
                var criteria = {
                    subject: message.reply_to_message.text.trim()
                };
                var toUser = findAssignee(message.text);
                var setTo = { $set: { assign: toUser } };
                tasks.updateOne(criteria, setTo);
                slimbot.sendMessage(message.chat.id, "Ready to do for " + toUser);
            });
        }
        return;
    }
    var group = null;
    group = message.chat.title;
    if (message.text.trim().substring(0, 5) === "/user") {
        message.text = message.text.trim().substring(5);
        var user = message.from.username;
        if (!checkCommand(message, user, message.text.trim(), group)) {
            slimbot.sendMessage(message.chat.id, message.text.trim() + " What!");
        }
    }
    else if ((message.text.trim().match(/ /g) || []).length === 0) {
        var user = message.from.username;
        if (!checkCommand(message, user, message.text.trim(), group)) {
            slimbot.sendMessage(message.chat.id, message.text.trim() + " What!");
        }
    }
    else if (message.text.trim().substring(0, 4) === "/add") {
        message.text = message.text.trim().substring(4);
        var subject = (message.text.trim() + "@");
        subject = subject.match(/^([^@]*)@/)[1];
        var toUser = findAssignee(message.text);
        var task = {
            username: message.from.username,
            subject: subject.trim(),
            date: message.date,
            group: group,
            assign: toUser,
        };
        if (saveTask(task)) {
            console.log("MSG to save Task");
            console.log(message);
            slimbot.sendMessage(message.chat.id, "Added!");
        }
    }
});
slimbot.on("callback_query", function (query) {
    console.log("QRY");
    console.log(query);
    var subject = "";
    var t = query.message.text.split(':');
    if (t.length === 1)
        subject = t[0];
    else if (t.length === 2) {
        subject = t[1];
    }
    t = subject.split('>');
    subject = t[0];
    mongodb_1.MongoClient.connect(constr, function (err, db) {
        if (err) {
            return;
        }
        var tasks = db.collection("tasks");
        var criteria = {
            subject: subject.trim()
        };
        if (query.data === "del") {
            tasks.remove(criteria);
            slimbot.sendMessage(query.message.chat.id, "Get rid of this bloody to do");
        }
        else if (query.data === "done") {
            var setTo = { $set: { Done: 1, DoneDate: new Date() } };
            tasks.updateOne(criteria, setTo);
            slimbot.sendMessage(query.message.chat.id, "To do done");
        }
        else if (query.data === "undone") {
            var setTo = { $set: { Done: 0, DoneDate: new Date() } };
            tasks.updateOne(criteria, setTo);
            slimbot.sendMessage(query.message.chat.id, "Ready to do");
        }
        else if (query.data === "assign") {
            slimbot.sendMessage(query.message.chat.id, "Reply to task!");
        }
    });
});
slimbot.on("chosen_inline_result", function (result) {
    console.log("choosen");
});
slimbot.on("inline_query", function (inline) {
    console.log("INLINE");
    if (!inline.query) {
        return;
    }
    var results = JSON.stringify([{
            "type": "article",
            "id": "ec",
            "title": "Topic by " + inline.from.first_name,
            "description": inline.query,
            "input_message_content": {
                "message_text": inline.query,
                "parse_mode": "HTML",
            }
        }]);
    slimbot.answerInlineQuery(inline.id, results);
});
slimbot.startPolling();
//# sourceMappingURL=index.js.map