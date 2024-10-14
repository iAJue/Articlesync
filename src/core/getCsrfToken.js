import { getCookie } from '../utils/cookieManager';

// 从指定域名获取指定 Cookie 值
export const getTokenFromCookie = async (domain, cookieName) => {
    return new Promise((resolve, reject) => {
        chrome.cookies.getAll({ domain: domain }, (cookies) => {
            if (cookies) {
                const cookieStr = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
                const token = getCookie(cookieName, cookieStr);
                if (token) {
                    resolve(token); 
                } else {
                    reject(`No ${cookieName} found for domain ${domain}`);
                }
            } else {
                reject(`No cookies found for domain ${domain}`);
            }
        });
    });
};

// 提交处理函数，直接返回 Token
export const getCsrfToken = async (domain, cookieName) => {
    try {
        const token = await getTokenFromCookie(domain, cookieName);
        console.log(`${cookieName} token`, token);
        return token; 
    } catch (error) {
        console.error(error);
        throw error; 
    }
};
