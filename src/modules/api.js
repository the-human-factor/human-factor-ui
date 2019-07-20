import config from "config";

const API = config["API"];
const CHALLENGE_API = `${API}/challenges`;
const RESPONSE_API = `${API}/responses`;
const AUTH_API = `${API}/auth`;


class HumanApi {
  constructor() {
    this.token = "";
    this.authenticatedFetch = this.authenticatedFetch.bind(this);
  }

  setToken(token) {
    // The token should be kept in sync with the user slice, so that the redux
    // records are sensible.
    this.token = token;
  }

  authenticatedFetch(resource, init) {
    if (!init.headers) {
      init.headers = new Headers();
    }
    init.headers.set('Authorization', `Basic ${this.token}`);
    return fetch(resource, init);
  }

  fetchUser() {
    return this.authenticatedFetch(`${AUTH_API}/status`, {
      method: "GET",
    })
      .then(res => {
        console.log("Got auth/status response");
        console.log(res);
      });
  }

  login() {
    // TODO
  }

  logout() {
    // TODO
  }

  register() {
    // TODO
  }

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
      .then(res => res.json(), {
        mode: "cors"
      })
      .catch(error => {
        console.error("Failed to fetch challenges");
      });
  }
}

export default new HumanApi();
