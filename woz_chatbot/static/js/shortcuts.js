var shortcutTable = {
	intro1: "Hi there! Let me briefly introduce myself. I'm Sally. ",
	intro2: "I’m studying to be a physicist and astronaut. My dream is to someday go to space!",
	intro3: "But I also love spending time with family, friends, playing tennis, and writing.",
	intro4: "For the past few years, I have been studying some of the most interesting topics in mathematics, science, and languages.",
	intro5: "Today, I'm really excited to be sharing some of what I learned with you! I can't wait to get started!",
	intro6: "How about you? Tell me a little about yourself.",
	bye1: "Thanks for going through the mission with me, NAME! I really enjoyed working through it with you.",
	bye2: "Come back soon!",
	well: "Well done!",
	g: "great job!",
	half: "Don’t forget that the box is only half full!"
};

function expandShortcuts(msg) {
	expanded = msg.replace(/::(\w+)::/g, function(match, capture){
		if (shortcutTable.hasOwnProperty(capture)) {
			return shortcutTable[capture];
		} else {
			return match;
		}
	});
	return expanded;
};
