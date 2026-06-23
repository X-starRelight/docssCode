# KossJS 使用示例

## 基础示例

### 1. 基本计算

```python
from kossjs_interface import KossJS

with KossJS() as koss:
    result = koss.eval("1 + 2")
    print(f"1 + 2 = {result}")  # 输出: 3
```

### 2. 函数定义

```python
from kossjs_interface import KossJS

with KossJS() as koss:
    code = """
    const add = (a, b) => a + b;
    add(5, 10);
    """
    result = koss.eval(code)
    print(f"Result: {result}")  # 输出: 15
```

### 3. 异步 Fetch

```python
from kossjs_interface import KossJS

with KossJS() as koss:
    result = koss.run_async("""
    (async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
      const data = await res.json();
      return data.title;
    })();
    """, timeout_ms=10000)
    print(result)
```

### 4. 设置全局变量

```python
from kossjs_interface import KossJS

with KossJS() as koss:
    koss.set_global("APPNAME", "MyApp")
    koss.set_global("VERSION", 1.0)
    
    result = koss.eval("APPNAME + ' v' + VERSION")
    print(f"App info: {result}")  # 输出: MyApp v1
```

---

## 高级示例

### 5. 沙箱模式（能力控制）

```python
from kossjs_interface import KossJS

# 纯计算沙箱 — 无 FS / 网络 / 加密
with KossJS(capabilities=KossJS.KOSS_CAP_SANDBOX) as koss:
    result = koss.eval("1 + 2 * 3")
    print(result)  # 输出: 7

# 只允许网络 + 加密
with KossJS(capabilities=KossJS.KOSS_CAP_NET | KossJS.KOSS_CAP_CRYPTO) as koss:
    result = koss.run_async("""
    (async () => {
        const r = await fetch("https://api.github.com/users/github");
        const d = await r.json();
        return d.login;
    })();
    """)
    print(result)
```

### 6. Worker 线程池

```python
from kossjs_interface import KossJS

koss = KossJS()

# 创建 2 个 Worker
koss.create_worker_pool(2)

# 在 Worker 0 上执行计算
koss.worker_execute(0, "let s=0; for(let i=0;i<1000;i++) s+=i; s;")

# 获取结果
msg = koss.worker_try_recv()
print(f"Worker result: {msg}")

koss.worker_shutdown()
koss.destroy()
```

### 7. 注册原生类

```python
from kossjs_interface import KossJS

def greet(name="World"):
    return f"Hello, {name}!"

koss = KossJS()
koss.register_class("Greeter", {"greet": greet})

result = koss.eval("new Greeter().greet('KossJS')")
print(result)  # 输出: Hello, KossJS!
koss.destroy()
```

---

更多示例请查看各语言接口文档。