# koss_create_with_modules 函数

**功能描述**：创建一个支持模块加载的 JavaScript 实例（stable=true）。  
**返回值**：成功返回实例指针，失败返回 NULL。

## 函数签名

```c
static inline KossInstance* koss_create_with_modules(const char* root_dir);
```

## 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| ***root_dir*** | ***const char**** | 模块解析的根目录 |

## 说明

创建一个新的 JavaScript 实例，并启用模块解析功能。可以使用 `require()` 加载模块。

此函数是 `koss_create_with_modules_and_caps(root_dir, KOSS_CAP_ALL, true)` 的便捷封装，等价于：
- 启用所有 28 个能力位
- 启用稳定模式（禁用 FFI 和 Worker）

如需精确控制能力位或启用 FFI/Worker，请使用 [koss_create_with_modules_and_caps](/zh/api/functions/koss_create_with_modules_and_caps)。

## 向后兼容性

此函数定义为 `static inline` 包装器，不占用动态库符号。旧版宿主代码无需重新编译即可使用。

## 使用示例

### C

```c
KossInstance* inst = koss_create_with_modules("/path/to/modules");
// 现在可以使用 require()
koss_eval(inst, "const path = require('path'); path.join('/home', 'user')");
koss_destroy(inst);
```

### Python

```python
from kossjs_interface import KossJS

koss = KossJS(with_modules=True, root_dir="./modules")
result = koss.eval("const path = require('path'); path.join('/home', 'user')")
koss.destroy()
```

## 相关 API

- [koss_create_with_modules_and_caps](/zh/api/functions/koss_create_with_modules_and_caps)
- [koss_create_with_caps](/zh/api/functions/koss_create_with_caps)
- [koss_destroy](/zh/api/functions/koss_destroy)
