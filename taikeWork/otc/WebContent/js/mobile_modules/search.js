import React from 'react'
import {render} from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import SearchBar from 'antd-mobile/lib/search-bar'
import Video from '../../js/mobile_modules/Videosharemain.js'
import Filesearch from '../../js/mobile_modules/informationfilemain.js'
import Photo from '../../js/mobile_modules/Photosharemain.js'

import TestproductsSearch from '../../js/mobile_modules/testproductsmain.js'
var OpenID = "ojpX_jig-gyi3_Q9fHXQ4rdHniQs";
var currturl = window.location.href;  //获取当前url

//获取上一页


//获取上一页结束
var Search = React.createClass({
    getInitialState: function () {
        return {
            Y_login: true,  //是否登录
            value: '',
            referrer: document.referrer, //上一页
            Columns:geturl('Columns'),
            imgtype:geturl('imgtype'),
            custom_id:geturl('custom_id'),
            plan_id:geturl('plan_id'),
            searchval:"请输入搜索内容1"
        };
    },

    componentWillMount: function () {

    },
    componentDidMount: function () {
         var Columns=this.state.Columns;
      if(Columns=="Videoshare"){
       
         this.setState({ 
          referrer: topreurl("Videoshare.html"), //上一页 
          searchval:"请输入搜索的视频名"
          
        });  
       
       }
       if(Columns=="informationfile"){
        this.setState({ 
         referrer: topreurl("informationfile.html"), //上一页
          searchval:"请输入搜索的文件名"
        });  
       }
       if(Columns=="Photoshare"){
       
        this.setState({ 
          referrer: topreurl("Photoshare.html"), //上一页
          searchval:"请输入搜索的图片名"
        });  
        
       }
        
       if(Columns=="testproducts"){
        var parenturl="testproducts.html?custom_id="+this.state.custom_id+"&plan_id="+this.state.plan_id;
        this.setState({ 
           referrer: topreurl(parenturl), //上一页
          searchval:"请输入搜索的考核产品名"
        });  
       }
    },
    
  onChange: function(value) {
    this.setState({ value });
  },
  clear: function() {
    this.setState({ value: '' });
  },
  onSubmit:function() {
    var searchinfo;
     var searchname = this.state.value;
     var imgtype=this.state.imgtype;
    searchinfo = { 
    "searchname":searchname,
    "imgtype":imgtype 
    }

    PubSub.publish('changsearch', searchinfo);
  },
    render: function () {
       var showinfo;
      var Columns=this.state.Columns;
       if(Columns=="Videoshare"){
           
        showinfo=<Video/>;
       }
       if(Columns=="informationfile"){
        showinfo=<Filesearch />;
       }
       if(Columns=="Photoshare"){
        showinfo=<Photo/>;
       }
       
        if(Columns=="testproducts"){
        showinfo=<TestproductsSearch/>;

       }

        return (
            <div>
       
        <div className="profile white" id="pagenav">
        <span className="toleft"> <a href={this.state.referrer}></a></span>
        <div className="searchipt_cont">
         <SearchBar 
         className="searchipt white" 
        id="prct_search" 
        name="prct_search" 
        value={this.state.value}
        placeholder={this.state.searchval}
        onSubmit={this.onSubmit}
        onClear={(value) => console.log(value, 'onClear')}
        onFocus={() => console.log('onFocus')}
        onBlur={() => console.log('onBlur')}
        showCancelButton={false}
        onChange={this.onChange}
      />
        </div>
              
                </div>
           


       
               <div className="profile margint_1r" id="">
               
                     {showinfo}
                    
                </div>
               
            </div>

        );
    }
});

ReactDOM.render(
    <Search  />,
    document.getElementById('conter')
);




