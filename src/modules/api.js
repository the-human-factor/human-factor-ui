import RequestDispatcher from "./requestDispatcher";

const CHALLENGE_API = "/challenges";
const RESPONSE_API = "/responses";

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
        try {
          const data = error.response.data;
          error = new Error(data.message);
        } catch(err) {
          console.error(err);
        };
        throw error;
      });
  }

  register(credentials) {
    return this.dispatcher
      .loginRegister(credentials, {isRegister: true})
      .then(res => res.data )
      .catch(error => {
        try {
          const data = error.response.data;
          error = new Error(data.message);
        } catch(err) {
          console.error(err);
        };
        throw error;
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

  fetchResponses() {
    return this.dispatcher
      .getWithAuth(`${RESPONSE_API}`)
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
