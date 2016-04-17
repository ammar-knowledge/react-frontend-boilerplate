
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

export class FormModal extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    labelCol: PropTypes.number,
    wrapperCol: PropTypes.number,
    formProps: PropTypes.object,
    fields: PropTypes.array.isRequired,
    items: PropTypes.object.isRequired,
    object: PropTypes.object,
    onSubmit: PropTypes.func, /* function onSubmit(values, form) */
    onSuccess: PropTypes.func, /* function onSuccess() */
    onCancel: PropTypes.func, /* function onCancel() */
  }
  static defaultProps = {
    title: "表单",
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

  resetForm() {
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
          this.resetForm();
          onSuccess();
        });
      });
      console.log('Submit!!!', values);
    });
  }

  render() {
    const {form, formProps, fields, items} = this.props;
    const formItems = fields.map((field) => {
      return items[field].render.call(this);
    });
    const ModalFooter = this.props.type === "create" ? (<div>
      <Button type="ghost" onClick={e => this.resetForm()}>重置</Button>
      <Button type="primary" onClick={e => this.handleSubmit(e)}>提交</Button>
    </div>) : (<div>
        <Button type="primary" onClick={e => this.handleSubmit(e)}>提交</Button>
    </div>);
    return (
      <Modal title={this.props.title}
             visible={this.props.visible}
             footer={ModalFooter}
             onCancel={e => this.props.onCancel()}>
        <Form form={form} onSubmit={e => this.handleSubmit(e)}
              {...formProps} >
          {formItems}
        </Form>
      </Modal>
    );
  }
}
