import { contextBridge, ipcRenderer } from 'electron';
import { IPCChannel } from '../types';

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 认证
  login: (credentials: any) => ipcRenderer.invoke(IPCChannel.LOGIN, credentials),
  logout: () => ipcRenderer.invoke(IPCChannel.LOGOUT),
  getUser: (userId: number) => ipcRenderer.invoke(IPCChannel.GET_USER, userId),
  
  // 平台账户
  addAccount: (accountData: any) => ipcRenderer.invoke(IPCChannel.ADD_ACCOUNT, accountData),
  removeAccount: (accountId: number) => ipcRenderer.invoke(IPCChannel.REMOVE_ACCOUNT, accountId),
  getAccounts: (userId: number) => ipcRenderer.invoke(IPCChannel.GET_ACCOUNTS, userId),
  toggleAccount: (accountId: number) => ipcRenderer.invoke(IPCChannel.TOGGLE_ACCOUNT, accountId),
  
  // 频道
  getChannels: (accountId: number) => ipcRenderer.invoke(IPCChannel.GET_CHANNELS, accountId),
  toggleMonitoring: (data: any) => ipcRenderer.invoke(IPCChannel.TOGGLE_MONITORING, data),
  
  // 消息
  getMessages: (query: any) => ipcRenderer.invoke(IPCChannel.GET_MESSAGES, query),
  clearMessages: (data: any) => ipcRenderer.invoke(IPCChannel.CLEAR_MESSAGES, data),
  onNewMessage: (callback: (message: any) => void) => {
    ipcRenderer.on(IPCChannel.NEW_MESSAGE, (event, message) => callback(message));
  },
  
  // 关键词规则
  addRule: (ruleData: any) => ipcRenderer.invoke(IPCChannel.ADD_RULE, ruleData),
  removeRule: (ruleId: number) => ipcRenderer.invoke(IPCChannel.REMOVE_RULE, ruleId),
  getRules: (userId: number) => ipcRenderer.invoke(IPCChannel.GET_RULES, userId),
  updateRule: (ruleData: any) => ipcRenderer.invoke(IPCChannel.UPDATE_RULE, ruleData),
  
  // 通知
  showNotification: (data: any) => ipcRenderer.invoke(IPCChannel.SHOW_NOTIFICATION, data),
});

// 类型声明
declare global {
  interface Window {
    electronAPI: {
      login: (credentials: any) => Promise<any>;
      logout: () => Promise<any>;
      getUser: (userId: number) => Promise<any>;
      addAccount: (accountData: any) => Promise<any>;
      removeAccount: (accountId: number) => Promise<any>;
      getAccounts: (userId: number) => Promise<any>;
      toggleAccount: (accountId: number) => Promise<any>;
      getChannels: (accountId: number) => Promise<any>;
      toggleMonitoring: (data: any) => Promise<any>;
      getMessages: (query: any) => Promise<any>;
      clearMessages: (data: any) => Promise<any>;
      onNewMessage: (callback: (message: any) => void) => void;
      addRule: (ruleData: any) => Promise<any>;
      removeRule: (ruleId: number) => Promise<any>;
      getRules: (userId: number) => Promise<any>;
      updateRule: (ruleData: any) => Promise<any>;
      showNotification: (data: any) => Promise<any>;
    };
  }
}
