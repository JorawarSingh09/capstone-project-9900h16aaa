import { Card, Table, Tooltip } from 'antd';

const getColorBasedOnScore = (score) => {
  if (score <= 25) return '#FFDDDD';
  if (score <= 50) return '#FFBBBB';
  if (score <= 75) return '#FF8888';
  return '#FF5555';
};

const ReportTable = ({ report }) => {
  const subElements = report.frameworkDTO?.subElementDTOList || [];

  const columns = [
    {
      title: `${report.frameworkDTO?.frameworkName} - ${report.companyName}`,
      children: subElements.map((subElement) => ({
        title: subElement.subElementName,
        key: subElement.subElementId,
        children: subElement.tertiaryElementDTOList.map((tertiaryElement) => ({
          title: tertiaryElement.tertiaryElementName,
          key: tertiaryElement.tertiaryElementId,
          render: () => (
            <Tooltip title={`Score: ${tertiaryElement.score}`}>
              <div
                style={{
                  backgroundColor: getColorBasedOnScore(tertiaryElement.score),
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {tertiaryElement.tertiaryElementName}
              </div>
            </Tooltip>
          ),
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
