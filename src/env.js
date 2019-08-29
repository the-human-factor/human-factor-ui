const LOCAL_REGEX = /http(?:s)?:\/\/(local\.app\.thehumanfactor\.ai|localhost:9000)/;
const ENV_REGEX = /http(?:s)?:\/\/(staging\.)?app\.thehumanfactor\.ai/;

export const detectEnv = href => {
  const localMatch = LOCAL_REGEX.test(href);
  if (localMatch) {
    return "local";
  }

  const match = ENV_REGEX.exec(href);
  if (match) {
    // eslint-disable-next-line
    const [_, res] = match;

    if (typeof res === "undefined") {
      // undefined means we're in 'app.thehumanfactor.ai'
      return "prod";
    }

    return res.slice(0, -1);
  }

  return "staging";
};

export const getEnv = () => {
  const env = detectEnv(window.location.href);
  const overrideEnv = window.localStorage.getItem("env");

  if (["staging", "prod", "local"].includes(overrideEnv)) {
    return overrideEnv;
  }

  return env;
};
