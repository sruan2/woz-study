
var lesson1 = {
    "ice": {
        "says": [
            "Hi, this is Ada, I'm a chatbot.",
            "I'm going to help you understand mathematical concept called \"sequences\".",
            "Why don't we start from an example?",
            "By the way, feel free to ask for a hint if you need some help!",
            "2, 4, 6, 8, ...",
            "What would be the next number?",
        ],
        "reply": [
            {
                "question": "10",
                "answer": "sequence-term-pattern",
            },
            {
                "question": "2",
                "answer": "2",
            },
            {
                "question": "0",
                "answer": "0",
            },
            {
                "question": "hint",
                "answer": "hint_example_1"
            }
        ]
    },

    "hint_example_1": {
        "says": [
            "Could you take a look at the difference of two consecutive numbers?",
            "2, 4, 6, 8, ...",
            "What would be the next number?",
        ],
        "reply": [
            {
                "question": "10",
                "answer": "sequence-term-pattern",
            },
            {
                "question": "2",
                "answer": "2",
            },
            {
                "question": "0",
                "answer": "0",
            },
            {
                "question": "hint",
                "answer": "hint_example_1"
            }
        ]
    },

    "2": {
        "says": [
            "Well, that's possible.",
            "The sequence could be 2, 4, 6, 8, 2, 4, 6, ...",
            "But some other choice might work as well, right?",
            "2, 4, 6, 8, ...",
            "What would be the next number?"
        ],
        "reply": [
            {
                "question": "10",
                "answer": "sequence-term-pattern",
            },
            {
                "question": "2",
                "answer": "2",
            },
            {
                "question": "0",
                "answer": "0",
            },
            {
                "question": "hint",
                "answer": "hint_example_1"
            }
        ]
    },

    "0": {
        "says": [
            "OK. That's a bit strange",
            "But you know what, it can work as well!",
            "The sequence could be 2, 4, 6, 8, 0, 2, 4, 6, ...",
            "But some other choice might work as well, right?",
            "2, 4, 6, 8, ...",
            "What would be the next number?"
        ],
        "reply": [
            {
                "question": "10",
                "answer": "sequence-term-pattern",
            },
            {
                "question": "2",
                "answer": "2",
            },
            {
                "question": "0",
                "answer": "0",
            },
            {
                "question": "hint",
                "answer": "hint_example_1"
            }
        ]
    },

    "reprompt-opening exercise": {
        "says": [
            "Let's try again:",
            "\"What is the next number in the sequence 2, 4, 6, 8 , ...?\""
        ],
        "reply": [
            {
                "question": "10",
                "answer": "sequence-term-pattern",
            },
            {
                "question": "2",
                "answer": "2",
            },
            {
                "question": "0",
                "answer": "0",
            }
        ]
    },

    /*
    II: 1. introducing terminologies and concepts
        2. test student in finding simple patterns
    */
    "sequence-term-pattern-B": {
        "says": [
            "OK, what's in my mind is 2, 4, 6, 8, 10, 12, 14, 16 ...",
            "💪 We might need some terminologies before heading into more sequences:",
            "Ordered lists of numbers like these are called <span class=\"def\">sequences</span>. Each number in a sequence is called a <span class=\"def\">term</span>.",
            "<img src=\"https://mathbot.stanford.edu/resources/image/1-1.png\" alt=\"sequence1-1\">",
            "Sequences usually have  <span class=\"def\">patterns</span> that allow us to predict what the next term might be.",
            "With these concept in mind, we can revisit our previous example.",
            "2, 4, 6, 8, 10, 12, ...",
            "What is the 4th term?",
        ],
        "reply": [
            {
                "question": "8",
                "answer": "term_2"
            },
            {
                "question": "hint",
                "answer": "hint_term_1"
            }
        ]
    },

    "sequence-term-pattern": {
        "says": [
            "Yes, that's what in my mind as well.",
            "The sequence could be 2, 4, 6, 8, 10, 12, 14, 16 ...",
            "💪 We might need some terminologies before heading into more sequences:",
            "Ordered lists of numbers like these are called <span class=\"def\">sequences</span>. Each number in a sequence is called a <span class=\"def\">term</span>.",
            "<img src=\"https://mathbot.stanford.edu/resources/image/1-1.png\" alt=\"sequence1-1\">",
            "Sequences usually have  <span class=\"def\">patterns</span> that allow us to predict what the next term might be.",
            "With these concept in mind, we can revisit our previous example.",
            "2, 4, 6, 8, 10, 12, ...",
            "What is the 4th term?",
        ],
        "reply": [
            {
                "question": "8",
                "answer": "term_2"
            },
            {
                "question": "hint",
                "answer": "hint_term_1"
            }
        ]
    },

    "hint_term_1": {
        "says": [
            "Well, let's take a look at the following diagram👇: ",
            "<img src=\"https://mathbot.stanford.edu/resources/image/1-1.png\" alt=\"sequence1-1\">",
            ", from which we know the 3rd term is <span class=\"def\">6</span>",
            "Then what is the 4th term of 2, 4, 6, 8, 10, ..."
        ],
        "reply": [
            {
                "question": "8",
                "answer": "term_2"
            },
            {
                "question": "hint",
                "answer": "hint_term_1"
            }
        ]
    },

    "term_2": {
        "says": [
            "Good job! How about this one?",
            "3, 6, 9, 12, 15, ...",
            "What is its 5th term?"
        ],
        "reply": [
            {
                "question": "15",
                "answer": "pattern_example"
            },
            {
                "question": "hint",
                "answer": "hint_term_2"
            }
        ]
    },

    "hint_term_2": {
        "says": [
            "Well, let's take a look at the following diagram again 👇: ",
            "<img src=\"https://mathbot.stanford.edu/resources/image/1-1.png\" alt=\"sequence1-1\">",
            ", from which we know the 3rd term is <span class=\"def\">6</span>",
            "Then what is the 5th term of 3, 6, 9, 12, 15, ... ?",
            "We listed the first 5th numbers"

        ],
        "reply": [
            {
                "question": "15",
                "answer": "pattern_example"
            },
            {
                "question": "hint",
                "answer": "hint_term_2"
            }
        ]
    },

    "pattern_example": {
        "says": [
            "It seems you have understand the concept of <span class=\"def\">term</span> pretty well!",
            "Did you notice there are three dots at the end of those sequence?",
            "Actually, it indicate that the sequence can be extended, even though we only see a few terms.",
            "We only saw the first 5th terms of 3, 6, 9, 12, 15, ...",
            "But do you know what's the next one?"
        ],
        "reply": [
            {
                "question": "18",
                "answer": "pattern_exercise_1",
            },
            {
                "question": "hint",
                "answer": "pattern_example_hint",
            }
        ]
    },

    "pattern_example_hint": {
        "says": [
            "It seems you get some trouble.",
            "Don't be too worry about it. Let's go through each term one by one.",
            "I will draw a picture for you",
            "<img src=\"https://mathbot.stanford.edu/resources/image/1-2.png\" alt=\"sequence1-1\">",
            "This is for our previous example. What is the 4th term (next term)?",
            "(You might already know the answer)"
        ],
        "reply": [
            {
                "question": "8",
                "answer": "pattern_example_retry",
            },
            {
                "question": "hint",
                "answer": "pattern_example",
            }
        ]
    },

    "pattern_example_retry": {
        "says": [
            "Cool. Let's retry this question:",
            "What is the next term of 3, 6, 9, 12, 15, ...",
        ],
        "reply": [
            {
                "question": "18",
                "answer": "pattern_exercise_1",
            },
            {
                "question": "hint",
                "answer": "pattern_example_hint",
            }
        ]
    },

    /*
    Questions A - Next term with pattern
     */


    "pattern_exercise_1": {
        "says": [
            "Great! You are a predictor now!",
            "We have more exercise for you to make sure you did not hit it by luck. 👿",
            "3, 8, 13, ?, ...",
            "What would be the next term?",
        ],
        "reply": [
            {
                "question": "18",
                "answer": "pattern_exercise_2"
            },
            {
                "question": "hint",
                "answer": "pattern_exercise_1_hint"
            }
        ]
    },

    "pattern_exercise_1_hint": {
        "says": [
            "Well, I look into the first 3 terms and I think the pattern to generate next term is:",
            "Add five to the previous term.",
            "3, 8, 13, ?, ...",
            "What would be the next term?",
        ],
        "reply": [
            {
                "question": "18",
                "answer": "pattern_exercise_2"
            },
            {
                "question": "hint",
                "answer": "pattern_exercise_1_hint"
            }
        ]
    },

    "pattern_exercise_2": {
        "says": [
            "Another one you got!",
            "20, 17, 14, ?, ...",
            "What would be the next term?",
        ],
        "reply": [
            {
                "question": "11",
                "answer": "pattern_exercise_3"
            },
            {
                "question": "hint",
                "answer": "pattern_exercise_2_hint"
            }
        ]
    },

    "pattern_exercise_2_hint": {
        "says": [
            "This time the numbers become smaller and smaller!",
            "20 - 3 = 17, and 17 - 3 = 14. What would be the next?",
            "20, 17, 14, ?, ...",
            "What would be the next term?",
        ],
        "reply": [
            {
                "question": "11",
                "answer": "pattern_exercise_3"
            },
            {
                "question": "hint",
                "answer": "pattern_exercise_2_hint"
            }
        ]
    },


    "pattern_exercise_3": {
        "says": [
            "Last one! This one is a bit different.",
            "3, 6, 12, ?, ...",
            "What would be the next term?",
        ],
        "reply": [
            {
                "question": "24",
                "answer": "end"
            },
            {
                "question": "hint",
                "answer": "pattern_exercise_3_hint"
            }
        ]
    },

    "pattern_exercise_3_hint": {
        "says": [
            "On no, the difference between two consecutive terms change.",
            "But wait.. maybe we can get the next term by multiplying something?",
            "3, 6, 12, ?, ...",
            "What would be the next term?",
        ],
        "reply": [
            {
                "question": "24",
                "answer": "end"
            },
            {
                "question": "hint",
                "answer": "pattern_exercise_3_hint"
            }
        ]
    },

    "end": {
        "says": [
            "I am convinced you are a prophet now!",
            "--- in terms of predicting next term.",
            "Great to talk to you today!",
            "See you later and let's explore more math!👋"
        ]
    },

    /*
    Questions B - Match pattern
    */
    "match_pattern_1": {
        "says": [
            "OK let's move on.",
            "This time I need you to help me find the pattern.",
            "4, 11, 18, 25, ...",
            "What is the pattern here?"
        ],
        "reply": [
            {
                "question": "Divide by 2",
                "answer": "findPatternHint"
            },
            {
                "question": "Multiply by 3",
                "answer": "findPatternHint"
            },
            {
                "question": "Add by 7",
                "answer": "match_pattern_2"
            },
            {
                "question": "Subtract by 4",
                "answer": "findPatternHint"
            },

        ]
    },

    "match_pattern_2": {
        "says": [
            "How about this one?",
            "4, 11, 18, 25, ...",
            "What is the pattern?"
        ],
        "reply": [
            {
                "question": "Divide by 2",
                "answer": "match_pattern_3"
            },
            {
                "question": "Multiply by 3",
                "answer": "findPatternHint"
            },
            {
                "question": "Add by 7",
                "answer": "findPatternHint"
            },
            {
                "question": "Subtract by 4",
                "answer": "findPatternHint"
            },
        ]
    },

    "match_pattern_3": {
        "says": [
            "Good job! Another:",
            "100, 96, 92, 88, ...",
            "What is the pattern?"
        ],
        "reply": [
            {
                "question": "Divide by 2",
                "answer": "findPatternHint"
            },
            {
                "question": "Multiply by 3",
                "answer": "findPatternHint"
            },
            {
                "question": "Add by 7",
                "answer": "findPatternHint"
            },
            {
                "question": "Subtract by 4",
                "answer": "match_pattern_4"
            },
        ]
    },

    "match_pattern_4": {
        "says": [
            "Here is the last one:",
            "4, 12, 36, 108, ...",
        ],
        "reply": [
            {
                "question": "Divide by 2",
                "answer": "findPatternHint"
            },
            {
                "question": "Multiply by 3",
                "answer": "arithmetic"
            },
            {
                "question": "Add by 7",
                "answer": "findPatternHint"
            },
            {
                "question": "Subtract by 4",
                "answer": "findPatternHint"
            },
        ]
    }
}
