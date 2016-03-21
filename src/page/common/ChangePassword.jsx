import React from 'react';
import { Validation, Button, Form, Input, message } from 'antd';
import PageIntro from 'component/content/PageIntro.jsx';
import Topbar from 'component/content/Topbar.jsx';

import { httpPut } from 'data/api';
import { getStatusClasses, getStatusHelp } from 'common/utils';

const Validator = Validation.Validator;
const FormItem = Form.Item;

function noop() {
  return false;
}


export default React.createClass({
  displayName: 'ChangePassword',
  mixins: [Validation.FieldMixin],
  getInitialState() {
    const fields = ['old_password', 'new_password'];
    let state = {
      fields: fields,
      formData: {},
      status: {},
    };
    fields.forEach(function(field) {
      state.formData[field] = undefined;
      state.status[field] = {};
    });
    return state;
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
      const formData = this.state.formData;
      httpPut('/change_password', {
        old_password: formData.old_password,
        new_password: formData.new_password
      }).then((resp) => {
        this.resetForm();
        console.log('Api.User.update(password):', resp);
        message.success(resp.data.message);
      }).catch((resp) => {
        console.error(resp);
        message.error(`修改密码失败: ${resp.data.message}`, 2);
      });
    });
  },

  resetForm() {
    this.refs.validation.reset();
    this.setState(this.getInitialState());
  },

  checkOldPassword(rule, value, callback) {
    if (this.state.formData.old_password) {
      this.refs.validation.forceValidate(['new_password']);
    }
    callback();
  },

  checkNewPassword(rule, value, callback) {
    if (value && value === this.state.formData.old_password) {
      callback('两次输入密码不能相同！');
    } else {
      callback();
    }
  },

  render() {
    const labelCol = 6;
    const wrapperCol = 12;
    const formData = this.state.formData;
    const status = this.state.status;

    return (
      <div className="wrapper">
        <Topbar breadcrumb={['帐户管理', '修改密码']} />
        <div className="pane-wrapper pane-block">
          <Form horizontal={true}>
            <Validation ref="validation" onValidate={this.handleValidate}>
              <FormItem label="当前密码：" id="old_password"
                        labelCol={{span: labelCol}} wrapperCol={{span: wrapperCol}}
                        hasFeedback={true}
                        validateStatus={getStatusClasses(status.old_password, formData.old_password)}
                        help={getStatusHelp(status.old_password)}
                        required={true}>
                <Validator rules={[{required: true, Whitespace: true, message: '请输入当前密码'},
                                   {validator: this.checkOldPassword}]}>
                  <Input name="old_password" id="old_password" type="password"
                         autoComplete="off" placeholder="请输入当前密码"
                         onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                         value={formData.old_password}/>
                </Validator>
              </FormItem>

              <FormItem label="新密码：" id="new_password"
                        labelCol={{span: labelCol}} wrapperCol={{span: wrapperCol}}
                        hasFeedback={true}
                        validateStatus={getStatusClasses(status.new_password, formData.new_password)}
                        help={getStatusHelp(status.new_password)}
                        required={true}>
                <Validator rules={[{required: true, min: 6, whitespace: true, message: '请输入新密码(至少6个字符)'},
                                   {validator: this.checkNewPassword}]}>
                  <Input name="new_password" id="new_password" type="password" placeholder="请输入新密码"
                         autoComplete="off"
                         onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                         value={formData.new_password} />
                </Validator>
              </FormItem>

              <FormItem wrapperCol={{offset: labelCol, span: wrapperCol}} >
                <input name="submit" type="submit" className="ant-btn ant-btn-primary" value="提交"
                       onClick={this.handleSubmit}/>
              </FormItem>

            </Validation>
          </Form>
        </div>
      </div>
    );
  }
});
