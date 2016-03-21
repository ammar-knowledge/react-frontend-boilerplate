
import React from 'react';
import { message } from 'antd';
import { Link, History } from 'react-router';

import { Api, httpGet, httpErrorCallback } from 'data/api';
import { BaseForm } from 'component/content/Form.jsx';

const emailExists = function(rule, value, callback) {
  if (!value) {
    callback();
  } else {
    Api.User.objects({
      filters: [['email', '==', value.trim()]]
    }).then(function(resp) {
      console.log(resp);
      if (resp.data.total > 0) {
        callback();
      } else {
        callback([new Error('抱歉，不存在该邮箱。')]);
      }
    }).catch(httpErrorCallback);
  }
};

const formConfig = {
  submitLabel: '重发激活邮件',
  labelCol: 4,
  wrapperCol: 20,
  names: ['email'],
  items: {
    email: {
      attrs: {
        label: '邮箱:',
        required: true,
        hasFeedback: true,
      },
      validateStatus: true,
      help: true,
      update: {
        validator: {
          rules: [{required: true, type:'email', message: '请输入正确的邮箱地址'},
                  {validator: emailExists}]
        },
        input: {
          attrs: {
            type: 'email',
            placeholder: '请输入注册过的邮箱!'
          }
        }
      }
    }
  }
};

export default React.createClass({
  displayName: 'EmailVerify',

  getInitialState() {
    return {verified: false};
  },

  componentDidMount() {
    console.log('Query params:', this.props.location.query, this.isMounted());
    const query = this.props.location.query;
    if (query) {
      const token = query.token;
      if (token) {
        httpGet('/verify', {
          params: {token: token}
        }).then((resp) => {
          message.success(resp.data.message);
          this.setState({verified: true})
        }).catch((resp) => {
          message.error(resp.data.message);
        });
      }
    }
  },

  sendVerify() {
  },

  render() {
    const wrapperStyle = {
      width: '320px',
      padding: '40px 20px',
      margin: '60px auto 20px',
      border: '1px solid #CCC',
      borderRadius: '5px',
      background: '#fff',
    };
    const main = this.state.verified ? <span>邮箱验证成功! 请等待管理员开启帐号.</span> : (
      <div>
        <span>请登录你的邮箱验证帐号!</span>
      </div>
    );
    return (
      <div style={wrapperStyle}>
        <div>{main}</div>

        <div style={{marginTop: '15px'}}>
          <Link to="/signup" style={{marginRight: '5px'}} className="ant-btn ant-btn-default">注册</Link>
          <Link to="/signin" className="ant-btn ant-btn-default">登录</Link>
        </div>
      </div>
    );
  }
});
