import React from 'react';
import { Menu } from 'antd';
import { History } from 'react-router';

const SubMenu = Menu.SubMenu;

const NavMenu = React.createClass({
  displayName: 'NavMenu',
  mixins: [History],
  getInitialState() {
    return {
      current: '1'
    }
  },
  handleMenuItemClick(to) {
    console.log('handleMenuItemClick', to);
    /* this.history.pushState(null, to); */
  },
  handleClick(e) {
    console.log('click ', e);
    this.setState({
      current: e.key
    });
    if (e.key && e.key.length > 0 && e.key[0] == '/') {
      this.history.pushState(null, e.key);
    }
  },


  render() {
    const sideMenu = this.props.sideMenu;
    let menu = (
      <Menu theme="dark"
            onClick={this.handleClick}
            style={{width:200}}
            defaultOpenKeys={sideMenu.defaultOpenKeys}
            selectedKeys={[this.state.current]}
            mode="inline">
        {
          sideMenu.subMenus.map(function(subMenu) {
            const subMenuTitle = (
              <span>
                <i className={subMenu.title.iconClass}></i>
                <span> {subMenu.title.label}</span>
              </span>
            );
            return (
              <SubMenu key={subMenu.key} title={subMenuTitle}>
                {
                subMenu.menus.map(function(menu){
                  return <Menu.Item key={menu.key}>{menu.label}</Menu.Item>;
                })
              }
              </SubMenu>
            );
          })
        }
      </Menu>);

    return (
      <div className="nav-menu">
        <div className="nav-menu-inner">
          <div className="menu-items">
            {menu}
          </div>
        </div>
      </div>
    );
  }
});

export default NavMenu;
