
import React, { Component } from 'react';

import {
  /* 通用 */
  Col, Row, message, Button, Tabs, Icon, Card,
  /* 表单 */
  Form,        // 表单
  Input,       // 普通输入框: <input type="{T}" />
  InputNumber, // 数字输入框
  Checkbox,    // 多选框
  Radio,       // 单选框
  Cascader,    // 级联选择
  Transfer,    // 穿梭框
  Select,      // 选择器
  TreeSelect,  // 树选择
  Slider,      // 滑动输入条
  Switch,      // 开关
  DatePicker,  // 日期选择
  TimePicker,  // 时间选择
  Upload,      // 上传
  /* 动画 */
  QueueAnim,
} from 'antd';

import PageIntro from 'component/content/PageIntro.jsx';
import Topbar from 'component/content/Topbar.jsx';


const TabPane = Tabs.TabPane;

const createForm = Form.create;

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


class MyCard extends Component {
  render() {
    const titleStyle = {
      marginBottom: '8px',
    };
    const bodyStyle = {
      padding: '8px',
      border: '1px #BBB dashed',
      borderRadius: '5px'
    }
    const cardStyle = {
      marginBottom: '40px',
    };

    return (
      <div style={cardStyle}>
        <h3 style={titleStyle}>{ this.props.title }</h3>
        <div style={bodyStyle}>
          { this.props.children }
        </div>
      </div>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////
//// Demo List
////////////////////////////////////////////////////////////////////////////////

////////// Inline 表单 //////////
let DemoInlineForm = React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    console.log('收到表单值：', this.props.form.getFieldsValue());
  },

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <Form inline onSubmit={this.handleSubmit}>
        <FormItem
            label="账户：">
          <Input placeholder="请输入账户名"
                 {...getFieldProps('userName')} />
        </FormItem>
        <FormItem
            label="密码：">
          <Input type="password" placeholder="请输入密码"
                 {...getFieldProps('password')} />
        </FormItem>
        <FormItem>
          <label className="ant-checkbox-inline">
            <Checkbox
                {...getFieldProps('agreement')} />记住我
          </label>
        </FormItem>
        <Button type="primary" htmlType="submit">登录</Button>
      </Form>
    );
  }
});

DemoInlineForm = Form.create()(DemoInlineForm);


//////////  校验其他组件 //////////

let DemoValidateOther = React.createClass({
  componentDidMount() {
    this.props.form.setFieldsValue({
      eat: true,
      sleep: true,
      beat: true,
    });
  },

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!', errors);
        return;
      }
      console.log('Submit!!!');
      console.log(values);
    });
  },

  checkBirthday(rule, value, callback) {
    if (value && value.getTime() >= Date.now()) {
      callback(new Error('你不可能在未来出生吧!'));
    } else {
      callback();
    }
  },

  checkPrime(rule, value, callback) {
    if (value !== 11) {
      callback(new Error('8~12之间的质数明明是11啊!'));
    } else {
      callback();
    }
  },

  render() {
    const address = [{
      value: 'zhejiang',
      label: '浙江',
      children: [{
        value: 'hangzhou',
        label: '杭州',
      }],
    }];
    const { getFieldProps } = this.props.form;
    const selectProps = getFieldProps('select', {
      rules: [
        { required: true, message: '请选择您的国籍' }
      ],
    });
    const multiSelectProps = getFieldProps('multiSelect', {
      rules: [
        { required: true, message: '请选择您喜欢的颜色', type: 'array' },
      ]
    });
    const radioProps = getFieldProps('radio', {
      rules: [
        { required: true, message: '请选择您的性别' }
      ]
    });
    const birthdayProps = getFieldProps('birthday', {
      rules: [
        {
          required: true,
          type: 'date',
          message: '你的生日是什么呢?',
        }, {
          validator: this.checkBirthday,
        }
      ]
    });
    const primeNumberProps = getFieldProps('primeNumber', {
      rules: [{ validator: this.checkPrime }],
    });
    const addressProps = getFieldProps('address', {
      rules: [{ required: true, type: 'array' }],
    });
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
      <Form horizontal form={this.props.form}>
        <FormItem
          {...formItemLayout}
          label="国籍：">
          <Select {...selectProps} placeholder="请选择国家" style={{ width: '100%' }}>
            <Option value="china">中国</Option>
            <Option value="use">美国</Option>
            <Option value="japan">日本</Option>
            <Option value="korean">韩国</Option>
            <Option value="Thailand">泰国</Option>
          </Select>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="喜欢的颜色：">
          <Select {...multiSelectProps} multiple placeholder="请选择颜色" style={{ width: '100%' }}>
            <Option value="red">红色</Option>
            <Option value="orange">橙色</Option>
            <Option value="yellow">黄色</Option>
            <Option value="green">绿色</Option>
            <Option value="blue">蓝色</Option>
          </Select>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="性别：">
          <RadioGroup {...radioProps}>
            <Radio value="male">男</Radio>
            <Radio value="female">女</Radio>
          </RadioGroup>
          <span><Icon type="info-circle-o" /> 暂不支持其它性别</span>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="兴趣爱好：">
          <Checkbox {...getFieldProps('eat', {
            valuePropName: 'checked',
          })} />吃饭饭 &nbsp;
          <Checkbox {...getFieldProps('sleep', {
            valuePropName: 'checked',
          })} />睡觉觉 &nbsp;
          <Checkbox {...getFieldProps('beat', {
            valuePropName: 'checked',
          })} />打豆豆 &nbsp;
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="生日：">
          <DatePicker {...birthdayProps} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="8~12间的质数：">
          <InputNumber {...primeNumberProps} min={8} max={12} />
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="选择地址：">
          <Cascader {...addressProps} options={address} />
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 7 }} >
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={this.handleReset}>重置</Button>
        </FormItem>
      </Form>
    );
  },
});

DemoValidateOther = createForm()(DemoValidateOther);

////////// 含图片(文件) //////////

////////// 单行多字段 //////////
class DemoMultipleFieldForm extends Component {
  render() {
    return (
      <Form horizontal>
        <FormItem
            label="失败校验："
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            validateStatus="error"
            help="请输入数字和字母组合">
          <Input defaultValue="无效选择" id="error" />
        </FormItem>

        <FormItem
            label="警告校验："
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            validateStatus="warning">
          <Input defaultValue="前方高能预警" id="warning" />
        </FormItem>

        <FormItem
            label="校验中："
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            hasFeedback
            validateStatus="validating"
            help="信息审核中...">
          <Input defaultValue="我是被校验的内容" id="validating" />
        </FormItem>

        <FormItem
            label="成功校验："
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            hasFeedback
            validateStatus="success">
          <Input defaultValue="我是正文" id="success" />
        </FormItem>

        <FormItem
            label="警告校验："
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            hasFeedback
            validateStatus="warning">
          <Input defaultValue="前方高能预警" id="warning" />
        </FormItem>

        <FormItem
            label="失败校验："
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            hasFeedback
            validateStatus="error"
            help="请输入数字和字母组合">
          <Input defaultValue="无效选择" id="error" />
        </FormItem>

        <FormItem
            label="Datepicker："
            labelCol={{ span: 5 }}
            help>
          <Col span="6">
            <FormItem validateStatus="error" help="请选择正确日期">
              <DatePicker />
            </FormItem>
          </Col>
          <Col span="1">
            <p className="ant-form-split">-</p>
          </Col>
          <Col span="6">
            <FormItem>
              <DatePicker />
            </FormItem>
          </Col>
        </FormItem>

        <FormItem
            label="Datepicker："
            labelCol={{ span: 5 }}
            validateStatus="error"
            help>
          <Col span="6">
            <DatePicker />
          </Col>
          <Col span="1">
            <p className="ant-form-split">-</p>
          </Col>
          <Col span="6">
            <DatePicker />
          </Col>
          <Col span="19" offset="5">
            <p className="ant-form-explain">请选择正确日期</p>
          </Col>
        </FormItem>
      </Form>
    );
  }
}

DemoMultipleFieldForm = createForm()(DemoMultipleFieldForm);

////////// 高级搜索 //////////
class DemoAdvancedForm extends Component {
  render() {
    return (
      <Form horizontal className="ant-advanced-search-form">
        <Row gutter={16}>
          <Col sm={8}>
            <FormItem
                label="搜索名称："
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}>
              <Input placeholder="请输入搜索名称" />
            </FormItem>
            <FormItem
                label="较长搜索名称："
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}>
              <DatePicker size="default" />
            </FormItem>
            <FormItem
                label="搜索名称："
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}>
              <Input placeholder="请输入搜索名称" />
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem
                label="搜索名称："
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}>
              <Input placeholder="请输入搜索名称" />
            </FormItem>
            <FormItem
                label="较长搜索名称："
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}>
              <DatePicker size="default" />
            </FormItem>
            <FormItem
                label="搜索名称："
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}>
              <Input placeholder="请输入搜索名称" />
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem
                label="搜索名称："
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}>
              <Input placeholder="请输入搜索名称" />
            </FormItem>
            <FormItem
                label="较长搜索名称："
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}>
              <DatePicker size="default" />
            </FormItem>
            <FormItem
                label="搜索名称："
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}>
              <Input placeholder="请输入搜索名称" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={12} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">搜索</Button>
            &nbsp;&nbsp;&nbsp;
            <Button>清除条件</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

DemoAdvancedForm = createForm()(DemoAdvancedForm);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

class TestForms extends Component {
  render() {
    const wrapperStyle = {
      backgroundColor: 'transparent',
    };
    const cardStyle = {
      marginBottom: '40px',
    };

    return (
      <div className="wrapper">
        <Topbar breadcrumb={['帐户管理', '修改密码']} />
        <PageIntro>
          这里是表单示例页面
        </PageIntro>
        <Tabs type="card">
          <TabPane tab="原生" key="raw">
            <div className="pane-wrapper" style={wrapperStyle}>
              <Card title="平行排列" style={cardStyle}>
                <DemoInlineForm />
              </Card>
              <Card title="校验其他组件" style={cardStyle}>
                <DemoValidateOther />
              </Card>
              <Card title="含图片(文件)" style={cardStyle}>
              </Card>
              <Card title="单行多字段" style={cardStyle}>
                <DemoMultipleFieldForm />
              </Card>
              <Card title="高级搜索" style={cardStyle}>
                <DemoAdvancedForm />
              </Card>
            </div>
          </TabPane>
          <TabPane tab="Factory" key="factory">
            <div className="pane-wrapper" style={wrapperStyle}>
              <span>Factory</span>
            </div>
          </TabPane>
          <TabPane tab="声明式(自创)" key="define">
            <div className="pane-wrapper" style={wrapperStyle}>
              <span>Define</span>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}


export default TestForms;
