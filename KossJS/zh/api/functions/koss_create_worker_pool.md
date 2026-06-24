# koss_create_worker_pool 函数

**功能描述**：创建指定大小的 Worker 线程池。  
**返回值**：***KossResult*** 结构体。

> [!WARNING]
> Worker 在 `stable=True`（默认）时被禁用。如需在生产环境中使用并行执行功能，请查看 [stable 模式替代方案](/zh/reference/stable-alternatives)。

## 函数签名

```c
KossResult koss_create_worker_pool(KossInstance* inst, int32_t size);
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| ***inst*** | ***KossInstance**** | JS 实例指针 |
| ***size*** | ***int32_t*** | Worker 数量（1 ~ 64） |

## 说明

每个 Worker 运行在独立的 OS 线程上，拥有独立的 Boa Context。Worker 之间通过消息传递通信。最大支持 64 个 Worker。

## 使用示例

### C

```c
KossInstance* inst = koss_create();
koss_create_worker_pool(inst, 4);  // 创建 4 个 Worker

// 在 Worker 上执行代码
koss_worker_execute(inst, 0, "1 + 1");

koss_destroy(inst);
```

### Python

```python
from kossjs_interface import KossJS

koss = KossJS()
koss.create_worker_pool(4)

koss.worker_execute(0, "1 + 1")
```
