package com.tk.objects;

import com.alibaba.fastjson.JSONObject;
import com.tk.objects.module.Module;
import com.tk.objects.module.ModuleFactory;
import org.junit.Test;

import java.util.Map;

public class ModuleTest
{

	@Test
	public void testStream(){
		String s = "{\"14_nianling\":\"v1\",\"14_mingzi\":\"v2\",\"14_shangchuan\":\"v3\",\"14_aihao\":\"v4\",\"14_aa\":\"v5\"}";

		Module module = ModuleFactory.getInstance().getObject("id", 14);

		JSONObject jsonData = JSONObject.parseObject(s);
		JSONObject data = new JSONObject();

		module.steam((id)->{
			data.put(id, jsonData.get(id));
		});

	  for(Map.Entry<String,Object> entry:data.entrySet()){
	  	System.out.println(entry.getKey() + "\t" + entry.getValue());
		}
	}
}
