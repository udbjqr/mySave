package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;

/**
 * PPt播放工厂对象
 */
public class DocumentPlayFactory extends AbstractPersistenceFactory<DocumentPlay>{
	private static DocumentPlayFactory instance = new DocumentPlayFactory();

	public static DocumentPlayFactory getInstance(){
		return instance;
	}

	private DocumentPlayFactory(){
		this.tableName = "documents_play";
		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		sequenceField.setSerial("");
		
		addField("url", 2000, String.class, null, true, false);
		addField("document_name", 2000, String.class, null, true, false);
		addField("upload_employee_id", 10, Integer.class, null, true, false);
		addField("download_number", 10, Integer.class, null, true, false);
		addField("document_size", 20, String.class, null, true, false);
		addField("update_time", 20, Date.class, "getdate()", true, false);
		addField("tumbnails_url", 2000, String.class, null, true, false);
		addField("flag", 10, Integer.class, null, false, false);
		addField("category", 2000, String.class, null, true, false);
		addField("remark",2000,String.class,null,false,false);

		init();
	}

	@Override
	protected DocumentPlay createObject(User user) {
		return new DocumentPlay(this);
	}
}
