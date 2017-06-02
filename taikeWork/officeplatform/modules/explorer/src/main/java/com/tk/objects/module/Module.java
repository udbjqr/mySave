package com.tk.objects.module;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.persistence.*;
import com.tk.common.sql.DBHelperFactory;
import com.tk.objects.handle.*;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class Module extends AbstractPersistence {
	private Handle[] handles;
	private List<JSONObject> formStructures;

	protected Module(AbstractPersistenceFactory factory, User user) {
		super(factory);
	}

	@Override
	public synchronized void set(Field field, Object value) throws WriteValueException {
		super.set(field, value);

		if (field.name.equals("id")) {
			refreshHandles();
		} else if (field.name.equals("form_structure")) {
			refreshFormStructure();
		}
	}

	private void refreshFormStructure() {
		Object o = get("form_structure");
		if (o != null && o instanceof JSONObject) {
			formStructures = (List<JSONObject>) ((JSONObject) o).get("formArr");
		}
	}

	/**
	 * 重新从数据库获得功能模块所指定的操作对象，并创建对象
	 */
	public synchronized void refreshHandles() {
		try {
			int id = get("id");
			int count = DBHelperFactory.getDBHelper().selectOneValues("select count(*)::int from link_module_handle where module_id =" + id);
			if (count > 0) {
				ResultSet set = DBHelperFactory.getDBHelper().select(
					"select * from link_module_handle where module_id =" + id);
				handles = new Handle[count];
				for (int i = 0; set.next(); i++) {
					handles[i] = HandleFactory.getHandle(set.getInt("handle_id"));
				}
			} else {
				logger.info("功能模块{}未指定操作。", id);
			}
		} catch (SQLException e) {
			logger.error("读取功能模块与操作对应关系出现异常：", e);
		}
	}

	public int getId() {
		Integer id = get("id");
		return id == null ? -1 : id;
	}

	public JSONObject getFormStructure() {
		return get("form_structure");
	}

	public void steam(FormStructureNameFunction function) {
		formStructures.forEach(object -> function.setDataByField((String) object.get("id")));
	}


	/**
	 * 得到一个模块的查询操作,一个模块应该有且只有一个查询操作.
	 *
	 * @return 查询操作对象, 未定义返回 null,多定义返回查找到的第一个
	 */
	public Handle getQuestHandle() {
		for (Handle handle : handles) {
			if (QuestHandle.class.isAssignableFrom(handle.getClass())) {
				return handle;
			}
		}
		return null;
	}
}
