import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { db } from '../database';
import { IPCChannel } from '../types';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    frame: true,
    title: '消息聚合器 - Message Aggregator',
    icon: path.join(__dirname, '../../public/icon.png'),
  });

  // 开发环境加载Vite开发服务器，生产环境加载打包后的文件
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用准备就绪
app.whenReady().then(async () => {
  await db.init();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（macOS除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ==================== IPC 处理器 ====================

// 认证相关
ipcMain.handle(IPCChannel.LOGIN, async (event, { email }) => {
  try {
    // 简化的登录逻辑
    const user = {
      id: '1',
      email,
      displayName: email.split('@')[0]
    };
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.GET_USER, async (event, userId) => {
  try {
    const user = {
      id: userId,
      email: 'user@example.com',
      displayName: 'User'
    };
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// 平台账户相关
ipcMain.handle(IPCChannel.ADD_ACCOUNT, async (event, accountData) => {
  try {
    const account = await db.addAccount(accountData);
    return { success: true, account };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.GET_ACCOUNTS, async () => {
  try {
    const accounts = await db.getAccounts();
    return { success: true, accounts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.DELETE_ACCOUNT, async (event, accountId) => {
  try {
    await db.deleteAccount(accountId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// 消息相关
ipcMain.handle(IPCChannel.GET_MESSAGES, async (event, { limit = 100 }) => {
  try {
    const messages = await db.getMessages(limit);
    return { success: true, messages };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.ADD_MESSAGE, async (event, messageData) => {
  try {
    const message = await db.addMessage(messageData);
    return { success: true, message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// 配置相关
ipcMain.handle(IPCChannel.GET_CONFIG, async () => {
  try {
    const config = {
      theme: 'light',
      language: 'zh-CN',
      autoStart: false,
      minimizeToTray: true,
      notificationEnabled: true,
      soundEnabled: true
    };
    return { success: true, config };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.UPDATE_CONFIG, async (event, configData) => {
  try {
    return { success: true, config: configData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});
