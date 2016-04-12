
import React from 'react';
import {
  /* 通用 */
  Col, Row, message, Button,
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

import { getStatusClasses, getStatusHelp } from 'common/utils';
import * as _ from 'lodash';

/* antd.Form */
export const FormClass = React.createFactory(Form);
export const FormItemClass = React.createFactory(Form.Item);

export const InputClass = React.createFactory(Input);

export const InputNumberClass = React.createFactory(InputNumber);

export const CheckboxClass = React.createFactory(Checkbox);

export const RadioClass = React.createFactory(Radio);
export const RadioButtonClass = React.createFactory(Radio.Button);
export const RadioGroupClass = React.createFactory(Radio.Group);

export const CascaderClass = React.createFactory(Cascader);

export const TransferClass = React.createFactory(Transfer);

export const SelectClass = React.createFactory(Select);
export const OptionClass = React.createFactory(Select.Option);

export const DatePickerClass = React.createFactory(DatePicker);

/* antd.Common */
export const ButtonClass = React.createFactory(Button);


export const div = React.createFactory('div');
export const span = React.createFactory('span');
export const img = React.createFactory('img');
export const a = React.createFactory('a');
