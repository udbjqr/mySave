package com.tk.object;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.junit.Test;

public class TestScript {
	@Test
	public void test(){
		/*ScriptEngineManager manager = new ScriptEngineManager();
		ScriptEngine engine = manager.getEngineByName("JavaScript");
		try {
			Object object = engine.eval(" 1.0 - 120");

			System.out.println(object.getClass().getName() + object);
		} catch (ScriptException e) {
			e.printStackTrace();
		}*/
	}

	@Test
	public void test2(){
		System.out.print(String.format("%02d",119));
	}


	private void handlePermissionJson(JSONArray array){
			for (Object o: array){
				if(o instanceof JSONObject) {
					JSONObject jsonObject = (JSONObject) o;
					if(jsonObject.containsKey("id")){
						Object o1 = jsonObject.get("id");

					}
					Object o3 = jsonObject.get("items");
					if(o3 != null && o3 instanceof JSONArray){
						handlePermissionJson((JSONArray) o3);
					}
				}else{
					//TODO not JSONOBject error
				}
			}
	}

}
