import React from 'react';
import { Link, History } from 'react-router';
import { Button, Form, Input, Select, message } from 'antd';

import { signupRoles } from 'data/config';
import { Api, httpErrorCallback } from 'data/api';

const FormItem = Form.Item;
const Option = Select.Option;


function noop() {
  return false;
}

function handleSelectChange(value) {
    console.log('selected ' + value);
}


const Signup = React.createClass({
  displayName: 'Signup',

  handleSubmit(e) {
    e.preventDefault();
    console.log('Submit:');
  },

  handleReset(e) {
    e.preventDefault();
  },

  render() {
    const labelCol = 7;
    const wrapperCol = 15;
    const wrapperStyle = {
      width: '360px',
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

export default Signup;
