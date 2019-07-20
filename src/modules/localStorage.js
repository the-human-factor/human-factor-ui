export const loadToken = () => {
  try {
    return localStorage.getItem('loginToken');
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const saveToken = (token) => {
  try {
    localStorage.setItem('loginToken', token);
  } catch (err) {
    console.error(err)
  }
};