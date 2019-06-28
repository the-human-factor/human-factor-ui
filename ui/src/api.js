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
		 'link': "https://storage.googleapis.com/the-human-factor-videos/19f32a31-5fd8-4ec9-85c4-5dc9216795f6",
		 'author': "Leo Urbina",
	     },
	     {'challengeId': '345', 
	      'name': 'brian_prices',
	      'instructions': "Find out what Brian's budget is",
	      'gradingCriteria': "How empathetic and curious are you?",
	      'link': "https://storage.googleapis.com/the-human-factor-videos/d8912f88-3726-48e5-b280-fde3bf17d2b4",
	      'author': "Brian Basham"
	     }];
    
   
	this.responses = 
	    [
	     {
		 'responseId': '111',
		 'challengeId': '345',
		 'responder': "Leo Urbina",
		 'notes': "I think I did OK.",
		 'link': "https://storage.googleapis.com/the-human-factor-videos/cedd88e6-0841-4d2f-8b8e-123bc475f7a7",
	     },
	     {
		 'responseId': '505',
		 'challengeId': '345',
		 'responder': "Alex Warren",
		 'notes': "That was uncomfortable.",
		 'link': "https://storage.googleapis.com/the-human-factor-videos/c1c57ea6-00bd-432f-a71c-09c7685ae70f"
	     }
	     ]


	    }
    
    getChallengeIds() {
	return this.challenges.map((challenge) => {return challenge.challengeId});
    }

    getChallenge(challengeId) {
	for (let challenge of this.challenges) {
	    if (challenge.challengeId === challengeId) {
		    return challenge;
		}
	}
	alert('no such challenge' + challengeId);
    }
    
    getResponseIds() {
	return this.responses.map((response) => {return response.responseId});
    }

    getResponse(responseId) {
	for (let response of this.responses) {
	    if (response.responseId === responseId) {
		return response;
	    }
	}
	alert('no such response' + responseId);
    }

    
}   
    
export default HumanApi;