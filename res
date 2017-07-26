/*
{ message_id: 8,
  from:
   { id: 82197580,
     first_name: "Amin",
     username: "Aminkh17",
     language_code: "en-US" },
  chat:
   { id: 82197580,
     first_name: "Amin",
     username: "Aminkh17",
     type: "private" },
  date: 1500605526,
  text: "hi" }



  { message_id: 35,
  from:
   { id: 82197580,
     first_name: 'Amin',
     username: 'Aminkh17',
     language_code: 'en-US' },
  chat:
   { id: -222475472,
     title: 'Booking Portal - Bugs/Features',
     type: 'group',
     all_members_are_administrators: true },
  date: 1500609020,
  new_chat_participant: { id: 438809632, first_name: 'Todo7', username: 'todo7bot' },
  new_chat_member: { id: 438809632, first_name: 'Todo7', username: 'todo7bot' },
  new_chat_members: [ { id: 438809632, first_name: 'Todo7', username: 'todo7bot' } ] }
*/


 //   if ( (inline.query.trim().match(/ /g) || []).length === 0 ) {
    //     // command
    //     if(!checkCommand(inline.query.trim())) {
    //       let results: string = JSON.stringify([{
    //           "type": "article",
    //           "id": "ec",
    //           "title": "Topic by " + inline.from.first_name,
    //           "description":  "Wrong command: "+inline.query + "!",
    //           "input_message_content": {
    //             "message_text": "Added: <b>"+ inline.query+ "</b>",
    //             "parse_mode": "HTML",
    //           }
    //         }]);
    //         slimbot.answerInlineQuery(inline.id, results);
    //     }
    //   } else {   // add task
    //     if(!inline.chat)
    //       return;
    //     var toUser: string = findAssignee(inline.query);
    //     let task: Task = {
    //       username: inline.from.username,
    //       subject: inline.query.trim(),
    //       date: inline.date,
    //       group: inline.chat.title,
    //       assign: toUser,
    //     };
    //     if(saveTask(task)) {
    //       let results: string = JSON.stringify([{
    //           "type": "article",
    //           "id": "ec",
    //           "title": "Topic by " + inline.from.first_name,
    //           "description":  "Add Task: "+inline.query + "!",
    //           "input_message_content": {
    //             "message_text": "Added: " + inline.query + " <b>"+ toUser + "</b>",
    //             "parse_mode": "HTML",
    //           }
    //         }]);
    //       slimbot.answerInlineQuery(inline.id, results);
    //     }
    //     //console.log(task);
    //   }


   { message_id: 417,
     from: { id: 438809632, first_name: 'Todo7', username: 'todo7bot' },
     chat:
      { id: 82197580,
        first_name: 'Amin',
        username: 'Aminkh17',
        type: 'private' },
     date: 1500654921,
     text: 'task 3' },
  chat_instance: '2343843002329682213',
  data: 'del' }
