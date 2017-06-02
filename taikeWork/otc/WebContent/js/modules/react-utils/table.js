/**
 * Created by Administrator on 2016/9/7.
 */
import React from 'react'

 //var valArr =new Array();
  var valArr =new Array();

//表格组件
export default React.createClass({

   // var valArr =isnull(this.props.valArr)==""?[]:this.props.checkedarr;
        getDefaultProps:function () {

            return {
                dataKey:[],
                checkarr:[],
            }
        },
         componentDidMount:function(){

       //console.log(this.props.valArr)
         },

         //全选
        allcheck:function (e) {

            isnull(this.props.allcheck)!=""?this.props.allcheck(e):"";
           /*
            if(e.target.checked == true){

                 $("#tyTable tr").each(function(){
                 $(this).find("td input").attr("data-checked","true")
                 $(this).find("td input").prop("checked",true);
                 var checkid= $(this).find("td input").attr("data-checkid");
                 if(isnull(checkid)!=""){
                  valArr.push(checkid);
                 }
                 })
                 this.tockecks(valArr.toString());
               // isnull(this.props.checkid)!=""?this.props.checkid():"";

            }else{
               $("#tyTable tr").each(function(){
                 $(this).find("td input").attr("data-checked","false")
                 $(this).find("td input").prop("checked",false);
                 })
                //$("#mem-table .i-xz").attr("checked",false);
                valArr = [];
                this.tockecks(valArr.toString());
            }
            */
        },/*  点击复选框  */
        handleChange:function(e){
        isnull(this.props.tocheck)!=""?this.props.tocheck(e):"";
         /*
         var Tthis=isnull(this.props.Tthis)!=""?this.props.Tthis:"";
         if(e.target.dataset.checked == "true"){
               e.currentTarget.setAttribute("checked",false);
               e.currentTarget.dataset.checked="false"
               var checkid=e.currentTarget.dataset.checkid;
                 //valArr.remove(1);
               removeByValue(valArr, checkid);
               this.tockecks(valArr.toString());
            }else{
                 e.currentTarget.setAttribute("checked",true);
                 e.currentTarget.dataset.checked="true"
                var checkid=e.currentTarget.dataset.checkid;
                if(isnull(checkid)!=""){
                  valArr.push(checkid);
                 }
                   this.tockecks(valArr.toString());
            }
        */
        },
        allclean:function(){
              var Tthis=isnull(this.props.Tthis)!=""?this.props.Tthis:"";
                $("#tyTable tr").each(function(){
                 $(this).find("td input").attr("data-checked","false")
                 $(this).find("td input").prop("checked",false);
                 })
                  $(".th-checkbox").prop("checked",false);

                //$("#mem-table .i-xz").attr("checked",false);
                valArr = [];

        },
        render:function(){
            var $this = this;
            //this.allclean();

            /*审核*/
            var flagTrue = (<span className="flagTrue">正常</span>);
            var flagFalse = (<span className="flagFlase">请假</span>);
            /*是否考核*/
            var isAssessTrue = (<span className="flagTrue">是</span>);
            var isAssessFalse = (<span className="flagFlase">否</span>);
            /*产品列表状态*/
            var statusTrue = (<span className="flagTrue">正常</span>);
            var statusFalse = (<span className="flagFlase">停用</span>);

            var titlestyle=isnull(this.props.titlestyle)==""?{}:this.props.titlestyle
            return (
                <div className="mem-table" id="mem-table">
                    <table className="table table-bordered text-center" id="tyTable">
                        <thead>
                        <tr>
                            {this.props.titleName.map(function(data,i){
                                if(data == "checkbox"){
                                    return  <th style={{"padding":0}} key={"th"+i}><input className="th-checkbox" type="checkbox" onChange={$this.allcheck}/></th>
                                }else{
                            return  <th key={"th"+i} style={titlestyle["styles"+(i+1)]}>{data}</th>
                                }
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.dataTable.map(function(data,index){
                            var $data = data;
                            var $index = index + 1;
                            var $visitState = (data.planStatus == 1 || data.planStatus == 3 || data.planStatus == 4) ? true :false;
                            var $leaveShow = (data.leaveShow == "正常") ? true : false;
                            var $marktype=""; // (data.mark_type == "正常") ? true : false;
                            if(isnull(data.mark_type)==""|| isnull(data.mark_type)== "正常"){
                              $marktype=true;
                            }else{
                                 $marktype=false;
                            }

                            var $strData = JSON.stringify(data);
                            var $disable = data.status == 0 ? true : false;
                            if($this.props.tableStyle == "control"){
                                return	<tr key={"td"+index}>
                                            {$this.props.dataKey.map(function (valueKey,i) {
                                                if(valueKey == 'index'){
                                                    return 	<td key={i}>{$index < 10 ? '0'+$index : $index}</td>
                                                }else if(valueKey == 'flag'){
                                                    return <td key={i}>{($data[valueKey] ==1 ? flagTrue :flagFalse )}</td>
                                                }else if (valueKey == 'isAssess') {
                                                    return <td key={i}>{($data[valueKey] ==1 ? isAssessTrue :isAssessFalse )}</td>
                                                }else if (valueKey == 'status') {
                                                    return <td key={i}>{($data[valueKey] ==1 ? statusTrue :statusFalse )}</td>
                                                }else if(typeof valueKey == 'string'){
                                                    //return 	<td key={i}>{$data[valueKey]}</td>
                                                      return 	<td key={i}>{multi(valueKey,$data)}</td>
                                                }else {/*如果是在td上有链接的话进这里*/
                                                    return 	<td key={i}><a href={"#"+valueKey.moneyUrl} className="billing">{$data[valueKey.keyName]}</a></td>
                                                }
                                            })}
                                            <td className="last-td">
                                                {$this.props.controlArr.map(function(conData){
                                                    if(conData.conId == 1){
                                                        return <div key="delete" className={"c-icon delete "+conData.conClass}  title="删除" onClick={conData.callback}><a href="javascript:void(0)"></a></div>
                                                    }else if(conData.conId == 2){
                                                        return <div key="edit" className={"c-icon edit "+conData.conClass} title="编辑" onClick={conData.callback} value={$strData}><a href={conData.conUrl ? ("#"+conData.conUrl) : 'javascript:void(0)'}></a></div>
                                                    }else if(conData.conId == 3){
                                                        return <div key="see" className={"c-icon see "+conData.conClass} title="查看" onClick={conData.callback} value={$strData} ><a href={"#"+conData.conUrl}></a></div>
                                                    }else if(conData.conId == 4){
                                                        return <div key="lock" className={"c-icon lock "+conData.conClass} title="清空" onClick={conData.callback}><a href="javascript:void(0)"></a></div>
                                                    }else if(conData.conId == 5){
                                                        return <div key="reset" className={"c-icon reset "+conData.conClass} title="重置" onClick={conData.callback} value={$strData} ><a href="javascript:void(0)"></a></div>
                                                    }
                                                })}
                                            </td>
                                        </tr>
                            }else if($this.props.tableStyle == "checkbox"){                                
                                var checkkey=isnull($this.props.checkkey)==""?$data["id"]:$data[$this.props.checkkey];
                                return	<tr key={"td"+index}>
                                            <td><input  className="th-checkbox i-xz" type="checkbox" onClick={$this.handleChange} data-checked="false" data-checkid={checkkey}/></td>
                                            {$this.props.dataKey.map(function (valueKey,i) {
                                                if(valueKey == 'index'){
                                                    return 	<td key={i}>{$index < 10 ? '0'+$index : $index}</td>
                                                }else if(valueKey == 'flag'){
                                                    return <td key={i}>{($data[valueKey] ==1 ? flagTrue :flagFalse )}</td>
                                                }else if (valueKey == 'isAssess') {
                                                    return <td key={i}>{($data[valueKey] ==1 ? isAssessTrue :isAssessFalse )}</td>
                                                }else if (valueKey == 'status') {
                                                    return <td key={i}>{($data[valueKey] ==1 ? statusTrue :statusFalse )}</td>
                                                }else if(typeof valueKey == 'string'){
                                                    //return 	<td key={i}>{$data[valueKey]}</td>
                                                     return 	<td key={i}>{multi(valueKey,$data)}</td>
                                                }else {/*如果是在td上有链接的话进这里*/
                                                    return 	<td key={i}><a href={"#"+valueKey.moneyUrl} className="billing">{$data[valueKey.keyName]}</a></td>
                                                }
                                            })}
                                        </tr>
                            }else if($this.props.tableStyle == "clean"){
                                return	<tr key={"td"+index}>
                                            {$this.props.dataKey.map(function (valueKey,i) {
                                                if(valueKey == 'index'){
                                                    return 	<td key={i}>{$index < 10 ? '0'+$index : $index}</td>
                                                }else if(valueKey == 'flag'){
                                                    return <td key={i}>{($data[valueKey] ==1 ? flagTrue :flagFalse )}</td>
                                                }else if (valueKey == 'isAssess') {
                                                    return <td key={i}>{($data[valueKey] ==1 ? isAssessTrue :isAssessFalse )}</td>
                                                }else if (valueKey == 'status') {
                                                    return <td key={i}>{($data[valueKey] ==1 ? statusTrue :statusFalse )}</td>
                                                }else if(valueKey == "leaveShow"){
                                                    return <td key={i}>{($data[valueKey] == "正常" ? flagTrue :flagFalse )}</td>
                                                }else if(typeof valueKey == 'string'){
                                                   // return 	<td key={i}>{$data[valueKey]+i}</td>
                                                   return 	<td key={i}>{multi(valueKey,$data)}</td>
                                                }else {/*如果是在td上有链接的话进这里*/
                                                    return 	<td key={i}><a href={"#"+valueKey.moneyUrl} className="billing">{$data[valueKey.keyName]}</a></td>
                                                }
                                            })}
                                        </tr>
                            }else{
                               var checkkey=isnull($this.props.checkkey)==""?$data["id"]:$data[$this.props.checkkey];
                                return	<tr key={"td"+index}>


                                            <td><input  className="th-checkbox i-xz" type="checkbox" onClick={$this.handleChange} data-checked="false" data-checkid={checkkey}/></td>

                                            {$this.props.dataKey.map(function (valueKey,i) {
                                                if(valueKey == 'index'){
                                                    return 	<td key={i}>{$index < 10 ? '0'+$index : $index}</td>
                                                }else if(valueKey == 'flag'){
                                                    return <td key={i}>{($data[valueKey] ==1 ? flagTrue :flagFalse )}</td>
                                                }else if (valueKey == 'isAssess') {
                                                    return <td key={i}>{($data[valueKey] ==1 ? isAssessTrue :isAssessFalse )}</td>
                                                }else if (valueKey == 'status') {
                                                    return <td key={i}>{($data[valueKey] ==1 ? statusTrue :statusFalse )}</td>
                                                }else if(valueKey == "leaveShow"){
                                                    return <td key={i}>{($data[valueKey] == "正常" ? flagTrue :flagFalse )}</td>
                                                }else if(typeof valueKey == 'string'){
                                                   // return 	<td key={i}>{$data[valueKey]}</td>
                                                     return 	<td key={i}>{multi(valueKey,$data)}</td>
                                                }else {/*如果是在td上有链接的话进这里*/
                                                    return 	<td key={i}><a href={"#"+valueKey.moneyUrl} className="billing">{$data[valueKey.keyName]}</a></td>
                                                }
                                            })}
                                            <td className="last-td">
                                                {$this.props.controlArr.map(function(conData){
                                                    if(conData.conId == 1){
                                                        if(!$visitState){
                                                            return <div key="delete" className={"c-icon delete "+conData.conClass}  title="删除" onClick={conData.callback} value={$strData} ><a href="javascript:void(0)"></a></div>
                                                        }
                                                    }else if(conData.conId == 2){
                                                        if(!$visitState){
                                                            return <div key="edit" className={"c-icon edit "+conData.conClass} title="编辑" onClick={conData.callback} value={$strData}><a href={conData.conUrl ? ("#"+conData.conUrl) : 'javascript:void(0)'}></a></div>
                                                        }
                                                    }else if(conData.conId == 3){
                                                        if($marktype){
                                                        return <div key="see" className={"c-icon see "+conData.conClass} title={conData.title?conData.title:"查看"} onClick={conData.callback} value={$strData} ><a href={conData.conUrl ? ("#"+conData.conUrl) : 'javascript:void(0)'}></a></div>
                                                        }
                                                }else if(conData.conId == 4){
                                                        return <div key="lock" className={"c-icon lock "+conData.conClass} title="清空" onClick={conData.callback} value={$strData} ><a href="javascript:void(0)"></a></div>
                                                    }else if(conData.conId == 5){
                                                        return <div key="reset" className={"c-icon reset "+conData.conClass} title="重置" onClick={conData.callback} value={$strData} ><a href="javascript:void(0)"></a></div>
                                                    }else if(conData.conId == 6){
                                                        if($leaveShow){
                                                            return <div key="edit" className={"c-icon edit "+conData.conClass} title="修改请假状态" onClick={conData.callback} value={$strData}><a href={conData.conUrl ? ("#"+conData.conUrl) : 'javascript:void(0)'}></a></div>
                                                        }
                                                    }else if(conData.conId == 7){
                                                        if($disable){
                                                            return <div key="disable" className={"c-icon enable "+conData.conClass} title="启用" onClick={conData.callback} value={$strData} ><a href={conData.conUrl ? ("#"+conData.conUrl) : 'javascript:void(0)'}></a></div>
                                                        }else{
                                                            return <div key="disable" className={"c-icon disable "+conData.conClass} title="禁用" onClick={conData.callback} value={$strData} ><a href={conData.conUrl ? ("#"+conData.conUrl) : 'javascript:void(0)'}></a></div>
                                                        }
                                                    }
                                                })}
                                            </td>
                                        </tr>
                            }
                        })}
                        </tbody>
                    </table>
                </div>
            );
        }
    });

/*   */
function multi(str,data){

   if(str.indexOf("/")=="-1"){ //单个
    return isnull(data[str])
   }
   if(str.indexOf("/")!="-1"){ //多个

    var strarr=str.split("/");


    var strs=""
    for(var j=0;j<=strarr.length-1;j++){

          if(j==strarr.length-1){
          strs+=data[strarr[j]]
          }else{
          strs+=data[strarr[j]]+"/";
          }
      }

      return strs;
   }
}

  /*
去除""或undefind null
*
*
*/

function isnull(str) {
    if (str == null || str == undefined || str == "undefined") {
        return "";
    }
    else {
        return str;
    }
}

/*  清除勾选  */
function allclean(){
    $("#tyTable tr").each(function(){
                 $(this).find("td input").attr("data-checked","false")
                 $(this).find("td input").prop("checked",false);
                 })
                //$("#mem-table .i-xz").attr("checked",false);
                valArr = [];
                this.props.checkid(valArr.toString());
}

/*  删除数组特定值  */
function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}
