# Windows打包指南 - 生成.exe安装文件

## 📋 概述

本指南将教您如何将消息聚合器打包成Windows可执行的安装程序（.exe文件），方便分发给其他用户。

---

## 🎯 最终产物

打包完成后，您将得到：
- `message-aggregator-setup-1.0.0.exe` - 安装程序（约150-200MB）
- 用户双击即可安装，无需Node.js环境
- 自动创建桌面快捷方式
- 支持卸载

---

## ⚙️ 前期准备

### 1. 确保项目可以正常运行

在打包前，先确认应用能正常启动：

```powershell
# 启动开发模式测试
pnpm dev
```

如果能看到应用窗口，说明一切正常。

### 2. 安装必要的工具

打包工具已经在项目中配置好了（electron-builder），无需额外安装。

---

## 📦 方法一：一键打包（推荐）

### 步骤1：构建项目

在PowerShell中执行：

```powershell
# 确保在项目根目录
cd D:\下载\message-aggregator

# 跳过Puppeteer下载（如果之前没设置）
$env:PUPPETEER_SKIP_DOWNLOAD="true"

# 构建项目
pnpm build
```

**等待时间**：约1-2分钟

**输出**：会在`dist/`目录生成编译后的文件

### 步骤2：打包成.exe

```powershell
# 打包Windows安装程序
pnpm package:win
```

**等待时间**：约3-5分钟（首次打包会下载Electron二进制文件）

**输出位置**：`release/` 文件夹

### 步骤3：查看打包结果

```powershell
# 查看生成的文件
dir release
```

您会看到类似这样的文件：
```
message-aggregator-setup-1.0.0.exe    (安装程序，约150-200MB)
```

---

## 🔧 方法二：分步打包（更可控）

如果一键打包失败，可以分步执行：

### 步骤1：清理旧文件

```powershell
# 删除旧的构建文件
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force release -ErrorAction SilentlyContinue
```

### 步骤2：构建渲染进程

```powershell
pnpm build:renderer
```

### 步骤3：构建主进程

```powershell
pnpm build:main
```

### 步骤4：构建Preload脚本

```powershell
pnpm build:preload
```

### 步骤5：打包

```powershell
# 使用electron-builder打包
npx electron-builder --win --x64
```

---

## 📝 打包配置说明

打包配置已经在`package.json`中设置好了：

```json
{
  "build": {
    "appId": "com.messageaggregator.app",
    "productName": "消息聚合器",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "public/**/*",
      "package.json"
    ],
    "win": {
      "target": ["nsis"],
      "icon": "public/icon.png"
    }
  }
}
```

### 配置项说明

- **appId**: 应用唯一标识符
- **productName**: 应用显示名称
- **output**: 打包文件输出目录
- **files**: 需要打包的文件
- **win.target**: Windows打包格式（nsis = 安装程序）
- **win.icon**: 应用图标

---

## 🎨 自定义打包

### 修改应用图标

1. 准备一个256x256的PNG图片
2. 替换`public/icon.png`
3. 重新打包

### 修改应用名称

编辑`package.json`：

```json
{
  "name": "message-aggregator",
  "productName": "消息聚合器",  // 修改这里
  "version": "1.0.0"
}
```

### 修改版本号

```json
{
  "version": "1.0.0"  // 修改这里
}
```

### 添加应用描述

```json
{
  "description": "跨平台消息聚合桌面应用"  // 修改这里
}
```

---

## 🚀 高级打包选项

### 打包便携版（无需安装）

编辑`package.json`，修改`win.target`：

```json
{
  "build": {
    "win": {
      "target": ["portable"]  // 改为portable
    }
  }
}
```

然后打包：

```powershell
pnpm package:win
```

会生成`message-aggregator-1.0.0-portable.exe`，双击即可运行，无需安装。

### 同时生成安装版和便携版

```json
{
  "build": {
    "win": {
      "target": ["nsis", "portable"]
    }
  }
}
```

### 添加代码签名（可选）

如果您有代码签名证书，可以避免Windows安全警告：

```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/cert.pfx",
      "certificatePassword": "your-password"
    }
  }
}
```

**注意**：代码签名证书需要购买（约$200-500/年）

---

## 📤 分发打包文件

### 方法一：直接分享

1. 将`release/message-aggregator-setup-1.0.0.exe`上传到云盘
2. 分享下载链接给用户
3. 用户下载后双击安装

### 方法二：发布到GitHub

```powershell
# 创建GitHub Release
gh release create v1.0.0 release/*.exe --title "v1.0.0" --notes "首次发布"
```

### 方法三：上传到网站

将.exe文件上传到您的网站，提供下载链接。

---

## 🛠️ 常见问题

### Q1: 打包时提示"electron-builder not found"

**解决方法**：

```powershell
# 重新安装依赖
pnpm install

# 或者全局安装electron-builder
npm install -g electron-builder
```

### Q2: 打包速度很慢

**原因**：首次打包需要下载Electron二进制文件（约100MB）

**解决方法**：
- 耐心等待（只有第一次慢）
- 使用国内镜像：

```powershell
$env:ELECTRON_MIRROR="https://cdn.npmmirror.com/binaries/electron/"
pnpm package:win
```

### Q3: 打包后文件太大

**原因**：包含了完整的Chromium浏览器和Node.js运行时

**优化方法**：
1. 删除不必要的依赖
2. 使用`asar`压缩（默认已启用）
3. 排除开发依赖

在`package.json`中添加：

```json
{
  "build": {
    "files": [
      "dist/**/*",
      "!node_modules/**/*",
      "!src/**/*"
    ]
  }
}
```

### Q4: 安装时Windows提示"不受信任的发布者"

**原因**：没有代码签名

**解决方法**：
- 告诉用户点击"仍要运行"
- 或购买代码签名证书

### Q5: 打包后无法启动

**排查步骤**：

1. 检查`dist/`目录是否有文件
2. 检查`package.json`中的`main`字段是否正确
3. 查看日志文件（通常在`%APPDATA%\message-aggregator\logs\`）

### Q6: 如何减小安装包体积？

**方法**：

```json
{
  "build": {
    "compression": "maximum",
    "files": [
      "dist/**/*",
      "!**/*.map"  // 排除source map
    ]
  }
}
```

---

## 🎯 完整打包流程（推荐）

### 发布前检查清单

- [ ] 应用在开发模式下正常运行
- [ ] 所有功能测试通过
- [ ] 更新了版本号
- [ ] 准备了应用图标
- [ ] 编写了更新日志

### 执行打包

```powershell
# 1. 清理旧文件
Remove-Item -Recurse -Force dist, release -ErrorAction SilentlyContinue

# 2. 设置环境变量
$env:PUPPETEER_SKIP_DOWNLOAD="true"

# 3. 安装依赖（如果还没安装）
pnpm install

# 4. 构建项目
pnpm build

# 5. 打包
pnpm package:win

# 6. 测试安装包
cd release
.\message-aggregator-setup-1.0.0.exe
```

### 验证打包结果

1. 双击安装程序
2. 完成安装
3. 启动应用，测试所有功能
4. 检查快捷方式是否正常
5. 测试卸载功能

---

## 📊 打包文件大小参考

| 组件 | 大小 |
|------|------|
| Electron运行时 | ~100MB |
| Chromium浏览器 | ~80MB |
| Node.js运行时 | ~20MB |
| 应用代码 | ~5MB |
| 依赖包 | ~30MB |
| **总计** | **~150-200MB** |

**注意**：这是正常大小，所有Electron应用都差不多这个体积。

---

## 🔐 安全建议

### 1. 不要在代码中硬编码敏感信息

```javascript
// ❌ 错误
const API_KEY = "sk-1234567890";

// ✅ 正确
const API_KEY = process.env.API_KEY;
```

### 2. 使用代码混淆（可选）

安装混淆工具：

```powershell
npm install -D javascript-obfuscator
```

### 3. 启用ASAR加密（可选）

```json
{
  "build": {
    "asar": true,
    "asarUnpack": ["**/*.node"]
  }
}
```

---

## 📚 进阶资源

### 官方文档
- electron-builder文档：https://www.electron.build
- Electron文档：https://www.electronjs.org

### 视频教程
- B站搜索："Electron打包教程"
- YouTube搜索："Electron Builder Tutorial"

### 常用工具
- **electron-builder**: 打包工具（已使用）
- **electron-updater**: 自动更新
- **electron-log**: 日志记录

---

## 🎉 打包成功后

### 分享给用户

创建一个`安装说明.txt`：

```
消息聚合器 v1.0.0 安装指南

1. 双击 message-aggregator-setup-1.0.0.exe
2. 按照提示完成安装
3. 安装完成后会自动创建桌面快捷方式
4. 双击快捷方式启动应用

系统要求：
- Windows 10 或更高版本
- 至少2GB内存
- 约300MB磁盘空间

如有问题，请联系：support@messageaggregator.com
```

### 发布到网站

```html
<a href="https://your-site.com/downloads/message-aggregator-setup-1.0.0.exe">
  下载消息聚合器 v1.0.0 (150MB)
</a>
```

---

## 💡 小贴士

1. **首次打包会比较慢**：需要下载Electron二进制文件
2. **后续打包会快很多**：缓存了必要文件
3. **测试很重要**：在干净的Windows系统上测试安装
4. **保留源代码**：打包后的.exe无法还原源代码
5. **版本管理**：每次发布都更新版本号

---

**祝您打包顺利！** 🚀

如有任何问题，欢迎随时询问。

---

**文档版本**: 1.0  
**创建日期**: 2025年10月31日  
**作者**: Manus AI
