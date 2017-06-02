package com.tk.object.importData;

import com.tk.common.util.ImageUtil;

public class TestImage2 {

	public static void main(String[] args) {
		test();

	}
	
	public static void test(){
		String savePath = "D:/456.jpg";
		/*String thumbFileName = new ImageUtil().thumbnailImage(savePath, 150, 100);
		String thumbFilePath = "upload/" + thumbFileName;
		System.out.println(thumbFilePath);*/
		
		String path = savePath.substring(0, savePath.lastIndexOf("/")+1);
		System.out.println(path);
		 
	}

}
