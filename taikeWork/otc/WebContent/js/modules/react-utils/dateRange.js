import React from 'react'
import DatePicker from 'antd/lib/date-picker';      /*antd 日期组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/


/*时间范围组件*/
export default React.createClass({
    getInitialState() {
        return {
            startValue: null,
            endValue: null,
            endOpen: false
        };
    },
    disabledStartDate(startValue) {
        if (!startValue || !this.state.endValue) {
            return false;
        }
        return startValue.getTime() >= this.state.endValue.getTime();
    },
    disabledEndDate(endValue) {
        if (!endValue || !this.state.startValue) {
            return false;
        }
        return endValue.getTime() <= this.state.startValue.getTime();
    },
    onChange(field, value) {
        this.setState({
            [field]: value,
        });
    },
    onStartChange(value) {
        this.onChange('startValue', value);
    },
    onEndChange(value) {
        this.onChange('endValue', value);
    },
    handleStartToggle({ open }) {
        if (!open) {
            this.setState({ endOpen: true });
        }
    },
    handleEndToggle({ open }) {
        this.setState({ endOpen: open });
    },/*格式转换*/
    formatDate:function (date) {
        if(date !== null){
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return year + "-" +(month > 9 ? (month + "") : ("0" + month))  + "-" + (day > 9 ? (day + "") : ("0" + day));
        }else{
            message.warning('请先填写日期范围！');
            return "";
        }
    },
    searchTime:function () {
        var sd = this.formatDate(this.state.startValue) ;
        var ed = this.formatDate(this.state.endValue) ;
        this.props.searchTime(sd,ed);
    },
    render() {
        return (
            <div className="inlineBlock">
                <DatePicker
                    disabledDate={this.disabledStartDate}
                    value={this.state.startValue}
                    placeholder="开始日期"
                    onChange={this.onStartChange}
                    toggleOpen={this.handleStartToggle}
                />
                <span> ~ </span>
                <DatePicker
                    disabledDate={this.disabledEndDate}
                    value={this.state.endValue}
                    placeholder="结束日期"
                    onChange={this.onEndChange}
                    open={this.state.endOpen}
                    toggleOpen={this.handleEndToggle}
                />
                <button type="button" className="btn btn-search" onClick={this.searchTime}>搜索</button>
            </div>
        );
    },
});
