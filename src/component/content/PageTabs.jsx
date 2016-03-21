import React from 'react';
import {Tabs, Validation, Select, Radio} from 'antd';

import Pane from './Pane.jsx';
import TestForm from './TestForm.jsx';

const TabPane = Tabs.TabPane;
function callback(key) {
  console.log(key);
}

const PageTabs = React.createClass({
  render() {
    return (
      <div className="page-tabs">
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="选项卡一" key="1">
            <Pane />
          </TabPane>
          <TabPane tab="选项卡二" key="2">
            <Pane />
          </TabPane>
          <TabPane tab="选项卡三" key="3">
            <div className="pane-wrapper pane-block">
              <TestForm />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
});

export default PageTabs;
