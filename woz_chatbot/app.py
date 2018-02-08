from flask import Flask, render_template, url_for, redirect, request
from flask_socketio import SocketIO, emit
from datetime import datetime
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

app.config['MONGO_DBNAME'] = 'woz_chatlog'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/woz_chatlog'
mongo = PyMongo(app)

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
    emit('chat response', {'data': message['data'],'name':message['name']}, broadcast=True)

@socketio.on('sign in', namespace='')
def sign_in(name):
	user = mongo.db.users
	user.insert({name: []})

if __name__ == '__main__':
	socketio.run(app, host='0.0.0.0', port=8000)
