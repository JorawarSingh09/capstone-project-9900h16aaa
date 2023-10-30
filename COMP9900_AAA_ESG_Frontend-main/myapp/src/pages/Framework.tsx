import { getDefaultFrameworkUsingGET } from '@/services/ant-design-pro/userController';
import { EditOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, theme } from 'antd';
import React, { useEffect, useState } from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  onEdit?: () => void; // 添加一个编辑回调函数
}> = ({ title, index, onEdit }) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', // 确保内容垂直居中
        justifyContent: 'space-between', // 内容在横向上均匀分布
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          lineHeight: '22px',
          backgroundSize: '100%',
          textAlign: 'center',
          padding: '8px 16px 16px 12px',
          color: '#FFF',
          fontWeight: 'bold',
          backgroundImage:
            "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
        }}
      >
        {index}
      </div>
      <div
        style={{
          fontSize: '16px',
          color: token.colorText,
          flex: 1, //
          marginLeft: 10, // 为了视觉间距
        }}
      >
        {title}
      </div>
      <Button
        icon={<EditOutlined />}
        type="primary"
        onClick={onEdit}
        style={{ marginLeft: 10 }} // 为了视觉间距
      >
        Edit
      </Button>
    </div>
  );
};




function handleEditClick() {
  console.log("Edit button clicked!");
  // 你可以在这里放入其他的代码来定义你的逻辑
}

const Framework: React.FC = () => {
  const { token } = theme.useToken();
  // const { initialState } = useModel('@@initialState');
  const [cards, setCards] = useState<API.FrameworkDTO[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getDefaultFrameworkUsingGET(); // 假设getDefaultFrameworkUsingGET返回一个Promise
        setCards(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            Welcome use UNSW ESG Management Web Platform.
          </div>

          <div
            style={{
              paddingTop: '10px',
              display: 'flex',
              flexDirection: 'column', // 设置为column使其纵向排列
              gap: 16, // 可以根据需要调整间隙
            }}
          >
            {cards.map((card, index) => (
              <InfoCard
                key={index}
                index={card.frameworkId} //
                title={card.frameworkName} //
                onEdit = {handleEditClick}
              />
            ))}


          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Framework;
