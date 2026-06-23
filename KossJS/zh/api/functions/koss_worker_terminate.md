# koss_worker_terminate 函数

**功能描述**：终止指定的 Worker 线程。  
**返回值**：***KossResult*** 结构体。

## 函数签名

```c
KossResult koss_worker_terminate(KossInstance* inst, int32_t worker_id);
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| ***inst*** | ***KossInstance**** | JS 实例指针 |
| ***worker_id*** | ***int32_t*** | Worker ID（从 0 开始） |

## 说明

立即终止指定 Worker 线程并回收资源。该 Worker 之后不可再用。

## 使用示例

### C

```c
KossInstance* inst = koss_create();
koss_create_worker_pool(inst, 4);

// 终止 Worker 2
koss_worker_terminate(inst, 2);

koss_destroy(inst);
```

### Python

```python
from kossjs_interface import KossJS

koss = KossJS()
koss.create_worker_pool(4)
koss.worker_terminate(2)
```
