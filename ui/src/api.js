class HumanApi {
  constructor() {
    this.endpoint = "/api/";
    this.videosEndpoint = this.endpoint + "videos";
    this.createChallengeEndpoint = this.endpoint + "challenges/create";
    this.listChallengesEndpoint = this.endpoint + "challenges"
    this.listUsersEndpoint = this.endpoint + "users"
    this.challenges = {};
    this.responses = {};

    // this.challenges =
    //   [{
    //     'challengeId': '45',
    //     'name': "car_crash",
    //     'instructions': "How much empathy do you have for bad drivers?",
    //     'gradingCriteria': "Does the viewer cringe?",
    //     'link': "https://fat.gfycat.com/PowerlessDiligentAstarte.webm",
    //     'author': "Brian Basham",
    //   }, {
    //     'challengeId': '202',
    //     'name': "big_buck_bunny",
    //     'instructions': "Smile when you see animals!?",
    //     'gradingCriteria': "Does the viewer smile when they see animals?",
    //     'link': "https://storage.googleapis.com/the-human-factor-videos/19f32a31-5fd8-4ec9-85c4-5dc9216795f6",
    //     'author': "Leo Urbina",
    //   }, {
    //     'challengeId': '345',
    //     'name': 'brian_prices',
    //     'instructions': "Find out what Brian's budget is",
    //     'gradingCriteria': "How empathetic and curious are you?",
    //     'link': "https://storage.googleapis.com/the-human-factor-videos/d8912f88-3726-48e5-b280-fde3bf17d2b4",
    //     'author': "Brian Basham"
    //   }, {
    //     'challengeId': '888',
    //     'name': 'alex_cant_trust_tech',
    //     'instructions': "Find a way forward in the conversation",
    //     'gradingCriteria': "How empathetic and curious are you?",
    //     'link': "https://storage.googleapis.com/the-human-factor-videos/70e70f89-072e-4de1-9357-5214e5d6d6c9",
    //     'author': "Alex Warren"
    //   }];

    // this.responses =
    //   [{
    //     'responseId': '111',
    //     'challengeId': '345',
    //     'responder': "Leo Urbina",
    //     'notes': "I think I did OK.",
    //     'link': "https://storage.googleapis.com/the-human-factor-videos/cedd88e6-0841-4d2f-8b8e-123bc475f7a7",
    //   }, {
    //     'responseId': '505',
    //     'challengeId': '345',
    //     'responder': "Alex Warren",
    //     'notes': "That was uncomfortable.",
    //     'link': "https://storage.googleapis.com/the-human-factor-videos/c1c57ea6-00bd-432f-a71c-09c7685ae70f"
    //   }, {
    //     'responseId': '999',
    //     'challengeId': '888',
    //     'responder': "Brian Basham",
    //     'notes': "Couldn't stop laughing.",
    //     'link': "https://storage.googleapis.com/the-human-factor-videos/10ded6f0-5e9f-45a9-88ce-a273cd1bb4ad",
    //   }];
  }



  getChallenge(id) {
    if (!(id in this.challenges)) {
      console.error("Missing id, ", id)
    }
    return this.challenges[id];
  }

  getResponseIds() {
    return this.responses.map((response) => {
      return response.responseId
    });
  }

  getResponse(responseId) {
    for (let response of this.responses) {
      if (response.responseId === responseId) {
        return response;
      }
    }
    alert('no such response' + responseId);
  }

  getChallenges(callback) {
    fetch(this.listChallengesEndpoint, {
      method: 'GET'
    }).catch(error => {
      console.error('Failed to getChallenges:', error);
    }).then(response => {
      response.json().then((result) => {
        result.forEach(challenge => {
          this.challenges[challenge.id] = challenge;
        });
        callback(result);
      });
    });
  }

  getUsers(ids, callback) {
    let url = this.listUsersEndpoint + '?ids=' + ids.join(',');
    fetch(url, {
      method: 'GET',
    }).catch(error => {
      console.error('Failed to getChallenges:', error);
    }).then(response => {
      response.json().then(callback);
    });
  }

  createChallenge(challenge, callback) {
    let formData = this.convertToForm(challenge);
    fetch(this.createChallengeEndpoint, {
      method: 'POST',
      body: formData
    }).catch(error => {
      console.error('Failed to createChallenge:', error);
    }).then(response => {
      callback(response);
    });
  }

  convertToForm(obj) {
    var formData = new FormData();
    for (const [key, val] of Object.entries(obj)) {
      formData.append(key, val)
    }
    return formData;
  }
}


export default HumanApi;