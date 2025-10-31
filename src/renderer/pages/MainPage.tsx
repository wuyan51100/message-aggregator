import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Switch, Badge, Button, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  MessageOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BulbOutlined,
  PlusOutlined,
  FilterOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import TimelineView from '../components/TimelineView';
import CardView from '../components/CardView';
import DashboardView from '../components/DashboardView';
import AccountManager from '../components/AccountManager';
import SettingsPanel from '../components/SettingsPanel';
import { Platform, Message } from '../../types';

const { Header, Sider, Content } = Layout;

interface MainPageProps {
  user: any;
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

type ViewType = 'timeline' | 'card' | 'dashboard' | 'accounts' | 'settings';

const MainPage: React.FC<MainPageProps> = ({ user, onLogout, isDarkMode, setIsDarkMode }) => {
  const [currentView, setCurrentView] = useState<ViewType>('timeline');
  const [messages, setMessages] = useState<Message[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
    loadMessages();
  }, []);

  const loadAccounts = async () => {
    try {
      const result = await window.electronAPI.getAccounts(user.id);
      if (result.success) {
        setAccounts(result.accounts || []);
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      const result = await window.electronAPI.getMessages({ limit: 100 });
      if (result.success) {
        setMessages(result.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'timeline',
      icon: <ClockCircleOutlined />,
      label: '时间线视图',
    },
    {
      key: 'card',
      icon: <AppstoreOutlined />,
      label: '分类卡片',
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      type: 'divider',
    },
    {
      key: 'accounts',
      icon: <UserOutlined />,
      label: '账户管理',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'theme',
      icon: <BulbOutlined />,
      label: (
        <Space>
          深色模式
          <Switch checked={isDarkMode} onChange={setIsDarkMode} size="small" />
        </Space>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: onLogout,
    },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'timeline':
        return <TimelineView messages={messages} loading={loading} onRefresh={loadMessages} />;
      case 'card':
        return <CardView messages={messages} loading={loading} onRefresh={loadMessages} />;
      case 'dashboard':
        return <DashboardView messages={messages} loading={loading} onRefresh={loadMessages} />;
      case 'accounts':
        return <AccountManager userId={user.id} accounts={accounts} onAccountsChange={loadAccounts} />;
      case 'settings':
        return <SettingsPanel userId={user.id} />;
      default:
        return <TimelineView messages={messages} loading={loading} onRefresh={loadMessages} />;
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 24px',
        background: isDarkMode ? '#001529' : '#fff',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <MessageOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>消息聚合器</h2>
        </div>

        <Space size="large">
          <Button icon={<FilterOutlined />} type="text">
            过滤规则
          </Button>
          <Badge count={unreadCount} overflowCount={99}>
            <Button icon={<MessageOutlined />} type="text">
              未读消息
            </Button>
          </Badge>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar src={user.avatar} icon={<UserOutlined />} />
              <span>{user.displayName || user.email}</span>
            </div>
          </Dropdown>
        </Space>
      </Header>

      <Layout>
        <Sider 
          width={220} 
          style={{ 
            background: isDarkMode ? '#001529' : '#fff',
            borderRight: '1px solid #f0f0f0',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[currentView]}
            items={menuItems}
            style={{ height: '100%', borderRight: 0 }}
            onClick={({ key }) => setCurrentView(key as ViewType)}
          />
        </Sider>

        <Content style={{ 
          padding: 24, 
          background: isDarkMode ? '#141414' : '#f0f2f5',
          overflow: 'auto',
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainPage;
