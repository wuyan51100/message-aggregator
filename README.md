# 消息聚合器 (Message Aggregator)

<div align="center">

![Logo](public/icon.svg)

**一个开源的跨平台桌面应用，统一管理多个群组软件的消息**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-39.0-blue.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

[English](README_EN.md) | 简体中文

</div>

## 📖 项目简介

消息聚合器是一款专为Web3项目参与者、社区管理员和信息追踪者设计的桌面应用。它能够实时监控多个平台(Discord、Telegram、Reddit、微信、QQ、Slack等)的群组消息，智能过滤和高亮重要公告，让您不再错过任何关键信息。

### ✨ 核心特性

- 🌐 **多平台支持**: 支持Discord、Telegram、Reddit、微信、QQ、Slack等主流群组软件
- 🔐 **统一认证**: 通过Google/邮箱登录应用，集中管理所有平台账户
- 🚀 **实时抓取**: 直接模拟登录各平台账户，绕过API限制，获取完整消息内容
- 🎯 **智能过滤**: 支持关键词过滤、正则表达式匹配、优先级排序
- 💡 **智能高亮**: 自动识别官方消息、置顶消息，根据优先级算法高亮显示
- 📊 **多种视图**: 时间线视图、分类卡片视图、仪表盘视图，满足不同使用场景
- 🔔 **桌面通知**: 重要消息实时推送桌面通知
- 🔌 **插件化架构**: 模块化设计，方便社区贡献新平台支持
- 🔒 **隐私保护**: 所有数据本地加密存储，不上传到任何服务器
- 💻 **跨平台**: 支持Windows、macOS、Linux操作系统

## 🖼️ 界面预览

### 登录页面
![Login Page](docs/screenshots/login.png)

### 时间线视图
![Timeline View](docs/screenshots/timeline.png)

### 账户管理
![Account Manager](docs/screenshots/accounts.png)

## 🚀 快速开始

### 安装

#### Windows
1. 下载最新版本的 `.exe` 安装包
2. 双击运行安装程序
3. 按照提示完成安装

#### macOS
1. 下载最新版本的 `.dmg` 文件
2. 打开dmg文件，将应用拖入Applications文件夹
3. 首次运行可能需要在"系统偏好设置 > 安全性与隐私"中允许

#### Linux
1. 下载最新版本的 `.AppImage` 文件
2. 添加执行权限: `chmod +x message-aggregator.AppImage`
3. 运行: `./message-aggregator.AppImage`

### 使用指南

#### 1. 登录应用
- 使用邮箱密码登录，或通过Google账户快捷登录
- 首次登录会自动创建账户

#### 2. 添加平台账户
- 点击左侧菜单"账户管理"
- 点击"添加账户"按钮
- 选择要添加的平台
- 根据平台要求提供登录凭证

#### 3. 选择监听频道
- 添加账户后，系统会自动拉取该账户已加入的频道列表
- 勾选要监听的频道
- 开始接收实时消息

#### 4. 设置关键词过滤
- 点击顶部"过滤规则"按钮
- 添加关键词(支持正则表达式)
- 设置规则类型(高亮/过滤/通知)
- 保存规则

## 🔧 开发指南

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/your-username/message-aggregator.git
cd message-aggregator

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建应用
pnpm build

# 打包Windows应用
pnpm package:win

# 打包macOS应用
pnpm package:mac

# 打包Linux应用
pnpm package:linux
```

### 项目结构

```
message-aggregator/
├── src/
│   ├── main/              # Electron主进程
│   │   └── index.ts       # 主进程入口
│   ├── renderer/          # React渲染进程
│   │   ├── pages/         # 页面组件
│   │   ├── components/    # 通用组件
│   │   ├── App.tsx        # 应用根组件
│   │   └── main.tsx       # 渲染进程入口
│   ├── preload/           # Preload脚本
│   │   └── index.ts       # IPC通信桥接
│   ├── plugins/           # 平台抓取器插件
│   │   ├── discord-scraper.ts
│   │   ├── telegram-scraper.ts
│   │   └── reddit-scraper.ts
│   ├── database/          # 数据库管理
│   │   └── index.ts       # SQLite封装
│   └── types/             # TypeScript类型定义
│       └── index.ts
├── public/                # 静态资源
├── dist/                  # 构建输出
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 开发新平台插件

所有平台抓取器需实现 `PlatformScraper` 接口:

```typescript
interface PlatformScraper {
  platformName: Platform;
  platformIcon: string;
  
  initialize(credentials: any): Promise<void>;
  login(credentials: any): Promise<boolean>;
  getChannels(): Promise<Channel[]>;
  startListening(channelIds: string[]): void;
  stopListening(): void;
  onMessage(callback: (message: Message) => void): void;
  onError(callback: (error: Error) => void): void;
  cleanup(): Promise<void>;
}
```

参考 `src/plugins/discord-scraper.ts` 实现新平台支持。

## 📚 平台接入指南

### Discord
1. 打开Discord网页版并登录
2. 按F12打开开发者工具
3. 进入Console标签
4. 输入并执行: `(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()`
5. 复制返回的Token
6. 在应用中添加Discord账户时粘贴Token

### Telegram
1. 访问 https://my.telegram.org
2. 登录并进入"API development tools"
3. 创建新应用获取API ID和API Hash
4. 在应用中添加Telegram账户时填写这些信息

### Reddit
1. 登录Reddit网页版
2. 按F12打开开发者工具
3. 进入Application > Cookies
4. 复制所有Cookie
5. 在应用中添加Reddit账户时粘贴Cookie

### 其他平台
请参考 [完整文档](docs/platform-guides.md)

## ⚠️ 重要提示

1. **账户安全**: 建议使用小号进行监控，避免主账号被平台封禁
2. **频率限制**: 请遵守各平台的API调用频率限制
3. **隐私保护**: 所有凭证信息均加密存储在本地，不会上传到任何服务器
4. **合规使用**: 请仅用于个人学习研究，不要进行商业化使用或大规模数据爬取
5. **法律责任**: 使用本应用造成的任何后果由用户自行承担

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### 贡献方向

- 🐛 修复Bug
- ✨ 添加新平台支持
- 📝 完善文档
- 🌍 翻译多语言
- 🎨 改进UI/UX设计
- ⚡ 性能优化

## 📄 开源许可

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [React](https://reactjs.org/) - 用户界面库
- [Ant Design](https://ant.design/) - 企业级UI组件库
- [Puppeteer](https://pptr.dev/) - 无头浏览器自动化
- [Better SQLite3](https://github.com/WiseLibs/better-sqlite3) - 高性能SQLite库

## 📞 联系我们

- 提交Issue: [GitHub Issues](https://github.com/your-username/message-aggregator/issues)
- 讨论交流: [GitHub Discussions](https://github.com/your-username/message-aggregator/discussions)
- 邮箱: support@messageaggregator.com

## 🗺️ 开发路线图

- [x] Phase 1: 基础框架搭建
- [x] Phase 2: 用户认证系统
- [ ] Phase 3: Discord平台支持
- [ ] Phase 4: Telegram平台支持
- [ ] Phase 5: Reddit平台支持
- [ ] Phase 6: 关键词过滤与高亮
- [ ] Phase 7: 桌面通知功能
- [ ] Phase 8: 应用打包与发布
- [ ] Phase 9: 微信/QQ平台支持
- [ ] Phase 10: 多语言支持

---

<div align="center">

**如果这个项目对您有帮助，请给我们一个⭐Star⭐支持！**

Made with ❤️ by Message Aggregator Team

</div>
