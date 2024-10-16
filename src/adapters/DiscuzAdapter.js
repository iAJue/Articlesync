import BaseAdapter from '../core/BaseAdapter';

export default class DiscuzAdapter extends BaseAdapter {
    constructor() {
        super();
        this.version = '1.2.0';
        this.type = 'discuz';
        this.name = 'discuz';
        this.url = {};
        this.formhash = {};
        chrome.storage.local.get(['data'], (result) => {
            this.data = result.data
        });
    }

    async getMetaData() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['accounts'], async (result) => {
                const accounts = result.accounts || [];

                const discuzAccounts = accounts.filter(account => account.platform === this.type);
                if (discuzAccounts.length === 0) {
                    return reject(new Error('未找到 discuz 数据或未保存 URL'));
                }

                const results = [];

                for (const discuzAccount of discuzAccounts) {
                    const finalUrl = discuzAccount.url + '/home.php?mod=spacecp&ac=profile';
                    try {
                        const response = await $.ajax({
                            url: finalUrl,
                        });

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response, 'text/html');
                        const usernameElement = doc.querySelector('strong.vwmy.qq a');
                        const username = usernameElement ? usernameElement.textContent.trim() : null;
                        const avatarElement = doc.querySelector('div.avt img');
                        const avatarUrl = avatarElement ? avatarElement.src : null;
                        const tokenInput = doc.querySelector('input[name="token"]');
                        this.token = tokenInput ? tokenInput.value : null;
                        const uidMatch = response.match(/discuz_uid\s*=\s*'(\d+)'/);
                        const uid = uidMatch ? uidMatch[1] : null;
                        const formhashInput = doc.querySelector('input[name="formhash"]');
                        this.formhash[discuzAccount.platformName] = formhashInput ? formhashInput.value : null;
                        if (!username || !uid) {
                            throw new Error(`${discuzAccount.platformName} 未检测到登录信息`);
                        }

                        this.url[discuzAccount.platformName] = discuzAccount.url;

                        results.push({
                            uid: uid,
                            title: username,
                            avatar: avatarUrl,
                            type: 'discuz',
                            displayName: 'discuz',
                            home: discuzAccount.url,
                            icon: discuzAccount.url + '/favicon.ico',
                        });

                    } catch (error) {
                        console.error(`${discuzAccount.platformName} 处理时出错: ${error.message}`);
                        continue;
                    }
                }
                if (results.length > 0) {
                    resolve(results);
                } else {
                    reject(new Error('未能成功获取任何账户的登录信息'));
                }
            });
        });
    }

    async addPost(post) {
        await this.getMetaData();
        const errors = [];
        for (const platformName in this.url) {
            try {
                const platformUrl = this.url[platformName];

                const now = Math.floor(Date.now() / 1000);
                if (!this.data[platformUrl].discuzForumId || !this.data[platformUrl].discuzCategoryId) {
                    throw new Error('板块ID或分类ID未设置');
                }

                // 构建要发送的数据
                const data = {
                    formhash: this.formhash[platformName],
                    posttime: now,
                    wysiwyg: '1',
                    typeid: this.data[platformUrl].discuzCategoryId, 
                    subject: post.post_title,
                    message: `[md]${post.post_content}[/md]`,
                    replycredit_times: '1',
                    replycredit_extcredits: '0',
                    replycredit_membertimes: '1',
                    replycredit_random: '100',
                    readperm: '',
                    price: '',
                    tags: '',
                    cronpublishdate: '',
                    ordertype: '1',
                    allownoticeauthor: '1',
                    usesig: '1',
                    save: '',
                    file: '',
                    file: ''
                };
                const encodedData = $.param(data);
                const response = await $.ajax({
                    url: `${platformUrl}/forum.php?mod=post&action=newthread&fid=${this.data[platformUrl].discuzForumId}&extra=&topicsubmit=yes`,
                    type: 'POST',
                    data: encodedData,
                    contentType: 'application/x-www-form-urlencoded',
                });
                // 这里可以做更加复杂的判断,判断是否真正发表成功
                console.log(`${platformName} 发表成功`);
            } catch (error) {
                errors.push(`${platformName} 发表失败: ${error.message}`);
                console.error(`${platformName} 发表失败: ${error.message}`);
                continue; 
            }
        }
        if (errors.length > 0) {
            throw new Error(JSON.stringify(errors));
        }
        return {
            status: 'success'
        };
    }

    async editPost(post, post_id) {

        return {
            status: 'success',
            post_id: post_id
        };
    }


    async uploadFile(file) {

        return [{
            id: res.hash,
            object_key: res.hash,
            url: res.src,
        }];
    }
}