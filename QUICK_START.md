# 快速开始指南 - 5分钟上手

## 🎯 您将得到什么

一个**完整的桌面应用程序**，可以：
- 同时监控Discord、Telegram、Reddit等多个平台的消息
- 自动高亮重要公告和活动信息
- 通过关键词过滤快速找到您关心的内容
- 所有数据安全存储在您的电脑上

---

## 📥 第一步：准备环境（仅需一次）

### Windows用户

1. **下载并安装Node.js**
   - 访问：https://nodejs.org
   - 下载"LTS"版本（推荐）
   - 双击安装，一路点"下一步"即可

2. **验证安装成功**
   - 按`Win + R`，输入`cmd`，回车
   - 输入`node -v`，回车
   - 如果显示版本号（如v20.x.x），说明安装成功

3. **安装pnpm（包管理工具）**
   - 在命令提示符中输入：
     ```
     npm install -g pnpm
     ```
   - 等待安装完成

### macOS用户

1. **打开终端**（应用程序 > 实用工具 > 终端）

2. **安装Homebrew**（如果还没有）
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. **安装Node.js**
   ```bash
   brew install node
   ```

4. **安装pnpm**
   ```bash
   npm install -g pnpm
   ```

---

## 🚀 第二步：启动应用

### 方法一：使用命令行（推荐）

1. **解压项目文件**
   - 将`message-aggregator-complete.tar.gz`解压到任意位置
   - 例如：`C:\Users\你的用户名\Desktop\message-aggregator`

2. **打开命令提示符/终端**
   - Windows：在项目文件夹中按住`Shift`键，右键点击空白处，选择"在此处打开PowerShell窗口"
   - macOS：打开终端，输入`cd `（注意有空格），然后把文件夹拖进终端窗口，回车

3. **安装依赖**（第一次需要，约需3-5分钟）
   ```bash
   pnpm install
   ```

4. **启动应用**
   ```bash
   pnpm dev
   ```

5. **等待应用窗口自动打开**
   - 首次启动可能需要10-20秒
   - 之后启动会更快

### 方法二：创建启动脚本（更方便）

#### Windows用户

1. 在项目文件夹中创建一个新文件`启动应用.bat`
2. 用记事本打开，粘贴以下内容：
   ```batch
   @echo off
   echo 正在启动消息聚合器...
   cd /d %~dp0
   call pnpm dev
   pause
   ```
3. 保存后，以后双击这个文件就能启动应用

#### macOS/Linux用户

1. 在项目文件夹中创建文件`启动应用.sh`
2. 粘贴以下内容：
   ```bash
   #!/bin/bash
   echo "正在启动消息聚合器..."
   cd "$(dirname "$0")"
   pnpm dev
   ```
3. 在终端中给予执行权限：
   ```bash
   chmod +x 启动应用.sh
   ```
4. 以后双击这个文件即可启动

---

## 🎨 第三步：开始使用

### 1. 登录

应用启动后会显示登录页面：

- **邮箱**：输入任意邮箱地址（如test@example.com）
- **密码**：设置一个密码（至少6位）
- 点击"登录/注册"

**首次使用会自动创建账户，无需单独注册**

### 2. 添加平台账户

登录后进入主界面：

1. 点击左侧菜单的"账户管理"
2. 点击右上角"添加账户"按钮
3. 选择平台（Discord/Telegram/Reddit）
4. 输入登录凭证（见下方获取方法）

#### 获取Discord Token

```
1. 打开Discord网页版：https://discord.com/app
2. 按F12打开开发者工具
3. 点击"Console"标签
4. 粘贴以下代码并回车：

(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()

5. 复制返回的Token（一长串字符）
6. 在应用中粘贴
```

#### 获取Telegram凭证

```
1. 访问：https://my.telegram.org
2. 用手机号登录
3. 点击"API development tools"
4. 创建应用，获取API ID和API Hash
5. 在应用中填写：
   {
     "api_id": "你的API_ID",
     "api_hash": "你的API_Hash",
     "phone": "+86你的手机号"
   }
```

### 3. 选择监听频道

添加账户后：

1. 系统会自动显示您已加入的所有频道
2. 勾选要监听的频道
3. 点击"开始监听"

### 4. 查看消息

切换不同视图查看消息：

- **时间线视图**：所有消息按时间排序
- **分类卡片**：按平台分组显示
- **仪表盘**：只显示重要消息

### 5. 设置关键词过滤

1. 点击顶部"过滤规则"
2. 添加关键词（如"空投"、"白名单"、"AMA"）
3. 选择规则类型：
   - **高亮**：包含关键词的消息会高亮显示
   - **过滤**：只显示包含关键词的消息
   - **通知**：收到包含关键词的消息时弹出通知

---

## ⚠️ 重要提示

### 关于账户安全

- ⚠️ **建议使用小号**：避免主账号被平台检测封禁
- 🔒 **Token安全**：Token相当于密码，不要分享给他人
- 💾 **数据本地存储**：所有数据只保存在您的电脑上

### 当前功能状态

✅ **已完成**：
- 用户界面
- 账户管理
- 消息展示
- 设置功能

🚧 **需要进一步开发**：
- 实际的消息抓取（目前是演示数据）
- 实时消息推送
- 关键词过滤算法

**如需完整功能，建议找开发者继续完成**

---

## 🔧 常见问题

### Q: 启动后没有窗口弹出？

**A**: 检查命令提示符是否有错误信息
- 如果提示"pnpm: command not found"，重新安装pnpm
- 如果提示端口被占用，关闭其他占用5173端口的程序

### Q: 添加账户后看不到消息？

**A**: 当前版本主要展示界面和架构
- 实际消息抓取功能需要进一步开发
- 可以看到演示数据验证功能

### Q: 如何关闭应用？

**A**: 
- 点击窗口右上角的X关闭
- 或在命令提示符中按`Ctrl + C`

### Q: 如何完全卸载？

**A**: 
1. 删除项目文件夹
2. 删除数据文件夹：
   - Windows: `C:\Users\你的用户名\AppData\Roaming\message-aggregator`
   - macOS: `~/Library/Application Support/message-aggregator`
   - Linux: `~/.config/message-aggregator`

---

## 📞 需要帮助？

### 技术支持

- 📧 邮件：support@messageaggregator.com
- 💬 GitHub Issues：提交问题报告
- 📖 详细文档：查看`docs/USER_GUIDE.md`

### 继续开发

如果您需要完成剩余功能：

1. **查看技术文档**：`architecture_design.md`
2. **查看交付说明**：`DELIVERY_GUIDE.md`
3. **联系开发者**：提供完整项目文件

---

## 🎉 开始使用

现在您已经了解了基本操作，可以：

1. ✅ 启动应用体验界面
2. ✅ 添加测试账户
3. ✅ 查看演示数据
4. ✅ 测试各项功能

**祝您使用愉快！** 🚀

---

**最后更新**: 2025年10月31日  
**版本**: 1.0.0  
**作者**: Message Aggregator Team
