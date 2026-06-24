# koss_worker_post_message 函数

**功能描述**：向指定 Worker 发送 JSON 消息。  
**返回值**：***KossResult*** 结构体。

> [!WARNING]
> Worker 在 `stable=True`（默认）时被禁用。如需在生产环境中使用并行执行功能，请查看 [stable 模式替代方案](/zh/reference/stable-alternatives)。

## 函数签名

```c
KossResult koss_worker_post_message(KossInstance* inst, int32_t worker_id, const char* data);
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| ***inst*** | ***KossInstance**** | JS 实例指针 |
| ***worker_id*** | ***int32_t*** | Worker ID（从 0 开始） |
| ***data*** | ***const char**** | JSON 格式的消息数据 |

## 说明

向指定 Worker 发送消息。Worker 端通过 `__koss_onmessage` 回调接收。

## 使用示例

### C

```c
KossInstance* inst = koss_create();
koss_create_worker_pool(inst, 2);

koss_worker_post_message(inst, 0, "{\"type\":\"task\",\"payload\":\"hello\"}");

koss_destroy(inst);
```

### Python

```python
from kossjs_interface import KossJS

koss = KossJS()
koss.create_worker_pool(2)
koss.worker_post_message(0, '{"type":"task","payload":"hello"}')
```
