import React, { useState } from 'react';
import { Card, List, Avatar, Tag, Space, Button, Empty, Spin, Input, Select } from 'antd';
import {
  ReloadOutlined,
  SearchOutlined,
  LinkOutlined,
  PushpinOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Message, Platform } from '../../types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

interface TimelineViewProps {
  messages: Message[];
  loading: boolean;
  onRefresh: () => void;
}

const platformColors: Record<Platform, string> = {
  [Platform.DISCORD]: '#5865F2',
  [Platform.TELEGRAM]: '#0088cc',
  [Platform.REDDIT]: '#FF4500',
  [Platform.WECHAT]: '#07C160',
  [Platform.QQ]: '#12B7F5',
  [Platform.SLACK]: '#4A154B',
};

const platformNames: Record<Platform, string> = {
  [Platform.DISCORD]: 'Discord',
  [Platform.TELEGRAM]: 'Telegram',
  [Platform.REDDIT]: 'Reddit',
  [Platform.WECHAT]: '微信',
  [Platform.QQ]: 'QQ',
  [Platform.SLACK]: 'Slack',
};

const TimelineView: React.FC<TimelineViewProps> = ({ messages, loading, onRefresh }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');

  const filteredMessages = messages.filter(msg => {
    const matchKeyword = !searchKeyword || msg.content.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchPlatform = filterPlatform === 'all' || msg.platform === filterPlatform;
    return matchKeyword && matchPlatform;
  });

  const getHighlightClass = (score?: number) => {
    if (!score) return '';
    if (score >= 60) return 'message-highlight-high';
    if (score >= 40) return 'message-highlight-medium';
    if (score >= 20) return 'message-highlight-low';
    return '';
  };

  return (
    <div>
      <Card 
        style={{ marginBottom: 16 }}
        bodyStyle={{ padding: 16 }}
      >
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="搜索消息内容..."
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              value={filterPlatform}
              onChange={setFilterPlatform}
              style={{ width: 150 }}
            >
              <Select.Option value="all">全部平台</Select.Option>
              {Object.entries(platformNames).map(([key, name]) => (
                <Select.Option key={key} value={key}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Space>
          <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
            刷新
          </Button>
        </Space>
      </Card>

      <Card>
        {loading && messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Spin size="large" tip="加载消息中..." />
          </div>
        ) : filteredMessages.length === 0 ? (
          <Empty
            description="暂无消息"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ padding: 60 }}
          >
            <p style={{ color: '#999', marginTop: 16 }}>
              {messages.length === 0 
                ? '请先在"账户管理"中添加平台账户并选择要监听的频道' 
                : '没有符合筛选条件的消息'}
            </p>
          </Empty>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={filteredMessages}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条消息`,
            }}
            renderItem={(message) => (
              <List.Item
                key={message.id}
                className={getHighlightClass(message.priorityScore)}
                style={{
                  padding: '16px 20px',
                  borderRadius: 8,
                  marginBottom: 8,
                  transition: 'all 0.3s',
                }}
                extra={
                  message.attachments && message.attachments.length > 0 && (
                    <div style={{ width: 200 }}>
                      {message.attachments[0].type === 'image' && (
                        <img
                          src={message.attachments[0].url}
                          alt="attachment"
                          style={{ width: '100%', borderRadius: 8 }}
                        />
                      )}
                    </div>
                  )
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={message.authorAvatar}>{message.author[0]}</Avatar>}
                  title={
                    <Space>
                      <span style={{ fontWeight: 600 }}>{message.author}</span>
                      <Tag color={platformColors[message.platform]}>
                        {platformNames[message.platform]}
                      </Tag>
                      <Tag>{message.channelName}</Tag>
                      {message.isOfficial && <Tag color="gold" icon={<StarOutlined />}>官方</Tag>}
                      {message.isPinned && <Tag color="red" icon={<PushpinOutlined />}>置顶</Tag>}
                      <span style={{ color: '#999', fontSize: 12 }}>
                        {dayjs(message.timestamp).fromNow()}
                      </span>
                    </Space>
                  }
                  description={
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {message.content}
                      </div>
                      {message.url && (
                        <Button
                          type="link"
                          icon={<LinkOutlined />}
                          href={message.url}
                          target="_blank"
                          style={{ paddingLeft: 0, marginTop: 8 }}
                        >
                          查看原消息
                        </Button>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default TimelineView;
