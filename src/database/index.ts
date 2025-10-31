import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import crypto from 'crypto';

// 加密密钥（实际应用中应从安全存储获取）
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

// 加密函数
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(crypto.createHash('sha256').update(ENCRYPTION_KEY).digest()),
    iv
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// 解密函数
export function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(crypto.createHash('sha256').update(ENCRYPTION_KEY).digest()),
    iv
  );
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

class DatabaseManager {
  private db: Database.Database | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'message-aggregator.db');
    
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    
    this.createTables();
  }

  private createTables() {
    if (!this.db) return;

    // 用户表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        google_id TEXT,
        display_name TEXT,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 平台账户表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS platform_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        platform TEXT NOT NULL,
        account_name TEXT NOT NULL,
        account_avatar TEXT,
        credentials TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 监听频道表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS monitored_channels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        channel_id TEXT NOT NULL,
        channel_name TEXT NOT NULL,
        channel_icon TEXT,
        is_monitoring BOOLEAN DEFAULT 1,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES platform_accounts(id) ON DELETE CASCADE,
        UNIQUE(account_id, channel_id)
      )
    `);

    // 消息缓存表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        channel_name TEXT NOT NULL,
        message_id TEXT NOT NULL,
        author TEXT NOT NULL,
        author_avatar TEXT,
        content TEXT NOT NULL,
        timestamp DATETIME NOT NULL,
        is_official BOOLEAN DEFAULT 0,
        is_pinned BOOLEAN DEFAULT 0,
        is_highlighted BOOLEAN DEFAULT 0,
        priority_score INTEGER DEFAULT 10,
        url TEXT,
        attachments TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(platform, channel_id, message_id)
      )
    `);

    // 关键词规则表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS keyword_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        keyword TEXT NOT NULL,
        rule_type TEXT NOT NULL,
        priority INTEGER DEFAULT 10,
        is_regex BOOLEAN DEFAULT 0,
        platforms TEXT,
        channels TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 应用配置表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS app_config (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        user_id INTEGER,
        theme TEXT DEFAULT 'light',
        language TEXT DEFAULT 'zh-CN',
        auto_start BOOLEAN DEFAULT 0,
        minimize_to_tray BOOLEAN DEFAULT 1,
        notification_enabled BOOLEAN DEFAULT 1,
        sound_enabled BOOLEAN DEFAULT 1,
        message_retention_days INTEGER DEFAULT 30,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 创建索引
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_messages_platform ON messages(platform);
      CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel_id);
      CREATE INDEX IF NOT EXISTS idx_messages_priority ON messages(priority_score DESC);
      CREATE INDEX IF NOT EXISTS idx_messages_highlighted ON messages(is_highlighted);
    `);
  }

  getDatabase(): Database.Database {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export const dbManager = new DatabaseManager();
export const db = dbManager.getDatabase();
