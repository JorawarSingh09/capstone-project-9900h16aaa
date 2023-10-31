import { getFrameworkByIdUsingGET } from '@/services/ant-design-pro/frameworkController';
import { getDefaultFrameworkUsingGET,getUserDefinedFrameworkUsingGET } from '@/services/ant-design-pro/userController';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { CaretRightOutlined } from '@ant-design/icons';
import { Button, Modal, message } from 'antd';
import { ReportCardHeader } from '@/components';
import { Collapse, theme } from 'antd';
import { ModalSeparatorLine } from '@/components';
import React, { useEffect, useState } from 'react';



import {useModel } from '@umijs/max';

import ReportTable, {ReportTemplate} from './ReportTable'; // 确保正确地导入 ReportTable


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
  const [displayEditModle,setDisplayEditModal]= useState(false);
  const [frameworks, setFrameworks] = useState<API.FrameworkDTO[]>([]);
  const [userDefinedframeworks, setUserDefinedframeworks] = useState<API.FrameworkDTO[]>([]);
  const [currentSelectedFramework,setCurrentSelectedFramework]=useState({frameworkName:'None'});
  const { token } = theme.useToken();
  const [renderCount, setRenderCount] = useState(0);
  const { initialState } = useModel('@@initialState');
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const displayEdit =(framework:any)=>{
    if(isModalVisible)setIsModalVisible(false);
    setRenderCount(renderCount+1);
    setCurrentSelectedFramework(framework);
    console.log(framework)
    setDisplayEditModal(true);
    

  }

  const hideDisplayEdit =(framework:any)=>{
    
    setDisplayEditModal(false);
    

  }

  useEffect(() => {
    
    const fetchData = async () => {
      const fetchedReportsPromise = getReportList();
      const fetchedFrameworksPromise = getDefaultFrameworkUsingGET();
      const fetchedUserFrameworksPromise = getUserDefinedFrameworkUsingGET();

      
      const [fetchedReports, fetchedFrameworks, fetchedUserFrameworks] = await Promise.all([
        fetchedReportsPromise,
        fetchedFrameworksPromise,
        fetchedUserFrameworksPromise
      ]);
      setReports(fetchedReports || []);
      setFrameworks(fetchedFrameworks || []);
      setUserDefinedframeworks(fetchedUserFrameworks || []);
    };

    fetchData();
  }, [renderCount]);

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
          onEdit: (e : any, action: any) => console.log(e, action),
        }}
      >
        <ProCard direction="column" ghost gutter={[0, 16]}>
          <Collapse accordion bordered={false} style={{ background: '#F5F7FA' }} expandIconPosition={'end'} expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}  items={reports.map((report, idx) => (
            {
              key: idx,
              label: <ReportCardHeader companyName={report.companyName} frameworkName={report.frameworkDTO.frameworkName} score=''></ReportCardHeader>,
              children: <ReportTable report={report} />,
              style:{ border:'none',marginBottom: 24,background: token.colorFillAlter,borderRadius: token.borderRadiusLG, 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'}
            }
           
          ))}/>

         
        </ProCard>

      </PageContainer>

      
      <Modal title="New Report" visible={isModalVisible} onCancel={handleCancel}>
        <div style={{marginTop:'30px'}}>
          <ModalSeparatorLine title='Default frameworks'/>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {frameworks.map((framework, idx) => (
                <div key={idx} style={{ flex: '0 0 50%', padding: '5px', boxSizing: 'border-box' }} onClick={()=>{displayEdit(framework)}}>
                  <div style={{ background: '#e5e5e5', padding: '10px', borderRadius: '5px' }}>
                    {framework.frameworkName}
                  </div>
                  
                </div>
              ))}
              <ModalSeparatorLine title='User defined frameworks'/>
              {userDefinedframeworks.map((framework, idx) => (
                <div key={idx} style={{ flex: '0 0 50%', padding: '5px', boxSizing: 'border-box' }}>
                  <div style={{ background: '#e5e5e5', padding: '10px', borderRadius: '5px' }}>
                    {framework.frameworkName}
                  </div>
                  
                </div>
              ))}
              

            </div>
        </div>
        
      </Modal>
      <Modal destroyOnClose title={currentSelectedFramework.frameworkName} visible={displayEditModle}  width='2000px'  onCancel={hideDisplayEdit}>
        <ReportTemplate framework={currentSelectedFramework} companyNameIpt='' userId={initialState?.currentUser ?initialState?.currentUser.userId:''}/>
      </Modal>
    </div>
  );
};

export default addChart;
