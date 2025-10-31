@echo off
chcp 65001 >nul
echo ========================================
echo    消息聚合器 - 一键启动脚本
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

echo [提示] 正在启动应用...
echo.
echo 启动后会自动打开应用窗口
echo 如需停止，请关闭此窗口或按 Ctrl+C
echo.
echo ========================================
echo.

REM 设置环境变量
set PUPPETEER_SKIP_DOWNLOAD=true
set NODE_ENV=development

REM 启动应用
pnpm dev

if %errorlevel% neq 0 (
    echo.
    echo [错误] 启动失败！
    echo.
    echo 尝试使用npm启动...
    npm run dev
    
    if %errorlevel% neq 0 (
        echo.
        echo [错误] 启动失败！
        echo.
        echo 可能的原因：
        echo 1. 依赖未正确安装，请重新运行"一键安装.bat"
        echo 2. 端口5173被占用，请关闭其他应用
        echo 3. 防火墙阻止了应用运行
        echo.
        pause
        exit /b 1
    )
)
