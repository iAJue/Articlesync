# ArticleSync - 多平台文章同步插件

ArticleSync 是一个浏览器扩展，帮助用户轻松将文章同步发布到多个社交平台。支持将文章从本地草稿发布到各大平台，如知乎、Bilibili 等。它提供了一站式解决方案，让你在不同的社交媒体平台上同步文章变得简单高效。

## 功能特色
- **多平台支持**：当前支持知乎、Bilibili，未来将扩展到更多平台。
- **状态跟踪**：在插件界面中查看文章的同步状态，并支持跳转至发布的文章。
- **账号管理**：可查看与插件绑定的各平台账号信息。
- **可扩展性强**：支持开发者通过适配器模式轻松扩展到更多平台。

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

## 项目结构
```
├── src
│   ├── adapters         # 各平台的适配器
│   │   ├── ZhiHuAdapter.js
│   │   ├── BilibiliAdapter.js
│   ├── content_scripts  # 内容脚本
│   ├── background.js    # 后台脚本
│   ├── popup            # 插件弹窗界面
│   │   ├── popup.js
│   │   ├── popup.html
│   ├── options          # 扩展选项页面
│   │   ├── options.js
│   │   ├── options.html
├── dist                 # 打包后的文件
├── webpack.config.js     # Webpack 配置文件
├── manifest.json         # Chrome 插件清单文件
```

## 贡献指南

欢迎对项目进行贡献！如果你有任何改进意见或想要添加新的平台支持，请遵循以下步骤：

1. Fork 仓库。
2. 创建一个新的分支。
3. 提交你的更改。
4. 发起一个 Pull Request。


## 许可证

GPL-3.0