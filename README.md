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
# Run the chat application on the server:

Open a terminal in the woz-study directory on the Smart Primer server. Switch to the 'woz' screen. Restart the application server using the start server script.

Open two web browser windows side by side. In window 1, navigate to http://localhost:8000/user. In window 2, navigate to http://localhost:8000/. Window 1 will act as the user's chat perspective. Window 2 will act as the bot's chat perspective. As the Wizard, you will be prompted to set a full name for the user which will be used to record the conversation in the database. The page will then redirect to the chat interface at http://localhost:8000/bot. With the current design, it is assumed that the "wizard" will connect to the chat before the user begins the conversation.

# Get the conversation history in readable form for a particular user:

On the Smart Primer server, export the logs collection to json format using:
```
mongoexport -u username -p password -d woz_chatlog -c logs --jsonArray -o output.json
```
Make sure to fill in the username and password fields and name the output file. This should be done every time to ensure a fresh copy of the data.

Next, in the woz-study directory, run the following script on the json file you just exported as the input:
```
python convertHistory.py input.json userID output.txt
```
Make sure to replace input.json with your exported json file, the userID with the mongodb \_id string corresponding to the user whose conversation you are seeking to convert, and output.txt with the name of your output file.
