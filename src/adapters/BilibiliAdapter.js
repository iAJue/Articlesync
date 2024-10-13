import BaseAdapter from '../core/BaseAdapter';
import { _cacheState } from '../core/submitHandler';

export default class BilibiliAdapter extends BaseAdapter {
    constructor() {
        super();
        this.version = '1.0';
        this.type = 'bilibili';
        this.name = '哔哩哔哩';
    }

    async getMetaData() {
        var res = await $.ajax({
            url: 'https://api.bilibili.com/x/web-interface/nav?build=0&mobi_app=web',
        })
        if (!res.data.isLogin) {
            throw new Error('未登录')
        }
        return {
            uid: res.data.mid,
            title: res.data.uname,
            avatar: res.data.face,
            type: 'bilibili',
            displayName: '哔哩哔哩',
            home: 'https://member.bilibili.com/platform/upload/text',
            icon: 'https://www.bilibili.com/favicon.ico',
        }
    }

    async addPost(post) {
        var res = await this.editPost(post); //没有打草稿不允许发表
        await this.editPost(post, res.post_id); 
        return {
            status: 'success',
            post_id: 0,
        }
    }

    async editPost(post, post_id = 0) {
        var url = 'https://api.bilibili.com/x/article/creative/draft/addupdate'; //草稿箱地址
        var post_data = {
            "title": post.post_title,
            "content": post.post_content,
            "category": 0,//专栏分类,0为默认
            "list_id": 0,//文集编号，默认0不添加到文集
            "tid": 4, //4为专栏封面单图,3为专栏封面三图
            "reprint": 0,
            "media_id": 0,
            "spoiler": 0,
            "original": 1,
            "csrf": _cacheState['bilibili']['csrf']
        };
        if (post_id){
            post_data["aid"] = post_id;
            url = 'https://api.bilibili.com/x/article/creative/article/submit'; //正式发表地址
        }

        var res = await $.ajax({
            url: url, 
            type: 'POST',
            dataType: 'JSON',
            data:post_data
        })
        if (!res.data) {
            throw new Error(res.message)
        }
        return {
            status: 'success',
            post_id: res.data.aid
        }
    }

    async uploadFile(file) {
        var src = file.src
        var csrf = this.config.state.csrf

        var uploadUrl = 'https://api.bilibili.com/x/article/creative/article/upcover'
        var file = new File([file.bits], 'temp', {
            type: file.type,
        })
        var formdata = new FormData()
        formdata.append('binary', file)
        formdata.append('csrf', csrf)
        var res = await axios({
            url: uploadUrl,
            method: 'post',
            data: formdata,
            headers: { 'Content-Type': 'multipart/form-data' },
        })

        if (res.data.code != 0) {
            throw new Error('图片上传失败 ' + src)
        }
        // http only
        console.log('uploadFile', res)
        var id = Math.floor(Math.random() * 100000)
        return [
            {
                id: id,
                object_key: id,
                url: res.data.data.url,
                size: res.data.data.size,
                // images: [res.data],
            },
        ]
    }

    async preEditPost(post) {
        var div = $('<div>')
        $('body').append(div)

        div.html(post.content)
        var doc = div
        var pres = doc.find('a')
        for (let mindex = 0; mindex < pres.length; mindex++) {
            const pre = pres.eq(mindex)
            try {
                pre.after(pre.html()).remove()
            } catch (e) { }
        }

        tools.processDocCode(div)
        tools.makeImgVisible(div)

        var pres = doc.find('iframe')
        for (let mindex = 0; mindex < pres.length; mindex++) {
            const pre = pres.eq(mindex)
            try {
                pre.remove()
            } catch (e) { }
        }

        try {
            const images = doc.find('img')
            for (let index = 0; index < images.length; index++) {
                const image = images.eq(index)
                const imgSrc = image.attr('src')
                if (imgSrc && imgSrc.indexOf('.svg') > -1) {
                    console.log('remove svg Image')
                    image.remove()
                }
            }
            const qqm = doc.find('qqmusic')
            qqm.next().remove()
            qqm.remove()
        } catch (e) { }

        post.content = $('<div>')
            .append(doc.clone())
            .html()
        console.log('post', post)
    }

    editImg(img, source) {
        img.attr('size', source.size)
    }

    addPromotion(post) {
        var sharcode = `<blockquote><p>本文使用 <a href="https://github.com/iAJue/Articlesync" class="internal">文章同步助手</a> 同步</p></blockquote>`
        post.content = post.content.trim() + `${sharcode}`
    }
}
