import BaseAdapter from '../core/BaseAdapter';

export default class ZhiHuAdapter extends BaseAdapter {
    constructor() {
        super();
        this.version = '1.0';
        this.type = 'zhihu';
        this.name = '知乎';
    }

    async getMetaData() {
        const res = await $.ajax({
            url: 'https://www.zhihu.com/api/v4/me?include=account_status,is_bind_phone,is_force_renamed,email,renamed_fullname',
        });
        if (res.error) {
            throw new Error('未登录');
        }
        return {
            uid: res.uid,
            title: res.name,
            avatar: res.avatar_url,
            type: 'zhihu',
            displayName: '知乎',
            home: 'https://www.zhihu.com/settings/account',
            icon: 'https://static.zhihu.com/static/favicon.ico',
        };
    }

    async addPost(post) {
        const res = await $.ajax({
            url: 'https://zhuanlan.zhihu.com/api/articles/drafts',
            type: 'POST',
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({
                content: post.post_content,
                title: post.post_title,
                topics: 'MoeJue'
            }),
        });
        this.publishPost(res.id)
        return {
            status: 'success',
            post_id: res.id,
        };
    }

    async editPost(post_id, post) {
        const res = await $.ajax({
            url: `https://zhuanlan.zhihu.com/api/articles/${post_id}/draft`,
            type: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({
                title: post.post_title,
                content: post.post_content,
                isTitleImageFullScreen: false,
                table_of_contents: false,
                delta_time: 10,
                // titleImage: `https://pic1.zhimg.com/${post.post_thumbnail}.png`,
            }),
        });
        this.publishPost(post_id)
        return {
            status: 'success',
            post_id: post_id
        };
    }

    // 目前是存草稿，现在需要把它设置为发布
    async publishPost(post_id) {
        await $.ajax({
            url: `https://zhuanlan.zhihu.com/api/articles/${post_id}/publish`,
            type: 'PUT',
            dataType: 'JSON',
            contentType: 'application/json',
            data: JSON.stringify({
                disclaimer_type: "none",
                disclaimer_status: "close",
                table_of_contents_enabled: false,
                commercial_report_info: { commercial_types: [] },
                commercial_zhitask_bind_info: null,
            }),
        });
    }

    async uploadFile(file) {
        const res = await $.ajax({
            url: 'https://zhuanlan.zhihu.com/api/uploaded_images',
            type: 'POST',
            headers: {
                accept: '*/*',
                'x-requested-with': 'fetch',
            },
            data: {
                url: file.src,
                source: 'article',
            },
        });
        return [{
            id: res.hash,
            object_key: res.hash,
            url: res.src,
        }];
    }
}