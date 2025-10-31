import React from 'react';
import { Card, Row, Col, Statistic, List, Tag, Empty } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { Message, Platform } from '../../types';
import dayjs from 'dayjs';

interface CardViewProps {
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

const CardView: React.FC<CardViewProps> = ({ messages, loading }) => {
  const groupedByPlatform = messages.reduce((acc, msg) => {
    if (!acc[msg.platform]) {
      acc[msg.platform] = [];
    }
    acc[msg.platform].push(msg);
    return acc;
  }, {} as Record<Platform, Message[]>);

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总消息数" value={messages.length} prefix={<MessageOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="已监控平台" 
              value={Object.keys(groupedByPlatform).length} 
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="高优先级消息" 
              value={messages.filter(m => (m.priorityScore || 0) >= 60).length} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="今日消息" 
              value={messages.filter(m => dayjs(m.timestamp).isAfter(dayjs().startOf('day'))).length} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {Object.entries(groupedByPlatform).map(([platform, platformMessages]) => (
          <Col key={platform} span={12}>
            <Card 
              title={
                <span>
                  {platformNames[platform as Platform]} 
                  <Tag style={{ marginLeft: 8 }}>{platformMessages.length} 条</Tag>
                </span>
              }
              loading={loading}
            >
              <List
                size="small"
                dataSource={platformMessages.slice(0, 5)}
                renderItem={msg => (
                  <List.Item>
                    <List.Item.Meta
                      title={msg.channelName}
                      description={msg.content.substring(0, 50) + (msg.content.length > 50 ? '...' : '')}
                    />
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {dayjs(msg.timestamp).format('HH:mm')}
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
        {Object.keys(groupedByPlatform).length === 0 && (
          <Col span={24}>
            <Card>
              <Empty description="暂无消息数据" />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default CardView;
