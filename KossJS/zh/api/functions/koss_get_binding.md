# koss_get_binding 函数

**功能描述**：获取内部 Rust 绑定模块的信息（JSON 格式）。  
**返回值**：***KossResult*** 结构体，包含 JSON 格式的绑定信息。

## 函数签名

```c
KossResult koss_get_binding(KossInstance* inst, const char* binding_name);
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| ***inst*** | ***KossInstance**** | JS 实例指针 |
| ***binding_name*** | ***const char**** | 绑定模块名称（如 `"fs"`, `"crypto"`） |

## 说明

查询内部 Rust 绑定模块的信息。主要用于调试和内部使用。不同模块返回的 JSON 结构因模块而异，取决于 Rust 侧的实现。

## 使用示例

### C

```c
KossInstance* inst = koss_create();

KossResult result = koss_get_binding(inst, "fs");
if (result.code == 0) {
    printf("FS bindings: %s\n", result.value);
}
koss_free_result(result);

koss_destroy(inst);
```
