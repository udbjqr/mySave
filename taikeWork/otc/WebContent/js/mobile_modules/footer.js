var Userfooter = React.createClass({

 getInitialState: function () {
        return {
            custom_id:geturl('custom_id'), //custom_id
            plan_id:geturl('plan_id'),   //plan_id
        };
        
   },
    componentDidMount: function () {
   },




    render: function () {
        var visitsNumber=this.state.visitsNumber==0? "":"<em>"+this.state.visitsNumber+"</em>";
        return (
            <footer className="white index-nav">
                <ul className="wd-nav">
                    <li className="client for_gaq">
                        <a href={"signin.html?custom_id="+this.state.custom_id+"&plan_id="+this.state.plan_id}>
                            <p className="footer-action-icon icon-dynamic4"></p>
                            <h2>签到{this.props.name}</h2>
                        </a>
                    </li>
                    <li className="product for_gaq">
                        <a href={"testproducts.html?custom_id="+this.state.custom_id+"&plan_id="+this.state.plan_id}>
                            <p className="footer-action-icon icon-dynamic5"></p>
                            <h2>考核盘点</h2>
                        </a>
                    </li>
                    <li className="myprofild for_gaq">
                        <a href={"historyrecord.html?custom_id="+this.state.custom_id+"&plan_id="+this.state.plan_id}>
                            <p className="footer-action-icon icon-dynamic6"></p>
                            <h2>来访纪录</h2>
                           {visitsNumber}
                        </a>
                    </li>

                </ul>
            </footer>
        )
    }
})

  

module.exports = Userfooter;