# todo7bot
A simple todo Telegram bot based on [Slimbot](https://github.com/edisonchee/slimbot)

This bot can be add to your Telegram chat and groups and it will remember your remain tasks.

## How to install

### Clone it and install prerequisites
```
git clone https://github.com/aminkh17/todo7bot

cd todo7bot

npm install
```

### Install [mongodb](https://docs.mongodb.com/manual/administration/install-community/)

### Run mongodb and modify connection string constant in index file

### Get API Token from [Telegram BotFather](https://telegram.me/botfather)

## Bot Instructions
  
  /add [subject] 
  To add a new task to do.
  
  /list 
  List all tasks ready to do in a group or if you ask bot itself all tasks added by you in all places.
  
  /mine 
  List all tasks assigned to you or if you ask bot itself all tasks assigned to you in all places.
  
  /dones 
  List all tasks marked as done.
  
  /user [@username] or just type @username:
  List all tasks in group assigned to mentioned username.
  
