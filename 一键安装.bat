@echo off
chcp 65001 >nul
echo ========================================
echo    消息聚合器 - 一键安装脚本
echo ========================================
echo.
echo 正在检查环境...
echo.

REM 检查Node.js是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js！
    echo.
    echo 请先安装Node.js：
    echo 1. 访问 https://nodejs.org
    echo 2. 下载并安装LTS版本
    echo 3. 重启电脑后再运行此脚本
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js 已安装
node --version
echo.

REM 检查pnpm是否安装
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [提示] 未检测到pnpm，正在安装...
    npm install -g pnpm
    echo [✓] pnpm 安装完成
    echo.
)

echo [✓] pnpm 已安装
pnpm --version
echo.

echo ========================================
echo    开始安装项目依赖
echo ========================================
echo.
echo 这可能需要3-5分钟，请耐心等待...
echo.

REM 设置环境变量，跳过Puppeteer下载
set PUPPETEER_SKIP_DOWNLOAD=true

REM 安装依赖
pnpm install

if %errorlevel% neq 0 (
    echo.
    echo [错误] 安装失败！
    echo.
    echo 尝试使用npm安装...
    npm install --legacy-peer-deps
    
    if %errorlevel% neq 0 (
        echo.
        echo [错误] npm安装也失败了！
        echo.
        echo 请检查网络连接，或联系技术支持。
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo    ✓ 安装完成！
echo ========================================
echo.
echo 接下来您可以：
echo 1. 双击"一键启动.bat"运行应用
echo 2. 双击"一键打包.bat"生成.exe安装文件
echo.
pause
