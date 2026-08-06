# KossJS 版本变更日志（dev.9 → dev.10）

本文档记录从 0.1.0-dev.9 到 0.1.0-dev.10 的所有变更。

> 测试统计：744 passed, 8 skipped (Python) | 156 passed, 0 failed (Rust)

---

## 0.1.0-dev.9 → 0.1.0-dev.10

### 破坏性变更（Breaking）

#### 1. 移除 Worker 线程池

Worker 线程池在 dev.10 被**彻底移除**：

- 删除 `src/worker.rs` 与 `src/js_shims/koss_shim/worker.js`
- 清理 `__koss_create_worker_pool`、`__koss_worker_*` 等 C ABI 函数
- 移除 Python / TypeScript 接口中的 Worker 绑定
- 移除 `KOSS_CAP_WORKER` 能力位（此前 `1 << 3` 与 `FS_MKDIR` 位冲突）
- 移除 `koss:worker` 内置模块
- `__koss_fs_mkdir` 恢复使用 `FS_MKDIR` 门控（与已移除的 `KOSS_CAP_WORKER` 位冲突消除）

> [!IMPORTANT]
> 原 Worker 相关 API（`koss_create_worker_pool` 等）已不存在于动态库中。
> 若需并行执行任务，请使用「多实例隔离」或「异步执行（`koss_run_async`）」，
> 详见 [stable 模式替代方案](/zh/reference/stable-alternatives)。

#### 2. 默认构造器能力改为 KOSS_CAP_SANDBOX

`koss_create()` 与 `koss_create_with_modules()` 不再默认授予全部能力：

```c
// 旧行为（dev.9）：默认 KOSS_CAP_ALL，可访问所有系统能力
// 新行为（dev.10）：默认 KOSS_CAP_SANDBOX (0)，纯计算沙箱

KossInstance *k = koss_create();          // 现在 = 无任何能力
KossInstance *k2 = koss_create_with_caps(KOSS_CAP_ALL, true);  // 需显式授予
```

- 消除了"不可信脚本获得广泛系统权限"的风险
- 所有宿主代码需显式传入 `KOSS_CAP_ALL`（或所需能力位）

---

### 安全强化（Security）

#### 1. JS 层审核回调（两级审核链）

新增 JS 侧参与审核决策的机制。宿主审核回调仍是**主闸门**，JS 回调在其放行后进行**进一步限制**：

```
Audit Mask = 0
    │
    ▼
不触发审核，直接依据 Capability 放行/拒绝
    │
Audit Mask ≠ 0
    │
    ▼
宿主回调是否注册？
    ├── 否 → 直接拒绝（KossConfigError: Audit mask is set but no callback is registered）
    ▼ 是
宿主回调
    ├── 返回 false → 拒绝（KossSecurityError）【不调用 JS 层】
    ▼ 返回 true
JS 回调是否注册（KossJS.set_audit_callback）？
    ├── 否 → 放行
    ▼ 是
JS 回调 (target, args[], pwd) => bool
    ├── 返回 false / 抛异常 / 重入 → 拒绝
    ├── 返回 true → 放行
```

**新增 API：**

| API | 说明 |
|-----|------|
| `KossJS.set_audit_callback(fn)` | JS 全局对象方法。注册 JS 层审核回调；传 `null` 清除。签名 `(target, args[], pwd) => boolean` |
| `koss_clear_js_audit(inst)` | C ABI。宿主清除 JS 层审核回调 |

**安全语义：**

- JS 回调**只能进一步收紧**（返回 `false` → 拒绝），无法放行宿主已拒绝的操作，也无法绕过能力位
- 宿主回调为 `NULL` 时，即使已注册 JS 回调，掩码覆盖的操作仍抛 `KossConfigError`
- JS 回调执行期间再次触发审核（重入）直接拒绝，防止死循环/绕过
- JS 回调抛异常视为拒绝

**示例：**

```javascript
// JS 侧注册策略：仅允许读取 /tmp/sandbox/ 下的文件
KossJS.set_audit_callback(function (target, args, pwd) {
    if (target === 'fs.readFile') {
        return args[0].startsWith('/tmp/sandbox/');
    }
    return true;
});
```

#### 2. 审核掩码与审核回调的关系强化

明确 "Audit Mask ≠ 0 但未注册审核回调" 时的行为（修复潜在的安全绕过）：

| 场景 | 行为 |
|------|------|
| `Audit Mask = 0` | 不触发审核，直接依据 Capability 放行/拒绝 |
| `Audit Mask ≠ 0` 且 `Callback ≠ NULL` | 调用回调，由宿主逻辑决定 |
| `Audit Mask ≠ 0` 且 `Callback = NULL` | 直接拒绝，抛 `KossConfigError`（`Audit mask is set but no callback is registered`） |

> 此前"掩码≠0 但无回调"会**静默放行**，形成安全绕过，已修复。

#### 3. 审核回调 `pwd` 参数修正

`pwd` 由进程 `current_dir()` 改为「**当前执行模块的目录**」：

- `koss_run_file` / `koss_run_module` → 模块所在目录
- `koss_eval` / `koss_run_string` / `koss_run_module_string` → `NULL`

> [!NOTE]
> `pwd` 由引擎根据入口模块推导，供宿主回调参考；宿主**不应信任**其内容。

#### 4. 其他安全修复

- `process.dlopen` 增加 `NATIVE_ADDON` 能力位门控，防止绕过稳定模式加载原生插件
- FFI 操作（`open`/`call`/`alloc`/`callback`）统一经过审核回调路径，支持动态策略变更
- 模块加载路径校验后使用 verified 路径读取，修复 TOCTOU 竞态窗口
- 网络、加密、文件系统操作按细粒度能力位独立注册与校验
- 全局 TCP socket 表移入实例生命周期管理

---

### 新增功能（Added）

#### 1. Node 内置模块 shim 扩充

`koss:*` 标准库模块显著扩充：

| 模块 | 说明 |
|------|------|
| `koss:assert` | 断言库 |
| `koss:buffer` | Buffer（索引访问、Array 构造、toString 不可枚举） |
| `koss:constants` | 系统常量 |
| `koss:querystring` | 查询字符串 |
| `koss:zlib` | 压缩/解压 |

- **os shim**：新增 `version()` / `machine()` 与 `os.constants`（信号、errno 表）
- **crypto shim**：`hash` / `hmac` 直接返回 hex；`sign` / `verify` 改用 HMAC-SHA256 加密钥派生
- **path shim**：兼容 Windows 分隔符
- **Deno shim**：`Deno.mkdir` 幂等处理 `EEXIST`

#### 2. 全平台 shim 迁移

所有平台 shim 迁移到 koss 标准库，扩充 Rust 原生实现（提交 30430da）。

#### 3. ESM import 支持 `koss:/*` 协议

ESM `import` 支持 `koss:/*` 协议模块，并补全 Rust 单元测试（提交 34a945c）。

#### 4. 正式删除 `src/stdlib` 目录

`src/stdlib` 目录正式移除（不影响编译，提交 8128941）。

#### 5. Python 接口优化

优化 `kossjs_interface.py` 的动态库寻找逻辑（支持 ARM64/x86 等平台后缀）。

---

### 修复（Fixed）

| 编号 | 修复内容 |
|------|----------|
| C1/H6 | `__koss_fs_*` 按 FS 能力位门控；无损二进制写入 |
| C2 | FFI struct `char*` 字段 CString 生命周期保持 |
| C3/H1-H5 | N-API 统一 tagged value 表示 |
| H7 | FFI 回调分配回收不泄漏 |
| — | 跨平台 CI 修复（macOS dylib 产物名、CI 无法测试） |
| — | 所有源代码文件添加头部版权标识 |

---

### 测试统计

| 版本 | Python 测试 | Rust 测试 | 总计 |
|------|-------------|-----------|------|
| dev.9 | 731 passed | 140 passed | 871 |
| dev.10 | 744 passed, 8 skipped | 156 passed | 900 |
| **增量** | **+13** | **+16** | **+29** |

新增测试：
- `test_sandbox_js_audit.py`（11 个）：JS 层审核回调（放行/拒绝/异常/重入、宿主与 JS 关系、pwd、清除）
- Rust：`test_js_audit_*`（7 个）：JS 审核决策、重入、宿主优先级、pwd

---

### 从旧版本升级

#### 从 dev.9 升级到 dev.10

1. **Worker 用户**：Worker API 已移除，改用多实例隔离或异步执行
2. **依赖默认能力的代码**：`koss_create()` 现在默认 `KOSS_CAP_SANDBOX`，请显式传 `KOSS_CAP_ALL`（或所需能力位）
3. **审核回调 `pwd`**：语义从进程 CWD 改为模块目录，依赖旧语义的宿主代码需适配
4. **JS 审核回调**（新功能）：可选，不影响现有审核流程
