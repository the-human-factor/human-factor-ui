const ENV_REGEX = /http(?:s)?:\/\/(local\.|dev\.|staging\.)?app\.thehumanfactor\.ai/;

export const getEnv = () => {
  return "local";
  const match = ENV_REGEX.exec(window.location.href);
  if (match) {
    // eslint-disable-next-line
    const [_, res] = match;

    if (typeof res === "undefined") {
      // undefined means we're in 'app.thehumanfactor.ai'
      return "prod";
    }

    return res.slice(0, -1);
  }

  return "dev";
};
