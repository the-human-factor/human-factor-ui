const mockAxios = jest.genMockFromModule('axios');

let time = 0;
let mockResponses = Object.create(null);
let config = Object.create(null);
let currentTokenId = 0;
let pendingRequests = [];

// Used to await a refresh being put on pending.
let requestCallback = () => null;

function create(configArg) {
  config = configArg;
  return mockAxios;
}

function __callbackOnRequest(func) {
  requestCallback = func;
}

function request(config) {
  console.log(`mockAxios.request(${config.url})`);
  requestCallback();
  requestCallback = () => null;

  let res, rej;
  let promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;

  pendingRequests.push({
    config: config,
    promise: promise,
  });

  return promise;
}

function __clearMockResponses() {
  mockResponses = Object.create(null);
}

function __setMockResponse({ endpoint, response }) {
  if (!mockResponses[endpoint]) {
    mockResponses[endpoint] = [];
  }
  mockResponses[endpoint].push(response);
}

function failMissing(req) {
  let error = new Error('Request failed with status code 404');
  error.config = req.config;
  error.response = {
    config: req.config,
    data: '',
    status: 404,
    statusText: 'NOT FOUND',
  };
  req.promise.reject(error);
}

function __resolveAll() {
  const pending = [...pendingRequests];
  pendingRequests = [];

  pending.forEach(req => {
    const posssibleRes = mockResponses[req.config.url] || [];
    if (posssibleRes.length === 0) {
      failMissing(req);
    }

    for (var i = 0; i < posssibleRes.length; i++) {
      const ret = posssibleRes[i](req);
      if (ret instanceof Error) {
        req.promise.reject(ret);
        break;
      } else if (ret !== undefined) {
        req.promise.resolve(ret);
        break;
      }
      failMissing(req);
    }
  });

  return pending;
}

function __cancelToken(token) {
  // loop through the requests and cancel if they have that token
  pendingRequests.forEach(req => {
    if (req.config.cancelToken == token) {
      let error = new Error('Cancel');
      error.axiosCancel = true;
      req.promise.reject(error);
    }
  });
}

function __axiosResponseError(status, statusText) {
  let error = new Error(`${status}(${statusText})`);
  error.response = {
    data: '',
    status: status,
    statusText: statusText,
  };
  return error;
}

function __axiosResponse(status, data) {
  return {
    data: data,
    status: status,
    headers: {},
    config: {},
    request: {},
  };
}

function isCancel(error) {
  return Boolean(error.axiosCancel);
}

const CancelToken = {
  source: () => {
    const result = {
      token: currentTokenId,
      cancel: token => mockAxios.__cancelToken(token),
    };
    currentTokenId++;
    return result;
  },
};

mockAxios.CancelToken = CancelToken;
mockAxios.request = request;
mockAxios.create = create;
mockAxios.request = request;
mockAxios.__setMockResponse = __setMockResponse;
mockAxios.__resolveAll = __resolveAll;
mockAxios.__cancelToken = __cancelToken;
mockAxios.__axiosResponseError = __axiosResponseError;
mockAxios.__axiosResponse = __axiosResponse;
mockAxios.__clearMockResponses = __clearMockResponses;
mockAxios.__callbackOnRequest = __callbackOnRequest;

export default mockAxios;
