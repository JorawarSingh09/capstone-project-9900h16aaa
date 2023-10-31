import React from 'react';
import { DecompositionTreeGraph } from '@ant-design/graphs';

export const DemoDecompositionTreeGraph = (props) => {

  // Transfer Data
  const convertToTreeData = (sourceData) => {
    const createIndicatorNode = (indicator) => ({
      id: `Indi${indicator.indicatorId}`,
      value: {
        title: indicator.indicatorName,
        items: [{ text: indicator.iptValue || '' }],
      }
    });

    const createTertiaryNode = (tertiaryElement) => ({
      id: `Teri${tertiaryElement.tertiaryElementId}`,
      value: {
        title: tertiaryElement.tertiaryElementName,
        items: [
          { text: tertiaryElement.score || '' },
          { text: 'Weight', value: `${tertiaryElement.eleWeight}%` },
        ],
      },
      children: tertiaryElement.indicatorDTOList.map(createIndicatorNode)
    });

    const createSubElementNode = (subElement) => ({
      id: `Sub${subElement.subElementId}`,
      value: {
        title: subElement.subElementName,
        items: [
          { text: subElement.score || '' },
          { text: 'Weight', value: `${subElement.eleWeight}%` },
        ],
      },
      children: subElement.tertiaryElementDTOList.map(createTertiaryNode)
    });

    return {
      id: 'A0',
      value: {
        title: sourceData.frameworkName,
        items: [{ text: 'Year' }],
      },
      children: sourceData.subElementDTOList.map(createSubElementNode)
    };
  };

  const treeData = convertToTreeData(props.data);
  console.log("treeData Output: ", treeData);


  const data = treeData;


  console.log("Formatted Output11: ", typeof(data));
  const config = {
    data,
    behaviors: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    nodeCfg: {
      title: {
        containerStyle: {
          fill: 'transparent',
        },
        style: {
          fill: '#000',
        },
      },
      items: {
        containerStyle: {
          fill: '#fff',
        },
        style: (cfg, group, type) => {
          const styles = {
            icon: {
              width: 10,
              height: 10,
            },
            value: {
              fill: '#52c41a',
            },
            text: {
              fill: '#aaa',
            },
          };
          return styles[type];
        },
      },
      style: {
        stroke: 'transparent',
      },
      nodeStateStyles: false,
    },
    edgeCfg: {
      endArrow: {
        show: false,
      },
      style: (item, graph) => {
        /**
         * graph.findById(item.target).getModel()
         * item.source: 获取 source 数据
         * item.target: 获取 target 数据
         */
        // console.log(graph.findById(item.source).getModel());
        return {
          stroke: '#40a9ff',
          lineWidth: Math.random() * 10 + 1,
          strokeOpacity: 0.5,
        };
      },
      edgeStateStyles: false,
    },
  };
  // @ts-ignore
  return <DecompositionTreeGraph {...config} />;
};





