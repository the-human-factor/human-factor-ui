const ENV_REGEX = /http(?:s)?:\/\/(local\.|dev\.|staging\.)?app\.thehumanfactor\.ai/;

export const getEnv = () => {
  const match = ENV_REGEX.exec(window.location.href);
  if (match) {
    // eslint-disable-next-line
    const [_, res] = match;
    return res.slice(0, -1);
  }

  return "dev";
};
