import React, { useState } from 'react';
import { Card, List, Button, Modal, Form, Select, Input, message, Tag, Space, Avatar, Popconfirm } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  DiscordOutlined,
  RedditOutlined,
  WechatOutlined,
  QqOutlined,
} from '@ant-design/icons';
import { Platform } from '../../types';

interface AccountManagerProps {
  userId: number;
  accounts: any[];
  onAccountsChange: () => void;
}

const platformOptions = [
  { value: Platform.DISCORD, label: 'Discord', icon: <DiscordOutlined /> },
  { value: Platform.TELEGRAM, label: 'Telegram', icon: '📱' },
  { value: Platform.REDDIT, label: 'Reddit', icon: <RedditOutlined /> },
  { value: Platform.WECHAT, label: '微信', icon: <WechatOutlined /> },
  { value: Platform.QQ, label: 'QQ', icon: <QqOutlined /> },
  { value: Platform.SLACK, label: 'Slack', icon: '💼' },
];

const AccountManager: React.FC<AccountManagerProps> = ({ userId, accounts, onAccountsChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleAddAccount = async (values: any) => {
    setLoading(true);
    try {
      const result = await window.electronAPI.addAccount({
        userId,
        platform: values.platform,
        accountName: values.accountName,
        credentials: {
          token: values.token,
          // 其他凭证信息
        },
      });

      if (result.success) {
        message.success('账户添加成功!');
        setIsModalOpen(false);
        form.resetFields();
        onAccountsChange();
      } else {
        message.error(result.error || '添加失败');
      }
    } catch (error) {
      message.error('添加账户时发生错误');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    try {
      const result = await window.electronAPI.removeAccount(accountId);
      if (result.success) {
        message.success('账户已删除');
        onAccountsChange();
      } else {
        message.error(result.error || '删除失败');
      }
    } catch (error) {
      message.error('删除账户时发生错误');
      console.error(error);
    }
  };

  return (
    <div>
      <Card
        title="平台账户管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            添加账户
          </Button>
        }
      >
        <List
          dataSource={accounts}
          locale={{ emptyText: '暂无绑定账户，请点击上方按钮添加' }}
          renderItem={(account) => (
            <List.Item
              actions={[
                <Tag color={account.is_active ? 'success' : 'default'} icon={account.is_active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                  {account.is_active ? '已启用' : '已禁用'}
                </Tag>,
                <Popconfirm
                  title="确定要删除此账户吗?"
                  description="删除后将无法恢复，且会停止监听该账户的所有频道"
                  onConfirm={() => handleDeleteAccount(account.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="text" danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={account.account_avatar}>{account.account_name[0]}</Avatar>}
                title={
                  <Space>
                    <span style={{ fontWeight: 600 }}>{account.account_name}</span>
                    <Tag color="blue">
                      {platformOptions.find(p => p.value === account.platform)?.label}
                    </Tag>
                  </Space>
                }
                description={`添加于 ${new Date(account.created_at).toLocaleString()}`}
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="使用说明" style={{ marginTop: 16 }}>
        <div style={{ lineHeight: 2 }}>
          <h4>如何添加平台账户:</h4>
          <ol>
            <li><strong>Discord</strong>: 需要提供用户Token (可通过浏览器开发者工具获取)</li>
            <li><strong>Telegram</strong>: 需要申请API ID和API Hash (访问 my.telegram.org)</li>
            <li><strong>Reddit</strong>: 需要登录后的Cookie信息</li>
            <li><strong>微信/QQ</strong>: 需要扫码登录授权</li>
            <li><strong>Slack</strong>: 需要创建Slack App并获取OAuth Token</li>
          </ol>
          <p style={{ color: '#ff4d4f', marginTop: 16 }}>
            ⚠️ 重要提示: 所有凭证信息均加密存储在本地，不会上传到任何服务器。
            但请注意使用小号进行监控，避免主账号被平台封禁的风险。
          </p>
        </div>
      </Card>

      <Modal
        title="添加平台账户"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddAccount}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="platform"
            label="选择平台"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select
              placeholder="请选择要添加的平台"
              options={platformOptions.map(p => ({
                ...p,
                label: (
                  <Space>
                    {p.icon}
                    {p.label}
                  </Space>
                ),
              }))}
            />
          </Form.Item>

          <Form.Item
            name="accountName"
            label="账户名称"
            rules={[{ required: true, message: '请输入账户名称' }]}
          >
            <Input placeholder="例如: my_discord_account" />
          </Form.Item>

          <Form.Item
            name="token"
            label="登录凭证"
            rules={[{ required: true, message: '请输入登录凭证' }]}
            extra="不同平台需要不同的凭证信息，请参考使用说明"
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入Token、Cookie或其他登录凭证"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                添加
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManager;
