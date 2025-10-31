// 简化版数据库模块 - 使用内存存储避免编译问题
export interface Message {
  id: string;
  platform: string;
  channelId: string;
  channelName: string;
  content: string;
  author: string;
  timestamp: number;
  isImportant: boolean;
}

export interface Account {
  id: string;
  platform: string;
  username: string;
  isActive: boolean;
}

class SimpleDatabase {
  private messages: Message[] = [];
  private accounts: Account[] = [];

  async init() {
    console.log('Database initialized (in-memory mode)');
  }

  async addMessage(message: Omit<Message, 'id'>): Promise<Message> {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    this.messages.push(newMessage);
    return newMessage;
  }

  async getMessages(limit: number = 100): Promise<Message[]> {
    return this.messages
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  async addAccount(account: Omit<Account, 'id'>): Promise<Account> {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  async getAccounts(): Promise<Account[]> {
    return this.accounts;
  }

  async deleteAccount(id: string): Promise<void> {
    this.accounts = this.accounts.filter(acc => acc.id !== id);
  }
}

export const db = new SimpleDatabase();
export const dbManager = { getDatabase: () => db, close: () => {} };
