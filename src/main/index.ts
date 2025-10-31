import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import path from 'path';
import { dbManager } from '../database';
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
app.whenReady().then(() => {
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
    dbManager.close();
    app.quit();
  }
});

// 应用退出前清理
app.on('before-quit', () => {
  dbManager.close();
});

// ==================== IPC 处理器 ====================

// 认证相关
ipcMain.handle(IPCChannel.LOGIN, async (event, { email, password, googleId }) => {
  try {
    const db = dbManager.getDatabase();
    
    // 简化的登录逻辑（实际应集成Firebase）
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      // 创建新用户
      const result = db.prepare(
        'INSERT INTO users (email, google_id, display_name) VALUES (?, ?, ?)'
      ).run(email, googleId || null, email.split('@')[0]);
      
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    } else {
      // 更新最后登录时间
      db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
    }
    
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.GET_USER, async (event, userId) => {
  try {
    const db = dbManager.getDatabase();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 平台账户相关
ipcMain.handle(IPCChannel.ADD_ACCOUNT, async (event, accountData) => {
  try {
    const db = dbManager.getDatabase();
    const { userId, platform, accountName, credentials } = accountData;
    
    // 加密凭证
    const { encrypt } = await import('../database');
    const encryptedCredentials = encrypt(JSON.stringify(credentials));
    
    const result = db.prepare(
      'INSERT INTO platform_accounts (user_id, platform, account_name, credentials) VALUES (?, ?, ?, ?)'
    ).run(userId, platform, accountName, encryptedCredentials);
    
    return { success: true, accountId: result.lastInsertRowid };
  } catch (error) {
    console.error('Add account error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.GET_ACCOUNTS, async (event, userId) => {
  try {
    const db = dbManager.getDatabase();
    const accounts = db.prepare(
      'SELECT id, user_id, platform, account_name, account_avatar, is_active, created_at FROM platform_accounts WHERE user_id = ?'
    ).all(userId);
    
    return { success: true, accounts };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.REMOVE_ACCOUNT, async (event, accountId) => {
  try {
    const db = dbManager.getDatabase();
    db.prepare('DELETE FROM platform_accounts WHERE id = ?').run(accountId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 频道相关
ipcMain.handle(IPCChannel.GET_CHANNELS, async (event, accountId) => {
  try {
    const db = dbManager.getDatabase();
    const channels = db.prepare(
      'SELECT * FROM monitored_channels WHERE account_id = ?'
    ).all(accountId);
    
    return { success: true, channels };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.TOGGLE_MONITORING, async (event, { channelId, accountId }) => {
  try {
    const db = dbManager.getDatabase();
    db.prepare(
      'UPDATE monitored_channels SET is_monitoring = NOT is_monitoring WHERE channel_id = ? AND account_id = ?'
    ).run(channelId, accountId);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 消息相关
ipcMain.handle(IPCChannel.GET_MESSAGES, async (event, query) => {
  try {
    const db = dbManager.getDatabase();
    let sql = 'SELECT * FROM messages WHERE 1=1';
    const params: any[] = [];
    
    if (query.platform) {
      sql += ' AND platform = ?';
      params.push(query.platform);
    }
    
    if (query.channelId) {
      sql += ' AND channel_id = ?';
      params.push(query.channelId);
    }
    
    if (query.keyword) {
      sql += ' AND content LIKE ?';
      params.push(`%${query.keyword}%`);
    }
    
    if (query.isHighlighted !== undefined) {
      sql += ' AND is_highlighted = ?';
      params.push(query.isHighlighted ? 1 : 0);
    }
    
    sql += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(query.limit || 100, query.offset || 0);
    
    const messages = db.prepare(sql).all(...params);
    
    // 解析附件JSON
    const parsedMessages = messages.map((msg: any) => ({
      ...msg,
      attachments: msg.attachments ? JSON.parse(msg.attachments) : [],
      timestamp: new Date(msg.timestamp),
    }));
    
    return { success: true, messages: parsedMessages };
  } catch (error) {
    console.error('Get messages error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.CLEAR_MESSAGES, async (event, { platform, channelId }) => {
  try {
    const db = dbManager.getDatabase();
    let sql = 'DELETE FROM messages WHERE 1=1';
    const params: any[] = [];
    
    if (platform) {
      sql += ' AND platform = ?';
      params.push(platform);
    }
    
    if (channelId) {
      sql += ' AND channel_id = ?';
      params.push(channelId);
    }
    
    db.prepare(sql).run(...params);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 关键词规则相关
ipcMain.handle(IPCChannel.ADD_RULE, async (event, ruleData) => {
  try {
    const db = dbManager.getDatabase();
    const { userId, keyword, ruleType, priority, isRegex, platforms, channels } = ruleData;
    
    const result = db.prepare(
      'INSERT INTO keyword_rules (user_id, keyword, rule_type, priority, is_regex, platforms, channels) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(
      userId,
      keyword,
      ruleType,
      priority || 10,
      isRegex ? 1 : 0,
      platforms ? JSON.stringify(platforms) : null,
      channels ? JSON.stringify(channels) : null
    );
    
    return { success: true, ruleId: result.lastInsertRowid };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.GET_RULES, async (event, userId) => {
  try {
    const db = dbManager.getDatabase();
    const rules = db.prepare('SELECT * FROM keyword_rules WHERE user_id = ?').all(userId);
    
    const parsedRules = rules.map((rule: any) => ({
      ...rule,
      platforms: rule.platforms ? JSON.parse(rule.platforms) : [],
      channels: rule.channels ? JSON.parse(rule.channels) : [],
    }));
    
    return { success: true, rules: parsedRules };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle(IPCChannel.REMOVE_RULE, async (event, ruleId) => {
  try {
    const db = dbManager.getDatabase();
    db.prepare('DELETE FROM keyword_rules WHERE id = ?').run(ruleId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// 通知相关
ipcMain.handle(IPCChannel.SHOW_NOTIFICATION, async (event, { title, body }) => {
  try {
    if (Notification.isSupported()) {
      new Notification({
        title,
        body,
        icon: path.join(__dirname, '../../public/icon.png'),
      }).show();
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

console.log('Electron main process started');
