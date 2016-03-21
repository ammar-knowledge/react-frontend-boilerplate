import React from 'react';
import Topbar from 'component/content/Topbar.jsx';
import PageIntro from 'component/content/PageIntro.jsx';

export default React.createClass({
  displayName: 'Blank',
  render() {
    return (
      <div className="wrapper">
        <Topbar breadcrumb={['主页']} />
        <PageIntro><strong>提示：</strong> 请点击左侧菜单栏来操作.</PageIntro>
      </div>
    )
  }
});
