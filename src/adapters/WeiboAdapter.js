import BaseAdapter from '../core/BaseAdapter';

export default class WeiboAdapter extends BaseAdapter {
    constructor() {
        super();
        this.version = '1.0';
        this.type = 'weibo';
        this.name = '微博';
        this.uid = null;
    }

    async getMetaData() {
        try {
            const html = await $.get('https://card.weibo.com/article/v3/editor');
            const uidMatch = html.match(/\$CONFIG\['uid'\]\s*=\s*(\d+)/);
            const nickMatch = html.match(/\$CONFIG\['nick'\]\s*=\s*'([^']+)'/);
            const avatarMatch = html.match(/\$CONFIG\['avatar_large'\]\s*=\s*'([^']+)'/);

            if (uidMatch && nickMatch && avatarMatch) {
                const uid = uidMatch[1];
                const nick = nickMatch[1];
                const avatar = avatarMatch[1];
                this.uid = uid;
                return {
                    uid: uid,
                    title: nick,
                    avatar: avatar,
                    displayName: '微博',
                    type: 'weibo',
                    home: 'https://card.weibo.com/article/v3/editor',
                    icon: 'https://weibo.com/favicon.ico',
                };
            } else {
                throw new Error('CONFIG not found');
            }
        } catch (error) {
            console.error('Error fetching Weibo user metadata:', error);
            throw error;
        }
    }

    async addPost(post) {
        await this.getMetaData();
        var res = await $.post(
            'https://card.weibo.com/article/v3/aj/editor/draft/create?uid=' +
            this.uid
        )
        if (res.code != 100000) {
            throw new Error(res.msg)
        }

        console.log(res)
        var post_id = res.data.id
        var post_data = {
            id: post_id,
            title: post.post_title,
            subtitle: '',
            type: '',
            status: '0',
            publish_at: '',
            error_msg: '',
            error_code: '0',
            collection: '[]',
            free_content: '',
            content: post.post_content,
            cover: '',
            summary: '',
            writer: '',
            extra: 'null',
            is_word: '0',
            article_recommend: '[]',
            follow_to_read: '0', //仅粉丝阅读全文
            isreward: '1',
            pay_setting: '{"ispay":0,"isvclub":0}',
            source: '0',
            action: '1',
            content_type: '0',
            save: '1',
        }

        var res = await $.ajax({
            url:
                'https://card.weibo.com/article/v3/aj/editor/draft/save?uid=' +
                this.uid +
                '&id=' +
                post_id,
            type: 'POST',
            dataType: 'JSON',
            headers: {
                accept: 'application/json',
            },
            data: post_data,
        })
        var res = await $.ajax({
            url:
                'https://card.weibo.com/article/v3/aj/editor/draft/publish?uid=' +
                this.uid +
                '&id=' +
                post_id,
            type: 'POST',
            dataType: 'JSON',
            headers: {
                accept: 'application/json',
            },
            data: post_data,
        })
        
        console.log(res)
        return {
            status: 'success',
            post_id: post_id,
        }
    }

    async editPost(post_id, post) {
        var res = await $.ajax({
            url:
                'https://card.weibo.com/article/v3/aj/editor/draft/save?uid=' +
                this.uid +
                '&id=' +
                post_id,
            type: 'POST',
            dataType: 'JSON',
            headers: {
                accept: 'application/json',
            },
            data: {
                id: post_id,
                title: post.post_title,
                subtitle: '',
                type: '',
                status: '0',
                publish_at: '',
                error_msg: '',
                error_code: '0',
                collection: '[]',
                free_content: '',
                content: post.post_content,
                cover: post.post_thumbnail_raw ? post.post_thumbnail_raw.url : '',
                summary: '',
                writer: '',
                extra: 'null',
                is_word: '0',
                article_recommend: '[]',
                follow_to_read: '0',
                isreward: '1',
                pay_setting: '{"ispay":0,"isvclub":0}',
                source: '0',
                action: '1',
                content_type: '0',
                save: '1',
            },
        })

        if (res.code == '111006') {
            throw new Error(res.msg)
        }
        console.log(res)
        return {
            status: 'success',
            post_id: post_id,
        }
    }

    untiImageDone(src) {
        return new Promise((resolve, reject) => {
            ; (async function loop() {
                var res = await $.ajax({
                    url:
                        'https://card.weibo.com/article/v3/aj/editor/plugins/asyncimginfo?uid=' +
                        this.uid,
                    type: 'POST',
                    headers: {
                        accept: '*/*',
                        'x-requested-with': 'fetch',
                    },
                    data: {
                        'urls[0]': src,
                    },
                })

                var done = res.data[0].task_status_code == 1
                if (done) {
                    resolve(res.data[0])
                } else {
                    setTimeout(loop, 1000)
                }
            })()
        })
    }

    async uploadFileByUrl(file) {
        var src = file.src
        var res = await $.ajax({
            url:
                'https://card.weibo.com/article/v3/aj/editor/plugins/asyncuploadimg?uid=' +
                this.uid,
            type: 'POST',
            headers: {
                accept: '*/*',
                'x-requested-with': 'fetch',
            },
            data: {
                'urls[0]': src,
            },
        })

        var imgDetail = await this.untiImageDone(src)
        return [
            {
                id: imgDetail.pid,
                object_key: imgDetail.pid,
                url: imgDetail.url,
            },
        ]
    }

    async uploadFile(file) {
        var blob = new Blob([file.bits])
        console.log('uploadFile', file, blob)
        var uploadurl1 = `https://picupload.weibo.com/interface/pic_upload.php?app=miniblog&s=json&p=1&data=1&url=&markpos=1&logo=0&nick=&file_source=4`
        var uploadurl2 = 'https://picupload.weibo.com/interface/pic_upload.php?app=miniblog&s=json&p=1&data=1&url=&markpos=1&logo=0&nick='
        var fileResp = await $.ajax({
            url:
                uploadurl1,
            type: 'POST',
            processData: false,
            data: new Blob([file.bits]),
        })
        console.log(file, fileResp)
        return [
            {
                id: fileResp.data.pics.pic_1.pid,
                object_key: fileResp.data.pics.pic_1.pid,
                url:
                    'https://wx3.sinaimg.cn/large/' +
                    fileResp.data.pics.pic_1.pid +
                    '.jpg',
            },
        ]
    }

}
