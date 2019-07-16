import config from "./config";

const API = config["API"];
const CHALLENGE_API = `${API}/challenges`;
const RESPONSE_API = `${API}/responses`;

class HumanApi {
  createChallenge(challenge) {
    let formData = this.convertToForm(challenge);
    return fetch(`${CHALLENGE_API}/create`, {
      method: "POST",
      body: formData
    })
      .then(res => {
        return res.json();
      })
      .catch(error => {
        console.error("Failed to createChallenge:", error);
      });
  }

  createResponse(response) {
    let formData = this.convertToForm(response);
    return fetch(`${RESPONSE_API}/create`, {
      method: "POST",
      body: formData
    })
      .then(res => {
        return res.json();
      })
      .catch(error => {
        console.error("Failed to createResponse:", error);
      });
  }

  convertToForm(obj) {
    var formData = new FormData();
    for (const [key, val] of Object.entries(obj)) {
      formData.append(key, val);
    }
    return formData;
  }

  fetchChallenges() {
    return fetch(`${CHALLENGE_API}`, {
      mode: "cors"
    })
      .then(res => res.json())
      .catch(error => {
        console.error("Failed to fetch challenges", error);
      });
  }

  fetchResponses() {
    return fetch(`${RESPONSE_API}`)
      .then(res => res.json())
      .catch(error => {
        console.error("Failed to fetch challenges");
      });
  }
}

export default new HumanApi();
