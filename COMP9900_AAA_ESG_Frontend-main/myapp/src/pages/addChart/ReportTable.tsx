import { Card, Table, Tooltip } from 'antd';
import {ToolTipComponent} from './ToolTipComponent/ReportToolTip';
const getColorBasedOnScore = (score) => {
  if (score <= 25) return '#FFDDDD';
  if (score <= 50) return '#FFBBBB';
  if (score <= 75) return '#FF8888';
  return '#FF5555';
};
/*
children: tertiaryElement.indicatorDTOList.map((indicator)=>({
            title: indicator.indicatorName,
            key: indicator.indicatorId,
            render: () => (
              <Tooltip title={`Score: ${indicator.score}`}>
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
                  {indicator.indicatorName}
                </div>
              </Tooltip>
            )
          })),
),*/
const ReportTable = ({ report }) => {
  const subElements = report.frameworkDTO?.subElementDTOList || [];

  const columns = [
    {
      title: `${report.frameworkDTO?.frameworkName} - ${report.companyName}`,
      children: subElements.map((subElement) => ({
        title: subElement.subElementName,
        key: subElement.subElementId,
        
        children: subElement.tertiaryElementDTOList.map((tertiaryElement) => ({
          title: <Tooltip title={`Score: ${tertiaryElement.score}`}> {tertiaryElement.tertiaryElementName}</Tooltip>,
          key: tertiaryElement.tertiaryElementId,
          children: tertiaryElement.indicatorDTOList.map((indicator)=>({
            title: indicator.indicatorName,
            key: indicator.indicatorId,
            render: () => (
              <Tooltip title={`Weight: ${indicator.eleWeight}`}>
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
              </Tooltip>
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
    </Card>
  );
};

export default ReportTable;
