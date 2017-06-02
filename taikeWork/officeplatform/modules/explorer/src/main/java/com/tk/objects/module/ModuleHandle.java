package com.tk.objects.module;

import com.tk.objects.handle.Handle;

/**
 * 保存一个功能模块与操作的对应关系.
 */
public class ModuleHandle {
	private final Module module;
	private final Handle handle;

	public ModuleHandle(Module module, Handle handle) {
		this.module = module;
		this.handle = handle;
	}

	public Module getModule() {
		return module;
	}

	public Handle getHandle() {
		return handle;
	}
}
