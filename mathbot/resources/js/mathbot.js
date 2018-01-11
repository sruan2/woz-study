/***
 * Mathbot Finite State Machine
 * MathbotFSM is supposed to maintain current state of the mathbot and decide what to say next
 * @param fsmJson
 * @param randomDict
 * @param startNodeName
 * @constructor
 */
function MathbotFSM(fsmJson, randomDict, startNodeName) {
    //init
    var self = this;
    self.fsmJson = fsmJson;
    self.fsmJson["dummy_start_node"] = {
        "says": [],
        "branch": [],
        "skip": startNodeName
    };
    self.currNodeId = "dummy_start_node";
    self.randomDict = randomDict;
    self.unfinishedQuestionStack = [];
    self.unfinishedQuestionNextPropStack = [];
    self.previousRandom = {};

    this.getCurrNodeId = function () {
        return self.currNodeId;
    }

    this.getCurrNodeSays = function () {
        if (self.fsmJson[self.currNodeId]["says"]) {
            return self.fsmJson[self.currNodeId]["says"];
        } else {
            var randomType = self.fsmJson[self.currNodeId]["random"];
            return sayRandom(randomType);
        }
    };

    this.isCurrNodeSkipNode = function () {
        return Boolean(self.fsmJson[self.currNodeId].skip);
    };

    /***
     * keep walking down the FSM until a response is required
     * @param response
     * @returns {Array}
     */
    this.keepSayingUntilNextResponseRequired = function (response) {
        var says = [];
        says = says.concat(moveAndSay(response));
        while (self.isCurrNodeSkipNode()) {
            says = says.concat(moveAndSay(response));
        }
        return says;
    }


    // LOCAL PRIVATE FUNCTIONS

    /***
     *
     * @param randomType
     */
    function sayRandom(randomType) {
        var idx = Math.floor(Math.random() * self.randomDict[randomType].length);
        // random but not previous
        while (self.previousRandom[randomType] == idx) {
            idx = Math.floor(Math.random() * self.randomDict[randomType].length);
        }
        self.previousRandom[randomType] = idx;
        return self.randomDict[randomType][idx];
    }

    /***
     * More to the next node and return the says of the node
     * @param response user response
     */
    function moveAndSay(response) {
        var currNode = self.fsmJson[self.currNodeId];
        var nextNodeId;
        // how we came to the current node
        var previousNextProp;
        var nextProp;
        var says = [];

        if (self.isCurrNodeSkipNode()) {
            //if current node is a skip node, skip to it
            nextNodeId = currNode.skip;
            nextProp = currNode.nextProp;
        } else {
            //if current node is not a skip node, then we should expect branches or it is a terminal node
            var matchResult = match(currNode, response);
            nextNodeId = matchResult["next"];
            nextProp = matchResult["nextProp"];
        }

        // 0 = 0000(binary), with each digit represent:
        // xxx1: we are going to a concept node, otherwise question
        // xx1x: get the current question wrong, otherwise correct
        // 00xx: we are going to a new node (00), review a node (01),
        //          come back from a reviewed node (10), or just redo the same question (11)
        // by default is correct-question-new
        var sayMarker = 0;

        if (nextProp && nextProp["nextType"]) {
            //Decide if we want to proceed to the next question in the graph or this is merely a review question by examining the stack
            if (nextProp && nextProp["nextType"] === "new") {
                self.unfinishedQuestionStack.pop();
                self.unfinishedQuestionNextPropStack.pop();
                if (self.unfinishedQuestionStack.length > 0) {
                    //going back to previous question/concept
                    nextNodeId = self.unfinishedQuestionStack.pop();
                    previousNextProp = self.unfinishedQuestionNextPropStack.pop();
                    sayMarker += parseInt(1000, 2);
                    //if the node we are going back to (from the stack) is a concept or a question
                    sayMarker += previousNextProp["concept"] ? parseInt(1, 2) : parseInt(0000, 2);
                    //if we get the CURRENT answer correct
                    sayMarker += nextProp["wrong"] ? parseInt(10, 2) : parseInt(0000, 2);

                } else {
                    // when there is no questions left in the stack, say new question stuff
                    sayMarker += parseInt(0000, 2);
                    sayMarker += nextProp["concept"] ? parseInt(1, 2) : parseInt(0000, 2);
                    sayMarker += nextProp["wrong"] ? parseInt(10, 2) : parseInt(0000, 2);
                }
            } else if (nextProp && nextProp["nextType"] === "review") {
                // if review, do not pop the stacks
                sayMarker += parseInt(100, 2);
                sayMarker += nextProp["concept"] ? parseInt(1, 2) : parseInt(0000, 2);
                sayMarker += nextProp["wrong"] ? parseInt(10, 2) : parseInt(0000, 2);
            } else if (nextProp && nextProp["nextType"] === "self") {
                // if the next node is the question it self, simply pop out the current top element in the stack as it will be pushed back in again
                self.unfinishedQuestionStack.pop();
                self.unfinishedQuestionNextPropStack.pop();
                sayMarker += parseInt(1100, 2);
                sayMarker += nextProp["concept"] ? parseInt(1, 2) : parseInt(0000, 2);
                sayMarker += nextProp["wrong"] ? parseInt(10, 2) : parseInt(0000, 2);
            } else {
                console.error("Unexpected nextType:", nextProp["nextType"]);
            }
        } else {
            sayMarker = -1;
        }

        // disable reading property
        if (nextProp && nextProp["disable"]) {
            sayMarker = -1;
        }

        // 0 = 0000(binary), with each digit represent:
        // xxx1: we are going to a concept node, otherwise question
        // xx1x: get the current question wrong, otherwise correct
        // 00xx: we are going to a new node (00), review a node (01),
        //          come back from a reviewed node (10), or just redo the same question (11)
        // by default is correct-question-new
        //handle random says based on sayMarker
        console.log(nextNodeId, nextProp, sayMarker.toString(2), self.unfinishedQuestionStack);
        if (sayMarker != -1) {
            switch (sayMarker) {
                case parseInt(1111, 2):
                    // Give the wrong answer and going to redo the same concept
                    // THIS SHOULD RARELY HAPPEN BUT LET'S KEEP THIS ANYWAYS
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("wrong_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("try_again_the_same_concept"));
                    }
                    break;
                case parseInt(1110, 2):
                    // Give the wrong answer and going to redo the same question
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("wrong_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("try_again_the_same_question"));
                    }
                    break;
                case parseInt(1101, 2):
                    // Give the right answer but still redo the same concept
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("correct_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("try_again_the_same_concept"));
                    }
                    break;
                case parseInt(1100, 2):
                    // Give the right answer but still redo the same question
                    // happens when the student fail the main question but get the follow-up guiding sub-questions right
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("correct_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("try_again_the_same_question"));
                    }
                    break;
                // case parseInt(1011, 2):
                //     // Give the wrong answer and done reviewing coming back to a concept
                //     // SHOULD NOT HAPPEN
                //     break;
                // case parseInt(1010, 2):
                //     // Give the wrong answer and done reviewing coming back to a question
                //     // SHOULD NOT HAPPEN
                //     break;
                case parseInt(1001, 2):
                    // Give the right answer and done reviewing coming back to a question
                    // THIS SHOULD RARELY HAPPEN BUT LET'S KEEP THIS ANYWAYS
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("correct_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("previously_failed_concept"));
                    }
                    break;
                case parseInt(1000, 2):
                    // Give the right answer and done reviewing coming back to a question
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("correct_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("previously_failed_question"));
                    }
                    break;
                case parseInt(111, 2):
                    // Got the answer wrong and going to review something concept
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("wrong_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("try_easier_concept"));
                    }
                    break;
                case parseInt(110, 2):
                    // Got the answer wrong and going to review something easier question
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("wrong_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("try_easier_question"));
                    }
                    break;
                // case parseInt(0101, 2):
                // get the answer correct, but still going to review some concept
                // SHOULD NOT HAPPEN
                // break;
                // case parseInt(0100, 2):
                // get the answer correct, but still going to review something
                // SHOULD NOT HAPPEN
                // break;
                case parseInt(11, 2):
                    // give the wrong answer but still going to do a new concept
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("wrong_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("wrong_answer_but_new_concept"));
                    }
                    break;
                case parseInt(10, 2):
                    // give the wrong answer but still going to do a new question
                    console.log("Here");
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("wrong_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("wrong_answer_but_new_question"));
                    }
                    break;
                case parseInt(1, 2):
                    // get the question correct and going to a concept
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("correct_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("another_concept"));
                    }
                    break;
                case parseInt(0000, 2):
                    // get the question correct and going to a new question
                    if (!nextProp["no_grade"]) {
                        says = says.concat(sayRandom("correct_answer"));
                    }
                    if (!nextProp["no_transition"]) {
                        says = says.concat(sayRandom("another_question"));
                    }
                    break;
                default:
                    console.error("Random Branch [" + sayMarker.toString(2) + "]; This should not happend!")

            }
        }

        //if the node we are about to move to is a root node, push it in the stack
        var nextNode = self.fsmJson[nextNodeId];
        if (nextNode['is_root']) {
            self.unfinishedQuestionStack.push(nextNodeId);
            self.unfinishedQuestionNextPropStack.push(nextProp);
        }

        //make the move
        self.currNodeId = nextNodeId;
        says = says.concat(self.getCurrNodeSays());
        return says;
    }

    /***
     * match user reponses with one of the branches; return null if none is matched
     * @param current current node
     * @param response user response
     */
    function match(current, response) {

        /***
         * HELPER MATCHING FUNCTIONS
         *
         */

        /***
         * check if valToMatch is the only integer in response
         * @param response
         * @param valToMatch
         * @returns {boolean}
         */
        function onlyIntMatch(response, valToMatch) {
            var matched = response.match(/[0-9]+/g, " ");
            return (matched.length == 1) && (matched.includes(valToMatch));
        }

        /***
         * END OF HELPER MATCHING FUNCTIONS
         */
        //convert all string to lower case for answer matching
        //sanitize text for search function
        // noinspection JSUnusedAssignment
        if (response) {
            response = response.toLowerCase();
            //do not strip
            // .replace(/[\s.,\/#!$%\^&\*;:{}=\-_'"`~()]/g, "");
        }
        console.log("used response", response);
        if (!current.hasOwnProperty('random')) {
            var found = false;
            var otherwise = false;
            var branchLength = current.branch.length;
            for (var k = 0; k < branchLength; k++) {
                var b = current.branch[k];
                var next = b.next;
                var match = true;
                if (b.hasOwnProperty('evals')) {
                    var evalsLength = b.evals.length;
                    for (var i = 0; i < evalsLength; i++) {
                        var e = b.evals[i];
                        if (!eval(e)) {
                            match = false;
                        }
                    }
                    if (match && evalsLength > 0) {
                        found = next;
                        return {
                            "next": found,
                            "nextProp": b['nextProp']
                        };
                    }
                } else {
                    otherwise = next;
                }
            }
            if (otherwise) {
                return {
                    "next": otherwise,
                    "nextProp": b['nextProp']
                };

            } else {
                //handle unmatched response here
                console.error("A response is not caught!");
                return null;
            }
        }
    }
}


/***
 * Class Bubbles is responsible for rendering the conversation and handle front-end interaction
 * Bubbles contains a MathbotFSM instance, which responsible for handling the back-end finite state machine
 * @param container
 * @param name
 * @param options
 * @constructor
 */
function Bubbles(container, name, options) {
    /**********************************************************************************************************
     Init.
     **********************************************************************************************************/
    var giveMeBubbles = this;
    var MQ = MathQuill.getInterface(2); // this is a math expression render, we might want to use it later
    // options
    options = typeof options !== "undefined" ? options : {};
    var animationTime = options.animationTime || 0;			// how long it takes to animate chat bubble, also set in CSS
    var typeSpeed = options.typeSpeed || 0;				// delay per character, to simulate the machine "typing"
    var widerBy = options.widerBy || 2;				// add a little extra width to bubbles to make sure they don't break
    var sidePadding = options.sidePadding || 6; 				// padding on both sides of chat bubbles
    var randomDict = options.randomDict;
    var standingAnswer = "ice"; // remember where to restart convo if interrupted
    var _convo = {};			// local memory for conversation JSON object
    //--> NOTE that this object is only assigned once, per session and does not change for this


    // set up the stage
    container.classList.add("bubble-container");
    var bubbleWrap = document.createElement("div");
    bubbleWrap.className = "bubble-wrap";
    container.appendChild(bubbleWrap);
    var proposal = null;
    var botSayingLock = false;


    /**********************************************************************************************************
     Graph logic
     **********************************************************************************************************/

    this.startConversation = function (convJson, startNode) {
        giveMeBubbles.mathbotFsm = new MathbotFSM(convJson, randomDict, startNode);
        var says = giveMeBubbles.mathbotFsm.keepSayingUntilNextResponseRequired();
        orderBubbles(says, function () {
            botSayingLock = false;
        });
    };


    /**********************************************************************************************************
     Help function
     **********************************************************************************************************/
    function insertAfter(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        }
        else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    };

    /**********************************************************************************************************
     record conversation
     **********************************************************************************************************/
    var recordConversation = function (speaker, say, nodeId) {
        var say_log = speaker + ": " + say;
        var datetime_log = new Date().toISOString().replace('T', ' ').replace(/\..*$/, '')
        console.log("[" + datetime_log + "][" + nodeId + "] " + say_log);
        $.ajax({
            type: "POST",
            url: "api/record",
            data: {
                "say": say_log,
                "datetime": datetime_log,
                "nodeId": nodeId
            },
            success: null,
            dataType: "json"
        });
    }

    /**********************************************************************************************************
     User input matching
     **********************************************************************************************************/

    //check user input
    this.check = function (o) {
        recordConversation("Student", o.input, giveMeBubbles.mathbotFsm.getCurrNodeId());

        var says = giveMeBubbles.mathbotFsm.keepSayingUntilNextResponseRequired(o.input);
        orderBubbles(says, function () {
            botSayingLock = false;
        });
    };


    // install user input textfield
    this.typeInput = function (callbackFn) {
        var inputWrap = document.createElement("div");
        inputWrap.className = "input-wrap";
        var inputText = document.createElement("textarea");
        var mathExp = document.createElement("span");

        inputText.setAttribute("placeholder", "Type your reply here...");
        inputText.setAttribute("id", "answer");

        mathExp.setAttribute("placeholder", "Type your reply here...");
        mathExp.setAttribute("id", "latex");
        mathExp.setAttribute("class", "mq-math-field");

        inputWrap.appendChild(inputText);

        var mathExpMQ = MQ(mathExp);
        var flag = 1;
        var oldText = inputText.value;
        inputText.addEventListener("keydown", function (e) { // register user input

                if (botSayingLock) {
                    console.log("User input area locked.")
                    return
                }
                var key = e.keyCode;
                var newText = inputText.value;
                if (flag) {
                    oldText = newText;
                    propose(oldText);
                    flag = 0;
                }

                setTimeout(function () {
                    if (key != 13) {
                        var newText = inputText.value;
                        if (newText !== oldText) {
                            oldText = newText;
                            propose(oldText)
                        }
                    }
                });

                if (key == 13) {
                    e.preventDefault();
                    botSayingLock = true;
                    typeof bubbleQueue !== false ? clearTimeout(bubbleQueue) : false; // allow user to interrupt the bot
                    var lastBubble = document.querySelectorAll(".bubble.say");
                    lastBubble = lastBubble[lastBubble.length - 1];
                    lastBubble.classList.contains("reply") && !lastBubble.classList.contains("reply-freeform") ? lastBubble.classList.add("bubble-hidden") : false;
                    confirm()
                    flag = 1;

                    // callback
                    callbackFn({
                        "input": oldText,
                        "convo": _convo,
                        "standingAnswer": standingAnswer
                    });
                    inputText.value = "";
                    input = "";
                }


            }
        );


        container.appendChild(inputWrap);
        bubbleWrap.style.paddingBottom = "100px";
        //inputText.focus();
    };

    this.typeInput(this.check);

    // init typing bubble
    var bubbleTyping = document.createElement("div");
    bubbleTyping.className = "bubble-typing imagine";
    for (dots = 0; dots < 3; dots++) {
        var dot = document.createElement("div");
        dot.className = "dot_" + dots + " dot";
        bubbleTyping.appendChild(dot);
    }
    bubbleWrap.appendChild(bubbleTyping);

    /**********************************************************************************************************
     Below are renders
     **********************************************************************************************************/
    var propose = function (say) {
        var bubbleTextList = document.getElementsByClassName("bubble-button bubble say");

        var bubble;
        var bubbleContent;
        var bubbleText

        if (bubbleTextList.length) {
            bubbleText = bubbleTextList[0];
            bubbleText.innerHTML = say;
        }
        else {
            bubble = document.createElement("div");
            bubbleContent = document.createElement("span");
            bubbleText = document.createElement("span");

            bubble.className = "bubble reply reply-freeform say";
            bubbleContent.className = "bubble-content";
            bubbleText.className = "bubble-button bubble say"

            bubbleText.innerHTML = say;
            bubbleContent.appendChild(bubbleText)
            bubble.appendChild(bubbleContent);
            proposal = bubble;
            bubbleWrap.insertBefore(bubble, bubbleTyping);
        }
    };

    var confirm = function () {
        var bubbleTextList = document.getElementsByClassName("bubble-button bubble say");
        if (bubbleTextList.length) {
            var bubbleText = bubbleTextList[0];
            bubbleText.className = "bubble-button bubble-pick";
            proposal = null;
        }
    }

    // api for typing bubble
    this.think = function () {
        bubbleTyping.classList.remove("imagine");
        this.stop = function () {
            bubbleTyping.classList.add("imagine");
        }
    };

    // "type" each message within the group
    var orderBubbles = function (q, callback) {
        var start = function () {
            setTimeout(function () {
                if (typeof callback == "function") {
                    callback();
                }
            }, animationTime);
        };

        var position = 0;
        for (var nextCallback = position + q.length - 1; nextCallback >= position; nextCallback--) {
            (function (callback, index) {
                start = function () {
                    addBubble(q[index], callback);
                };
            })(start, nextCallback);
        }
        start();
    };

    // create a bubble
    var bubbleQueue = false;
    var addBubble = function (say, posted, style, delay) {
        delay = animationTime;
        //delay = delay || animationTime;			// how long it takes to animate chat bubble, also set in CSS

        style = typeof style !== "undefined" ? style : "";
        // create bubble element
        var bubble = document.createElement("div");
        var bubbleContent = document.createElement("span");
        bubble.className = "bubble imagine " + style;
        bubbleContent.className = "bubble-content";
        bubbleContent.innerHTML = say;
        bubble.appendChild(bubbleContent);
        if (proposal !== null) {
            bubbleWrap.insertBefore(bubble, proposal);
        } else {
            bubbleWrap.insertBefore(bubble, bubbleTyping);
        }


        // answer picker styles
        if (style !== "") {
            var bubbleButtons = bubbleContent.querySelectorAll(".bubble-button");

            for (var z = 0; z < bubbleButtons.length; z++) {
                (function (el) {
                    if (!el.parentNode.parentNode.classList.contains("reply-freeform"))
                        el.style.width = el.offsetWidth - sidePadding * 2 + widerBy + "px";
                })(bubbleButtons[z]);
            }
            bubble.addEventListener("click", function () {
                for (var i = 0; i < bubbleButtons.length; i++) {
                    (function (el) {
                        el.style.width = 0 + "px";
                        el.classList.contains("bubble-pick") ? el.style.width = "" : false;
                        el.removeAttribute("onclick");
                    })(bubbleButtons[i]);
                }
                this.classList.add("bubble-picked");
            });
        }
        // time, size & animate

        var wait = delay * 2;
        var minTypingWait = delay * 6;


        if (say.length * typeSpeed > delay && style == "") {
            wait += typeSpeed * say.length;
            wait < minTypingWait ? wait = minTypingWait : false;
            setTimeout(function () {
                bubbleTyping.classList.remove("imagine");
            }, delay);
        }
        setTimeout(function () {
            bubbleTyping.classList.add("imagine");
        }, wait - delay * 2);

        bubbleQueue = setTimeout(function () {
            bubble.classList.remove("imagine");
            var bubbleWidthCalc = bubbleContent.offsetWidth + widerBy + "px";
            bubble.style.width = style == "" ? bubbleWidthCalc : "";
            bubble.style.width = say.includes("<img src=") ? "50%" : bubble.style.width;
            bubble.classList.add("say");
            if (posted) {
                posted();
            }
            // animate scrolling
            var containerHeight = container.offsetHeight;
            var scrollDifference = bubbleWrap.scrollHeight - bubbleWrap.scrollTop;
            var scrollHop = scrollDifference / 200;
            var scrollBubbles = function () {
                for (var i = 1; i <= scrollDifference / scrollHop; i++) {
                    (function () {
                        setTimeout(function () {
                            bubbleWrap.scrollHeight - bubbleWrap.scrollTop > containerHeight ? bubbleWrap.scrollTop = bubbleWrap.scrollTop + scrollHop : false;
                        }, (i * 5));
                    })();
                }
            };
            setTimeout(scrollBubbles, delay / 2);
        }, wait + delay * 2);

        recordConversation("MathBot", say, giveMeBubbles.mathbotFsm.getCurrNodeId());
    }
}
