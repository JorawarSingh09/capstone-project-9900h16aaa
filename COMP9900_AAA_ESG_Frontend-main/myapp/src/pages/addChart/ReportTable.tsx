import { Card, Table, Tooltip } from 'antd';
import { ReportToolTipTitle } from '@/components';
import { Pie } from '@ant-design/plots';
const getColorBasedOnScore = (score:any) => {
  if (score <= 25) return '#FFDDDD';
  if (score <= 50) return '#FFBBBB';
  if (score <= 75) return '#FF8888';
  return '#FF5555';
};



const ChartInlineContainer=({framework}:any)=>{
  let subData=[];
  let terData=[];
  subData=framework.subElementDTOList.map((obj:any)=>({type:obj.subElementName,value:obj.score}));
  for(let i of framework.subElementDTOList){
    for(let j of i.tertiaryElementDTOList){
      terData.push({
        type:j.tertiaryElementName,value:j.score
      })
    }
  }
 
  const subConfig = {
    appendPadding: 10,
    data:subData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  const terConfig = {
    appendPadding: 10,
    data:terData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return (
  <div style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly',alignContent:'center'}}>
    <Pie {...subConfig} />
    <Pie {...terConfig} />
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
