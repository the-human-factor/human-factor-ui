import RequestDispatcher, { AUTH_API } from "./requestDispatcher";

// TODO: Keep all the api endpoints in the same place
const CHALLENGE_API = "/challenges";
const RESPONSE_API = "/responses";
const AUTH_PASSWORD_API = `${AUTH_API}/password`;

class HumanApi {
  constructor() {
    this.dispatcher = new RequestDispatcher();

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
    return this.dispatcher
      .loginRegister(credentials)
      .then(res => res.data )
      .catch(error => {
        // TODO wrap this into axios.
        const message = (((error || {}).response || {}).data || {}).message;
        throw message ? new Error(message) : error;
      });
  }

  register(credentials) {
    return this.dispatcher
      .loginRegister(credentials, {isRegister: true})
      .then(res => res.data )
      .catch(error => {
        // TODO wrap this into axios.
        const message = (((error || {}).response || {}).data || {}).message;
        throw message ? new Error(message) : error;
      });
  }

  logout() {
    return this.dispatcher
      .logout()
      .then(res => res.data );
  }

  refresh() {
    return this.dispatcher
      .refresh()
      .then(res => res.data );
  }

  changePassword(values) {
    return this.dispatcher
      .putWithAuth(AUTH_PASSWORD_API, values)
      .then(res => {
        const {user, access_token, refresh_token} = res.data;
        this.dispatcher.updateUserAndTokens(user, access_token, refresh_token);
      });
  }

  createChallenge(challenge) {
    let formData = this.convertToForm(challenge);
    return this.dispatcher
      .postWithAuth(`${CHALLENGE_API}/create`, formData)
      .then(res => res.data );
  }

  createResponse(response) {
    let formData = this.convertToForm(response);
    return this.dispatcher
      .postWithAuth(`${RESPONSE_API}/create`, formData)
      .then(res => res.data );
  }

  fetchChallenges() {
    return this.dispatcher
      .getWithAuth(`${CHALLENGE_API}`)
      .then(res => res.data );
  }

  fetchChallenge(id) {
    return this.dispatcher
      .getWithAuth(`${CHALLENGE_API}/${id}`)
      .then(res => res.data );
  }

  updateChallenge(id, patches) {
    return this.dispatcher
      .putWithAuth(`${CHALLENGE_API}/${id}`, patches)
      .then(res => res.data );
  }

  deleteChallenge(id) {
    return this.dispatcher
      .deleteWithAuth(`${CHALLENGE_API}/${id}`)
      .then(res => undefined);
  }

  fetchResponses() {
    return this.dispatcher
      .getWithAuth(`${RESPONSE_API}`)
      .then(res => res.data );
  }

  fetchResponse(id) {
    return this.dispatcher
      .getWithAuth(`${RESPONSE_API}/${id}`)
      .then(res => res.data );
  }

  convertToForm(obj) {
    var formData = new FormData();
    for (const [key, val] of Object.entries(obj)) {
      formData.append(key, val);
    }
    return formData;
  }
}

export default new HumanApi();
