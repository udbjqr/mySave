<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>

<script type="text/javascript" src="http://code.jquery.com/jquery-1.4.1.min.js"></script>

<script type="text/javascript">
	
	function submitFile(){
		var baseCode = $('#file_base64').val();
		var url = "${pageContext.request.contextPath }"+$("#url").val();
		var name = $("#name").val();
		var value = $("#value").val();
		
		var data = {"paramMap":"{'controlType':'add','documentType':1,'file':'"+baseCode+"','fileName':'a.ppt'}"};
		
		$.ajax({
		  type: "POST",	
		  url: url,
		  dataType: "json",
		  data: data,
		  success: function(){}
		});
	}
	
	
	

	$(document).ready(function(){
		$("#file").change(function(){
		    var v = $(this).val();
		    var reader = new FileReader();
		    reader.readAsDataURL(this.files[0]);
		    reader.onload = function(e){
		      console.log(e.target.result);
		      $('#file_base64').val(e.target.result);
		  }});
	});
	
</script>


</head>
<body>
	<form id="f1" action="fileUpload.do" method="post" enctype="multipart/form-data">
		文件：<input type="file" id="file" name="file" multiple="multiple" /><br/>
		<input type="submit"  value="提交"/>
	</form>
</body>
</html>