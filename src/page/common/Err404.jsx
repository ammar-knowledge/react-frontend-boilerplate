import React from 'react';
import { Alert } from 'antd';
import Topbar from 'component/content/Topbar.jsx';
import PageIntro from 'component/content/PageIntro.jsx';

export default React.createClass({
  displayName: 'Err404',
  render() {
    return (
      <div className="wrapper">
        <Topbar breadcrumb={['错误']} />
        <Alert message="错误 404"
               description="页面无法找到!"
               type="error" />
      </div>
    )
  }
});
