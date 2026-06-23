# 安全与沙箱指南

KossJS 默认行为与 Node.js 一致：**信任运行在其中的 JS 代码**，赋予其完整的文件系统、网络和加密能力。对于运行可信代码的场景，这是合理的设计。

然而，当 KossJS 被嵌入到**运行不可信 JS 代码**的应用中时（如第三方插件引擎、用户脚本沙箱），这些能力成为安全风险。KossJS 提供了三层安全机制：

1. **能力位掩码**（Capability Bitmask）— 静态权限声明，实例创建时确定
2. **审核掩码**（Audit Mask）— 动态审核策略，运行时可更改
3. **审核回调**（Audit Callback）— 运行时动态决策，允许宿主根据上下文判断

---

## 一、能力位掩码

### 1.1 设计原则

能力位掩码是 **静态权限声明**，在实例创建时确定，运行时不可更改。所有危险 API 均受能力位控制，未授予的能力在 JS 层表现为 `undefined` 或调用时抛出 `TypeError`。

**能力位容量**：当前使用 32 位无符号整数（`uint32_t`），已占用 28 位。

### 1.2 能力位定义

```c
// 文件系统（6 个细粒度操作）
#define FS_READ         (1 << 0)   // 读取文件、目录、元数据
#define FS_WRITE        (1 << 1)   // 写入、追加、截断、复制
#define FS_DELETE       (1 << 2)   // 删除文件或空目录
#define FS_MKDIR        (1 << 3)   // 创建目录
#define FS_RENAME       (1 << 4)   // 重命名/移动
#define FS_CHMOD        (1 << 5)   // 修改权限、所有者、创建链接

// 网络（5 个细粒度操作）
#define NET_TCP_CLIENT  (1 << 6)   // TCP 客户端连接与数据发送
#define NET_TCP_SERVER  (1 << 7)   // TCP 服务端监听
#define NET_UDP         (1 << 8)   // UDP 发送与接收
#define NET_DNS         (1 << 9)   // DNS 解析
#define NET_FETCH       (1 << 10)  // HTTP/HTTPS 客户端请求

// 加密（4 个细粒度操作）
#define CRYPTO_HASH     (1 << 11)  // 哈希（MD5, SHA1, SHA256 等）
#define CRYPTO_HMAC     (1 << 12)  // HMAC
#define CRYPTO_RANDOM   (1 << 13)  // 随机数生成（randomBytes, randomUUID）
#define CRYPTO_PBKDF2   (1 << 14)  // 密钥派生（pbkdf2）

// 内置 FFI（5 个细粒度操作）
#define FFI_OPEN        (1 << 15)  // 加载/关闭动态库
#define FFI_CALL        (1 << 16)  // 调用 C 函数（同步/异步）
#define FFI_ALLOC       (1 << 17)  // 内存分配/释放/地址获取
#define FFI_CALLBACK    (1 << 18)  // 创建 JS 回调指针
#define FFI_STRUCT      (1 << 19)  // 结构体、数组、指针操作

// 其他模块（8 个操作）
#define NATIVE_ADDON    (1 << 20)  // 加载 .node 原生模块
#define WASM            (1 << 21)  // WebAssembly
#define SHARED_MEMORY   (1 << 22)  // SharedArrayBuffer 与 Atomics
#define HIGHRES_TIME    (1 << 23)  // 高精度计时（performance.now, process.hrtime）
#define SYSINFO         (1 << 24)  // 系统信息泄露（os.hostname, os.cpus 等）
#define MODULE_LOAD     (1 << 25)  // JS 模块加载（require, import）
#define DYNAMIC_CODE    (1 << 26)  // 动态代码执行（eval, Function, setTimeout 字符串）
#define DEBUG_CAP       (1 << 27)  // 调试/内省（Error.stack, console 详细输出）

// 组合常量
#define KOSS_CAP_SANDBOX    0
#define KOSS_CAP_ALL_FS     (FS_READ | FS_WRITE | FS_DELETE | FS_MKDIR | FS_RENAME | FS_CHMOD)
#define KOSS_CAP_ALL_NET    (NET_TCP_CLIENT | NET_TCP_SERVER | NET_UDP | NET_DNS | NET_FETCH)
#define KOSS_CAP_ALL_CRYPTO (CRYPTO_HASH | CRYPTO_HMAC | CRYPTO_RANDOM | CRYPTO_PBKDF2)
#define KOSS_CAP_ALL_FFI    (FFI_OPEN | FFI_CALL | FFI_ALLOC | FFI_CALLBACK | FFI_STRUCT)
#define KOSS_CAP_ALL        0xFFFFFFFF

// 兼容别名（用于旧宿主代码过渡）
#define KOSS_CAP_FS              KOSS_CAP_ALL_FS
#define KOSS_CAP_NET             KOSS_CAP_ALL_NET
#define KOSS_CAP_CRYPTO          KOSS_CAP_ALL_CRYPTO
#define KOSS_CAP_WORKER          (1u << 3)
#define KOSS_CAP_EXTERNAL_LOADER MODULE_LOAD
```

### 1.3 使用方式

#### C 语言

```c
#include "kossjs.h"

// 纯计算实例（无 IO），stable=true（默认）
KossInstance *k = koss_create_with_caps(KOSS_CAP_SANDBOX, true);
koss_eval(k, "1 + 1");  // 正常工作
koss_eval(k, "require('fs').readFileSync('/etc/passwd')");  // 抛出错误 — fs 不可用
koss_destroy(k);

// 只允许网络请求
KossInstance *k2 = koss_create_with_caps(KOSS_CAP_ALL_NET, true);

// 允许 fs + net，禁止 crypto + FFI
KossInstance *k3 = koss_create_with_caps(KOSS_CAP_ALL_FS | KOSS_CAP_ALL_NET, true);

// 模块 + 能力组合
KossInstance *k4 = koss_create_with_modules_and_caps(".", KOSS_CAP_ALL_FS | KOSS_CAP_ALL_NET, true);

// 开发模式（启用 FFI 和 Worker）
KossInstance *k5 = koss_create_with_caps(KOSS_CAP_ALL, false);
```

#### Python 语言

```python
from kossjs_interface import KossJS

# 沙箱模式（纯计算）
koss = KossJS(capabilities=KossJS.KOSS_CAP_SANDBOX)

# 部分启用
koss2 = KossJS(capabilities=KossJS.KOSS_CAP_ALL_NET | KossJS.KOSS_CAP_ALL_CRYPTO)

# 完全启用（默认，stable=True）
koss3 = KossJS()  # 等价于 capabilities=KossJS.KOSS_CAP_ALL, stable=True

# 开发模式（启用 FFI 和 Worker）
koss4 = KossJS(stable=False)

# 搭配模块加载
koss5 = KossJS(with_modules=True, root_dir="./modules",
               capabilities=KossJS.KOSS_CAP_ALL_NET)
```

### 1.4 禁用后的行为

当 JS 代码尝试使用被禁用的能力时：

```javascript
// 假设实例禁用了 FS_READ

const fs = require('fs');     // require 仍然可以解析模块名
fs.readFileSync('/etc/passwd') // → TypeError: fs.readFileSync is not a function
```

原因是禁用的 `internalBinding()` 返回 `undefined`，导致该能力的原生函数不存在，JS 侧调用时报 `TypeError`。

### 1.5 不受能力限制的模块

以下模块始终可用（纯计算，无 I/O 副作用）：

| 模块 | 说明 |
|------|------|
| `os` | 基本系统信息（CPU、内存、hostname），不涉及 I/O 操作 |
| `timers` | `setTimeout` / `setInterval` 是 JS 运行时的基本功能 |
| `buffer` | Buffer 字节操作是纯内存计算 |
| `constants` | 常量值查询，无副作用 |
| `url` | URL 解析是纯计算 |
| `events` | EventEmitter 是纯内存操作 |
| `path` | 路径解析是纯字符串操作 |
| `querystring` | 查询字符串解析是纯字符串操作 |
| `assert` | 断言是纯计算 |
| `string_decoder` | 字符串解码是纯计算 |

---

## 二、稳定模式（stable）

`stable` 参数控制实例的**生产就绪模式**。当 `stable=True`（默认）时，不稳定或未充分测试的功能会被禁用。

### 2.1 stable 参数

| 值 | 行为 |
|----|------|
| `true`（默认） | 禁用 FFI 和 Worker 功能，生产环境推荐 |
| `false` | 启用所有功能，开发/调试用 |

### 2.2 stable=True 时被禁用的功能

| 功能 | 禁用原因 |
|------|---------|
| FFI（`_senri_ffi`） | 无法在所有场景下充分测试 |
| Worker（`worker_threads`） | Worker 实现未传播沙箱设置（能力位、审核回调） |

### 2.3 stable=True 时的行为

- 如果 caps 包含 FFI 位，这些位会被自动剥离
- 如果 caps 包含 Worker 位，该位会被自动剥离
- `_senri_ffi` 和 `__koss_create_worker_pool` 等函数会注册为 stub，调用时抛出明确错误
- `require('worker_threads')` 会被模块加载器拦截

### 2.4 使用示例

```python
from kossjs_interface import KossJS

# 生产模式（默认）
koss = KossJS()  # stable=True
print(koss.is_stable)  # True

# 开发模式
koss_dev = KossJS(stable=False)  # 启用 FFI 和 Worker
print(koss_dev.is_stable)  # False
```

```c
// 生产模式（默认）
KossInstance *k = koss_create();  // stable=true
bool stable = koss_is_stable(k);  // true

// 开发模式
KossInstance *k2 = koss_create_with_caps(KOSS_CAP_ALL, false);
bool stable2 = koss_is_stable(k2);  // false
```

---

## 三、审核掩码

审核掩码是 **动态审核策略声明**，在实例创建时确定，运行时可更改。它与能力位掩码使用相同的位定义，但语义不同：

- **能力位掩码**：控制"是否允许"（静态权限）
- **审核掩码**：控制"是否需要审核"（动态策略）

### 3.1 审核掩码语义

- **位设置为 1**：该 API 需要经过审核回调
- **位设置为 0**：该 API 不需要审核（直接放行，前提是能力位允许）

**默认审核掩码**：`0`（不审核任何 API）。宿主必须显式设置审核掩码，才能启用审核回调。

> 审核掩码只能设置在能力位掩码已授予的位上。若审核掩码包含了能力位掩码未授予的位，这些位将被视为无效（忽略，不会报错），因为对应的 API 已被禁用，无需审核。

### 3.2 决策流程

```
JS 调用受保护 API（例如 fs.readFile）
    │
    ▼
┌─────────────────────────────────┐
│ 能力位掩码检查                    │
└─────────────────────────────────┘
    │
    ├── 未设置 → 直接拒绝（KossCapabilityError）
    │
    ▼ 已设置
┌─────────────────────────────────┐
│ 审核掩码检查                      │
└─────────────────────────────────┘
    │
    ├── 未设置 → 直接放行
    │
    ▼ 已设置
┌─────────────────────────────────┐
│ 是否存在外部审核回调？            │
└─────────────────────────────────┘
    │
    ├── 无 → 放行
    │
    ▼ 有
┌─────────────────────────────────┐
│ 调用外部审核回调                  │
└─────────────────────────────────┘
    │
    ├── 返回 false / 异常 → 拒绝（KossSecurityError）
    ├── 返回 true → 放行
    │
    ▼
    放行，执行实际 API 调用
```

### 3.3 使用示例

```c
// 设置审核掩码：只审核文件系统读取操作
koss_set_audit_mask(inst, FS_READ);

// 审核所有文件系统操作
koss_set_audit_mask(inst, KOSS_CAP_ALL_FS);

// 审核高风险 API（FFI + 动态代码）
koss_set_audit_mask(inst, FFI_OPEN | FFI_CALL | DYNAMIC_CODE);

// 不审核任何 API（直接放行）
koss_set_audit_mask(inst, 0);
```

```python
# 设置审核掩码
koss.set_audit_mask(KossJS.FS_READ | KossJS.NET_FETCH)

# 获取当前审核掩码
mask = koss.get_audit_mask()
```

---

## 四、审核回调

审核回调允许宿主在运行时根据上下文（函数名、参数、文件路径）决定是否放行某个 API 调用。

### 4.1 注册审核回调

```c
// 定义审核回调
bool my_audit(const char* target, const char** args, int argc, const char* pwd, void* userdata) {
    if (strcmp(target, "fs.readFile") == 0) {
        // 只允许读取 /tmp/sandbox/ 目录下的文件
        return args[0] && strncmp(args[0], "/tmp/sandbox/", 13) == 0;
    }
    return true;  // 其他操作放行
}

// 注册回调
koss_check_sandbox(inst, my_audit, NULL);

// 清除回调
koss_check_sandbox(inst, NULL, NULL);
```

```python
def my_audit(target: str, args: list[str], pwd: str | None) -> bool:
    if target == "fs.readFile":
        return args[0].startswith("/tmp/sandbox/")
    return True

# 注册回调
koss.check_sandbox(my_audit)

# 清除回调
koss.check_sandbox(None)
```

### 4.2 回调参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `target` | `const char*` | API 名称，如 `fs.readFile`、`_senri_ffi.open` |
| `args` | `const char**` | 参数字符串数组 |
| `argc` | `int` | 参数个数 |
| `pwd` | `const char*` | 当前模块目录（绝对路径），`eval` 时为 NULL |
| `userdata` | `void*` | 注册时传入的用户数据 |

### 4.3 错误类型

| 错误 | 原因 |
|------|------|
| `KossCapabilityError` | 能力位掩码禁止该操作 |
| `KossSecurityError` | 审核回调返回 `false` |

---

## 五、审核调试模式

调试模式开启后，错误消息包含详细的拒绝原因、超时信息和回调失败详情。

```c
// 开启调试模式
koss_enable_audit_debug(inst, true);

// 关闭调试模式（生产环境应关闭）
koss_enable_audit_debug(inst, false);
```

```python
# 开启调试模式
koss.enable_audit_debug(True)
```

**生产环境**：使用通用错误消息，避免信息泄露。
```
KossSecurityError: Access denied
```

**调试模式**：使用详细错误消息，便于排查问题。
```
KossSecurityError: sandbox audit denied for fs.readFile (path: /etc/passwd)
```

---

## 六、不受能力控制的操作

以下 API 由宿主主动调用，属于宿主权限范围：

| API | 说明 |
|-----|------|
| `koss_run_file()` | 宿主决定执行哪个文件 |
| `koss_eval()` / `koss_run_string()` | 代码执行是 JS 运行时的核心功能 |
| `koss_set_global_*` | 宿主向 JS 注入数据 |
| `koss_register_function` / `koss_register_class` | 宿主注入自定义能力 |

---

## 七、Python 常量参考

```python
# 文件系统（6 个细粒度操作）
KossJS.FS_READ         = 1 << 0
KossJS.FS_WRITE        = 1 << 1
KossJS.FS_DELETE       = 1 << 2
KossJS.FS_MKDIR        = 1 << 3
KossJS.FS_RENAME       = 1 << 4
KossJS.FS_CHMOD        = 1 << 5

# 网络（5 个细粒度操作）
KossJS.NET_TCP_CLIENT  = 1 << 6
KossJS.NET_TCP_SERVER  = 1 << 7
KossJS.NET_UDP         = 1 << 8
KossJS.NET_DNS         = 1 << 9
KossJS.NET_FETCH       = 1 << 10

# 加密（4 个细粒度操作）
KossJS.CRYPTO_HASH     = 1 << 11
KossJS.CRYPTO_HMAC     = 1 << 12
KossJS.CRYPTO_RANDOM   = 1 << 13
KossJS.CRYPTO_PBKDF2   = 1 << 14

# 内置 FFI（5 个细粒度操作）
KossJS.FFI_OPEN        = 1 << 15
KossJS.FFI_CALL        = 1 << 16
KossJS.FFI_ALLOC       = 1 << 17
KossJS.FFI_CALLBACK    = 1 << 18
KossJS.FFI_STRUCT      = 1 << 19

# 其他模块（8 个操作）
KossJS.NATIVE_ADDON    = 1 << 20
KossJS.WASM            = 1 << 21
KossJS.SHARED_MEMORY   = 1 << 22
KossJS.HIGHRES_TIME    = 1 << 23
KossJS.SYSINFO         = 1 << 24
KossJS.MODULE_LOAD     = 1 << 25
KossJS.DYNAMIC_CODE    = 1 << 26
KossJS.DEBUG_CAP       = 1 << 27

# 组合常量
KossJS.KOSS_CAP_SANDBOX    = 0
KossJS.KOSS_CAP_ALL_FS     = FS_READ | FS_WRITE | FS_DELETE | FS_MKDIR | FS_RENAME | FS_CHMOD
KossJS.KOSS_CAP_ALL_NET    = NET_TCP_CLIENT | NET_TCP_SERVER | NET_UDP | NET_DNS | NET_FETCH
KossJS.KOSS_CAP_ALL_CRYPTO = CRYPTO_HASH | CRYPTO_HMAC | CRYPTO_RANDOM | CRYPTO_PBKDF2
KossJS.KOSS_CAP_ALL_FFI    = FFI_OPEN | FFI_CALL | FFI_ALLOC | FFI_CALLBACK | FFI_STRUCT
KossJS.KOSS_CAP_ALL        = 0xFFFFFFFF

# 兼容别名（用于旧宿主代码过渡）
KossJS.KOSS_CAP_FS              = KossJS.KOSS_CAP_ALL_FS
KossJS.KOSS_CAP_NET             = KossJS.KOSS_CAP_ALL_NET
KossJS.KOSS_CAP_CRYPTO          = KossJS.KOSS_CAP_ALL_CRYPTO
KossJS.KOSS_CAP_WORKER          = 1 << 3
KossJS.KOSS_CAP_EXTERNAL_LOADER = KossJS.MODULE_LOAD
```

---

## 八、安全建议

1. **运行不可信代码时始终使用最小权限原则**：仅启用必要的能力
2. **生产环境使用 `stable=True`**：禁用 FFI 和 Worker 等不稳定功能
3. **不要暴露敏感原生函数**：`koss_register_function` 注入的函数不受能力控制
4. **设置合理的 timeout**：`koss_run_async` 的超时参数可防止无限执行
5. **限制 Worker 数量**：`koss_create_worker_pool` 最大 64 个
6. **查询当前能力**：用 `koss_get_capabilities` 验证实例权限状态
7. **生产环境关闭调试模式**：`koss_enable_audit_debug(inst, false)` 避免信息泄露

---

## 九、相关 API

- [koss_create_with_caps](/zh/api/functions/koss_create_with_caps)
- [koss_create_with_modules_and_caps](/zh/api/functions/koss_create_with_modules_and_caps)
- [koss_get_capabilities](/zh/api/functions/koss_get_capabilities)
- [koss_is_stable](/zh/api/functions/koss_is_stable)
- [koss_set_audit_mask](/zh/api/functions/koss_set_audit_mask)
- [koss_get_audit_mask](/zh/api/functions/koss_get_audit_mask)
- [koss_check_sandbox](/zh/api/functions/koss_check_sandbox)
- [koss_enable_audit_debug](/zh/api/functions/koss_enable_audit_debug)
