
import React, { Component } from 'react';

import {
  /* 通用 */
  Col, Row, message, Button, Tabs, Icon, Card, Modal,
} from 'antd';

import PageIntro from 'component/content/PageIntro.jsx';
import Topbar from 'component/content/Topbar.jsx';

import {
  DemoInlineForm,
  DemoValidateOtherForm,
  DemoImageForm,
  DemoMultipleFieldForm,
  DemoAdvancedForm,
  DemoValidateOtherFormModal,
  CreateUserFormModal,
  UpdateUserFormModal,
} from 'page/demo/RawForms.jsx';

import {
} from 'page/demo/FactoryForms.jsx';


const TabPane = Tabs.TabPane;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

class TestForms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawModalVisible: false,
      rawCreateUserVisible: false,
      rawUpdateUserVisible: false,
      factoryModalVisible: false,
      defineModalVisible: false
    };
  }

  render() {
    const wrapperStyle = {
      backgroundColor: 'transparent',
    };
    const cardStyle = {
      marginBottom: '40px',
    };

    const onCancelRaw = (e) => {
      console.log('Cancel raw modal clicked');
      this.setState({rawModalVisible: false});
    };
    const onSubmitRaw = (e, form) => {
      console.log('onSubmitRaw:', form);
      console.log('Values:', form.getFieldsValue());
      message.success('提交成功!', 2);
      this.setState({rawModalVisible: false});
    };

    return (
      <div className="wrapper">
        <Topbar breadcrumb={['帐户管理', '修改密码']} />
        <PageIntro>
          这里是表单示例页面
        </PageIntro>
        <Tabs type="card">
          <TabPane tab="原生" key="raw">
            <DemoValidateOtherFormModal
                visible={this.state.rawModalVisible}
                onCancel={onCancelRaw}
                onSubmit={onSubmitRaw} />
            <div className="pane-wrapper" style={wrapperStyle}>
              <Card title="平行排列" style={cardStyle}>
                <DemoInlineForm />
              </Card>
              <Card title="校验其他组件" style={cardStyle}>
                <DemoValidateOtherForm />
              </Card>
              <Card title="含图片(文件)" style={cardStyle}>
                <DemoImageForm />
              </Card>
              {
                /*
                  <Card title="单行多字段" style={cardStyle}>
                    <DemoMultipleFieldForm />
                  </Card>
                */
              }
              <Card title="高级搜索" style={cardStyle}>
                <DemoAdvancedForm />
              </Card>
              <Card title="弹出框" style={cardStyle}>
                <CreateUserFormModal
                    title="添加用户"
                    visible={this.state.rawCreateUserVisible}
                    object={{blocked: '0', verified: '1'}}
                    onCancel={() => this.setState({ rawCreateUserVisible: false })} />
                <UpdateUserFormModal
                    title="修改用户"
                    visible={this.state.rawUpdateUserVisible}
                    object={{id: 222, ignore_field: 'IJK',
                             role_id: 1, login: 'xxyy', name: 'XXYY', email: 'xxyy@gmail.com', blocked: '0'}}
                    onCancel={() => this.setState({ rawUpdateUserVisible: false })}/>
                <Button className="list-btn" type="primary"
                        onClick={() => this.setState({rawModalVisible: true})}>编辑</Button>
                <Button className="list-btn" type="primary"
                        onClick={() => this.setState({rawCreateUserVisible: true})}>创建用户(继承方式)</Button>
                <Button className="list-btn" type="primary"
                        onClick={() => this.setState({rawUpdateUserVisible: true})}>编辑用户(继承方式)</Button>
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
