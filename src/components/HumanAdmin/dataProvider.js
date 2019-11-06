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

import api from 'modules/api';

// TODO: type is undefined - this seems like a bug in the Beta React Admin.
const fixType = (type, params) => {
  if (type === undefined) {
    if ('pagination' in params) {
      type = GET_LIST;
    } else if ('data' in params) {
      type = UPDATE;
    } else if ('id' in params) {
      type = GET_ONE;
    }
  }
  return type;
};

const makeRequest = (type, resource, params) => {
  type = fixType(type, params);

  if (resource !== 'challengeAdmin') {
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
      return api.deleteChallenge(params.id);
    default:
      throw new Error(`Unsupported fetch action type ${type}`);
  }
};

const resolve = (obj, keys) => {
  return keys.split('.').reduce(function(cur, key) {
    return cur[key] || {};
  }, obj);
};

const compareInPath = (key, order = 'ASC') => {
  return function(a, b) {
    const valA = resolve(a, key);
    const valB = resolve(b, key);

    let comparison = 0;
    if (valA > valB) {
      comparison = 1;
    } else if (valA < valB) {
      comparison = -1;
    }
    return order === 'DESC' ? comparison * -1 : comparison;
  };
};

const responseToDataProvider = (response, type, resource, params) => {
  type = fixType(type, params);
  switch (type) {
    case GET_LIST:
      return {
        data: response.sort(
          compareInPath(params.sort.field, params.sort.order)
        ),
        total: response.length,
      };
    default:
      return { data: response };
  }
};

export default (type, resource, params) => {
  return makeRequest(type, resource, params).then(response =>
    responseToDataProvider(response, type, resource, params)
  );
};
