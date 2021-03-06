from flask import Flask, render_template, url_for, redirect, request
from flask_socketio import SocketIO, emit
from datetime import datetime
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

app.config['MONGO_DBNAME'] = 'woz_chatlog'
app.config['MONGO_URI'] = os.environ["MONGO_URI"]
#mongo = PyMongo(app)

epoch = datetime.utcfromtimestamp(0)
delay = 2000    # milliseconds

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/user')
def user():
    return render_template('user.html')

@app.route('/bot')
def bot():
    return render_template('bot.html')

@socketio.on('est connection', namespace='')
def show_connection(message):
    params = {'name':'Server','data': message['data']}
    if message.get('initTime'):
        params['serverTime'] = int((datetime.utcnow() - epoch).total_seconds() * 1000)
    emit('chat response', params)

@socketio.on('chat broadcast', namespace='')
def test_message(message):
    # if message['name'] == 'User' and message['uid'] != '':
    #   logs = mongo.db.logs
    #   time = datetime.utcnow()
    #   userID = ObjectId(message['uid'])
    #   logDoc = logs.find_one({'user_id': userID})
    #   if logDoc:
    #       logDoc['history'].append({'sender':message['name'], 'contents':message['data'], 'time':time})
    #       logs.save(logDoc)
    emit('chat response', {'data': message['data'],'name':message['name']}, broadcast=True)

@socketio.on('log bot message', namespace='')
def log_bot_message(message):
    # if message['uid'] != '':
    #   logs = mongo.db.logs
    #   time = datetime.utcnow()
    #   userID = ObjectId(message['uid'])
    #   logDoc = logs.find_one({'user_id': userID})
    #   if logDoc:
    #       logDoc['history'].append({'sender':message['name'], 'contents':message['data'], 'time':time})
    #       logs.save(logDoc)
    pass

@socketio.on('sign in', namespace='')
def sign_in(name):
    #get db collections
    # users = mongo.db.users
    # logs = mongo.db.logs
    # userID = ''

    # #find and/or add user
    # user = users.find_one({'name': name})
    # if user:
    #   userID = user['_id']
    # else:
    #   users.insert({'name': name})
    #   user = users.find_one({'name': name})
    #   userID = user['_id']
    #   #create user's conversation log
    #   logDoc = logs.insert({'user_id':userID, 'history':[]})
    userID = 101
    emit('signed in', {'name':name, 'uid': str(ObjectId(userID))})

if __name__ == '__main__':
    context = ('/etc/letsencrypt/live/smartprimer.org/fullchain.pem',
               '/etc/letsencrypt/live/smartprimer.org/privkey.pem')
    socketio.run(app, host='0.0.0.0', port=8000, certfile=context[0], keyfile=context[1])

