package com.tk;

import org.junit.Test;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by yimin on 2017/1/20.
 */

//定义一个函数式接口
@FunctionalInterface
interface WorkerInterface {

	public void doSomeWork(int a, int b);

}


public class TestLambda {

	public static void execute(WorkerInterface worker) {
		for (int i = 0; i < 10; i++) {
			for (int j = 0; j < 10; j++) {
				worker.doSomeWork(i, j);
			}
		}
	}


	@Test
	public void test() {
		TestLambda.execute((a, b) -> {
			int c = a + b;
			System.out.println("a + b = " + c);
		});
		System.out.println("\n\n\n  TWO:");
		TestLambda.execute((a, b) -> {
			int c = a * b;
			System.out.println("a * b = " + c);
		});
	}

	@Test
	public  void testMap() {

		Map<Integer, String> HOSTING = new HashMap<>();
		HOSTING.put(1, "linode.com");
		HOSTING.put(2, "heroku.com");
		HOSTING.put(3, "digitalocean.com");
		HOSTING.put(4, "aws.amazon.com");

		String result = "";
		for (Map.Entry<Integer, String> entry : HOSTING.entrySet()) {
			if ("aws.amazon.com".equals(entry.getValue())) {
				result = entry.getValue();
			}
		}
		System.out.println("Before Java 8 : " + result);

		//Map -> Stream -> Filter -> String
		result = HOSTING.entrySet().stream()
						.filter((map) -> "aws.amazon.com".equals(map.getValue()))
						.map(map -> map.getValue())

			.collect(Collectors.joining());

		System.out.println("With Java 8 : " + result);
	}

	@Test
	public void testGeneric(){
		Integer i = testG();

	}

	private <T> T testG(){
		GenericType<Integer> t = new GenericType<>();
//		t.canGetTClassName();
		t.cannotGetTClassName();
		return null;
	}

	abstract class ImportantBase<T>{}
	class GenericType<T> extends ImportantBase<T>{
		private T t;
		private Type type;

		public void canGetTClassName()
		{
			Type t = getClass().getGenericSuperclass();
			Type[] params = ((ParameterizedType) t).getActualTypeArguments();
			Class<T> cls = (Class<T>) params[0];
			System.out.println(cls.getName());
		}

		public <T> void cannotGetTClassName()
		{
			Type t = GenericType.class.getGenericSuperclass();
			Type[] params = ((ParameterizedType) t).getActualTypeArguments();
			System.out.println(params);
			Class<T> cls = (Class<T>) params[0];
			System.out.println(cls.getName());
		}

	}
}
