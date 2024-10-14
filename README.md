# ArticleSync - 多平台文章同步插件

ArticleSync 是一个浏览器扩展，帮助用户轻松将文章同步发布到多个社交平台。支持将文章从本地草稿发布到各大平台，如知乎、Bilibili 等。它提供了一站式解决方案，让你在不同的社交媒体平台上同步文章变得简单高效。

基于浏览器插件模式,自动检测本地登录账号,杜绝账号泄露,环境异常等风险
基于 chrome Manifest v3 浏览器扩展标准开发

## 功能特色
- **多平台支持**：支持知乎、Bilibili等各大主流平台,支持自建开源CMS系统。
- **状态跟踪**：在插件界面中查看文章的同步状态.
- **账号管理**：可查看与插件绑定的各平台账号信息。
- **可扩展性强**：支持开发者通过适配器模式轻松扩展到更多平台。
- **安全可靠**：插件基于浏览器扩展模式，确保账号安全，避免账号泄露等风险。

## Todo List
- [ ] 独立markdown编辑器
- [ ] 图片一键同步
- [ ] markdown与HTML互转
- [ ] 第三方图床系统
- [ ] 多账号管理
- [ ] 多系统客户端版本
- [ ] 一键ai总结
- [ ] 视频同步
- [ ] 更多平台的接入

## 支持渠道
| 媒体           | 媒体行业  | 状态  | 网址                                | 支持类型          | 更新时间      |
|--------------|-------|-----|-----------------------------------|---------------|-----------|
| 哔哩哔哩        | 主流自媒体 | 已支持 | https://bilibili.com/         | HTML          | 2024/10/13 |
| 知乎           | 主流自媒体 | 已支持 | https://www.zhihu.com/            | HTML          | 2024/10/13 |
| 博客园           | 博客 | 已支持 | https://cnblogs.com/            | HTML          | 2024/10/14 |
| 新浪头条           | 主流自媒体 | 已支持 | https://weibo.com/            | HTML          | 2024/10/14 |
| emlog           | 开源CMS | 已支持 | https://www.emlog.net/            | HTML          | 2024/10/14 |
| WordPress           | 开源CMS | 已支持 | https://cn.wordpress.org/            | HTML          | 2024/10/14 |

## 安装说明

1. 克隆仓库到本地：
   ```bash
   git clone https://github.com/yourusername/articlesync.git
   ```

2. 进入项目目录：
   ```bash
   cd articlesync
   ```

3. 安装依赖：
   ```bash
   npm install
   ```

4. 打包项目
   ```bash
   npm run build
   ```

5. 加载插件：
- 打开 Chrome 浏览器，进入 chrome://extensions/。
- 启用 开发者模式。
- 点击 加载已解压的扩展程序，选择 dist/ 文件夹。
   
6. 开发
   1. 启动开发环境
	``` bash
	npm run watch-reload
	```
	2. 以配置热更新,每次修改代码后，插件将自动打包，并且 Chrome 会自动重新加载插件。

## 如何添加一个适配器
1. 在 `src/adapters` 目录下创建一个新的适配器文件，例如 `PlatformAdapter.js`。
2. 继承 `BaseAdapter` 类，并实现以下方法：
   -  `getMetaData()`: 获取当前页面的元数据。
   -  `addPost(post)`: 添加新的文章。
   -  `editPost(post, post_id)`: 编辑文章。
   -  `uploadFile(file)`: 上传文件。
   -  定义`constructor`构造函数，设置适配器的版本、类型和名称或其他初始化数据.
	   ```
		constructor() {
			super();
			this.version = '1.0';
			this.type = 'Twitter';
			this.name = '推特';
		}
		```
3. 在 `src/adapters/adapters.js` 中导入并注册新的适配器。
	

## 项目结构
```
├── src
│   ├── adapters         # 各平台的适配器
│   │   ├── ZhiHuAdapter.js
│   │   ├── BilibiliAdapter.js
│   ├── contents         # 内容脚本
│   ├── background.js    # 后台脚本
│   ├── popup            # 插件弹窗界面
│   │   ├── popup.js
│   │   ├── popup.html
│   ├── options          # 扩展选项页面
│   │   ├── options.js
│   │   ├── options.html
│   ├── dist             # 打包后的文件
│   ├── manifest.json    # Chrome 插件清单文件
├── webpack.config.js    # Webpack 配置文件
├── package.json         # 项目配置文件
├── README.md            # 项目说明文件
├── .gitignore           # Git 忽略文件

```

## 贡献指南

欢迎对项目进行贡献！如果你有任何改进意见或想要添加新的平台支持，请遵循以下步骤：

1. Fork 仓库。
2. 创建一个新的分支。
3. 提交你的更改。
4. 发起一个 Pull Request。

## 反馈
如果你在使用过程中遇到任何问题或建议，请通过以下方式告诉我们：

- 提交 [Issue](https://github.com/iAJue/Articlesync/issues)
  - BUG
    - 浏览器版本: Chrome 129.0.6668.90
    - 内核版本: 129.0.6668.90
    - 操作系统: Windows 10
    - 插件版本: 1.0.0
    - 复现步骤:
    - 错误描述:
  - 建议
    - 描述:
    - 期望效果:
  - 支持
    - 平台:
    - 网址:
    - 账号: (有最好)
- Blog：访问 [阿珏酱のBlog](https://MoeJue.cn) 留言


## 投喂 ☕
	我很可爱，请给我钱！
	I am cute, please give me money!

![image](./images/Feeding.gif)

#### 啥？没钱？没事，我也支持虚拟币
钱包地址：`0x56949baed7b69b09a1c5539230ba6ffadd0323c3`

## 许可证

Copyright (c) 2024-present, iAJue

本项目遵循 [GPL-3.0](https://opensource.org/licenses/GPL-3.0) 许可证。