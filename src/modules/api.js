import config from "config";
import lodash from "lodash";

const API = config["API"];
const CHALLENGE_API = `${API}/challenges`;
const RESPONSE_API = `${API}/responses`;
const AUTH_API = `${API}/auth`;


class HumanApi {
  constructor() {
    this.token = "";
    this.refreshToken = "";

    this.setAuthHeader = this.setAuthHeader.bind(this);
    this.authenticatedFetch = this.authenticatedFetch.bind(this);
    this.refreshUser = this.refreshUser.bind(this);
  }

  // setToken(token) {
  //   // The token should be kept in sync with the user slice, so that the redux
  //   // records are sensible.
  //   // Actually probably better to keep the token out of the redux store
  //   // and instead just keep it locally in the api
  //   // But that needs to be updated nicely
  //   this.token = token;
  // }

  getUser() {
    return new Promise((resolve, reject) => {
      this.token = this.token || localStorage.getItem("userToken");
      this.refreshToken = this.refreshToken || localStorage.getItem("refreshToken");

      if (this.token) {
        // TODO: decrypt the token and see if the expiration is after now.
        // let user = {name: 'Alex'};
        // return new Promise(resolve => resolve(user));
        reject("Not implemented");
      } else if (this.refreshToken) {
        this
          .refreshUser()
          .then(user => {resolve(user)})
          .catch(error => {reject(error)});
      } else {
        reject("Missing tokens");
      }
    });
  }

  setAuthHeader(init, token) {
    if (!init.headers) {
      init.headers = new Headers();
    }
    init.headers.set("Authorization", `Bearer ${token}`);
    return init;
  }

  authenticatedFetch(resource, init) {
    if (!this.token) {
      if (!this.refreshToken) {
        throw "Missing tokens, can not make authenticated fetch";
      }
      // TODO: Refresh token here?
      throw "unimplemented";
    }
    let init = this.setAuthHeader(init, this.token);
    return fetch(resource, init)
      .catch(error => {
        console.log(error);
        throw error;
        // TODO: use refresh token if that is possible
        // Also what if there are multiple of these that
        // have a race condition 0_o
      });
  }

  login(credentials) {
    let formData = this.convertToForm(credentials);
    return fetch(`${AUTH_API}/logon`, {
      method: "POST",
      body: formData
    })
      .then(res => {
        let obj = res.json();
        console.log(obj);
        return obj.user;
      })
      .catch(error => {
        console.error("Failed to log in:", error);
      });
  }

  register(credentials) {
    let formData = this.convertToForm(credentials);
    return fetch(`${AUTH_API}/register`, {
      method: "POST",
      body: formData
    })
      .then(res => {
        let obj = res.json();
        console.log(obj);
        return obj.user;
      })
      .catch(error => {
        console.error("Failed to log in:", error);
      });
  }

  refreshUser() {
    let init = this.setAuthHeader({ method: "GET" }, this.refreshToken);
    return this.fetch(`${AUTH_API}/refresh`, init)
      .then(res => {
        console.log("Got auth/status response");
        console.log(res);
      });
  }

  logoff() {
    let init = this.setAuthHeader({ method: "GET" }, this.refreshToken);
    // TODO: Delete the local storage and tokens no matter what?
    return this.fetch(`${AUTH_API}/logout`, init)
      .then(res => {
        console.log("Successful Log Out");
        console.log(res);
      });
  }

  createChallenge(challenge) {
    let formData = this.convertToForm(challenge);
    return authenticatedFetch(`${CHALLENGE_API}/create`, {
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
    return authenticatedFetch(`${RESPONSE_API}/create`, {
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

  fetchChallenges() {
    return authenticatedFetch(`${CHALLENGE_API}`, {
      mode: "cors"
    })
      .then(res => res.json())
      .catch(error => {
        console.error("Failed to fetch challenges", error);
      });
  }

  fetchResponses() {
    return authenticatedFetch(`${RESPONSE_API}`)
      .then(res => res.json(), {
        mode: "cors"
      })
      .catch(error => {
        console.error("Failed to fetch challenges");
      });
  }

  convertToForm(obj) {
    var formData = new FormData();
    for (const [key, val] of Object.entries(obj)) {
      formData.append(lodash.snakeCase(key), val);
    }
    return formData;
  }

  loadTokensFromLocalStore() {
    try {
      this.token = localStorage.getItem('userToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    } catch (err) {
      console.error(err);
    }
  }

  saveTokensToLocalStore() {
    try {
      localStorage.setItem('userToken', this.token);
      localStorage.setItem('refreshToken', this.refreshToken);
    } catch (err) {
      console.error(err)
    }
  }
}

export default new HumanApi();
