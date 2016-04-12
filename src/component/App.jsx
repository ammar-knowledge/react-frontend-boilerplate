


import React from 'react';
import { History } from 'react-router'
import cookie from 'react-cookie';
import { message, Menu, Link } from 'antd';

import { tokenKey, sideMenus } from 'data/config';
import { httpGet } from 'data/api';
import NavGlobal from './nav/NavGlobal.jsx';
import NavMenu from './nav/NavMenu.jsx';


function signOut(e) {
  cookie.remove(tokenKey);
}

const topMenu = [
  {key: "2", href:"/user/change_password", label: "修改密码"},
  {key: "-1", divider: true},
  {key: "3", href:"/signin", onClick: signOut, iconClass: "fa fa-fw fa-sign-out", label: "注销"},
];


const user = {
  name: '某某用户',
  role: {
    name: 'customer'
  }
};

const App = React.createClass({
  displayName: 'App',
  mixins: [ History ],

  getInitialState() {
    /* return {user: undefined}; */
    return {
      user: {
        name: 'Test user',
        role: {
          name: 'user',
          descr: 'Test role descr',
        }
      }
    };
  },

  componentDidMount(){
    console.log('NavGlobal:componentDidMount');
  },

  render() {
    console.log('App.props:', this.props);

    if (cookie.load(tokenKey) === undefined) {
      console.log('X-Token is missing!');
      message.error('请先登录系统!');
      this.history.pushState(null, '/signin');
    }

    console.log('current user:', this.state.user);
    const navMenu = this.state.user ? <NavMenu sideMenu={sideMenus[this.state.user.role.name]} /> : '';
    return (
      <div className="app-container">
        <div className="app-viewport">
          <NavGlobal user={this.state.user} topMenu={topMenu} />
          {navMenu}
          <div className="content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  },
});


/* Global pages */
import Signin from 'page/common/Signin.jsx';
import Signup from 'page/common/Signup.jsx';
import Blank from 'page/common/Blank.jsx';
import Err404 from 'page/common/Err404.jsx';

/* Sub pages */
import ChangePassword from 'page/common/ChangePassword.jsx';
import TestForms from 'page/demo/TestForms.jsx';

const routes = [
  { path: '/signin', component: Signin },
  { path: '/signup', component: Signup },
  {
    path: '/',
    component: App,
    indexRoute: { component: Blank },
    childRoutes: [
      /* Common */
      {path: '/demo/test_forms', component: TestForms},
      {path: '/user/change_password', component: ChangePassword},
      /* Others */
      {path: '*', component: Err404},
    ]
  },
]

export default {App, routes};
