package com.tk.object.importData;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;

public class TestImage {

	public void JpgTset() throws Exception{
		File _file = new File("/Order005-0001.jpg");                       //读入文件
		Image src = javax.imageio.ImageIO.read(_file);                     //构造Image对象
		int wideth=src.getWidth(null);                                     //得到源图宽
		int height=src.getHeight(null);                                    //得到源图长
		BufferedImage tag = new BufferedImage(wideth/2,height/2,BufferedImage.TYPE_INT_RGB);
		tag.getGraphics().drawImage(src,0,0,wideth/2,height/2,null);       //绘制缩小后的图
		FileOutputStream out=new FileOutputStream("newfile.jpg");          //输出到文件流
		/*JPEGImage encoder = JPEGCodec.createJPEGEncoder(out);      
		encoder.encode(tag);  */                                             //近JPEG编码
		//System.out.print(width+"*"+height);                             
		out.close();}

}
