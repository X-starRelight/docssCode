# koss_worker_try_recv 函数

**功能描述**：非阻塞地尝试从任意 Worker 收取消息或执行结果。  
**返回值**：***KossResult*** 结构体。无消息时 `value` 为 `"null"`。

## 函数签名

```c
KossResult koss_worker_try_recv(KossInstance* inst);
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| ***inst*** | ***KossInstance**** | JS 实例指针 |

## 返回值格式

成功时返回 JSON，包含以下格式之一：

**执行结果**：
```json
{"type":"result","workerId":0,"id":1,"success":true,"value":"4950"}
```

**消息**：
```json
{"type":"message","workerId":0,"data":"{\"msg\":\"hello\"}"}
```

**错误**：
```json
{"type":"error","workerId":0,"message":"error description"}
```

## 使用示例

### C

```c
KossInstance* inst = koss_create();
koss_create_worker_pool(inst, 2);
koss_worker_execute(inst, 0, "42");

KossResult msg = koss_worker_try_recv(inst);
if (msg.code == 0 && strcmp(msg.value, "null") != 0) {
    printf("Received: %s\n", msg.value);
}
koss_free_result(msg);
koss_destroy(inst);
```

### Python

```python
from kossjs_interface import KossJS

koss = KossJS()
koss.create_worker_pool(2)
koss.worker_execute(0, "42")

msg = koss.worker_try_recv()
if msg:
    print(f"Received: {msg}")
```
