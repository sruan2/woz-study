var shortcutTable = {
	name_intro: 'Hi there! Let me briefly introduce myself. \
				I\'m Ada. Well actually, my real name is Augusta, \
				but most people just call me Ada.',
	ada_favs: 'Some of my favorite things to do include spending time with \
					  family, friends and my dog Buddy - he\'s so fun to play with!',
	ada_edu: 'For the past few years, I\'ve been studying some of the most \
				interesting topics in mathematics, science, and languages.',
	ada_motivate:'I\'m really excited to be sharing some of what I learned with you! \
				 Let\'s get started!',
	ada_prompt: 'How about you? Tell me a little about yourself.'
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

