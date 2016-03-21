import React from 'react';
import { Link, History } from 'react-router';
import { Validation, Button, Form, Input, Select, message } from 'antd';

import { signupRoles } from 'data/config';
import { Api, httpErrorCallback } from 'data/api';
import { getStatusClasses, getStatusHelp } from 'common/utils';

const Validator = Validation.Validator;
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
  mixins: [Validation.FieldMixin, History],

  getInitialState() {
    return {
      roles: [],
      status: {
        role_id: {},
        email: {},
        qq: {},
        login: {},
        password: {},
        rePassword: {},
      },
      formData: {
        role_id: undefined,
        email: undefined,
        qq: undefined,
        login: undefined,
        password: undefined,
        rePassword: undefined,
      },
    };
  },

  componentDidMount() {
    const self = this;

    Api.Role.objects({
      filters: [['name', 'in', signupRoles]]
    }).then((resp) => {
      console.log('roles:', resp.data);
      this.setState({roles: resp.data.objects});
      console.log(this.state);
    }).catch(httpErrorCallback);
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
      Api.User.create(formData).then((resp) => {
        console.log('Signup response:', resp);
        this.resetForm()
        message.success('注册成功!', 5);
        /* this.history.pushState(null, '/verify'); */
        this.history.pushState(null, '/signin');
      }).catch(function(resp) {
        console.error(resp);
        message.error(`注册失败: ${resp.data.message}`, 3);
      });
    });
  },

  resetForm() {
    this.refs.validation.reset();
    this.setState(this.getInitialState());
  },

  handleReset(e) {
    this.resetForm();
    e.preventDefault();
  },

  checkRole(rule, value, callback) {
    if (!value) {
      callback([new Error('请选择一种用户类型')]);
    } else {
      callback();
    }
  },

  userExists(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      Api.User.objects({
        filters: [['login', '==', value.trim()]]
      }).then(function(resp) {
        console.log(resp);
        if (resp.data.total > 0) {
          callback([new Error('抱歉，该用户名已被占用。')]);
        } else {
          callback();
        }
      }).catch(httpErrorCallback);
    }
  },

  emailExists(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      Api.User.objects({
        filters: [['email', '==', value.trim()]]
      }).then(function(resp) {
        console.log(resp);
        if (resp.data.total > 0) {
          callback([new Error('抱歉，该邮箱已被占用。')]);
        } else {
          callback();
        }
      }).catch(httpErrorCallback);
    }
  },

  checkPassword(rule, value, callback) {
    if (this.state.formData.password) {
      this.refs.validation.forceValidate(['rePassword']);
    }
    callback();
  },

  checkPassword2(rule, value, callback) {
    if (value && value !== this.state.formData.password) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
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

    let formData = this.state.formData;
    let status = this.state.status;

    return (
      <div style={wrapperStyle}>
        <Form horizontal={true}>
          <legend>xxx平台 用户注册</legend>
          <Validation ref="validation" onValidate={this.handleValidate}>
            <FormItem label="用户类型：" id="role_id"
                      labelCol={{span: labelCol}} wrapperCol={{span: 10}}
                      validateStatus={getStatusClasses(status.role_id, formData.role_id)}
                      help={getStatusHelp(status.role_id)}
                      required={true}>
              <Validator rules={[{required: true, message: '请选择用户类型'}]}>
                <Select size="large" placeholder="请选择用户类型" name="role_id"
                        style={{width:"100%"}} value={formData.role_id}>
                  {
                    this.state.roles.map(function(role) {
                      return <Option key={role.id} value={String(role.id)}>{role.descr}</Option>;
                    })
                  }
                </Select>
              </Validator>
            </FormItem>

            <FormItem label="用户名(登录)：" id="login"
                      labelCol={{span: labelCol}} wrapperCol={{span: wrapperCol}}
                      hasFeedback={true}
                      validateStatus={getStatusClasses(status.login, formData.login)}
                      help={getStatusHelp(status.login)}
                      required={true}>
              <Validator rules={[{required: true, min: 4, message: '用户名至少为 4 个字符'},
                                 {validator: this.userExists}]}>
                <Input name="login" id="login" placeholder="请输入用户名"
                       value={formData.login}/>
              </Validator>
            </FormItem>

            <FormItem label="邮箱：" id="email"
                      labelCol={{span: labelCol}} wrapperCol={{span: wrapperCol}}
                      hasFeedback={true}
                      validateStatus={getStatusClasses(status.email, formData.email)}
                      help={getStatusHelp(status.email)}
                      required={true}>
              <Validator rules={[{required: true, type:'email', message: '请输入正确的邮箱地址'},
                                 {validator: this.emailExists}]}
                         trigger={'onBlur'}>
                <Input type="email" name="email" id="email"  placeholder="请输入邮箱"
                       value={formData.email}/>
              </Validator>
            </FormItem>

            <FormItem label="QQ：" id="qq"
                      labelCol={{span: labelCol}} wrapperCol={{span: wrapperCol}}
                      hasFeedback={true}
                      validateStatus={getStatusClasses(status.qq, formData.qq)}
                      help={getStatusHelp(status.qq)}
                      required={true}>
              <Validator rules={[{required: true, type:'string', message: '请输入正确的QQ号码'}]}
                         trigger={'onBlur'}>
                <Input name="qq" id="qq" placeholder="请输入QQ号码"
                       value={formData.qq}/>
              </Validator>
            </FormItem>


            <FormItem label="密码：" id="password"
                      labelCol={{span: labelCol}} wrapperCol={{span: wrapperCol}}
                      hasFeedback={true}
                      validateStatus={getStatusClasses(status.password, formData.password)}
                      help={getStatusHelp(status.password)}
                      required={true}>
              <Validator rules={[{required: true, Whitespace: true, message: '请填写密码'},
                                 {validator: this.checkPassword}]}>
                <Input name="password" id="password" type="password"
                       autoComplete="off"
                       onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                       value={formData.password}/>
              </Validator>
            </FormItem>

            <FormItem label="确认密码：" id="password2"
                      labelCol={{span: labelCol}} wrapperCol={{span: wrapperCol}}
                      hasFeedback={true}
                      validateStatus={getStatusClasses(status.rePassword, formData.rePassword)}
                      help={getStatusHelp(status.rePassword)}
                      required={true}>
              <Validator rules={[{required: true, whitespace: true, message: '请再次输入密码'},
                                 {validator: this.checkPassword2}]}>
                <Input name="rePassword" id="password2" type="password" placeholder="两次输入密码保持一致"
                       autoComplete="off"
                       onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                       value={formData.rePassword} />
              </Validator>
            </FormItem>

            <FormItem wrapperCol={{offset: labelCol, span: wrapperCol}} >
              <input name="submit" type="submit" className="ant-btn ant-btn-primary" value="注 册"
                     onClick={this.handleSubmit}/>
              &nbsp;&nbsp;&nbsp;
              <Link to="/signin" className="ant-btn ant-btn-default">登录</Link>
            </FormItem>
          </Validation>
        </Form>
      </div>
    );
  }
});

export default Signup;
