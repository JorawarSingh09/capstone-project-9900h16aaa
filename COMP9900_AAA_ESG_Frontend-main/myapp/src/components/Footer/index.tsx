import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = 'Produced by UNSW CSE Department';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Ant Design Pro',
          title: 'UNSWCSE',
          href: 'https://www.unsw.edu.au/engineering/our-schools/computer-science-and-engineering',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/unsw-cse-comp3900-9900-23T3/capstone-project-9900h16aaa/tree/main',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: 'H16 Group AAA',
          href: 'https://github.com/unsw-cse-comp3900-9900-23T3/capstone-project-9900h16aaa/tree/main',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
