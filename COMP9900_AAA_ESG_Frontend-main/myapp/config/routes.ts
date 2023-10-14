export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          { name: 'Login', path: '/user/login', component: './user/Login' },
          { name: 'Register', path: '/user/register', component: './user/Register' },
          { name: 'ResetPassword', path: '/user/resetPassword', component: './user/ResetPassword' },
        ],
      },
      { component: './404' },
    ],
  },

  { name: 'Dashboard', path: '/add_chart', icon: 'smile', component: './addChart' },

  { name: 'Framework', path: '/framework', icon: 'smile', component: './Framework' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    name: 'AdminPage',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', component: './Admin' },
    ],
  },

  { path: '/', redirect: '/add_chart' },
  // { path: '*', layout: false, component: './404' },
  { path: '*', layout: false, component: './404' },
];
