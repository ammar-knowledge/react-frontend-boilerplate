import React from 'react';
import {
  Validation, Form, Input, InputNumber, Select, Col, Row,
  Table, Tabs, Button, message, Radio, Checkbox, QueueAnim,
  DatePicker,
} from 'antd';

import {
  getStatusClasses, getStatusHelp, deepCompare
} from 'common/utils';
import * as _ from 'lodash';

/* Re design use reuseable component:
    > https://facebook.github.io/react/docs/reusable-components.html
 */

const FormClass = React.createFactory(Form);
const FormItemClass = React.createFactory(Form.Item);
const ValidationClass = React.createFactory(Validation);
const ValidatorClass = React.createFactory(Validation.Validator);
export const InputClass = React.createFactory(Input);
export const SelectClass = React.createFactory(Select);
export const OptionClass = React.createFactory(Select.Option);
export const RadioClass = React.createFactory(Radio);
export const RadioButtonClass = React.createFactory(Radio.Button);
export const RadioGroupClass = React.createFactory(Radio.Group);
export const CheckboxClass = React.createFactory(Checkbox);
export const DatePickerClass = React.createFactory(DatePicker);

const ButtonClass = React.createFactory(Button);

const div = React.createFactory('div');
const span = React.createFactory('span');
const img = React.createFactory('img');
const a = React.createFactory('a');

const FormItem = Form.Item;

const Integer = Number;
const FormConfig = {
  attrs: {
    horizontal: undefined || Boolean,
    inline: undefined || Boolean,
  },
  submitLabel: undefined || String,
  // Default configs
  labelCol: Integer,
  wrapperCol: Integer,
  // Form Items
  getNames: undefined || Function,
  virtualFields: undefined || {
    '{virtual-field-name}': [String, String], // For inner fields
  },
  names: [String, String, String], // Required!!, full name list.
  items: {
    name: {
      // Unimportant attrs
      attrs: {
        label: undefined || String,
        style: undefined || Object,
        labelCol: undefined || Integer,
        wrapperCol: undefined || Integer,
        /// Only you want then apply to both update and create
        required: undefined || Boolean,
        hasFeedback: undefined || Boolean,
      },
      validateStatus: undefined || Boolean || Function, // validateStatus(status, formData, isUpdate)
      help: undefined || Boolean || Function, // help(status, isUpdate)
      // `file` is required because its `key` and `onChange` is special
      file: undefined || {
        accept: String,
        multiple: undefined || Boolean,
      },
      create: {
        attrs: undefined || {
          required: undefined || Boolean,
          hasFeedback: undefined || Boolean,
        },
        validateStatus: undefined || Boolean || Function, // validateStatus(status, formData, isUpdate)
        help: undefined || Boolean || Function, // help(status, isUpdate)
        validator: undefined || {
          rules: Array,
          trigger: undefined || String,
        },
        input: undefined || {
          attrs: {
            size: undefined || String,
            style: undefined || Object,
            placeholder: undefined || String,
          },
          typeClass: undefined || Object, // Default: InputClass || SelectClass
          optionClass: undefined || Object, // Default: OptionClass
          options: undefined || Array, // For: Select, Radio
          ////////////////////
          render: undefined || Function, // render(formData, isUpdate)
        },
        render: undefined || Function, // render(formData, isUpdate)
        below: undefined || {
          render: Function, // render(formData, isUpdate)
        },
      },
      /// Structure is same as `create`,
      //  If (update === undefined), means same config as `create`.
      update: undefined || {},
      below: undefined || {
        render: Function, // render(formData, isUpdate)
      },
    }
  },
}; // Structure


export const renderInputItem = function(config, value, theExtras) {
  /// Start: main part
  const extras = theExtras ? theExtras : {};
  const fieldName = extras.fieldName;
  const formData = extras.formData;
  const fileCfg = extras.fileCfg;
  const handleFileChanged = extras.handleFileChanged;
  const onChange = extras.onChange;
  const inputCfg = config;

  const options = inputCfg.options;
  const optionClass = _.get(inputCfg, 'optionClass', OptionClass);
  const defaultTypeClass = options ? SelectClass : InputClass;
  const typeClass = _.get(inputCfg, 'typeClass', defaultTypeClass);
  let theValue = value === undefined || value === null ? '' : value.constructor();
  if (value !== undefined && value !== null) {
    if (typeof value === 'boolean') {
      theValue = value ? '1' : '0';
    } else if (value.constructor === Array) {
      theValue = value;
    } else {
      theValue = String(value);
    }
  }

  let inputItem = undefined;
  /// Build: <Input>, <Select>
  let inputAttrs = _.clone(_.get(inputCfg, 'attrs', {}));
  Object.assign(inputAttrs, {
    /* id: fieldName, */
    name: fieldName,
  });
  if (fileCfg) {
    // input[type="file"]
    Object.assign(inputAttrs, {
      type: 'file',
      accept: fileCfg.accept,
      key: formData[`${fieldName}Key`],
      onChange: (e) => {handleFileChanged(e, fieldName)}
    });
    if (fileCfg.multiple) {
      Object.assign(inputAttrs, {multiple: fileCfg.multiple});
    }
    inputItem = InputClass(inputAttrs);
  } else if (options) {
    // input[type="option"], input[type="radio"]
    inputAttrs.value = theValue;
    inputAttrs.defaultValue = theValue;
    if (inputAttrs.style === undefined) {
      inputAttrs.style = {width: '100%'};
    }
    if (inputAttrs.onChange === undefined && onChange) {
      inputAttrs.onChange = onChange;
    }
    const optionItems = options.map(function(option) {
      return optionClass(
        {
          key: option[0],
          value: option[0],
        },
        option[1]);
    });
    inputItem = typeClass(inputAttrs, ...optionItems);
  } else {
    // input[type=others]
    inputAttrs.value = theValue;
    if (inputAttrs.onChange === undefined && onChange) {
      if (typeClass == DatePickerClass) {
      }
      inputAttrs.onChange = onChange;
    }
    inputItem = typeClass(inputAttrs);
  }
  /// END: build inputItem
  return inputItem;
};



// Require Validation.FieldMixin in `mixins`
export const FormMixin = {
  /* Optinal implement: handleUpdate, handleCreate */

  getBaseState() {
    ////////////////////////////////////////
    const formConfig = this.props.formConfig; // See: this.renderFormItems()
    const object = this.props.object;
    const virtualFields = formConfig.virtualFields || {};
    let status = {};

    const virtualFieldNames = Object.keys(virtualFields);
    const innerFieldNames = virtualFieldNames.reduce(function(acc, name) {
      return acc.concat(virtualFields[name]);
    }, []);
    console.log('virtualFields:', virtualFields, innerFieldNames);
    const dataFieldNames =  _.union(_.without(formConfig.names, ...virtualFieldNames), innerFieldNames);

    const items = formConfig.names.map(function(name) {
      let item = formConfig.items[name];
      item.name = name;
      return item;
    });
    console.log('>>> items:', items);
    const normalFields = items.filter(function(item) {
      return item.file === undefined;
    }).map((item) => {
      return item.name;
    });
    const fileFields = items.filter(function(item) {
      return item.file !== undefined;
    }).map(function(item) {
      return item.name;
    });

    dataFieldNames.forEach((name) => {
      status[name] = {};
    });
    if (virtualFields) {
       virtualFieldNames.forEach((vName) => {
        virtualFields[vName].forEach(function(name) {
          status[name] = {};
        });
      });
    }
    // TODO: 意味着虚拟字段中的 [input="file"] 被忽略了
    const normalDataFields = _.union(_.without(normalFields, ...virtualFieldNames), innerFieldNames);
    const formData = this.getNewFormData(formConfig, object, _.clone(object), normalDataFields, fileFields);
    return {
      formConfig: formConfig,
      normalFields: normalDataFields,
      fileFields: fileFields,
      status: status,
      object: object,
      formData: formData,
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    const validation = this.refs.validation;
    validation.validate((valid) => {
      if (!valid) {
        console.log('Error in form');
        return;
      }
      let formData = this.state.formData;
      if (this.props.isUpdate) {
        formData.id = this.props.object.id;
        if (this.handleUpdate) {
          this.handleUpdate(formData);
        }
      } else {
        if (this.handleCreate) {
          this.handleCreate(formData, () => {
            this.resetForm();
          });
        }
      }
    });
  },

  resetForm() {
    this.refs.validation.reset();
    this.setState(this.getInitialState());
  },

  handleFileChanged(e, name) {
    let formData = this.state.formData;
    /* sufix: File */
    formData[`${name}File`] = e.target.files;
    this.setState({formData: formData});
  },

  getNewFormData(formConfig, object, _formData, _normalFields, _fileFields) {
    // TODO: Such ugly function!!!!!

    console.log('getNewFormData', object, _formData, _normalFields, _fileFields);

    const normalFields = _normalFields ? _normalFields : this.state.normalFields;
    const fileFields = _fileFields ? _fileFields : this.state.fileFields;
    let formData = _formData !== undefined ? _formData : this.state.formData;

    normalFields.forEach((field) => {
      formData[field] = object[field];
    });
    // Add input[type="file"] fields
    fileFields.forEach((field) => {
      const timestampStr = String(Number(new Date()));
      formData[`${field}Key`] = `${field}-${timestampStr}`;
      formData[`${field}File`] = undefined;
    });
    // Add `id` field
    if (object.id !== undefined) {
      formData.id = object.id;
    }
    console.log('>>>>>>> New formData:', formData);
    return formData;
  },

  updateFormDataFromProps(newProps) {
    if (newProps.isUpdate) {
      console.log('newProps:', newProps);
      const object = newProps.object;
      const formData = this.getNewFormData(this.state.formConfig, object);
      return {formData: formData};
    } else {
      return {};
    }
  },

  renderForm() {
    const formConfig = _.clone(this.state.formConfig);
    const labelCol = _.get(formConfig, 'labelCol', 6);
    const wrapperCol = _.get(formConfig, 'wrapperCol', 14);
    const status = this.state.status;
    const formData = this.state.formData;
    const isUpdate = this.props.isUpdate;
    const getNames = formConfig.getNames;
    const names = getNames ? getNames(formData, isUpdate) : formConfig.names;
    const items = formConfig.items;

    console.log('formData, names', formData, names);

    //// 1 => Render items.
    let fieldItems = names.map((fieldName) => {
      const itemCfg = items[fieldName];
      const fileCfg = itemCfg.file;
      const belowCfg = itemCfg.below;

      const createCfg = itemCfg.create;
      const updateCfg = itemCfg.update === undefined ? createCfg : itemCfg.update;
      const innerCfg = isUpdate ? updateCfg : createCfg;
      let innerAttrs = _.clone(_.get(innerCfg, 'attrs', {}));

      const validatorCfg = innerCfg.validator;
      const inputCfg = innerCfg.input;

      //// 1.1 => Build: <FormItem> attrs
      let itemAttrs = _.clone(_.get(itemCfg, 'attrs', {}));
      const itemLabelCol = _.get(itemAttrs, 'labelCol', labelCol);
      const itemWrapperCol = _.get(itemAttrs, 'wrapperCol', wrapperCol);
      const innerLabelCol = _.get(innerAttrs, 'labelCol', itemLabelCol);
      const innerWrapperCol = _.get(innerAttrs, 'wrapperCol', itemWrapperCol);
      ['labelCol', 'wrapperCol'].forEach(function(attrName) {
        delete itemAttrs[attrName];
        delete innerAttrs[attrName];
      });
      Object.assign(itemAttrs, {
        id: fieldName,
        labelCol: {span: itemLabelCol},
        wrapperCol: {span: itemWrapperCol},
      }, innerAttrs);
      const validateStatus = _.get(innerCfg, 'validateStatus', itemCfg.validateStatus);
      const help = _.get(innerCfg, 'help', itemCfg.help);
      if (validateStatus) {
        if (typeof validateStatus === "function") {
          itemAttrs['validateStatus'] = validateStatus(status, formData, isUpdate);
        } else {
          itemAttrs['validateStatus'] = getStatusClasses(status[fieldName], formData[fieldName]);
        }
      }
      if (help) {
        if (typeof help === "function") {
          itemAttrs['help'] = help(status, isUpdate);
        } else {
          itemAttrs['help'] = getStatusHelp(status[fieldName]);
        }
      }

      let itemChildren = [];
      //// 1.2 => Children in <FormItem>
      const innerRender = innerCfg.render;
      /* console.log('inner render by innerRender:', fieldName, isUpdate, innerCfg); */
      if (innerRender) {
        itemChildren.push(innerRender.bind(this, formData, isUpdate).call());
      } else {
        const inputRender = inputCfg.render;
        let inputItem = undefined;
        if (inputRender) {
          inputItem = inputRender.bind(this, formData, isUpdate).call();
        } else {
          let inputItemExtras = {
            fieldName: fieldName,
            formData: formData,
            fileCfg: fileCfg,
            handleFileChanged: this.handleFileChanged,
          };
          if (!validatorCfg) {
            inputItemExtras.onChange = this.setField.bind(this, fieldName);
          }
          inputItem = renderInputItem(innerCfg.input, formData[fieldName], inputItemExtras);
        }

        /// Add: <Validator(InputItem)> or <InputItem>
        if (validatorCfg) {
          const rules = validatorCfg.rules;
          const trigger = _.get(validatorCfg, 'trigger', 'onBlur');
          const validatorItem = ValidatorClass(
            {rules: rules, trigger: trigger}, inputItem);
          itemChildren.push(validatorItem);
        } else {
          itemChildren.push(inputItem);
        }

        /// <InnerItem> below part.
        const innerBelowCfg = innerCfg.below;
        if (innerBelowCfg) {
          const innerBelowItem = innerBelowCfg.render.bind(this, formData, isUpdate).call();
          itemChildren.push(innerBelowItem);
        }

      } // END: <FormItem> main part.

      /// 1.3 => <FormItem> below part.
      if (belowCfg) {
        const belowItem = belowCfg.render.bind(this, formData, isUpdate).call();
        itemChildren.push(belowItem);
      }

      return FormItemClass(itemAttrs, ...itemChildren);
    });

    //// 2 => Render footer: (submit, reset)
    const submitLabel = _.get(formConfig, 'submitLabel', '提交');
    let footerInputs = [div(
      {style: {display: 'inline-block'}},
      InputClass(
        {className:"ant-btn ant-btn-primary",
         key: 'submit', name: 'submit', type: 'submit', value: submitLabel,
         onClick: this.handleSubmit}
    ))];
    if (!isUpdate) {
      footerInputs.push(div(
        {style: {display: 'inline-block'}},
        InputClass(
          {className: 'ant-btn ant-btn-ghost', style: {marginLeft: '4px'},
           key: 'reset', name: 'reset', type:'reset', value: '重置',
           onClick: this.resetForm}
      )));
    }
    const footerItem = FormItemClass(
      {wrapperCol: {offset: labelCol, span: wrapperCol}},
       ...footerInputs
    );
    fieldItems.push(footerItem);

    return FormClass(
      formConfig.attrs,
      ValidationClass(
        {ref: 'validation', onValidate: this.handleValidate},
        ...fieldItems
      )
    );
  },
};


export const BaseForm = React.createClass({
  displayName: 'BaseForm',
  mixins: [Validation.FieldMixin, FormMixin],

  /* Require props: [formConfig, object, isUpdate] */

  getInitialState() {
    console.log('BaseForm.props', this.props);
    let state = this.getBaseState();
    console.log('BaseForm.BaseState', state);
    return state;
  },

  componentWillReceiveProps(newProps) {
    if (_.isEqual(newProps, this.props)) {
      console.log('Form (config,object) unchanged');
      return;
    } else {
      console.log('Form (config,object) has changed');
    }

    let newState = this.updateFormDataFromProps(newProps);
    Object.assign(newState, {formConfig: newProps.formConfig});
    console.log('componentWillReceiveProps:', newState);
    this.setState(newState, () => {
      this.refs.validation.validate(function(valid) {
        if (!valid) {
          console.log('Error in update form');
          return;
        }
      });
    });
  },

  handleUpdate(formData, callback) {
    console.log('Update');
    if (this.props.handleUpdate) {
      this.props.handleUpdate(formData, callback);
    }
  },

  handleCreate(formData, callback) {
    console.log('Create');
    if (this.props.handleCreate) {
      this.props.handleCreate(formData, callback);
    }
  },

  render() {
    const form = this.renderForm();
    console.log('BaseForm.form:', form);
    return form;
  }
});

////////////////////////////////////////////////////////////
////  Search Form
////////////////////////////////////////////////////////////
const SearchFormConfig = {
  names: [
    [String, String, String],
    [String, String, String],
    ["..."],
  ],
  items: {
    name: {
      attrs: undefined || {
        label: undefined || String,
        style: undefined || Object,
        labelCol: undefined || Integer,
        wrapperCol: undefined || Integer,
        /// Only you want then apply to both update and create
        hasFeedback: undefined || Boolean,
      },
      validateStatus: undefined || Boolean || Function, // validateStatus(status, formData)
      help: undefined || Boolean || Function, // help(status)
      validator: undefined || {
        rules: Array,
        trigger: undefined || String,
      },
      input: undefined || {
        attrs: {
          size: undefined || String,
          style: undefined || Object,
          placeholder: undefined || String,
        },
        typeClass: undefined || Object, // Default: InputClass || SelectClass
        optionClass: undefined || Object, // Default: OptionClass
        options: undefined || Array, // For: Select, Radio
        ////////////////////
        render: undefined || Function, // render(formData)
      },
      render: undefined || Function, // render(formData)
      below: undefined || {
        render: Function, // render(formData)
      },
    }
  }
};

export const SearchForm = React.createClass({

  /// Props:
  ///   * visible: 是否显示该表单(监控修改)
  ///   * formStyle: 应用到 <Form> 上的样式
  ///   * formConfig: 表单的定义
  ///   * defaults: 默认值
  ///   * onSubmit: 监听, 当点击搜索时提交当前 formData 中的值

  displayName: 'SearchForm',
  mixins: [Validation.FieldMixin],

  getInitialState() {
    let formData = {};
    let status = {};
    const formConfig = this.props.formConfig;
    const defaults = _.get(this.props, 'defaults', {});
    // 是一个二维数组
    formConfig.names.forEach(function(rowNames) {
      rowNames.forEach(function(name) {
        formData[name] = _.get(defaults, name);
        status[name] = {};
      });
    });

    const visible = _.get(this.props, 'visible', true);
    return {
      visible: visible,
      status: status,
      formData: formData,
    }
  },

  componentWillReceiveProps(newProps) {
    this.setState({visible: newProps.visible});
  },

  renderSearchFormItem(fieldName, itemCfg, status, formData) {
    const labelCol = 10;
    const wrapperCol = 14;
    const belowCfg = itemCfg.below;

    let innerAttrs = _.clone(_.get(itemCfg, 'attrs', {}));

    const validatorCfg = itemCfg.validator;
    const inputCfg = itemCfg.input;

    //// 1.1 => Build: <FormItem> attrs
    let itemAttrs = _.clone(_.get(itemCfg, 'attrs', {}));
    const itemLabelCol = _.get(itemAttrs, 'labelCol', labelCol);
    const itemWrapperCol = _.get(itemAttrs, 'wrapperCol', wrapperCol);
    const innerLabelCol = _.get(innerAttrs, 'labelCol', itemLabelCol);
    const innerWrapperCol = _.get(innerAttrs, 'wrapperCol', itemWrapperCol);
    ['labelCol', 'wrapperCol'].forEach(function(attrName) {
      delete itemAttrs[attrName];
      delete innerAttrs[attrName];
    });
    Object.assign(itemAttrs, {
      id: fieldName,
      labelCol: {span: itemLabelCol},
      wrapperCol: {span: itemWrapperCol},
    }, innerAttrs);
    const validateStatus = _.get(itemCfg, 'validateStatus', itemCfg.validateStatus);
    const help = _.get(itemCfg, 'help', itemCfg.help);
    if (validateStatus) {
      if (typeof validateStatus === "function") {
        itemAttrs['validateStatus'] = validateStatus(status, formData);
      } else {
        itemAttrs['validateStatus'] = getStatusClasses(status[fieldName], formData[fieldName]);
      }
    }
    if (help) {
      if (typeof help === "function") {
        itemAttrs['help'] = help(status);
      } else {
        itemAttrs['help'] = getStatusHelp(status[fieldName]);
      }
    }

    let itemChildren = [];
    //// 1.2 => Children in <FormItem>
    const innerRender = itemCfg.render;
    /* console.log('inner render by innerRender:', fieldName, itemCfg); */
    if (innerRender) {
      itemChildren.push(innerRender.bind(this, formData).call());
    } else {
      const inputRender = inputCfg.render;
      let inputItem = undefined;
      if (inputRender) {
        inputItem = inputRender.bind(this, formData).call();
      } else {
        let inputItemExtras = {
          fieldName: fieldName,
          formData: formData,
        };
        if (!validatorCfg) {
          inputItemExtras.onChange = this.setField.bind(this, fieldName);
        }
        inputItem = renderInputItem(itemCfg.input, formData[fieldName], inputItemExtras);
      }

      /// Add: <Validator(InputItem)> or <InputItem>
      if (validatorCfg) {
        const rules = validatorCfg.rules;
        const trigger = _.get(validatorCfg, 'trigger', 'onBlur');
        const validatorItem = ValidatorClass(
          {rules: rules, trigger: trigger}, inputItem);
        itemChildren.push(validatorItem);
      } else {
        itemChildren.push(inputItem);
      }

      /// <InnerItem> below part.
      const innerBelowCfg = itemCfg.below;
      if (innerBelowCfg) {
        const innerBelowItem = innerBelowCfg.render.bind(this, formData).call();
        itemChildren.push(innerBelowItem);
      }
    } // END: <FormItem> main part.

    /// 1.3 => <FormItem> below part.
    if (belowCfg) {
      const belowItem = belowCfg.render.bind(this, formData).call();
      itemChildren.push(belowItem);
    }

    return FormItemClass(itemAttrs, ...itemChildren);
  },

  resetForm() {
    this.refs.validation.reset();
    let formData = this.state.formData;
    Object.keys(formData).forEach(function(name) {
      formData[name] = undefined;
    });
    this.setState({formData});
  },

  submitForm(e) {
    e.preventDefault();
    const onSubmit = this.props.onSubmit;
    const operations = {};
    const formData = this.state.formData;
    Object.keys(formData).forEach((name) => {
      operations[name] = _.get(this.props.formConfig.items[name], 'operation', '==');
    });
    if (onSubmit) {
      onSubmit(formData, operations);
    }
  },

  render() {
    const type = _.get(this.props, 'type', ['top', 'right']);
    const formStyle = _.get(this.props, 'formStyle', {marginTop: '8px'});
    const formConfig = this.props.formConfig;
    const status = this.state.status;
    const formData = this.state.formData;

    return <QueueAnim type={type}
                      ease={['easeOutQuart', 'easeInOutQuart']}>
      { this.state.visible ? [
          <Form key="form" horizontal
                style={formStyle}
                onSubmit={this.submitForm}
                className="advanced-search-form">
            <Validation ref="validation" onValidate={this.handleValidate}>
              { formConfig.names.map((rowNames) => {
                  return (
                    <Row key={String(rowNames)}>
                      { rowNames.map((fieldName) => {
                          const itemCfg = formConfig.items[fieldName];
                          const colSpan = _.get(itemCfg, 'colSpan', 8);
                          return (
                            <Col span={String(colSpan)} key={fieldName}>
                              {this.renderSearchFormItem(fieldName, itemCfg, status, formData)}
                            </Col>
                          );
                       })}
                    </Row>);
                }) }
                    <Row>
                      <Col span="8" offset="16" style={{ textAlign: 'right' }}>
                        <Button onClick={this.submitForm} type="primary">搜索</Button>
                        <Button onClick={this.resetForm} type="ghost">清除条件</Button>
                      </Col>
                    </Row>
            </Validation>
          </Form>
        ] : null
      }
    </QueueAnim>;
  }
})
