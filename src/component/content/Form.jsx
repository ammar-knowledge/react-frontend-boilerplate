
import React, { Component, PropTypes } from 'react';
import {
  Table, Button, Modal,
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
} from 'antd';

import * as _ from 'lodash';

const FormItem = Form.Item;

export class BaseForm extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    labelCol: PropTypes.number,
    wrapperCol: PropTypes.number,
    formProps: PropTypes.object,
    fields: PropTypes.array.isRequired,
    items: PropTypes.object.isRequired,
    object: PropTypes.object,
    onSubmit: PropTypes.func, /* function onSubmit(values, form) */
    onSuccess: PropTypes.func, /* function onSuccess() */
  }
  static defaultProps = {
    labelCol: 6,
    wrapperCol: 14,
    formProps: {horizontal: true},
    object: {},
    onSuccess: function() {}
  }

  constructor(props) {
    super(props);
    this.state = {object: this.props.object};
  }

  componentWillReceiveProps(newProps) {
    console.log('componentWillReceiveProps', this.props.type, newProps);
    if (!_.isEqual(newProps.object, this.props.object)) {
      this.setFieldDefaults(newProps.object);
      this.setState({object: newProps.object});
    }
  }

  formatObject(object) {
    let result = {};
    const { fields } = this.props;
    fields.map(function(field) {
      let value = object[field];
      if (_.isBoolean(value)) {
        value = value ? '1' : '0';
      } else if (_.isNumber(value)) {
        value = String(value);
      }
      result[field] = value;
    });
    console.log('fields:', fields, 'result', result);
    return result;
  }

  setFieldDefaults(object) {
    console.log('setFieldDefaults', this.props.type, object);
    const newObject = object === undefined ? this.state.object : object;
    this.props.form.setFieldsValue(this.formatObject(newObject));
  }

  handleReset() {
    this.props.form.resetFields();
    this.setFieldDefaults();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, onSubmit, onSuccess, object } = this.props;
    const theOnSubmit = _.get(this, 'onSubmit', onSubmit);
    form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!', errors);
        return;
      }
      values.id = object.id;
      theOnSubmit.bind(this)(values, form, (newObject) => {
        this.setState({object: newObject}, () => {
          this.handleReset();
          onSuccess();
        });
      });
      console.log('Submit!!!', values);
    });
  }

  getFormItems() {
    const { fields, items } = this.props;
    return fields.map((field) => {
      const item = items[field];
      const render = _.isFunction(item) ? item : item.render;
      return render.call(this);
    });
  }

  render() {
    const {form, formProps, labelCol, wrapperCol} = this.props;
    const footerItem = <FormItem key="_footer" wrapperCol={{ span: wrapperCol, offset: labelCol }}>
      <Button className="list-btn" type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
      <Button className="list-btn" type="ghost" onClick={this.handleReset.bind(this)}>重置</Button>
    </FormItem>;
    let formItems = this.getFormItems();
    formItems.push(footerItem);

    return <Form form={form} onSubmit={e => this.handleSubmit(e)}
                 {...formProps} >
      {formItems}
    </Form>;
  }
}

export class FormModal extends BaseForm {
  static propTypes = {
    ...BaseForm.propTypes,
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    onCancel: PropTypes.func, /* function onCancel() */
  }

  static defaultProps = {
    ...BaseForm.defaultProps,
    title: "表单"
  }

  render() {
    const {form, formProps} = this.props;
    const formItems = this.getFormItems();
    const footer = <div>
      <Button type="ghost" onClick={e => this.handleReset()}>重置</Button>
      <Button type="primary" onClick={e => this.handleSubmit(e)}>提交</Button>
    </div>;
    return <Modal title={this.props.title}
                  visible={this.props.visible}
                  footer={footer}
                  onCancel={e => this.props.onCancel()}>
      <Form form={form} onSubmit={e => this.handleSubmit(e)}
            {...formProps} >
        {formItems}
      </Form>
    </Modal>;
  }
}
