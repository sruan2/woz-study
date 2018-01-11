# Wiki
https://github.com/smartprimer/woz-study/wiki

# About
This is a chat room webpage which can send and receive messages using Python Flask as the backend server.

# Team
Ellen, Sherry, Liz, and Yeshuang

# Setup
Download the repo:
```
git clone https://github.com/smartprimer/woz-study
```
# Test the chat application locally:

Open a terminal in the woz-study directory and move to the woz_chatbot folder:
```
cd woz_chatbot
```
Run the application:
```
python app.py
```
Open two web browser windows side by side. In window 1, navigate to http://localhost:8000/. In window 2, navigate to http://localhost:8000/bot. Window 1 will act as the user's chat perspective. You will be prompted to sign in by setting a username, and the page will redirect to the chat interface at http://localhost:8000/user. Window 2 will act as the bot's chat perspective. With the current design, it is assumed that the "wizard" will connect to the chat before the user begins the conversation.


