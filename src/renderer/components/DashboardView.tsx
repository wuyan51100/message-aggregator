import React from 'react';
import { Card, List, Tag, Badge, Empty, Space, Progress } from 'antd';
import { StarOutlined, FireOutlined, BellOutlined } from '@ant-design/icons';
import { Message, Platform } from '../../types';
import dayjs from 'dayjs';

interface DashboardViewProps {
  messages: Message[];
  loading: boolean;
  onRefresh: () => void;
}

const platformNames: Record<Platform, string> = {
  [Platform.DISCORD]: 'Discord',
  [Platform.TELEGRAM]: 'Telegram',
  [Platform.REDDIT]: 'Reddit',
  [Platform.WECHAT]: '微信',
  [Platform.QQ]: 'QQ',
  [Platform.SLACK]: 'Slack',
};

const DashboardView: React.FC<DashboardViewProps> = ({ messages, loading }) => {
  const highPriorityMessages = messages
    .filter(m => (m.priorityScore || 0) >= 40)
    .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
    .slice(0, 20);

  const officialMessages = messages.filter(m => m.isOfficial);
  const pinnedMessages = messages.filter(m => m.isPinned);

  const getPriorityIcon = (score?: number) => {
    if (!score) return null;
    if (score >= 60) return <FireOutlined style={{ color: '#ff4d4f' }} />;
    if (score >= 40) return <StarOutlined style={{ color: '#faad14' }} />;
    return <BellOutlined style={{ color: '#52c41a' }} />;
  };

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title={<span><FireOutlined /> 高优先级消息</span>} loading={loading}>
          {highPriorityMessages.length === 0 ? (
            <Empty description="暂无高优先级消息" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List
              dataSource={highPriorityMessages}
              renderItem={msg => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getPriorityIcon(msg.priorityScore)}
                    title={
                      <Space>
                        <span>{msg.author}</span>
                        <Tag>{platformNames[msg.platform]}</Tag>
                        <Tag>{msg.channelName}</Tag>
                        <Badge 
                          count={msg.priorityScore} 
                          style={{ backgroundColor: msg.priorityScore && msg.priorityScore >= 60 ? '#ff4d4f' : '#faad14' }} 
                        />
                      </Space>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          {msg.content.substring(0, 100)}{msg.content.length > 100 ? '...' : ''}
                        </div>
                        <Progress 
                          percent={(msg.priorityScore || 0)} 
                          size="small" 
                          status={msg.priorityScore && msg.priorityScore >= 60 ? 'exception' : 'active'}
                          showInfo={false}
                        />
                      </div>
                    }
                  />
                  <div style={{ fontSize: 12, color: '#999' }}>
                    {dayjs(msg.timestamp).format('MM-DD HH:mm')}
                  </div>
                </List.Item>
              )}
            />
          )}
        </Card>

        <Card title={<span><StarOutlined /> 官方消息</span>} loading={loading}>
          {officialMessages.length === 0 ? (
            <Empty description="暂无官方消息" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List
              size="small"
              dataSource={officialMessages.slice(0, 10)}
              renderItem={msg => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{msg.author}</span>
                        <Tag>{platformNames[msg.platform]}</Tag>
                        <Tag color="gold">官方</Tag>
                      </Space>
                    }
                    description={msg.content.substring(0, 80)}
                  />
                  <div style={{ fontSize: 12, color: '#999' }}>
                    {dayjs(msg.timestamp).fromNow()}
                  </div>
                </List.Item>
              )}
            />
          )}
        </Card>
      </Space>
    </div>
  );
};

export default DashboardView;
