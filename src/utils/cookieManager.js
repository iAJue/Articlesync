export const getCookies = (url, name) => {
    return new Promise((resolve, reject) => {
      chrome.cookies.get({ url, name }, (cookie) => {
        if (cookie) {
          resolve(cookie.value);
        } else {
          reject(`No cookie found for ${name}`);
        }
      });
    });
  };