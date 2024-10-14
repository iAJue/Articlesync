import BaseAdapter from '../core/BaseAdapter';

export default class WordPressAdapter extends BaseAdapter {
    constructor() {
        super();
        this.version = '1.0';
        this.type = 'WordPress';
        this.name = 'WordPress';
        this.url = null;
        this.token = null;
    }

    async getMetaData() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['accounts'], async (result) => {
                const accounts = result.accounts || [];
                const WordPressAccount = accounts.find(account => account.platform === 'wordpress');
                if (!WordPressAccount || !WordPressAccount.url) {
                    reject(new Error('WordPress 数据不存在或未保存 URL'));
                    return;
                }
                const finalUrl = WordPressAccount.url + 'wp-admin';
                this.url = WordPressAccount.url;
                try {
                    const response = await $.ajax({
                        url: finalUrl,
                        xhrFields: {
                            withCredentials: true
                        },
                    });
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response, 'text/html');

                    const avatarElement = doc.querySelector('.ab-item img.avatar');
                    const avatarUrl = avatarElement ? avatarElement.src : null;
                    const displayNameElement = doc.querySelector('.ab-item .display-name');
                    const displayName = displayNameElement ? displayNameElement.textContent.trim() : null;

                    if (!displayName) {
                        reject(new Error('未登录'));
                        return;
                    }
                    resolve({
                        uid: 1,
                        title: displayName,
                        avatar: avatarUrl,
                        type: 'WordPress',
                        displayName: 'WordPress',
                        home: WordPressAccount.url + '/admin/admin_log.php',
                        icon: WordPressAccount.url + '/favicon.ico',
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async addPost(post) {
        await this.getMetaData();
        const res = await $.ajax({
            url: this.url + 'wp-admin/post-new.php',
            method: 'POST',
        });
        const parser = new DOMParser();
        const doc = parser.parseFromString(res, 'text/html');
        const _wpnonce = doc.querySelector('#_wpnonce').value;
        const _wp_http_referer = doc.querySelector('input[name="_wp_http_referer"]').value;
        const user_ID = doc.querySelector('#user-id').value;
        const action = doc.querySelector('#hiddenaction').value;
        const originalaction = doc.querySelector('#originalaction').value;
        const post_author = doc.querySelector('#post_author').value;
        const post_type = doc.querySelector('#post_type').value;
        const original_post_status = doc.querySelector('#original_post_status').value;
        const referredby = doc.querySelector('#referredby').value;
        const _wp_original_http_referer = doc.querySelector('input[name="_wp_original_http_referer"]').value;
        const post_ID = doc.querySelector('#post_ID').value;
        const meta_box_order_nonce = doc.querySelector('#meta-box-order-nonce').value;
        const closedpostboxesnonce = doc.querySelector('#closedpostboxesnonce').value;
        const samplepermalinknonce = doc.querySelector('#samplepermalinknonce').value;
        const _ajax_noncey = doc.querySelector('#_ajax_nonce-add-category').value;
        const _ajax_nonce = doc.querySelector('#_ajax_nonce-add-meta').value;
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); 
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const data = {
            _wpnonce: _wpnonce,
            _wp_http_referer: _wp_http_referer,
            user_ID: user_ID,
            action: action,
            originalaction: originalaction,
            post_author: post_author,
            post_type: post_type,
            original_post_status: original_post_status,
            referredby: referredby,
            _wp_original_http_referer: _wp_original_http_referer,
            post_ID: post_ID,
            'meta-box-order-nonce': meta_box_order_nonce,
            closedpostboxesnonce: closedpostboxesnonce,
            post_title: post.post_title,
            samplepermalinknonce: samplepermalinknonce,
            content: post.post_content,
            'wp-preview': '',
            hidden_post_status: 'draft',
            post_status: 'draft',
            hidden_post_password: '',
            hidden_post_visibility: 'public',
            visibility: 'public',
            post_password: '',
            aa: year,
            mm: month,
            jj: day,
            hh: hours,
            mn: minutes,
            ss: seconds,
            hidden_mm: month,
            cur_mm: month,
            hidden_jj: day,
            cur_jj: day,
            hidden_aa: year,
            cur_aa: year,
            hidden_hh: hours,
            cur_hh: hours,
            hidden_mn: minutes,
            cur_mn: minutes,
            original_publish: '发布',
            publish: '发布',
            post_format: '0',
            'post_category[]': '0',
            newcategory: '新分类名',
            newcategory_parent: '-1',
            '_ajax_nonce-add-category': _ajax_noncey,
            'tax_input[post_tag]': '',
            'newtag[post_tag]': '',
            _thumbnail_id: '-1',
            excerpt: '',
            trackback_url: '',
            metakeyselect: '#NONE#',
            metakeyinput: '',
            metavalue: '',
            '_ajax_nonce-add-meta': _ajax_nonce,
            advanced_view: '1',
            comment_status: 'open',
            ping_status: 'open',
            post_name: '',
            post_author_override: '1'
        };

        const response = await $.ajax({
            url: this.url + 'wp-admin/post.php',
            type: 'POST',
            data: $.param(data),  
            contentType: 'application/x-www-form-urlencoded',
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