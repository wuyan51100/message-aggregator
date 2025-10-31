import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

const { defaultAlgorithm, darkAlgorithm } = theme;

interface User {
  id: number;
  email: string;
  displayName?: string;
  avatar?: string;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储的用户信息
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      loadUser(parseInt(savedUserId));
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (userId: number) => {
    try {
      const result = await window.electronAPI.getUser(userId);
      if (result.success && result.user) {
        setCurrentUser(result.user);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('userId', user.id.toString());
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userId');
  };

  if (loading) {
    return (
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        <Layout style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>加载中...</div>
        </Layout>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      {currentUser ? (
        <MainPage user={currentUser} onLogout={handleLogout} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </ConfigProvider>
  );
};

export default App;
