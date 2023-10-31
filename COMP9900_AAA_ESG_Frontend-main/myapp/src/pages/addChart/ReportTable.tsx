import { Card, Table, Tooltip,Input ,Button,Modal} from 'antd';
import { ReportToolTipTitle } from '@/components';
import React, { useState, useEffect,useRef } from 'react';
import { Sunburst } from '@ant-design/plots';
import G6 from '@antv/g6';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import cloneDeep from 'lodash/cloneDeep';
const getColorBasedOnScore = (score:any) => {
  if (score <= 25) return '#FFDDDD';
  if (score <= 50) return '#FFBBBB';
  if (score <= 75) return '#FF8888';
  return '#FF5555';
};


const { Search } = Input;
const ChartInlineContainer=({framework}:any)=>{
  const [data, setData] = useState({
    name:framework.frameworkName,
    value:framework.score,
    label:'123',
    children: framework.subElementDTOList.map((subElement:any) => ({
      name:subElement.subElementName,
      value:subElement.score,
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
  });
  useEffect(() => {
    
  }, [data]);
  
  const config = {
    data,
    innerRadius: 0.3,
    interactions: [
      {
        type: 'element-active',
      },
    ],
    
    
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
            title: <Tooltip title={<ReportToolTipTitle score={indicator.score} weight={indicator.eleWeight} />}> {indicator.indicatorName}</Tooltip>,
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




export const ReportTemplate = ({framework,companyNameIpt,userId}:any)=>{
  type inputDict = Record<number, number>;
   
  const reportTemp:API.ReportDTO={
    companyName:companyNameIpt,
    userId,
    frameworkDTO:framework
  };
  const [data,setData]=useState(framework);
  const [inputValues, setInputValues] = useState<inputDict>({});
  const [currentSelectedElement,setCurrentSelectedElement]=useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mode,setMode]=useState(-1);
  const findIndicator=(data,id)=>{
    for(let i of data.subElementDTOList){
      for(let j of i.tertiaryElementDTOList){
        for(let z of j.indicatorDTOList){
          if(z.indicatorId==id) return z;
        }
      }
    }
    return null;
  }
  const handleInputChange = (target, event: React.ChangeEvent<HTMLInputElement>) => {
    let temp=cloneDeep(data);
    let tar=findIndicator(temp,target.indicatorId);
    tar.iptValue=parseFloat(event.target.value);
    setData(temp);
  };

  const showModal = (element:any,mode:number) => {
    setIsModalVisible(true);
    setMode(mode);
    setCurrentSelectedElement(element);
    
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentSelectedElement({});
  };
  let column=[
    {
      title:<div onClick={()=>{showModal(framework,1)}}>{data.frameworkName}</div>,
      children: data.subElementDTOList.map((subElement:any) => ({
        title: <Tooltip title={<ReportToolTipTitle score={subElement.score} weight={subElement.eleWeight} />}> <div onClick={()=>{showModal(subElement,2)}}>{subElement.subElementName}</div></Tooltip>,
        key: subElement.subElementId,
        weight:subElement.eleWeight,
        children: subElement.tertiaryElementDTOList.map((tertiaryElement:any) => ({
          title: <Tooltip title={<ReportToolTipTitle score={tertiaryElement.score} weight={tertiaryElement.eleWeight} />}> <div onClick={()=>{showModal(tertiaryElement,3)}}>{tertiaryElement.tertiaryElementName}</div></Tooltip>,
          key: tertiaryElement.tertiaryElementId,
          weight:tertiaryElement.eleWeight,
          
          children: tertiaryElement.indicatorDTOList.map((indicator:any)=>({
            title: <Tooltip title={<ReportToolTipTitle score={indicator.score} weight={indicator.eleWeight} />}> {indicator.indicatorName}</Tooltip>,
            key: indicator.indicatorId,
            weight:indicator.eleWeight,
            render: () => (
              
              <div
                style={{
                  
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <Input onChange={(e)=>{handleInputChange(indicator.indicatorId,e)}}/>
                </div>
              </div>
              
            )
          })),
          
        })),
      })),
    },
  ]
  let graphData={
    name:data.frameworkName,
    value: {
      title: data.frameworkName,
      items: [
        {
          text: data.score,
        }
        
      ],
    },
   
    children: data.subElementDTOList.map((subElement:any) => ({
      name:subElement.subElementName,
      value: {
        title: subElement.subElementName,
        id:subElement.subElementId,
        items: [
          
          {
            text: 'Weight',
            value: subElement.eleWeight,
          },
        ],
      },
      children: subElement.tertiaryElementDTOList.map((tertiaryElement:any) => ({
        name:tertiaryElement.tertiaryElementName,
        
        value: {
          title: tertiaryElement.tertiaryElementName,
          id:tertiaryElement.tertiaryElementId,
          items: [
            
            {
              text: 'Weight',
              value: tertiaryElement.eleWeight,
            }
            
          ],
        },
        children: tertiaryElement.indicatorDTOList.map((indicator:any)=>({
          name:indicator.indicatorName,
          
          value: {
            title: indicator.indicatorName,
            id:indicator.indicatorId,
            items: [
              
              {
                text: 'Weight',
                value: indicator.eleWeight,
              },
              {
                text: 'Input',
                value: indicator.iptValue?indicator.iptValue: 'No value',
              },
            ],
          },
          label:indicator.indicatorName,
          
        })),
        
      })),
    })),
  
  };
  useEffect(() => {
    graphData={
      name:data.frameworkName,
      value: {
        title: data.frameworkName,
        items: [
          {
            text: data.score,
          }
          
        ],
      },
     
      children: data.subElementDTOList.map((subElement:any) => ({
        name:subElement.subElementName,
        value: {
          title: subElement.subElementName,
          id:subElement.subElementId,
          items: [
            
            {
              text: 'Weight',
              value: subElement.eleWeight,
            },
          ],
        },
        children: subElement.tertiaryElementDTOList.map((tertiaryElement:any) => ({
          name:tertiaryElement.tertiaryElementName,
          
          value: {
            title: tertiaryElement.tertiaryElementName,
            id:tertiaryElement.tertiaryElementId,
            items: [
              
              {
                text: 'Weight',
                value: tertiaryElement.eleWeight,
              }
              
            ],
          },
          children: tertiaryElement.indicatorDTOList.map((indicator:any)=>({
            name:indicator.indicatorName,
            
            value: {
              title: indicator.indicatorName,
              id:indicator.indicatorId,
              items: [
                
                {
                  text: 'Weight',
                  value: indicator.eleWeight,
                },
                {
                  text: 'Input',
                  value: indicator.iptValue?indicator.iptValue: 'No value',
                },
              ],
            },
            label:indicator.indicatorName,
            
          })),
          
        })),
      })),
    
    };
    column=[
      {
        title:<div onClick={()=>{showModal(framework,1)}}>{data.frameworkName}</div>,
        children: data.subElementDTOList.map((subElement:any) => ({
          title: <Tooltip title={<ReportToolTipTitle score={subElement.score} weight={subElement.eleWeight} />}> <div onClick={()=>{showModal(subElement,2)}}>{subElement.subElementName}</div></Tooltip>,
          key: subElement.subElementId,
          weight:subElement.eleWeight,
          children: subElement.tertiaryElementDTOList.map((tertiaryElement:any) => ({
            title: <Tooltip title={<ReportToolTipTitle score={tertiaryElement.score} weight={tertiaryElement.eleWeight} />}> <div onClick={()=>{showModal(tertiaryElement,3)}}>{tertiaryElement.tertiaryElementName}</div></Tooltip>,
            key: tertiaryElement.tertiaryElementId,
            weight:tertiaryElement.eleWeight,
            
            children: tertiaryElement.indicatorDTOList.map((indicator:any)=>({
              title: <Tooltip title={<ReportToolTipTitle score={indicator.score} weight={indicator.eleWeight} />}> {indicator.indicatorName}</Tooltip>,
              key: indicator.indicatorId,
              weight:indicator.eleWeight,
              render: () => (
                
                <div
                  style={{
                    
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div>
                    <Input onChange={(e)=>{handleInputChange(indicator.indicatorId,e)}}/>
                  </div>
                </div>
                
              )
            })),
            
          })),
        })),
      },
    ]
  },[data,currentSelectedElement]);
  
  
  

  const config = {
    data:graphData,
    behaviors: ['drag-canvas', 'drag-node'],
    nodeCfg: {
      items: {
        type: 'html-node',
        style: (cfg, group, type) => {
          const styles = {
            value: {
              fill: '#52c41a',
            },
            text: {
              fill: '#aaa',
            },
            icon: {
              width: 10,
              height: 10,
            },
          };
          return styles[type];
        },
      },
      nodeStateStyles: {
        hover: {
          stroke: '#1890ff',
          lineWidth: 2,
        },
      },
      style: {
        stroke: '#40a9ff',
      },
    },
    edgeCfg: {
      endArrow: {
        fill: '#40a9ff',
      },
      style: (item, graph) => {
        return {
          stroke: '#40a9ff',
          lineWidth: 1,
          strokeOpacity: 0.5,
        };
      },
    },
    markerCfg: (cfg) => {
      const { children } = cfg;
      return {
        show: children?.length,
      };
    },
  };


 
  return (
    <div>
      <Table
        dataSource={[{}]}
        columns={column}
        pagination={false}
        bordered={true}
        showHeader={true}
      />
      
      <Modal destroyOnClose title="Edit element" visible={isModalVisible} onCancel={handleCancel}>
        {mode==1 &&<AddSubElement target={currentSelectedElement} data={data} setData={setData} />}
        {mode==2 &&<AddTerElement target={currentSelectedElement} data={data} setData={setData} />}
        {mode==3 &&<AddIndicator target={currentSelectedElement} data={data} setData={setData}/>}
      </Modal>
    <div style={{height:'800px'}}>
      <DecompositionTreeGraph {...config} />
    </div>
    </div>
  );
}
const AddSubElement=({target,data,setData}:any)=>{
  console.log(target);
  const [elementName, setElementName] = useState('');
  const [weight, setWeight] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 新增

  useEffect(() => {
    if (elementName.trim()!='' &&!isNaN(weight) && weight >=0 ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [elementName, weight]);
  const onChangeName=(e)=>{
    setElementName(e.target.value.trim());
  }
  const onChangeWeight=(e)=>{
    setWeight(parseFloat(e.target.value));
  }
  return (
      <div>
        <div>Sub element name</div>
        <Input placeholder="Sub element name" onChange={onChangeName} style={{ width: 200 }} />
        <div>Weight</div>
        <Input placeholder="Enter weight" onChange={onChangeWeight} style={{ width: 200 }} />
        <div>
        <Button type="primary" disabled={isButtonDisabled} onClick={()=>{
          let reg=cloneDeep(data);
          const maxId = Math.max(...reg.subElementDTOList.map(item => item.subElementId));
          const newId = maxId + 1;
          reg.subElementDTOList.push({
            subElementId:newId,
            subElementName:elementName,
            tertiaryElementDTOList:[],
            eleWeight:weight
          })
          setData(reg);
          
        }}>Add</Button>
        </div>
      </div>
      
     );
   
}

const AddTerElement=({target,data,setData}:any)=>{
  const [elementName, setElementName] = useState('');
  const [weight, setWeight] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 新增
  const getTerId=()=>{
    if(!data) return;
    let max=-1;
    for(let i of data.subElementDTOList){
      for(let j of i.tertiaryElementDTOList){
        if(j.tertiaryElementId>max) max=j.tertiaryElementId;
      }
    }
    return max+1;
  }
  useEffect(() => {
    
    
    if (elementName.trim()!='' &&!isNaN(weight) && weight >=0) {
      setIsButtonDisabled(false);
    }
    else {
      setIsButtonDisabled(true);
    }
  }, [elementName, weight]);
  
  const onChangeName=(e)=>{
    setElementName(e.target.value.trim());
  }
  const onChangeWeight=(e)=>{
    setWeight(parseFloat(e.target.value));
  }
  return (
      <div>
        <div>Tertiary element name</div>
        <Input placeholder="Sub element name" onChange={onChangeName} style={{ width: 200 }} />
        <div>Weight</div>
        <Input placeholder="Enter weight" onChange={onChangeWeight} style={{ width: 200 }} />
        <Button type="primary" disabled={isButtonDisabled} onClick={()=>{
          let reg=cloneDeep(data);
          let temp=reg.subElementDTOList.find(obj=>obj.subElementId==target.subElementId);
          if(!temp){
            console.log('not found');
            return;
          }
          temp.tertiaryElementDTOList.push({
            tertiaryElementId:getTerId(),
            subElementId:target.subElementId,
            tertiaryElementName:elementName,
            indicatorDTOList:[],
            eleWeight:weight
          })
          setData(reg);
          
        }}>Add</Button>
      </div>
      
     );
   
}
const AddIndicator=({target,data,setData}:any)=>{
  const [elementName, setElementName] = useState('');
  const [weight, setWeight] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 新增
  
  useEffect(() => {
    if (elementName.trim()!='' &&!isNaN(weight) && weight >=0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [elementName, weight]);

  const onChangeName=(e)=>{
    setElementName(e.target.value.trim());
  }
  const onChangeWeight=(e)=>{
    setWeight(parseFloat(e.target.value));
  }
  return (
      <div>
        <div>Indicator name</div>
        <Input placeholder="Sub element name" onChange={onChangeName} style={{ width: 200 }} />
        <div>Weight</div>
        <Input placeholder="Enter weight" onChange={onChangeWeight} style={{ width: 200 }} />
        <Button type="primary" disabled={isButtonDisabled} onClick={()=>{
          let reg=cloneDeep(data);
          let temp=null;
          for(let i of reg.subElementDTOList){
            for(let j of i.tertiaryElementDTOList){
              if(j.tertiaryElementId==target.tertiaryElementId) {
                temp=j;
              }
            }
          }
          if(!temp){
            console.log('not found');
            return;
          }
        
          temp.indicatorDTOList.push({
            tertiaryElementId:target.tertiaryElementId,
            indicatorName:elementName,
            eleWeight:weight,
            iptValue:null
          })
          setData(reg);
          
        }}>Add</Button>
      </div>
      
     );
   
}
export default ReportTable;

/*

*/
