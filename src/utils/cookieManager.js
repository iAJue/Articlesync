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

export const getCookie = (name, cookieStr) => {
    const match = cookieStr.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    }
    return null;
}