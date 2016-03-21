import React from 'react';
import { Checkbox, Form, Validation, Button, Input, message } from 'antd';
import { Link, History } from 'react-router';

import { httpPost } from 'data/api';
import { tokenKey } from 'data/config';
import { getStatusClasses, getStatusHelp } from 'common/utils';
import cookie from 'react-cookie';


const Validator = Validation.Validator;
const FormItem = Form.Item;

export default React.createClass({
  displayName: 'Signin',
  mixins: [History, Validation.FieldMixin],

  getInitialState() {
    return {
      status: {
        login: {},
        password: {},
      },
      formData: {
        login: undefined,
        password: undefined,
      },
    };
  },

  handleSubmit(e) {
    e.preventDefault();
    console.log('Submit:', this.state.formData);

    const validation = this.refs.validation;
    validation.validate((valid) => {
      if (!valid) {
        console.log('Error in form');
        return;
      }

      let formData = this.state.formData;
      Object.keys(formData).forEach(function(name) {
        formData[name] = formData[name].trim();
      });

      /*
      httpPost('/signin', formData).then((resp) => {
        console.log('Response:', resp);
        cookie.save(tokenKey, resp.data.token);
        message.success('登录成功!');
        this.history.pushState(null, '/');
      }).catch(function(resp) {
        console.error(resp);
        message.error(`登录失败: ${resp.data.message}`, 2);
      });
      */
      cookie.save(tokenKey, 'Test token');
      this.history.pushState(null, '/');
    });
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

    const noop = function() {
      return false;
    };

    let formData = this.state.formData;
    let status = this.state.status;

    return (
      <div style={wrapperStyle}>
        <Form horizontal={true}>
          <legend>xxx平台 用户注册</legend>
          <Validation ref="validation" onValidate={this.handleValidate}>
            <FormItem label="用户名：" id="login"
                      labelCol={{span: labelCol}} wrapperCol={{span: wrapperCol}}
                      hasFeedback={true}
                      validateStatus={getStatusClasses(status.login, formData.login)}
                      help={getStatusHelp(status.login)}
                      required={true}>
              <Validator rules={[{required: true, min: 2, message: '用户名至少为 2 个字符'}, {validator: this.userExists}]}>
                <Input name="login" id="login" placeholder="请输入用户名"
                       value={formData.login}/>
              </Validator>
            </FormItem>

            <FormItem label="密码：" id="password"
                      labelCol={{span: labelCol}} wrapperCol={{span: wrapperCol}}
                      hasFeedback={true}
                      validateStatus={getStatusClasses(status.password, formData.password)}
                      help={getStatusHelp(status.password)}
                      required={true}>
              <Validator rules={[{required: true, whitespace: true, message: '请输入密码'}, {validator: this.checkPass}]}>
                <Input name="password" id="password" type="password" placeholder="请输入密码"
                       autoComplete="off"
                       onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                       value={formData.password}/>
              </Validator>
            </FormItem>

            <FormItem wrapperCol={{offset: labelCol, span: wrapperCol}} >
              <input name="submit" type="submit" className="ant-btn ant-btn-primary" value="登 录"
                     onClick={this.handleSubmit} />
              &nbsp;&nbsp;&nbsp;
              <Link to="/signup" className="ant-btn ant-btn-default">注册</Link>
            </FormItem>
          </Validation>
        </Form>
      </div>
    );
  }
});
