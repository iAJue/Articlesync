import BaseAdapter from '../core/BaseAdapter';
import { getCsrfToken } from '../core/getCsrfToken';

export default class CnblogAdapter extends BaseAdapter {
    constructor() {
        super();
        this.version = '1.0';
        this.type = 'cnblog';
        this.name = '博客园';
        chrome.storage.local.get(['syncType'],  (result)=> {
            this.postType = result.syncType || 1;
        });
    }

    async getMetaData() {
        var res = await $.ajax({
            url: 'https://account.cnblogs.com/user/userinfo',
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/javascript'
            },
            contentType: 'application/json',
        });
        if (!res.displayName) {
            throw new Error('未登录')
        }
        return {
            uid: res.displayName,
            title: res.displayName,
            avatar: 'https:'+res.iconName,
            type: 'cnblog',
            displayName: '博客园',
            home: 'https://i.cnblogs.com/EditArticles.aspx?IsDraft=1',
            icon: 'https://i.cnblogs.com/favicon.ico',
        }
    }


    async addPost(post, post_id = null) {
        $.ajaxSetup({
            headers: {
                'Origin': 'https://i.cnblogs.com',
                'Referer': 'https://i.cnblogs.com/',
                'X-XSRF-TOKEN': await getCsrfToken('i.cnblogs.com', 'XSRF-TOKEN')
            }
        });
        try {
            var res = await $.ajax({
                url: 'https://i.cnblogs.com/api/posts',
                type: 'POST',
                data: JSON.stringify({
                    "id": post_id,
                    "postType": parseInt(this.postType), //1是随笔,2是文章,3是日志
                    "accessPermission": 0,
                    "title": post.post_title,
                    "url": null,
                    "postBody": post.post_content,
                    "categoryIds": null,
                    "inSiteCandidate": false,
                    "inSiteHome": false,
                    "siteCategoryId": null,
                    "blogTeamIds": null,
                    "isPublished": true,
                    "displayOnHomePage": true, //是否在首页显示
                    "isAllowComments": true,
                    "includeInMainSyndication": true,
                    "isPinned": false,
                    "isOnlyForRegisterUser": false,
                    "isUpdateDateAdded": false,
                    "entryName": null,
                    "description": null,
                    "tags": null,
                    "password": null,
                    "datePublished": new Date().toISOString(),
                    "isMarkdown": true,
                    "isDraft": true, // 是否是草稿
                    "autoDesc": null,
                    "changePostType": false,
                    "blogId": 0,
                    "author": null,
                    "removeScript": false,
                    "clientInfo": null,
                    "changeCreatedTime": false,
                    "canChangeCreatedTime": false
                }),
                contentType: 'application/json',
                success: function (data) {
                    console.log('文章已保存为草稿:', data);
                },
                error: function (error) {
                    console.error('文章保存失败:', error);
                }
            });
        } catch (error) {
            console.error('请求发生错误:', error);
        }
        return {
            status: 'success',
            post_id: res.id,
        }
    }

    async editPost(post, post_id) {
        this.addPost(post, post_id);
        return {
            status: 'success'
        }
    }


    async uploadFile(file) {
        return {
            url: file.src,
        }
    }

    


}

