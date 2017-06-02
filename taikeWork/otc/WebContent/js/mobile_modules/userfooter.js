
var Userfooter = React.createClass({
  getInitialState: function () {
    return {
      currenturl: "0",

    };
  },
  componentDidMount: function () {


    var current = this.props.name;

    if (current == "index") {

      $(".icon-dynamic3").css("background-image", "url(../images/mobile/6user_8.png)")
      $(".icon-dynamic3").next().css("color", "#00B134");
    }
    if (current == "product") {

      $(".icon-dynamic2").css("background-image", "url(../images/mobile/2cp_.png)");
      $(".icon-dynamic2").next().css("color", "#00B134");
    }
    if (current == "client") {

      $(".icon-dynamic1").css("background-image", "url(../images/mobile/4kh_.png)")
      $(".icon-dynamic1").next().css("color", "#00B134");
    }

    $(".index-nav a").on("touchend", function () {

      window.location.href = $(this).attr("href");
    })

  },
  render: function () {



    return (
      <footer className="white index-nav">
        <ul className="wd-nav">
          <li className="client for_gaq">
            <a href={"client.html"}>

              <p className="footer-action-icon icon-dynamic1"></p>
              <h2>客户</h2>
            </a>
          </li>
          <li className="product for_gaq">
            <a href={"product.html"}>
              <p className="footer-action-icon icon-dynamic2"></p>
              <h2>产品</h2>
            </a>
          </li>
          <li className="myprofild for_gaq">
            <a href={"index.html"}>
              <p className="footer-action-icon icon-dynamic3"></p>
              <h2>我的</h2>
            </a>
          </li>
        </ul>
      </footer>
    )
  }
})

module.exports = Userfooter;