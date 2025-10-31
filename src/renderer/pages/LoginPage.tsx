import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, message, Tabs, Space } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons';

const { Content } = Layout;

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleEmailLogin = async (values: any) => {
    setLoading(true);
    try {
      const result = await window.electronAPI.login({
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        message.success('登录成功!');
        onLogin(result.user);
      } else {
        message.error(result.error || '登录失败');
      }
    } catch (error) {
      message.error('登录过程中发生错误');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    message.info('Google登录功能开发中，请使用邮箱登录');
    // TODO: 集成Firebase Google OAuth
  };

  const tabItems = [
    {
      key: 'email',
      label: '邮箱登录',
      children: (
        <Form
          form={form}
          name="email-login"
          onFinish={handleEmailLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱地址"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录 / 注册
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'oauth',
      label: '快捷登录',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button
            icon={<GoogleOutlined />}
            onClick={handleGoogleLogin}
            size="large"
            block
          >
            使用 Google 账户登录
          </Button>
          <Button
            icon={<GithubOutlined />}
            onClick={() => message.info('GitHub登录功能开发中')}
            size="large"
            block
          >
            使用 GitHub 账户登录
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '50px' }}>
        <Card
          style={{
            width: 450,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            borderRadius: 12,
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              消息聚合器
            </h1>
            <p style={{ color: '#666', fontSize: 14 }}>
              统一管理多平台群组消息，智能过滤重要公告
            </p>
          </div>

          <Tabs items={tabItems} centered />

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#999' }}>
            <p>登录即表示您同意我们的服务条款和隐私政策</p>
            <p style={{ marginTop: 8 }}>本应用完全开源，数据仅存储在本地</p>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default LoginPage;
