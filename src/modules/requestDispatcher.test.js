import RequestDispatcher, { AUTH_REFRESH_API } from "./requestDispatcher";
import mockAxios from "axios";

const accessTokenA = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZGVudGl0eSI6IjEiLCJ0eXBlIjoiYWNjZXNzIiwibmJmIjoxNTY2NDU4MDAwLCJleHAiOjE1NjY0NTkwMDAsInVzZXJfY2xhaW1zIjp7InJvbGVzIjpbeyJhZG1pbiI6ImFkbWluIn1dfSwiaWF0IjoxNTY2NDU4MDAwLCJqdGkiOiIxMTUxZjBlNi03NDBkLTQ3MmQtOTRmNS02YTI5MGJmNGFiZjAifQ.ZEw2CdhuBJc_QzN0YrOQ63t1JMI3KJfCJpcV-Hz9M5U";
const accessTokenB = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZGVudGl0eSI6IjEiLCJ0eXBlIjoiYWNjZXNzIiwibmJmIjoxNTY2NDU5MDAwLCJleHAiOjE1NjY0NjAwMDAsInVzZXJfY2xhaW1zIjp7InJvbGVzIjpbeyJhZG1pbiI6ImFkbWluIn1dfSwiaWF0IjoxNTY2NDU5MDAwLCJqdGkiOiIxMTUxZjBlNi03NDBkLTQ3MmQtOTRmNS02YTI5MGJmNGFiZjAifQ.lvjQHxJ2R9Q9blBGXNr3LxA9yEgGwee0XHyelVS-JlA";
const refreshToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE1NjY0NTkwMDAsImV4cCI6MTU2NjQ4MDAwMCwiaWRlbnRpdHkiOiIxIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE1NjY0NTkwMDAsImp0aSI6IjYzYTRkNjAzLTY0MGEtNDdjYS05NWEzLWFmZjQzNTMyYWJlZCJ9.ugfE464AG7Yh6hspSi22MqefsdxqHyWTX5-yn0xY5nA";

const mockResponses = [
  {
    endpoint: "/healthcheck",
    response: (req) => mockAxios.__axiosResponse(200, "ok")
  },
  {
    endpoint: "/server/error",
    response: (req) => {
      let error = new Error("Request failed with status code 500");
      error.response = { status: 500, statusText: "INTERNAL SERVER ERROR" };
      return error;
    }
  },
  {
    endpoint: "/auth/login",
    response: (req) => {
      const data = ((req || {}).config || {}).data;
      if (!data ||
          data.email !== "god@heaven.com" ||
          data.password !== "love") {
        return mockAxios.__axiosResponseError(401, "AuthenticationFailure");
      }
      return mockAxios.__axiosResponse(200, {
        access_token: accessTokenA,
        refresh_token: refreshToken,
        user: {full_name: "God", email: "god@heaven.com"}
      });
    }
  },
  {
    endpoint: "/auth/register",
    response: (req) => {
      return mockAxios.__axiosResponse(200, {
        access_token: accessTokenA,
        refresh_token: refreshToken,
        user: {full_name: "Jess", email: "jess@heaven.com"}
      });
    }
  },
  {
    endpoint: "/auth/refresh",
    response: (req) => {
      const auth = (((req || {}).config || {}).headers || {}).Authorization;
      if (auth && auth.endsWith(refreshToken)) {
        return mockAxios.__axiosResponse(200, {
          access_token: accessTokenB,
          user: {}
        });
      }
      return mockAxios.__axiosResponseError(401, "AuthenticationFailure");
    }
  },
  {
    endpoint: "/access/requires/token/A",
    response: (req) => {
      const auth = (((req || {}).config || {}).headers || {}).Authorization;
      if (auth && auth.endsWith(accessTokenA)) {
        return mockAxios.__axiosResponse(200, "ok");
      }
      return mockAxios.__axiosResponseError(401, "AuthenticationFailure");
    }
  },
  {
    endpoint: "/access/requires/token/B",
    response: (req) => {
      const auth = (((req || {}).config || {}).headers || {}).Authorization;
      if (auth && auth.endsWith(accessTokenB)) {
        return mockAxios.__axiosResponse(200, "ok");
      }
      return mockAxios.__axiosResponseError(401, "AuthenticationFailure");
    }
  }
]

let rd;

describe("Testing Unauthenticated requests",  () => {
  beforeAll(() => {
    rd = new RequestDispatcher();
    mockAxios.__clearMockResponses();
    mockResponses.forEach(mr => mockAxios.__setMockResponse(mr));
  });

  test("healthcheck", () => {
    expect.assertions(1);
    expect(rd.get("/healthcheck"))
      .resolves.toHaveProperty("data", "ok");
    mockAxios.__resolveAll();
  });

  test("missing endpoint", () => {
    expect.assertions(1);
    expect(rd.get("/missing"))
      .rejects
      .toHaveProperty("response.status", 404);

    mockAxios.__resolveAll();
  });
});

describe("Testing Authenticated Requests",  () => {
  beforeEach(() => {
    rd = new RequestDispatcher();
    mockAxios.__clearMockResponses();
    mockResponses.forEach(mr => mockAxios.__setMockResponse(mr));
  });

  test("login()", () => {
    expect.assertions(3);
    const login = rd.loginRegister({email: "god@heaven.com", password: "love"});
    expect(login).resolves.toHaveProperty("data.access_token");
    expect(login).resolves.toHaveProperty("data.refresh_token");
    expect(login).resolves.toHaveProperty("data.user");

    mockAxios.__resolveAll();
  });

  test("login() failure", () => {
    expect.assertions(1);
    const login = rd.loginRegister({email: "god@heaven.com", password: "hate"});
    expect(login).rejects.toHaveProperty("response.status", 401);

    mockAxios.__resolveAll();
  });

  test("login() then getWithAuth()", async () => {
    expect.assertions(2);
    const login = rd.loginRegister({email: "god@heaven.com", password: "love"});
    expect(login).resolves.toHaveProperty("data.access_token");

    mockAxios.__resolveAll();
    await login;

    const first = rd.getWithAuth("/access/requires/token/A");
    expect(first).resolves.toHaveProperty("data", "ok");

    mockAxios.__resolveAll();
    await first;
  });

  test.skip("login() then getWithAuth() that requires refresh()", async () => {
    expect.assertions(2);
    const login = rd.loginRegister({email: "god@heaven.com", password: "love"});
    expect(login).resolves.toHaveProperty("data.access_token");

    mockAxios.__resolveAll();
    await login;

    // This will fail with the access token from login.
    const first = rd.getWithAuth("/access/requires/token/B");
    expect(first).resolves.toHaveProperty("data", "ok");

    mockAxios.__resolveAll();
    
    await new Promise((resolve, reject) => {
      mockAxios.__callbackOnRequest(resolve);
    });
    // Now there should be a refresh in the queue.
    mockAxios.__resolveAll();

    await new Promise((resolve, reject) => {
      mockAxios.__callbackOnRequest(resolve);
    });
    // Now the original "first" request should be pending again.
    mockAxios.__resolveAll();
  });

  // TODO: Test multiple requests in flight during a refresh.
});


