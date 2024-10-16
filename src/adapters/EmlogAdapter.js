import BaseAdapter from '../core/BaseAdapter';

export default class EmlogAdapter extends BaseAdapter {
    constructor() {
        super();
        this.version = '1.2.0';
        this.type = 'emlog';
        this.name = 'emlog';
        this.url = {};
        this.token = {};
    }

    async getMetaData() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['accounts'], async (result) => {
                const accounts = result.accounts || [];
    
                const emlogAccounts = accounts.filter(account => account.platform === this.type);
                if (emlogAccounts.length === 0) {
                    return reject(new Error('未找到 emlog 数据或未保存 URL'));
                }
    
                const results = [];
    
                for (const emlogAccount of emlogAccounts) {
                    const finalUrl = emlogAccount.url + '/admin/blogger.php';
                    try {
                        const response = await $.ajax({
                            url: finalUrl,
                        });
    
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response, 'text/html');
                        const avatarMatch = response.match(/<img\s+[^>]*src=['"](?:\.\.\/)?(content\/uploadfile\/[^'"]+)['"]/);
                        const avatarUrl = avatarMatch ? emlogAccount.url + avatarMatch[1] : null;
                        const usernameInput = doc.querySelector('input[name="username"]');
                        const username = usernameInput ? usernameInput.value : null;
                        const tokenInput = doc.querySelector('input[name="token"]');
                        this.token[emlogAccount.platformName] = tokenInput ? tokenInput.value : null; 
    
                        if (!username) {
                            throw new Error(`${emlogAccount.platformName} 未检测到登录信息`);
                        }
    
                        this.url[emlogAccount.platformName] = emlogAccount.url;
    
                        results.push({
                            uid: 1,
                            title: username,
                            avatar: avatarUrl,
                            type: 'emlog',
                            displayName: 'emlog',
                            home: emlogAccount.url + '/admin/admin_log.php',
                            icon: emlogAccount.url + '/favicon.ico',
                        });
    
                    } catch (error) {
                        console.error(`${emlogAccount.platformName} 处理时出错: ${error.message}`);
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
                const now = new Date();
                const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
    
                // 构建要发送的数据
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
                formData.append('token', this.token[platformName]); 
                formData.append('ishide', '');
                formData.append('gid', '-1');
                formData.append('author', '1');
    
                const response = await $.ajax({
                    url: `${platformUrl}/admin/save_log.php?action=add`,
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    data: formData,
                });
    
                // 这里可以添加复杂的判断，来确认是否发表成功
                console.log(`${platformName} 发表成功`);
            } catch (error) {
                errors.push(`${platformName} 发表失败: ${error.message}`);
                console.error(`${platformName} 发表失败: ${error.message}`);
                continue;  // 出错时继续尝试下一个平台
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