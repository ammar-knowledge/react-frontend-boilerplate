import React from 'react';
import { Checkbox, Form, Button, Input, message } from 'antd';
import { Link, History } from 'react-router';

import { httpPost } from 'data/api';
import { tokenKey } from 'data/config';
import cookie from 'react-cookie';


const FormItem = Form.Item;

export default React.createClass({
  displayName: 'Signin',

  handleSubmit(e) {
    e.preventDefault();
    console.log('Submit:');
    cookie.save(tokenKey, 'Test token');
    this.history.pushState(null, '/');
  },

  render() {
    const labelCol = 8;
    const wrapperCol = 12;
    const wrapperStyle = {
      width: '320px',
      padding: '40px 20px',
      margin: '60px auto 20px',
      border: '1px solid #CCC',
      borderRadius: '5px',
      background: '#fff',
    };

    return (
      <div style={wrapperStyle}>
        <Form horizontal={true}>
          <legend>xxx平台 用户注册</legend>
        </Form>
      </div>
    );
  }
});
