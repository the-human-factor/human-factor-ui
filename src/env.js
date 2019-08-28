const LOCAL_REGEX = /http(?:s)?:\/\/(local\.app\.thehumanfactor\.ai|localhost:9000)/;
const ENV_REGEX = /http(?:s)?:\/\/(staging\.)?app\.thehumanfactor\.ai/;

export const getEnv = () => {
  const href = window.location.href

  const envOverride = localStorage.getItem('OVERRIDE_ENV')
  if (envOverride && ['local', 'staging', 'prod'].includes(envOverride)) {
    return envOverride
  }

  const localMatch = LOCAL_REGEX.test(href)
  if (localMatch) {
    return "local"
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
