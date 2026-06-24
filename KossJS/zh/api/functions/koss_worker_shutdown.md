# koss_worker_shutdown 函数

**功能描述**：关闭全部 Worker 线程池并释放资源。  
**返回值**：***KossResult*** 结构体。

> [!WARNING]
> Worker 在 `stable=True`（默认）时被禁用。如需在生产环境中使用并行执行功能，请查看 [stable 模式替代方案](/zh/reference/stable-alternatives)。

## 函数签名

```c
KossResult koss_worker_shutdown(KossInstance* inst);
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| ***inst*** | ***KossInstance**** | JS 实例指针 |

## 说明

终止所有 Worker 线程，清空消息队列，释放线程池资源。调用后所有 Worker 不可再用。

应在销毁实例前或不再需要 Worker 时调用。

## 使用示例

### C

```c
KossInstance* inst = koss_create();
koss_create_worker_pool(inst, 4);

// 使用 Worker...
koss_worker_execute(inst, 0, "1 + 1");

// 关闭所有 Worker
koss_worker_shutdown(inst);

koss_destroy(inst);
```

### Python

```python
from kossjs_interface import KossJS

koss = KossJS()
koss.create_worker_pool(4)
koss.worker_execute(0, "1 + 1")
koss.worker_shutdown()
```
