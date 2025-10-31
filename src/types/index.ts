// 平台类型枚举
export enum Platform {
  DISCORD = 'discord',
  TELEGRAM = 'telegram',
  REDDIT = 'reddit',
  WECHAT = 'wechat',
  QQ = 'qq',
  SLACK = 'slack',
}

// 消息附件
export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'file' | 'link';
  url: string;
  name?: string;
  size?: number;
}

// 统一消息格式
export interface Message {
  id: string;
  platform: Platform;
  channelId: string;
  channelName: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
  isOfficial?: boolean;
  isPinned?: boolean;
  isHighlighted?: boolean;
  priorityScore?: number;
  url?: string;
}

// 频道/群组
export interface Channel {
  id: string;
  name: string;
  platform: Platform;
  icon?: string;
  description?: string;
  memberCount?: number;
  isMonitoring: boolean;
}

// 平台账户
export interface PlatformAccount {
  id: number;
  userId: number;
  platform: Platform;
  accountName: string;
  accountAvatar?: string;
  credentials: string; // 加密后的凭证
  isActive: boolean;
  createdAt: Date;
}

// 用户
export interface User {
  id: number;
  email: string;
  googleId?: string;
  displayName?: string;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
}

// 关键词规则类型
export enum RuleType {
  HIGHLIGHT = 'highlight',
  FILTER = 'filter',
  NOTIFY = 'notify',
}

// 关键词规则
export interface KeywordRule {
  id: number;
  userId: number;
  keyword: string;
  ruleType: RuleType;
  priority: number;
  isRegex: boolean;
  platforms?: Platform[];
  channels?: string[];
  createdAt: Date;
}

// 平台抓取器接口
export interface PlatformScraper {
  platformName: Platform;
  platformIcon: string;
  
  initialize(credentials: any): Promise<void>;
  login(credentials: any): Promise<boolean>;
  getChannels(): Promise<Channel[]>;
  startListening(channelIds: string[]): void;
  stopListening(): void;
  onMessage(callback: (message: Message) => void): void;
  onError(callback: (error: Error) => void): void;
  cleanup(): Promise<void>;
}

// IPC通信消息类型
export enum IPCChannel {
  // 认证相关
  LOGIN = 'auth:login',
  LOGOUT = 'auth:logout',
  GET_USER = 'auth:get-user',
  
  // 平台账户相关
  ADD_ACCOUNT = 'account:add',
  REMOVE_ACCOUNT = 'account:remove',
  GET_ACCOUNTS = 'account:get-all',
  TOGGLE_ACCOUNT = 'account:toggle',
  
  // 频道相关
  GET_CHANNELS = 'channel:get-all',
  TOGGLE_MONITORING = 'channel:toggle-monitoring',
  
  // 消息相关
  GET_MESSAGES = 'message:get',
  NEW_MESSAGE = 'message:new',
  CLEAR_MESSAGES = 'message:clear',
  
  // 关键词规则相关
  ADD_RULE = 'rule:add',
  REMOVE_RULE = 'rule:remove',
  GET_RULES = 'rule:get-all',
  UPDATE_RULE = 'rule:update',
  
  // 通知相关
  SHOW_NOTIFICATION = 'notification:show',
}

// 消息查询参数
export interface MessageQuery {
  platform?: Platform;
  channelId?: string;
  startDate?: Date;
  endDate?: Date;
  keyword?: string;
  isHighlighted?: boolean;
  limit?: number;
  offset?: number;
}

// 应用配置
export interface AppConfig {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  autoStart: boolean;
  minimizeToTray: boolean;
  notificationEnabled: boolean;
  soundEnabled: boolean;
  messageRetentionDays: number;
}
