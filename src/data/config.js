
export const tokenKey = 'X-Token';
export const siteTitle = '...';
export const docTitle = '... - [呼呼科技]';


export const provinces = [
  ['BJ', '北京市'],
  ['SH', '上海市'],
  ['TJ', '天津市'],
  ['CQ', '重庆市'],
  ['HL', '黑龙江省'],
  ['HE', '河北省'],
  ['SX', '山西省'],
  ['LN', '辽宁省'],
  ['JL', '吉林省'],
  ['JS', '江苏省'],
  ['ZJ', '浙江省'],
  ['AH', '安徽省'],
  ['FJ', '福建省'],
  ['JX', '江西省'],
  ['SD', '山东省'],
  ['HA', '河南省'],
  ['HB', '湖北省'],
  ['HN', '湖南省'],
  ['GD', '广东省'],
  ['HI', '海南省'],
  ['SC', '四川省'],
  ['GZ', '贵州省'],
  ['YN', '云南省'],
  ['SN', '陕西省'],
  ['GS', '甘肃省'],
  ['QH', '青海省'],
  ['NM', '内蒙古'],
  ['XZ', '西藏'],
  ['GX', '广西'],
  ['NX', '宁夏'],
  ['XJ', '新疆'],
  ['HK', '香港'],
  ['MO', '澳门'],
  ['TW', '台湾省'],
];

export let provinceMap = {};

provinces.forEach(function(item) {
  provinceMap[item[0]] = item[1];
});


export const resourceMapping = [
  /* common */
  ['Role', '/roles/'],          // 角色
  ['User', '/users/'],          // 用户
  /* admin: 系统管理员 */
];


export const sideMenus = {
  /* 广告主菜单 */
  'user':  {
    defaultOpenKeys: ['sub1'],
    subMenus: [
      {
        key: "sub1",
        title: {iconClass: "fa fa-fw fa-user", label: "账户管理"},
        menus: [
          {key: "/user/change_password", label: "修改密码"},
        ]
      },
    ]
  },
};
