import React from 'react';

import { Button, Form, Input, message } from 'antd';
import PageIntro from 'component/content/PageIntro.jsx';
import Topbar from 'component/content/Topbar.jsx';

import { httpPut } from 'data/api';

const FormItem = Form.Item;


export default React.createClass({
  displayName: 'ChangePassword',

  handleSubmit(e) {
    e.preventDefault();
    console.log('Submit:');
  },

  render() {
    const labelCol = 6;
    const wrapperCol = 12;

    return (
      <div className="wrapper">
        <Topbar breadcrumb={['帐户管理', '修改密码']} />
        <PageIntro>修改密码</PageIntro>
        <div className="pane-wrapper">
          <Form horizontal={true}>
          </Form>
        </div>
      </div>
    );
  }
});
