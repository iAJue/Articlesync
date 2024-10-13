import { getCookie } from '../utils/cookieManager';
export const _cacheState = {};

export const submitHandler = (cookies) => {
    const cookieStr = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    if (cookies.some(cookie => cookie.domain.includes('bilibili.com'))) {
        const bili_jct = getCookie('bili_jct', cookieStr);
        if (bili_jct) {
            _cacheState['bilibili'] = _cacheState['bilibili'] || {};
            Object.assign(_cacheState['bilibili'], { csrf: bili_jct });
            console.log('bili_jct', bili_jct);
        }
    }
};

chrome.cookies.getAll({ domain: 'bilibili.com' }, (bilibiliCookies) => {
    submitHandler(bilibiliCookies);
});