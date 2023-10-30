import { Card, Table, Tooltip } from 'antd';
import { ReportToolTipTitle } from '@/components';
import React, { useState, useEffect } from 'react';
import { Sunburst } from '@ant-design/plots';
const getColorBasedOnScore = (score:any) => {
  if (score <= 25) return '#FFDDDD';
  if (score <= 50) return '#FFBBBB';
  if (score <= 75) return '#FF8888';
  return '#FF5555';
};



const ChartInlineContainer=({framework}:any)=>{
  const [data, setData] = useState({});
  useEffect(() => {
    let temp={
      name:framework.frameworkName,
      value:framework.score,
      label:'123',
      children: framework.subElementDTOList.map((subElement:any) => ({
        name:subElement.subElementName,
        value:subElement.value,
        children: subElement.tertiaryElementDTOList.map((tertiaryElement:any) => ({
          name:tertiaryElement.tertiaryElementName,
          value:tertiaryElement.score,
          children: tertiaryElement.indicatorDTOList.map((indicator:any)=>({
            name:indicator.indicatorName,
            value:indicator.score,
            label:indicator.indicatorName,
            
          })),
          
        })),
      })),
    }
    setData(temp);
  }, []);
  
  const config = {
    data,
    innerRadius: 0.3,
    interactions: [
      {
        type: 'element-active',
      },
    ],
    
    label: {
      layout: [
        {
          type: 'adjust-position',
        },
      ],
      style: {
        fill: '#000',
        fontSize: 10,
      }
      
    }
  };
  return (
  <div style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly',alignContent:'center'}}>
    <Sunburst {...config} />
  </div>)
}


const ReportTable = ({report}:any) => {
  const subElements = report.frameworkDTO?.subElementDTOList || [];

  const columns = [
    {
      title: <Tooltip title={<ReportToolTipTitle score={report.frameworkDTO.score} weight='' />}> {report.frameworkDTO?.frameworkName} - {report.companyName}</Tooltip>,
      children: subElements.map((subElement:any) => ({
        title: <Tooltip title={<ReportToolTipTitle score={subElement.score} weight={subElement.eleWeight} />}> {subElement.subElementName}</Tooltip>,
        key: subElement.subElementId,
        
        children: subElement.tertiaryElementDTOList.map((tertiaryElement:any) => ({
          title: <Tooltip title={<ReportToolTipTitle score={tertiaryElement.score} weight={tertiaryElement.eleWeight} />}> {tertiaryElement.tertiaryElementName}</Tooltip>,
          key: tertiaryElement.tertiaryElementId,
          children: tertiaryElement.indicatorDTOList.map((indicator:any)=>({
            title: <Tooltip title={<ReportToolTipTitle score='' weight={indicator.eleWeight} />}> {indicator.indicatorName}</Tooltip>,
            key: indicator.indicatorId,
            render: () => (
              
              <div
                style={{
                  backgroundColor: getColorBasedOnScore(indicator.score),
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {indicator.iptValue}
              </div>
              
            )
          })),
          
        })),
      })),
    },
  ];

  return (
    <Card style={{ margin: '15px 0' }}>
      <Table
        dataSource={[{}]}
        columns={columns}
        pagination={false}
        bordered={true}
        showHeader={true}
      />
      <ChartInlineContainer framework={report.frameworkDTO}></ChartInlineContainer>
    </Card>
  );
};

export default ReportTable;
