import ZhiHuAdapter from './ZhiHuAdapter';
import BilibiliAdapter from './BilibiliAdapter';
import CnblogAdapter from './CnblogAdapter';
import WeiboAdapter from './WeiboAdapter';

const adapters = [
    new ZhiHuAdapter(),
    new BilibiliAdapter(),
    new CnblogAdapter(),
    new WeiboAdapter(),
];

export default adapters;