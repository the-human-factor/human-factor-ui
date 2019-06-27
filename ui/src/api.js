class HumanApi {
    constructor() {
	this.challenges = 
	    [
	     {
		 'challengeId': '45',
		 'name': "car_crash",
		 'instructions': 
		 "How much empathy do you have for bad drivers?",
		 'gradingCriteria': "Does the viewer cringe?",
		 'link': "https://fat.gfycat.com/PowerlessDiligentAstarte.webm",
		 'author': "Brian Basham",
	     },
	     {
		 'challengeId': '202',
		 'name': "big_buck_bunny",
		 'instructions': 
		 "Smile when you see animals!?",
		 'gradingCriteria': "Does the viewer smile when they see animals?",
		 'link': "http://dl5.webmfiles.org/big-buck-bunny_trailer.webm",
		 'author': "Leo Urbina",
	     }];
    
   
	this.responses = 
	    [
	     {
		 'responseId': '111',
		 'challengeId': '45',
		 'responser': "Brian Basham",
		 'notes': "This is weird",
		 'link': "http://dl5.webmfiles.org/big-buck-bunny_trailer.webm",
	     }
	     ]
	    }
    
    getChallengeIds() {
	return this.challenges.map((challenge) => {return challenge.challengeId});
    }

    getChallenge(challengeId) {
	for (let challenge of this.challenges) {
		console.log(challenge);
		console.log(challengeId);
		if (challenge.challengeId === challengeId) {
		    return challenge;
		}
	}
	alert('no such challenge' + challengeId);
    }
}   
    
export default HumanApi;