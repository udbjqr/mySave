import React from 'react'
import {Icon,Menu,Button} from 'antd'
const SubMenu = Menu.SubMenu;

export default React.createClass({
    render(){
        return (
            <div style={{width:"1280px",margin:"0 auto"}}>
                <div className="header-box row marginNone">
                    <div className="col-xs-12 col-sm-12 col-lg-6 h60"></div>
                    <div className="col-xs-12 col-sm-12 col-lg-6 h60">
                        <div className="fr">
                            <div className="nav-list">
                                <i className="icon-mail"></i>
                            </div>
                            <div className="nav-list">
                                <i className="icon-book"></i>
                            </div>
                            <div className="nav-list">
                                <i className="icon-setting"></i>
                            </div>
                            <div className="nav-list">
                                <i className="icon-search"></i>
                            </div>
                        </div>
                    </div>
                    <div className="relative menu-top">
                        <div className="menu-box">
                            <div className="user-box">
                                <div className="user-head">
                                    <img />
                                </div>
                                <p className="user-name">admin</p>
                                <Button style={{backgroundColor:"#f36f48",borderColor:"#f36f48",display:"block",margin:"15px auto 0"}} icon="plus" type="primary">发布事项</Button>
                            </div>
                            <Sider />
                        </div>
                    </div>
                </div>
                <div className="middle-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
});



const Sider = React.createClass({
    getInitialState() {
        return {
            current: '1',
            openKeys: [],
        };
    },
    handleClick(e) {
        console.log('Clicked: ', e);
        this.setState({ current: e.key });
    },
    onOpenChange(openKeys) {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }
        this.setState({ openKeys: nextOpenKeys });
    },
    getAncestorKeys(key) {
        const map = {
            sub3: ['sub2'],
        };
        return map[key] || [];
    },
    render() {
        return (
            <Menu
                mode="inline"
                openKeys={this.state.openKeys}
                selectedKeys={[this.state.current]}
                style={{ width: 240 }}
                onOpenChange={this.onOpenChange}
                onClick={this.handleClick}
            >
                <SubMenu key="sub1" title={<span><Icon type="home" /><span>工作台</span></span>}>
                    <Menu.Item key="1"><a href="#functionManagement">功能管理</a></Menu.Item>
                    <Menu.Item key="2"><a href="#processPage">流程管理</a></Menu.Item>
                    <Menu.Item key="3"><a href="#processDeployment">流程部署</a></Menu.Item>
                    <Menu.Item key="4"><a href="#dataDictionary">数据字典</a></Menu.Item>
                    <Menu.Item key="5"><a href="#todo">待办事项</a></Menu.Item>
                    <Menu.Item key="6"><a href="#personnelManagement">人员管理</a></Menu.Item>
                    <Menu.Item key="7"><a href="#taskManagement">任务管理</a></Menu.Item>
                    <Menu.Item key="8"><a href="#departmentManagement">部门管理</a></Menu.Item>
                    <Menu.Item key="9"><a href="#roleManagement">角色管理</a></Menu.Item>                    
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>流程中心</span></span>}>

                </SubMenu>
                <SubMenu key="sub4" title={<span><Icon type="switcher" /><span>文档中心</span></span>}>

                </SubMenu>
                <SubMenu key="sub5" title={<span><Icon type="exception" /><span>新闻公告</span></span>}>

                </SubMenu>
                <SubMenu key="sub6" title={<span><Icon type="setting" /><span>系统设置</span></span>}>

                </SubMenu>
                <SubMenu key="sub7" title={<span><Icon type="solution" /><span>通讯录</span></span>}>

                </SubMenu>
            </Menu>
        );
    },
});
