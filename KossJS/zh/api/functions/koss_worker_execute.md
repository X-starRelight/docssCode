# koss_worker_execute 函数

**功能描述**：在指定 Worker 线程上执行 JavaScript 代码。  
**返回值**：***KossResult*** 结构体，包含命令 ID（JSON 格式：`{"commandId": id}`）。

> [!WARNING]
> Worker 在 `stable=True`（默认）时被禁用。如需在生产环境中使用并行执行功能，请查看 [stable 模式替代方案](/zh/reference/stable-alternatives)。

## 函数签名

```c
KossResult koss_worker_execute(KossInstance* inst, int32_t worker_id, const char* code);
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| ***inst*** | ***KossInstance**** | JS 实例指针 |
| ***worker_id*** | ***int32_t*** | Worker ID（从 0 开始） |
| ***code*** | ***const char**** | JavaScript 代码字符串 |

## 说明

向 Worker 提交一段代码执行。Worker 在独立的线程和 Boa Context 中执行。执行结果通过 `koss_worker_try_recv` 获取。

## 使用示例

### C

```c
KossInstance* inst = koss_create();
koss_create_worker_pool(inst, 2);

// 提交执行任务
koss_worker_execute(inst, 0, "let sum = 0; for(let i=0;i<1000;i++) sum += i; sum;");

// 稍后获取结果
KossResult msg = koss_worker_try_recv(inst);
if (msg.value) {
    printf("Worker result: %s\n", msg.value);
    koss_free_result(msg);
}

koss_destroy(inst);
```

### Python

```python
from kossjs_interface import KossJS

koss = KossJS()
koss.create_worker_pool(2)

koss.worker_execute(0, "let sum=0; for(let i=0;i<1000;i++) sum+=i; sum;")

msg = koss.worker_try_recv()
if msg:
    print(f"Worker result: {msg}")
```
