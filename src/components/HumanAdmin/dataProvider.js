import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE,
} from 'react-admin';
import * as jsonpatch from 'fast-json-patch';

import api from "modules/api";

const makeRequest = (type, resource, params) => {
  if (resource !== "challenges") {
    throw new Error(`Unsupported fetch resource ${resource}`);
  }

  switch (type) {
  case GET_LIST: {
    // TODO: implement sorting and disable pagenation
    return api.fetchChallenges();
  }
  case GET_ONE:
    return api.fetchChallenge(params.id);
  case GET_MANY:
    throw new Error(`Unsupported fetch action type ${type}`);
  case GET_MANY_REFERENCE:
    throw new Error(`Unsupported fetch action type ${type}`);
  case UPDATE: {
    const ops = jsonpatch.compare(params.previousData, params.data);
    return api.updateChallenge(params.id, ops);
  }
  case CREATE:
    return api.createChallenge(params.data);
  case DELETE:
    throw new Error(`Unsupported fetch action type ${type}`);
  default:
    throw new Error(`Unsupported fetch action type ${type}`);
  }
};

const responseToDataProvider = (response, type, resource, params) => {
  console.log(response);
  switch (type) {
  case GET_LIST:
    return {
        data: response,
        total: response.length,
    };
  default:
    return { data: response };
  }
};

export default (type, resource, params) => {
  return makeRequest(type, resource, params)
    .then(response => responseToDataProvider(response, type, resource, params));
};





