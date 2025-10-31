@echo off
chcp 65001 >nul
echo ========================================
echo    消息聚合器 - 一键打包脚本
echo ========================================
echo.

REM 检查node_modules是否存在
if not exist "node_modules" (
    echo [错误] 未检测到依赖包！
    echo.
    echo 请先运行"一键安装.bat"安装依赖。
    echo.
    pause
    exit /b 1
)

echo [提示] 开始打包应用...
echo.
echo 这可能需要5-10分钟，请耐心等待...
echo 首次打包需要下载Electron（约100MB）
echo.
echo ========================================
echo.

REM 设置环境变量
set PUPPETEER_SKIP_DOWNLOAD=true
set ELECTRON_MIRROR=https://cdn.npmmirror.com/binaries/electron/

REM 清理旧的构建文件
echo [1/4] 清理旧文件...
if exist "dist" rmdir /s /q dist
if exist "release" rmdir /s /q release
echo [✓] 清理完成
echo.

REM 构建项目
echo [2/4] 构建项目...
pnpm build

if %errorlevel% neq 0 (
    echo.
    echo [错误] 构建失败！
    echo.
    echo 尝试使用npm构建...
    npm run build
    
    if %errorlevel% neq 0 (
        echo.
        echo [错误] 构建失败！请检查代码是否有错误。
        echo.
        pause
        exit /b 1
    )
)

echo [✓] 构建完成
echo.

REM 打包
echo [3/4] 打包成.exe文件...
echo 这一步会比较慢，请耐心等待...
echo.

pnpm package:win

if %errorlevel% neq 0 (
    echo.
    echo [错误] 打包失败！
    echo.
    echo 尝试使用electron-builder直接打包...
    npx electron-builder --win --x64
    
    if %errorlevel% neq 0 (
        echo.
        echo [错误] 打包失败！
        echo.
        echo 可能的原因：
        echo 1. 网络问题，无法下载Electron
        echo 2. 磁盘空间不足（需要至少2GB）
        echo 3. 防火墙阻止了下载
        echo.
        echo 建议：
        echo 1. 检查网络连接
        echo 2. 关闭防火墙后重试
        echo 3. 使用VPN或更换网络环境
        echo.
        pause
        exit /b 1
    )
)

echo [✓] 打包完成
echo.

REM 检查输出文件
echo [4/4] 检查打包结果...
echo.

if exist "release\*.exe" (
    echo ========================================
    echo    ✓ 打包成功！
    echo ========================================
    echo.
    echo 生成的文件位于 release 目录：
    echo.
    dir /b release\*.exe
    echo.
    echo 文件大小：
    dir release\*.exe | find ".exe"
    echo.
    echo 您可以：
    echo 1. 进入 release 文件夹查看
    echo 2. 双击.exe文件测试安装
    echo 3. 将.exe文件分享给其他用户
    echo.
    echo 按任意键打开 release 文件夹...
    pause >nul
    explorer release
) else (
    echo [错误] 未找到生成的.exe文件！
    echo.
    echo 请检查 release 目录是否存在。
    echo.
    pause
    exit /b 1
)
