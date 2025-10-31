import React from 'react';
import { Card, Form, Switch, Select, InputNumber, Button, message, Divider } from 'antd';

interface SettingsPanelProps {
  userId: number;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ userId }) => {
  const [form] = Form.useForm();

  const handleSave = (values: any) => {
    console.log('Settings:', values);
    message.success('设置已保存');
  };

  return (
    <Card title="应用设置">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          theme: 'light',
          language: 'zh-CN',
          autoStart: false,
          minimizeToTray: true,
          notificationEnabled: true,
          soundEnabled: true,
          messageRetentionDays: 30,
        }}
      >
        <Divider orientation="left">外观设置</Divider>

        <Form.Item name="theme" label="主题模式">
          <Select>
            <Select.Option value="light">浅色</Select.Option>
            <Select.Option value="dark">深色</Select.Option>
            <Select.Option value="auto">跟随系统</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="language" label="语言">
          <Select>
            <Select.Option value="zh-CN">简体中文</Select.Option>
            <Select.Option value="en-US">English</Select.Option>
          </Select>
        </Form.Item>

        <Divider orientation="left">行为设置</Divider>

        <Form.Item name="autoStart" label="开机自启动" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="minimizeToTray" label="最小化到系统托盘" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="notificationEnabled" label="启用桌面通知" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="soundEnabled" label="启用提示音" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Divider orientation="left">数据管理</Divider>

        <Form.Item 
          name="messageRetentionDays" 
          label="消息保留天数"
          extra="超过指定天数的消息将被自动删除"
        >
          <InputNumber min={1} max={365} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SettingsPanel;
