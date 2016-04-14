
import React, { Component, PropTypes } from 'react';

import {
  /* 通用 */
  Col, Row, message, Button, Tabs, Icon, Card, Modal,
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

const createForm = Form.create;

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


/*
   [ Form types ]
   ==============
     * Read only
     * Inline
     * With image field (file)
     * Multiple fields in one <FormItem>
     * <FormItem> organized by Row/Col (Advanced search form)


   Read only
   ---------
     * <p className="ant-form-text">The Content</p>
     * <span className="ant-form-text">The Content</span>

   Inline
   ------
     * Just add `inline` property to <Form>

   With image field (file)
   -------------------------
     * TODO

   Multiple fields in one <FormItem>
   ---------------------------------
     * !!! Currently not support, you should put them in multiple <FormItem>

   <FormItem> organized by Row/Col (Advanced search form)
   ------------------------------------------------------
     * By array config
*/

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

let DemoValidateOtherForm = React.createClass({
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
    this.props.form.validateFieldsAndScroll((errors, values) => {if (!!errors) {
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

DemoValidateOtherForm = createForm()(DemoValidateOtherForm);


////////// Modal //////////
class DemoValidateOtherFormModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    alwaysPropagate: PropTypes.bool,
    onSubmit: PropTypes.func, /* function onSubmit(e, form) */
    onCancel: PropTypes.func, /* function onCancel(e) */
  }

  static defaultProps = {
    alwaysPropagate: false,
  }

  constructor(props) {
    super(props);
    this.state = {visible: this.props.visible};
  }

  componentWillReceiveProps(newProps) {
    this.setState({visible: newProps.visible});
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      eat: true,
      sleep: false,
      beat: true,
    });
  }

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {if (!!errors) {
        console.log('Errors in form!!!', errors);
        return;
      }
      console.log('Submit!!!');
      console.log(values);
    });
  }

  checkBirthday(rule, value, callback) {
    if (value && value.getTime() >= Date.now()) {
      callback(new Error('你不可能在未来出生吧!'));
    } else {
      callback();
    }
  }

  checkPrime(rule, value, callback) {
    if (value !== 11) {
      callback(new Error('8~12之间的质数明明是11啊!'));
    } else {
      callback();
    }
  }

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
        { required: true, message: '请选择您的性别'}
      ],
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
    /*
    const addressProps = getFieldProps('address', {
      rules: [{ required: true, type: 'array' }],
    });
    */
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };

    const ModalFooter = (
      <div>
        <Button type="ghost"
                onClick={(e) => {this.handleReset(e)}}>重置</Button>
        <Button type="primary"
                onClick={(e) => {this.handleSubmit(e)}}>确定</Button>
      </div>
    );

    console.log('sleep field >>>>', getFieldProps('sleep', {valuePropName: 'checked'}));
    return (
      <Modal title="编辑表单"
             visible={this.state.visible}
             footer={ModalFooter}
             onCancel={(e) => {this.props.onCancel(e)}}>
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
              })} />吃饭饭
            <Checkbox {...getFieldProps('sleep', {
                valuePropName: 'checked',
              })} />睡觉觉
            <Checkbox {...getFieldProps('beat', {
                valuePropName: 'checked',
              })} />打豆豆
          </FormItem>

          <FormItem
              {...formItemLayout}
              label="生日：">
            <DatePicker disabled {...birthdayProps} />
          </FormItem>

          <FormItem
              {...formItemLayout}
              label="8~12间的质数：">
            <InputNumber {...primeNumberProps} min={8} max={12} />
          </FormItem>
          {
            /*
            <FormItem
                {...formItemLayout}
                label="选择地址：">
              <Cascader {...addressProps} options={address} />
            </FormItem>
           */
          }
        </Form>
      </Modal>
    );
  }
}

DemoValidateOtherFormModal = createForm()(DemoValidateOtherFormModal);


////////// 含图片(文件) //////////

class DemoImageForm extends Component {
  constructor(props) {
    super(props);
  }

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {if (!!errors) {
        console.log('Errors in form!!!', errors);
        return;
      }
      console.log('Submit!!! values:', values);
    });
  }

  handleBeforeUpload(file) {
    console.log('handleBeforeUpload:', file);
  }

  handleUpload(e) {
    console.log('handleUpload:', e);
  }

  normalFile(e) {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const { getFieldProps } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };

    const imageProps = {
      action: '/upload',
      listType: 'picture-card',
      defaultFileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
        thumbUrl: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
      }]
    };

    return (
      <Form horizontal form={this.props.form}>

        <FormItem
            {...formItemLayout}
            label="logo图："
            help="提示信息要长长长长长长长长长长长长长长">
          <Upload name="logo" action="/upload" multiple accept="image/*" listType="picture"
                  beforeUpload={file => this.handleBeforeUpload(file) }
                  onChange={e => this.handleUpload(e)}
                  {...getFieldProps('upload', {
                     valuePropName: 'fileList',
                     normalize: e => this.normalFile(e)
                   })} >
            <Button type="ghost">
              <Icon type="upload" /> 点击上传
            </Button>
          </Upload>
        </FormItem>

        <FormItem
            wrapperCol={{ span: 12, offset: 7 }} >
          <Button type="primary" onClick={e => this.handleSubmit(e)}>确定</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={e => this.handleReset(e)}>重置</Button>
        </FormItem>
      </Form>
    );
  }
};

DemoImageForm = createForm()(DemoImageForm);


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


export {
  DemoInlineForm,
  DemoValidateOtherForm,
  DemoImageForm,
  DemoMultipleFieldForm,
  DemoAdvancedForm,
  DemoValidateOtherFormModal
}
