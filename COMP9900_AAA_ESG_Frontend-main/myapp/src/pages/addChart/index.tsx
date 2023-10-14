import { getFrameworkByIdUsingGET } from '@/services/ant-design-pro/frameworkController';
import { getDefaultFrameworkUsingGET } from '@/services/ant-design-pro/userController';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import ReportTable from './ReportTable'; // 确保正确地导入 ReportTable
import './index.less';

const handleAdd = async (fields: API.ReportDTO) => {
  const hide = message.loading('正在添加');
  try {
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const getReportList = async () => {
  try {
    const reportList = await getFrameworkByIdUsingGET();
    return reportList;
  } catch (error) {
    const defaultRequestFailureMessage = 'Get Report Error!';
    console.log(error);
    message.error(defaultRequestFailureMessage);
  }
};

const addChart: React.FC = () => {
  const [reports, setReports] = useState<API.ReportDTO[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [frameworks, setFrameworks] = useState<API.FrameworkDTO[]>([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchFrameworks = async () => {
    const fetchedFrameworks = await getDefaultFrameworkUsingGET();
    if (fetchedFrameworks) {
      setFrameworks(fetchedFrameworks);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedReports = await getReportList();
      if (fetchedReports) {
        setReports(fetchedReports);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchFrameworks();
  }, []);

  return (
    <div
      style={{
        background: '#F5F7FA',
      }}
    >
      <PageContainer
        header={{
          title: 'Existing Report',
          ghost: true,

          extra: [
            <Button key="1" type="primary" onClick={showModal}>
              New Report
            </Button>,
          ],
        }}
        tabProps={{
          type: 'editable-card',
          hideAdd: false,
          onEdit: (e, action) => console.log(e, action),
        }}
      >
        <ProCard direction="column" ghost gutter={[0, 16]}>
          {reports.map((report, idx) => (
            <div key={idx}>
              <ReportTable report={report} />
            </div>
          ))}
        </ProCard>
      </PageContainer>
      <Modal title="New Report" visible={isModalVisible} onCancel={handleCancel}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {frameworks.map((framework, idx) => (
            <div key={idx} style={{ flex: '0 0 50%', padding: '5px', boxSizing: 'border-box' }}>
              <div style={{ background: '#e5e5e5', padding: '10px', borderRadius: '5px' }}>
                {framework.frameworkName}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default addChart;