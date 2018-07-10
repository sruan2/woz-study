# Notes

- http://0.0.0.0:8000 cannot go to the correct signed in page. We have to go to http://0.0.0.0:8000/user manually.

- The speech recognition only works if accessed from http://localhost:8000/user. It does not work for http://0.0.0.0:8000/user.


# Wiki
https://github.com/smartprimer/woz-study/wiki

# About
This is a chat room webpage which can send and receive messages using Python Flask as the backend server.

# Setup
Download the repo:
```
git clone https://github.com/smartprimer/woz-study
```
# Run the chat application on the server:

Open a terminal in the woz-study directory on the Smart Primer server. Switch to the 'woz' screen. Restart the application server using the start server script.

Open two web browser windows side by side. In window 1, navigate to http://smartprimer.org/cordova/www/CandyMan_Start.html. In window 2, navigate to http://smartprimer.org/bot. Window 1 has the story and chat panel and is the user's chat perspective. Window 2 is the bot's chat perspective. The user will set his or her name from the story window and then the chat iframe will appear. The iframe's URL contains the user's name and userID which will be used to record the conversation in the database. With the current design, it is assumed that the user will sign in with their name and connect to the chat before the bot says anything (If the bot speaks before the user has set his or her name, the conversation is not recorded).

# Set up Google Cloud Speech API for voice transcription:

1) Follow the quickstart instructions here (https://cloud.google.com/speech/docs/quickstart).
First, download (or ask Kat for) a JSON file containing the private key to our GCP Console project (Chatbot Voice Transcription).
Second, install and initialize the Cloud SDK.
Third, authenticate by running
```
gcloud auth activate-service-account --key-file=[PATH]
```
where PATH leads to the JSON private key.

2) Install SoX and make it available in your $PATH. For Mac OS, this looks like ```brew install sox;``` for Linux, ```sudo apt-get install sox libsox-fmt-all```.


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
