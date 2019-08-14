import axios from 'axios';
import config from "config";
import lodash from "lodash";

const API = config["API"];
const CHALLENGE_API = "/challenges";
const RESPONSE_API = "/responses";
const AUTH_API = "/auth";
const AUTH_REFRESH_API = "/auth/refresh";

class PendingRequest {
  constructor({config,
               isRefreshRequest=false,
               isAuthRequest=false,
               inFlight=false,
               cancel=() => void 0 }) {

    this.promise = new Promise((resolve, reject) => {
      res = resolve;
      rej = reject;
    });
    this.promise.resolve = res;
    this.promise.reject = rej;
    
    this.config = config;
    this.isRefreshRequest = isRefreshRequest;
    this.isAuthRequest = isAuthRequest;
  }
}

class TokenStorage {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken') || "";
    this.refreshToken = localStorage.getItem('refreshToken') || "";
    
    this.store = this.store.bind(this);
  }

  store(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    try {
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
    } catch (err) {
      console.error("Failed to save token to local storage");
      console.error(err);
    }
  }
}

class ApiDispatcher {
  constructor() {
    this.pendingRequests = [];

    this.tokenStorage = new TokenStorage();

    this.errorInterceptor = this.errorInterceptor.bind(this);

    this.axios = axios.create({
      baseURL: API,
    })

    axios.interceptors.response.use(response => response, errorInterceptor);
  }

  errorInterceptor(error) {
    // Return any error which is not due to authentication back to the calling service
    if (error.response.status !== 401) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    // Logout user if token refresh didn't work
    if (error.config.url == AUTH_REFRESH_API) {
      this.clearTokens();
      this.becameUnauthenticated();
      return new Promise((resolve, reject) => { reject(error); });
    }

    // Try request again with new token
    return TokenStorage.getNewToken()
      .then((token) => {

        // New request with new token
        const config = error.config;
        config.headers['Authorization'] = `Bearer ${token}`;

        return new Promise((resolve, reject) => {
          axios.request(config).then(response => {
            resolve(response);
          }).catch((error) => {
            reject(error);
          })
        });

      })
      .catch((error) => {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      });
  }

  refresh() {
    const self = this;

    const req = new PendingRequest({
      config: {
        method: "post",
        headers: {"Authorization", `Bearer ${this.tokenStorage.refreshToken}`},
        validStatus: status => status == 200
      },
      isRefreshRequest: true
    });
    this.pendingRequests.push(req);

    this.cycle();

    return req.promise
      .then(res => {
        console.log(res);
        self.tokenStorage.store("a", "b");
      })

    
    let init = this.setAuthHeader({ method: "GET" }, this.refreshToken);
    return fetch(`${AUTH_API}/refresh`, init)
      .then(res => {
        if (!res.ok) {
          throw Error(`refreshUser failed: ${res.status} (${res.statusText})`);
        }

        return res
          .json()
          .then(json => {
            self.token = json.access_token;
            try {
              self.saveTokensToLocalStore();
            } catch (err) {
              console.error("Failed to save token to local storage");
              console.error(err);
            }
            return json.user;
          });
      });
  }

  postData(url, data, isAuthRequest) {
    const req = new PendingRequest({
      config: {
        method: "post",
        data: data,
        headers: {},
      },
      isAuthRequest: isAuthRequest,
    });
    this.pendingRequests.push(req);

    this.cycle();

    return req.promise;
  }

  cycle() {
    if (!this.authorized) {
      for (const req of this.pendingRequests) {
        if (!req.inFlight) {
          if (req.requiresAuth)
        } 
      }
    }
    // Am I authorized?
    // 
    // States:
    // Ok!
    // Needs Authentication
    // Fail
  }


  setAuthHeader(init, token) {
    if (!init.headers) {
      init.headers = new Headers();
    }
    init.headers.set("Authorization", `Bearer ${token}`);
    return init;
  }

  authFetch(resource, init) {
    if (this.pendingRefresh) {
      return this.authFetchAfterRefresh(resource, init);
    }

    if (!this.hasValidAccessToken()) {
      if (!this.hasValidRefreshToken()) {
        this.becameUnauthenticated();
        this.token = "";
        this.refreshToken = "";
        throw Error("Missing tokens, cannot make authenticated fetch");
        // TODO: This would suck if it happened in the middle
        // of a user doing something. Maybe anticipate logout?
      }
      return this.authFetchAfterRefresh(resource, init);
    }

    const newInit = this.setAuthHeader(init, this.token);
    return fetch(resource, newInit).then(res => { return res });
  }


}

class HumanApi {
  constructor(apiDispatcher) {
    this.becameUnauthenticated = () => {
      throw Error("becameUnauthenticated should be set by a redux action.");
    }

    this.setAuthHeader = this.setAuthHeader.bind(this);
    this.authFetch = this.authFetch.bind(this);
    this.refreshUser = this.refreshUser.bind(this);
    this.hasValidAccessToken = this.hasValidAccessToken.bind(this);
    this.hasValidRefreshToken = this.hasValidRefreshToken.bind(this);

    this.pendingRefresh = false;
    this.pendingRequestQueue = [];
  }

  

  authFetchAfterRefresh(resource, init) {
    this.pendingRequestQueue.push({resource: resource, init: init});
    
    if (!this.pendingRefresh) {
      this.pendingRefresh = true;
      this.refreshUser()
          .then(user => {
            this.pendingRefresh = false;
            // Loop through all the pendingRequests
            return user;
          })
          .catch(err => {
            this.pendingRefresh = false;
            throw err;
          });
    } else {
      this.pendingRequestChain = this.pendingRequestChain.then(res => {
        const newInit = this.setAuthHeader(init, this.token);
        return fetch(resource, newInit).then(res => { return res });
      });
    }
  }

  getUser() {
    return new Promise((resolve, reject) => {
      this.token = this.token || localStorage.getItem("userToken");
      this.refreshToken = this.refreshToken || localStorage.getItem("refreshToken");

      if (!this.hasValidAccessToken() && !this.hasValidRefreshToken()) {
        reject("Missing tokens");
      } else {
        this.refreshUser()
          .then(user => {resolve(user)})
          .catch(err => {reject(err)});
      }
    });
  }

  // TODO: DRY: login and register and refresh are almost exactly the same
  login(credentials) {
    const self = this;
    return fetch(`${AUTH_API}/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(`Login failed: ${res.status} (${res.statusText})`);
        }

        return res
          .json()
          .then(json => {
            self.token = json.access_token;
            self.refreshToken = json.refresh_token;
            try {
              self.saveTokensToLocalStore();
            } catch (err) {
              console.error("Failed to save token to local storage");
              console.error(err);
            }
            return json.user;
          });
      })
      .catch(error => {
        console.error("Failed to log in:", error);
        throw error;
      });
  }

  register(credentials) {
    const self = this;
    return fetch(`${AUTH_API}/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(`Register failed: ${res.status} (${res.statusText})`);
        }

        return res
          .json()
          .then(json => {
            self.token = json.access_token;
            self.refreshToken = json.refresh_token;
            try {
              self.saveTokensToLocalStore();
            } catch (err) {
              console.error("Failed to save token to local storage");
              console.error(err);
            }
            return json.user;
          });
      })
      .catch(error => {
        console.error("Failed to register:", error);
        throw error;
      });
  }

  refreshUser() {
    const self = this;
    let init = this.setAuthHeader({ method: "GET" }, this.refreshToken);
    return fetch(`${AUTH_API}/refresh`, init)
      .then(res => {
        if (!res.ok) {
          throw Error(`refreshUser failed: ${res.status} (${res.statusText})`);
        }

        return res
          .json()
          .then(json => {
            self.token = json.access_token;
            try {
              self.saveTokensToLocalStore();
            } catch (err) {
              console.error("Failed to save token to local storage");
              console.error(err);
            }
            return json.user;
          });
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
    return this.authFetch(`${CHALLENGE_API}/create`, {
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
    return this.authFetch(`${RESPONSE_API}/create`, {
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
    return this.authFetch(`${CHALLENGE_API}`, {
      mode: "cors"
    })
      .then(res => res.json())
      .catch(error => {
        console.error("Failed to fetch challenges", error);
      });
  }

  fetchResponses() {
    return this.authFetch(`${RESPONSE_API}`)
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
    this.token = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  saveTokensToLocalStore() {
    localStorage.setItem('accessToken', this.token);
    localStorage.setItem('refreshToken', this.refreshToken);
  }

  readToken(str) {
    const parts = str.split(".");
    return {
      header: atob(parts[0]),
      body: atob(parts[1]),
      signature: atob(parts[2])
    }
  }

  tokenHasValidTime(token) {
    const time = Math.floor( Date.now() / 1000 );
    return token.body.nbf < time && time < token.body.exp;
  }

  hasValidAccessToken() {
    return Boolean(this.token) &&
        this.tokenHasValidTime(this.readToken(this.token));
  }

  hasValidRefreshToken() {
    return Boolean(this.refreshToken) &&
        this.tokenHasValidTime(this.readToken(this.refreshToken));
  }
}

export default new HumanApi(new ApiDispatcher);
