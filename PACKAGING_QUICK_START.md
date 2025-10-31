# 打包快速开始 - 5分钟生成.exe

## 🚀 最简单的方法

### 在PowerShell中执行（按顺序）：

```powershell
# 1. 进入项目目录
cd D:\下载\message-aggregator

# 2. 设置环境变量（跳过Puppeteer下载）
$env:PUPPETEER_SKIP_DOWNLOAD="true"

# 3. 一键打包
pnpm package:win
```

**等待5-10分钟**（首次打包需要下载Electron，约100MB）

**完成后查看**：
```powershell
dir release
```

您会看到：`message-aggregator-setup-1.0.0.exe`（约150-200MB）

---

## ✅ 打包前检查

确保以下命令能正常运行：

```powershell
# 测试开发模式
pnpm dev
```

如果能看到应用窗口，就可以打包了！

---

## 📦 打包后测试

```powershell
# 进入release目录
cd release

# 双击安装
.\message-aggregator-setup-1.0.0.exe
```

安装完成后，测试：
- [ ] 应用能正常启动
- [ ] 桌面有快捷方式
- [ ] 开始菜单有快捷方式
- [ ] 所有功能正常

---

## 🔧 如果打包失败

### 方法1：清理后重试

```powershell
# 删除旧文件
Remove-Item -Recurse -Force dist, release -ErrorAction SilentlyContinue

# 重新打包
$env:PUPPETEER_SKIP_DOWNLOAD="true"
pnpm package:win
```

### 方法2：使用国内镜像

```powershell
# 设置Electron镜像
$env:ELECTRON_MIRROR="https://cdn.npmmirror.com/binaries/electron/"

# 重新打包
pnpm package:win
```

### 方法3：分步打包

```powershell
# 步骤1：构建
pnpm build

# 步骤2：打包
npx electron-builder --win --x64
```

---

## 📤 分发给用户

### 方法1：云盘分享
1. 上传`release/message-aggregator-setup-1.0.0.exe`到百度云盘/OneDrive
2. 分享链接给用户

### 方法2：GitHub Release
```powershell
gh release create v1.0.0 release/*.exe --title "v1.0.0" --notes "首次发布"
```

### 方法3：直接发送
- 通过微信/QQ发送给用户
- 用户下载后双击安装

---

## 💡 常见问题

### Q: 打包很慢？
**A**: 首次打包需要下载Electron（约100MB），耐心等待。后续打包会快很多。

### Q: 文件太大？
**A**: 这是正常的，所有Electron应用都是150-200MB左右。

### Q: 安装时提示"不受信任"？
**A**: 点击"仍要运行"即可。如需去除警告，需要购买代码签名证书（约$200/年）。

### Q: 如何修改应用图标？
**A**: 替换`public/icon.png`，然后重新打包。

### Q: 如何修改版本号？
**A**: 编辑`package.json`中的`"version": "1.0.0"`，然后重新打包。

---

## 🎯 完整流程总结

```
1. 确保应用能正常运行 (pnpm dev)
   ↓
2. 设置环境变量 ($env:PUPPETEER_SKIP_DOWNLOAD="true")
   ↓
3. 执行打包命令 (pnpm package:win)
   ↓
4. 等待5-10分钟
   ↓
5. 在release/目录找到.exe文件
   ↓
6. 测试安装
   ↓
7. 分发给用户
```

---

## 📞 需要详细指南？

查看完整文档：`WINDOWS_PACKAGING_GUIDE.md`

---

**就这么简单！** 🎉
