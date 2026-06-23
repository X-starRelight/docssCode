# koss_create 函数

**功能描述**：创建一个新的 JavaScript 实例（全部能力，stable=true）。  
**返回值**：成功返回实例指针，失败返回 NULL。

## 函数签名

```c
static inline KossInstance* koss_create(void);
```

## 参数

无

## 说明

创建一个新的完全隔离的 JavaScript 虚拟机实例。该实例拥有自己的全局环境，不与其他实例共享。

此函数是 `koss_create_with_caps(KOSS_CAP_ALL, true)` 的便捷封装，等价于：
- 启用所有 28 个能力位
- 启用稳定模式（禁用 FFI 和 Worker）

如需精确控制能力位或启用 FFI/Worker，请使用 [koss_create_with_caps](/zh/api/functions/koss_create_with_caps)。

## 向后兼容性

此函数定义为 `static inline` 包装器，不占用动态库符号。旧版宿主代码无需重新编译即可使用。

## 使用示例

### C

```c
KossInstance* inst = koss_create();
if (!inst) {
    fprintf(stderr, "Failed to create instance\n");
    return 1;
}

KossResult result = koss_eval(inst, "1 + 2");
if (result.code == 0) {
    printf("Result: %s\n", result.value);
    koss_free_result(result);
}

koss_destroy(inst);
```

### Python

```python
from kossjs_interface import KossJS

koss = KossJS()  # 等价于 KossJS(stable=True)
print(koss.is_stable)  # True
koss.destroy()
```

## 相关 API

- [koss_create_with_caps](/zh/api/functions/koss_create_with_caps)
- [koss_create_with_modules](/zh/api/functions/koss_create_with_modules)
- [koss_destroy](/zh/api/functions/koss_destroy)
- [koss_is_stable](/zh/api/functions/koss_is_stable)
