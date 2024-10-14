import BaseAdapter from '../core/BaseAdapter';

export default class EmlogAdapter extends BaseAdapter {
    constructor() {
        super();
        this.version = '1.0';
        this.type = 'emlog';
        this.name = 'emlog';
        this.url = null;
        this.token = null;
    }

    async getMetaData() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['accounts'], async (result) => {
                const accounts = result.accounts || [];
                const emlogAccount = accounts.find(account => account.platform === 'emlog');
                if (!emlogAccount || !emlogAccount.url) {
                    reject(new Error('emlog 数据不存在或未保存 URL'));
                    return;
                }
                const finalUrl = emlogAccount.url + '/admin/blogger.php';
                this.url = emlogAccount.url;
                try {
                    const response = await $.ajax({
                        url: finalUrl,
                    });
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response, 'text/html');
                    const avatarElement = doc.querySelector('img[src^="../content/uploadfile"]');
                    const avatarUrl = avatarElement ? avatarElement.src : null;
                    const usernameInput = doc.querySelector('input[name="username"]');
                    const username = usernameInput ? usernameInput.value : null;
                    const tokenInput = doc.querySelector('input[name="token"]');
                    this.token = tokenInput ? tokenInput.value : null;

                    if (!username) {
                        reject(new Error('未登录'));
                        return;
                    }
                    resolve({
                        uid: 1,
                        title: username,
                        avatar: emlogAccount.url + avatarUrl,
                        type: 'emlog',
                        displayName: 'emlog',
                        home: emlogAccount.url + '/admin/admin_log.php',
                        icon: emlogAccount.url + '/favicon.ico',
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async addPost(post) {
        await this.getMetaData();
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
        const formData = new FormData();
        formData.append('title', post.post_title);
        formData.append('as_logid', '-1');
        formData.append('content', post.post_content);
        formData.append('excerpt', '');
        formData.append('sort', '-1');
        formData.append('tag', '');
        formData.append('postdate', formattedDate);
        formData.append('alias', '');
        formData.append('password', '');
        formData.append('allow_remark', 'y');
        formData.append('token', this.token);
        formData.append('ishide', '');
        formData.append('gid', '-1');
        formData.append('author', '1');

        await $.ajax({
            url: this.url + '/admin/save_log.php?action=add',
            type: 'POST',
            processData: false,
            contentType: false,
            data: formData,
        });
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