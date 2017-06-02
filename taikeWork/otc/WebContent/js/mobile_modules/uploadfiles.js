import '../../css/mobile/uploadfiles.css';

var Uploadfiles = React.createClass({
    getInitialState: function () {
        return {
            currenturl: "0",

        };
    },
    componentDidMount: function () {

    },/* 点击上传  */
    changePhoto: function () {
     //获取图片
        var preview, img_txt, file_head = document.getElementById("filephoto"), picture = file_head.value;
        var $inputImage = $('#filephoto');
        file_head.select();

        var preview_src;
        //获取图片url
        if (file_head.files && file_head.files[0]) {
            preview_src = window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1 ? window.webkitURL.createObjectURL(file_head.files[0]) : window.URL.createObjectURL(file_head.files[0]);
        } else {
            img_txt = document.selection.createRange().text;

            preview_src = img_txt;
            document.selection.empty()
        }
        
        //获取图片url结束

        //获取图片名
        var pos1 = picture.lastIndexOf("\\");

        var pos2 = picture.lastIndexOf(".");

        var pos = picture.substring(pos1 + 1, pos2);
        var photoname = picture.substring(pos1 + 1, picture.length);
        //$("#preview").attr("data-name", photoname);
        //获取图片名结束
         this.props.even(this.props.typeName, preview_src);
    },
    render: function () {



        return (
            <div className="white margint_1r Upload_photo">
                <div className="Upload_files">

                </div>

                <div className="Upload_btns">
                    <input type="file" capture="camera" accept="image/*" id="filephoto" name="filephoto" onChange={this.changePhoto} />
                </div>
            </div>
        )
    }
})

module.exports = Uploadfiles;