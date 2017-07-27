const TELEGRAM_BOT_TOKEN: string = "Your bot API TOKEN is here, catch it from @botFather";
import * as Slimbot from "slimbot";
import { MongoClient } from "mongodb";

const slimbot: Slimbot = new Slimbot(TELEGRAM_BOT_TOKEN);

const constr: string = "mongodb://localhost:27017/todo7bot"; // mongodb connection here

class Task {
  _id: number;
  username: string;
  subject: string;
  date: Date;
  group: string;
  assign: string;
  Done: boolean;
}

function sendMessage(element: Task, message): void {
      let Buttons = [[
              { text: "Delete" , callback_data: "del" },
              { text: "Assign" , callback_data: "assign" },
            ]]

      if(!element.Done)
        Buttons[0].push({ text: "Done" , callback_data: "done" });
      else
        Buttons[0].push({ text: "unDone" , callback_data: "undone" });

 
      let optionalParams = {
          parse_mode: "Markdown",
          reply_markup: JSON.stringify({
            inline_keyboard: Buttons
          })
        };
// console.log(element.subject);

        var group: string = element.group;
        if(!group)
          group = "";
        else
          group = group+":";

        if(message.chat.title)
          group = "";

        var assign: string = element.assign;
        if(!assign) 
          assign = "";
        else
          assign = " > "+assign;
        var subject: string = " *"+ group +"* "+ element.subject.replace("_", "-") +" _"+ assign+"_ ";
        //console.log(subject);
        slimbot.sendMessage(message.chat.id, subject, optionalParams );
}

function sendHelp(message): void {
  var help: string = "Hi, I am a simple to do bot in Telegram, I can help you to do your tasks in your groups or individually, "+
                    " if you have any question contact my dad, Amin: amin.17@gmail.com";
  slimbot.sendMessage(message.chat.id, help );
  help = "Here is a list of Commands to do:";
  slimbot.sendMessage(message.chat.id, help );
  help = "/add [subject] \n To add a new task to do.";
  slimbot.sendMessage(message.chat.id, help );
  help = "/list \n List all tasks ready to do in a group or if you ask bot itself all tasks added by you in all places.";
  slimbot.sendMessage(message.chat.id, help );
  help = "/mine \n List all tasks assigned to you or if you ask bot itself all tasks assigned to you in all places.";
  slimbot.sendMessage(message.chat.id, help );
  help = "/dones \n List all tasks marked as done.";
  slimbot.sendMessage(message.chat.id, help );
  help = "/user [@username] or just type @username: \n List all tasks in group assigned to mentioned username.";
  slimbot.sendMessage(message.chat.id, help );
}

function checkCommand(message, user: string, command: string, group: string): boolean {
  console.log("command:"+command+" user:"+user+" group:"+group);
  if (command === "help" || command === "/help" || command === "/start") {
    sendHelp(message);
  }
  else if(command === "list" || command === "/list" || command === "/list@todo7bot") {
    MongoClient.connect(constr, function(err, db) {
      if(err) {
        return;
      }
      slimbot.sendMessage(message.chat.id, "List of available tasks to do:");
      var tasks = db.collection("tasks");
      var criteria: object = {username: user};
      if(group)
        criteria = {group : group};
      var list = tasks.find(criteria).sort( { group: 1 } ).toArray(function(err, items){
        items.forEach(element => {
          if(!element.Done)
            sendMessage(element, message);
        });
        console.log("End");

        db.close();
      });
      //console.log(list);
      // slimbot.sendMessage(message.chat.id, list);

    });
    return true;
  }
  else if(command === "dones" || command === "/dones" || command === "/dones@todo7bot") {
    MongoClient.connect(constr, function(err, db) {
      if(err) {
        return;
      }
      slimbot.sendMessage(message.chat.id, "List of available tasks to do:");
      var tasks = db.collection("tasks");
      var criteria: object = {username: user};
      if(group)
        criteria = {group : group};
      var list = tasks.find(criteria).sort( { group: 1 } ).toArray(function(err, items){
        items.forEach(element => {
          if(element.Done)
            sendMessage(element, message);
        });

        db.close();
      });
      console.log(list);
      // slimbot.sendMessage(message.chat.id, list);

    });
    return true;
  }
  else if(command === "mine" || command === "/mine" || command === "/mine@todo7bot") {
    MongoClient.connect(constr, function(err, db){
      if(err) return;
      slimbot.sendMessage(message.chat.id, "All your ("+user+") tasks to do: ");
      var tasks = db.collection("tasks");
      user = "@"+user;
      //var criteria: object = {"assign" : {"$regex": "^" + user + "$", $options:"i"}};
      var criteria: object = {"assign" : user };
      if(group)
        criteria.group = group; 
      var mine = tasks.find(criteria).sort( { group: 1 } ).toArray(function(err, items){
        items.forEach(element => {
          if(!element.Done)
            sendMessage(element, message);
        });
        
        db.close();
      });
      // slimbot.sendMessage(message.chat.id, list);

    });
    return true;
  }
  else if(command[0]==="@"){
    MongoClient.connect(constr, function(err, db){
      if(err) return;
      slimbot.sendMessage(message.chat.id, "All your ("+command+") tasks to do: ");
      var tasks = db.collection("tasks");
      user = command;
      //var criteria: object = {"assign" : {"$regex": "^" + user + "$", $options:"i"}};
      var criteria: object = {"assign" : user };
      if(group)
        criteria.group = group; 
      var mine = tasks.find(criteria).sort( { group: 1 } ).toArray(function(err, items){
        items.forEach(element => {
          if(!element.Done)
            sendMessage(element, message);
        });
        
        db.close();
      });
      // slimbot.sendMessage(message.chat.id, list);

    });
    return true;
  }
  return false;
}

function saveTask(task: Task): boolean {
  console.log("Save");
  console.log(task);

  MongoClient.connect(constr, function(err, db) {
    if(err) { return console.dir(err); }
    
    var tasks:any = db.collection("tasks");
    tasks.insert(task);

  });

  return true;
}

function findAssignee(subject: string): string {
  var usernames: RegExpMatchArray = subject.match(/@.*$/);
  if(usernames !== null) {
    return usernames[0];
  }
  return null;
}

// register listener
slimbot.on("message", message => {
  console.log("msg");
  console.log(message);
  if(message.text[0]!== "/" && message.text[0]!== "@")
    return;
  if(message.reply_to_message) {
    if(message.text[0]==="@"){
      MongoClient.connect(constr, function(err, db) {
        if(err) {
          return;
        }
        var tasks = db.collection("tasks");
        var criteria: object = {
          subject: message.reply_to_message.text.trim()
        };
        var toUser: string = findAssignee(message.text);
        var setTo: object = {$set: {assign: toUser}};
        tasks.updateOne(criteria, setTo);      
        slimbot.sendMessage(message.chat.id, "Ready to do for "+toUser);
      });
    }

    return; 
  }

  var group: string = null;
  group = message.chat.title;
  if(message.text.trim().substring(0,5) === "/user") {
    message.text = message.text.trim().substring(5);
    var user: string = message.from.username;
    if(!checkCommand(message, user, message.text.trim(), group)) {
        slimbot.sendMessage(message.chat.id, message.text.trim() + " What!");
    }
  }
  else if ( (message.text.trim().match(/ /g) || []).length === 0 ) {
    // command
    
    var user: string = message.from.username;
    if(!checkCommand(message, user, message.text.trim(), group)) {
        slimbot.sendMessage(message.chat.id, message.text.trim() + " What!");
    }
  }
  else if(message.text.trim().substring(0,4) === "/add") {
  // add task
    message.text = message.text.trim().substring(4);
    var subject: string = (message.text.trim()+"@");
    subject = subject.match(/^([^@]*)@/)[1];
    var toUser: string = findAssignee(message.text);

    let task: Task = {
      username: message.from.username,
      subject: subject.trim(),
      date: message.date,
      group: group,
      assign: toUser,
    };
      if(saveTask(task)) {
        console.log("MSG to save Task");
        console.log(message);
        slimbot.sendMessage(message.chat.id, "Added!");
      }

  }

});

// because each inline keyboard button has callback data, you can listen for the callback data and do something with them

slimbot.on("callback_query", query => {
  console.log("QRY");
  console.log(query);

  var subject: string = "";
  var t: string[] = query.message.text.split(':');
  if(t.length===1)
    subject = t[0];
  else if(t.length===2){
    subject = t[1];
  }
  t = subject.split('>');
  subject = t[0];

  MongoClient.connect(constr, function(err, db) {
    if(err) {
      return;
    }
    var tasks = db.collection("tasks");
    var criteria: object = {
      subject: subject.trim()
    };


    if (query.data === "del") {
      tasks.remove(criteria);
      slimbot.sendMessage(query.message.chat.id, "Get rid of this bloody to do");
    }
    else if (query.data === "done") {
      var setTo: object = {$set: {Done: 1, DoneDate: new Date()}};
      tasks.updateOne(criteria, setTo );
      slimbot.sendMessage(query.message.chat.id, "To do done");
    }
    else if (query.data === "undone") {
      var setTo: object = {$set: {Done: 0, DoneDate: new Date()}};
      tasks.updateOne(criteria, setTo );
      slimbot.sendMessage(query.message.chat.id, "Ready to do");
    }
    else if (query.data === "assign") {
      
      slimbot.sendMessage(query.message.chat.id, "Reply to task!");
    }

  })
});

slimbot.on("chosen_inline_result", result => {
  console.log("choosen");
  // do something with result
});

slimbot.on("inline_query", inline => {
   console.log("INLINE");
  if(!inline.query) {
    return;
  }
  // console.log(inline.from.first_name);
  // console.log(inline.query);
  let results: string = JSON.stringify([{
          "type": "article",
          "id": "ec",
          "title": "Topic by " + inline.from.first_name,
          "description": inline.query,
          "input_message_content": {
            "message_text":inline.query,
            "parse_mode": "HTML",
          }
        }]);
 // console.log(results);
  slimbot.answerInlineQuery(inline.id, results);

 });

// call API
slimbot.startPolling();

// now try talking to your bot, and click on the Hello button. Your bot should reply you with "Hello to you too!".
