import React from 'react'
import Spin from 'antd/lib/spin'                    /*antd 正在加载中*/
import Alert from 'antd/lib/alert'


export default React.createClass({
    getInitialState(){
        return {
            maxWidth:0
        }
    },
    componentDidMount(){
        var $this = this;
        var maxWidth =  $(this.refs.loading).parents(".car-content").width();
        this.setState({maxWidth:maxWidth});
        window.onresize = function(){
            var maxWidth =  $($this.refs.loading).parents(".car-content").width();
            $this.setState({maxWidth:maxWidth});
        }
    },
    render(){
        return(
        <div id="loading" className="none" ref="loading" style={{width:this.state.maxWidth,position:"fixed",top:"270px",zIndex:"999"}}>
            <Alert message="" type="success"
                description={(
                    <div style={{margin:"50px auto",display:"table"}}>
                        <Spin size="large" />
                        <Spin size="large" tip="Loading..."/>
                        <Spin size="large" />
                    </div>
                )}
                />
        </div>
        );
    }
});
