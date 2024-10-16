import ZhiHuAdapter from './ZhiHuAdapter';
import BilibiliAdapter from './BilibiliAdapter';
import CnblogAdapter from './CnblogAdapter';
import WeiboAdapter from './WeiboAdapter';
import EmlogAdapter from './EmlogAdapter';
import WordPressAdapter from './WordPressAdapter';
import DiscuzAdapter from './DiscuzAdapter';

const adapters = [
    new ZhiHuAdapter(),
    new BilibiliAdapter(),
    new CnblogAdapter(),
    new WeiboAdapter(),
    new EmlogAdapter(),
    new WordPressAdapter(),
    new DiscuzAdapter(),
];

export default adapters;