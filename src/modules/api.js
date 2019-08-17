import axios from 'axios';
import config from "config";
import lodash from "lodash";

const API = config["API"];
const CHALLENGE_API = "/challenges";
const RESPONSE_API = "/responses";
const AUTH_API = "/auth";
const AUTH_REFRESH_API = `${AUTH_API}/refresh`;
const AUTH_LOGIN_API = `${AUTH_API}/login`;
const AUTH_REGISTER_API = `${AUTH_API}/register`;
const AUTH_LOGOUT_API = `${AUTH_API}/logout`;

class TokenStorage {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    if (this.accessToken === "undefined") {
      this.accessToken = "";
    }
    this.refreshToken = localStorage.getItem('refreshToken');
    if (this.refreshToken === "undefined") {
      this.refreshToken = "";
    }
    
    this.store = this.store.bind(this);
  }

  storeAccessToken(token) {
    this.store(token, this.refreshToken);
  }

  store(accessToken, refreshToken) {
    if (accessToken && refreshToken) {
      console.log(`store TOKENS w/ lens: ${accessToken.length} ${refreshToken.length}`);
    }
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

  hasValidRefreshToken() {
    return this.refreshToken && 
           this.tokenHasValidTime(this.readToken(this.refreshToken));
  }

  readToken(str) {
    const parts = str.split(".");
    return {
      header: JSON.parse(atob(parts[0])),
      body: JSON.parse(atob(parts[1])),
      signature: parts[2]
    }
  }

  tokenHasValidTime(token) {
    const time = Math.floor( Date.now() / 1000 );
    return token.body.nbf < time && time < token.body.exp;
  }
}

class PendingRequest {
  constructor({config,
               requiresAuth=false,
               maxRetries=2,
               cancel=() => void 0 }) {

    let res, rej;

    this.promise = new Promise((resolve, reject) => {
      res = resolve;
      rej = reject;
    });
    this.promise.resolve = res;
    this.promise.reject = rej;

    this.config = config;
    this.requiresAuth = requiresAuth;
    this.inFlight = false;
    this.finished = false;
    this.tries = 0;
  }

  cancelAndFinish() {
    this.cancel();
    this.finished = true;
  }
}

const DISPATCHER_STATE = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  AWAITING_REFRESH: "AWAITING_REFRESH",
  AWAITING_LOGIN_REGISTER: "AWAITING_LOGIN_REGISTER",
  AWAITING_LOGOUT: "AWAITING_LOGOUT",
  AUTHENTICATED: "AUTHENTICATED"
}

class ApiDispatcher {
  constructor() {
    this.updateUser = () => {
      throw Error("ApiDispatcher.updateUser needs to be set by parent.");
    }

    this.pendingRequests = [];
    this.pendingAuthCancel = undefined;

    this.state = DISPATCHER_STATE.UNAUTHENTICATED;

    this.tokenStorage = new TokenStorage();

    this.cancelInFlightRequiringAuth = this.cancelInFlightRequiringAuth.bind(this);
    this.cancelAndFinishInFlightRequiringAuth = this.cancelAndFinishInFlightRequiringAuth.bind(this);
    this.loginRegister = this.loginRegister.bind(this);
    this.logout = this.logout.bind(this);
    this.refresh = this.refresh.bind(this);
    this.request = this.request.bind(this);
    this.cycle = this.cycle.bind(this);

    this.axios = axios.create({
      baseURL: API,
      validateStatus: status => status >= 200 || status < 300
    });
  }

  cancelInFlightRequiringAuth() {
    for (const req of this.pendingRequests) {
      if (req.requiresAuth && req.inFlight) {
        req.cancel();
      }
    }
  }

  cancelAndFinishInFlightRequiringAuth() {
    for (const req of this.pendingRequests) {
      if (req.requiresAuth && req.inFlight) {
        req.cancelAndFinish();
      }
    }
  }

  loginRegister(credentials, {isRegister=false}={}) {
    const self = this;

    if (this.state !== DISPATCHER_STATE.UNAUTHENTICATED) {
      const error = new Error("Login aborted while because dispatcher state !== DISPATCHER_STATE.UNAUTHENTICATED");
      return new Promise((resolve, reject) => { reject(error) });
    }

    this.state = DISPATCHER_STATE.AWAITING_LOGIN_REGISTER;
    this.cancelAndFinishInFlightRequiringAuth();

    const config = {
      method: "post",
      url: isRegister ? AUTH_REGISTER_API : AUTH_LOGIN_API,
      data: credentials
    }

    return new Promise((resolve, reject) => {
      this.axios.request(config).then(res => {
        self.tokenStorage.store(res.data.access_token, res.data.refresh_token);
        self.updateUser(res.data.user);
        self.state = DISPATCHER_STATE.AUTHENTICATED;
        self.cycle();
        resolve(res);
      }).catch((error) => {
        self.state = DISPATCHER_STATE.UNAUTHENTICATED;
        self.tokenStorage.store("", "");
        self.updateUser(undefined);
        self.cycle(); // This will clear all pending auth requests.
        reject(error);
      });
    });
  }

  logout() {
    const self = this;

    const config = {
      method: "post",
      url: AUTH_LOGOUT_API,
      headers: {Authorization: `Bearer ${this.tokenStorage.refreshToken}`}
    }

    this.tokenStorage.store("", "");

    if (this.state !== DISPATCHER_STATE.AUTHENTICATED) {
      const error = new Error("Logout aborted while because dispatcher state !== DISPATCHER_STATE.AUTHENTICATED");
      return new Promise((resolve, reject) => { reject(error) });
    }

    this.state = DISPATCHER_STATE.AWAITING_LOGOUT;
    this.cancelAndFinishInFlightRequiringAuth();

    const finish = (promiseClose, result) => {
      self.updateUser(undefined);
      self.state = DISPATCHER_STATE.UNAUTHENTICATED;
      self.cycle();
      promiseClose(result);
    };

    return new Promise((resolve, reject) => {
      this.axios.request(config).then(res => {
        finish(resolve, res);
      }).catch((error) => {
        finish(reject, error);
      });
    });
  }

  refresh() {
    const self = this;

    if (this.state === DISPATCHER_STATE.AWAITING_LOGIN_REGISTER ||
        this.state === DISPATCHER_STATE.AWAITING_LOGOUT) {
      const error = new Error(`Refresh aborted while because dispatcher state = DISPATCHER_STATE.${this.state}`);
      return new Promise((resolve, reject) => { reject(error) });
    }

    if (!this.tokenStorage.hasValidRefreshToken()) {
      return new Promise((resolve, reject) => {
        self.updateUser(undefined);
        reject(new Error("invalid refresh token"));
      });
    }

    this.state = DISPATCHER_STATE.AWAITING_REFRESH;
    this.cancelInFlightRequiringAuth();

    const config = {
      method: "post",
      url: AUTH_REFRESH_API,
      headers: {Authorization: `Bearer ${this.tokenStorage.refreshToken}`}
    }

    return new Promise((resolve, reject) => {
      this.axios.request(config).then(res => {
        self.tokenStorage.storeAccessToken(res.data.access_token);
        self.updateUser(res.data.user);
        self.state = DISPATCHER_STATE.AUTHENTICATED;
        self.cycle();
        resolve(res);
      }).catch((error) => {
        self.state = DISPATCHER_STATE.UNAUTHENTICATED;
        self.tokenStorage.store("", "");
        self.updateUser(undefined);
        self.cycle(); // This will clear all pending auth requests.
        reject(error);
      });
    });
  }

  request(url, {data={}, method="post", requiresAuth=false}={}) {
    const req = new PendingRequest({
      config: {
        url: url,
        method: method,
        data: data,
        headers: {}
      },
      requiresAuth: requiresAuth,
    });

    console.log("PUSH REQUEST");
    console.log(req);

    this.pendingRequests.push(req);

    this.cycle();

    return req.promise;
  }

  getWithAuth(url) {
    return this.request(url, {method: "get", requiresAuth: true});
  }

  postWithAuth(url, data) {
    return this.request(url, {data: data, requiresAuth: true});
  }

  cycle() {
    const self = this;
    this.pendingRequests = this.pendingRequests.filter(req => !req.finished);

    console.log(this.state);

    loop: for (const req of this.pendingRequests) {
      if (req.requiresAuth) {
        switch (this.state) {
          case DISPATCHER_STATE.AUTHENTICATED:
            // We can make new requests
            break;
          case DISPATCHER_STATE.AWAITING_REFRESH:
            // Nothing to do yet
            continue loop;
          default:
            // If unauthenticated or awaiting login / register, ensure canceled.
            if (req.inFlight) {
              req.cancelAndFinish();
            }
            req.reject(new Error("Unauthenticated and not refreshing"));
            continue loop;
        }

        if (req.inFlight) {
          continue;
        }
        
        req.config.headers.Authorization = `Bearer ${this.tokenStorage.accessToken}`;
        this.axios.request(req.config).then(res => {
          req.promise.resolve(res);
          req.finished = true;
          self.cycle();
        }).catch((error) => {
          console.log(req.tries);
          if (axios.isCancel(error)) {
            req.inFlight = false;
          } else if (error.response.status !== 401 || req.tries >= req.maxRetries) {
            req.promise.reject(error);
            req.finished = true;
          } else {
            req.inFlight = false;
            self.refresh();
          }
          self.cycle();
        });
        req.inFlight = true;
        req.tries++;
      } else {
        this.axios.request(req.config).then(res => {
          req.promise.resolve(res);
          req.finished = true;
          self.cycle();
        }).catch((error) => {
          if (axios.isCancel(error) && req.tries <= req.maxRetries) {
            req.inFlight = false;
          } else {
            req.promise.reject(error);
            req.finished = true;
          }
          self.cycle();
        });
        req.inFlight = true;
      }
    }
  }
}

class HumanApi {
  constructor() {
    this.dispatcher = new ApiDispatcher();
    // TODO: Improve this Wierd pattern to get the redux callback in here...
    this.updateUser = () => {
      throw Error("updateUserInRedux should be set to call a redux thunk.");
    }
    this.dispatcher.updateUser = (user) => {
      this.updateUser(user);
    }

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.logout = this.logout.bind(this);
    this.refresh = this.refresh.bind(this);
    this.createChallenge = this.createChallenge.bind(this);
    this.createResponse = this.createResponse.bind(this);
    this.fetchChallenges = this.fetchChallenges.bind(this);
    this.fetchResponses = this.fetchResponses.bind(this);
  }

  login(credentials) {
    return this.dispatcher.loginRegister(credentials);
  }

  register(credentials) {
    return this.dispatcher.loginRegister(credentials, {isRegister: true});
  }

  logout() {
    return this.dispatcher.logout();
  }

  refresh() {
    return this.dispatcher.refresh();
  }

  createChallenge(challenge) {
    let formData = this.convertToForm(challenge);
    return this.dispatcher.postWithAuth(`${CHALLENGE_API}/create`, formData);
  }

  createResponse(response) {
    let formData = this.convertToForm(response);
    return this.dispatcher.postWithAuth(`${RESPONSE_API}/create`, formData);
  }

  fetchChallenges() {
    // TODO: Does this still need "cors"?
    return this.dispatcher.getWithAuth(`${CHALLENGE_API}`);
  }

  fetchResponses() {
    return this.dispatcher.getWithAuth(`${RESPONSE_API}`);
  }

  convertToForm(obj) {
    var formData = new FormData();
    for (const [key, val] of Object.entries(obj)) {
      // TODO: Do this for requests and responses with Axios??????
      formData.append(lodash.snakeCase(key), val);
    }
    return formData;
  }
}

export default new HumanApi();
