# KossJS 版本变更日志（dev.5 → dev.8）

本文档记录从 0.1.0-dev.5 到 0.1.0-dev.8 的所有变更。

---

## 0.1.0-dev.5 → 0.1.0-dev.6

### 新增功能

- **Senri FFI 子系统**：JS 调用 native C 库的完整 FFI
  - _senri_ffi.open：加载动态库
  - _senri_ffi.func：调用 C 函数
  - _senri_ffi.alloc：内存分配/释放
  - _senri_ffi.callback：创建 JS 回调指针
  - _senri_ffi.struct：结构体、数组、指针操作
  - _senri_ffi.types：FFI 类型定义
- **N-API 兼容层**：支持加载 .node 原生插件
  - process.dlopen：动态库加载
  - N-API 函数注册、对象操作、字符串处理
- **Buffer 全局对象**：Node.js 兼容的 Buffer 实现
- **GPL 许可证输出**：所有公共 C API 入口输出许可证信息
- **事件循环扩展**：支持异步 FFI 回调和任务管理
- **CI 改进**：增加 workflow_dispatch、autotools、ARM64 MSVC 支持

### 移除

- 移除旧的纯 JS fetch 实现

---

## 0.1.0-dev.6 → 0.1.0-dev.7

### 新增功能

- **28 位细粒度能力位系统**：替代旧的 5 位粗粒度系统
  - 文件系统（6 个）：FS_READ, FS_WRITE, FS_DELETE, FS_MKDIR, FS_RENAME, FS_CHMOD
  - 网络（5 个）：NET_TCP_CLIENT, NET_TCP_SERVER, NET_UDP, NET_DNS, NET_FETCH
  - 加密（4 个）：CRYPTO_HASH, CRYPTO_HMAC, CRYPTO_RANDOM, CRYPTO_PBKDF2
  - FFI（5 个）：FFI_OPEN, FFI_CALL, FFI_ALLOC, FFI_CALLBACK, FFI_STRUCT
  - 其他（8 个）：NATIVE_ADDON, WASM, SHARED_MEMORY, HIGHRES_TIME, SYSINFO, MODULE_LOAD, DYNAMIC_CODE, DEBUG_CAP
- **沙箱安全三层机制**：
  - 能力位掩码（Capability Bitmask）：静态权限声明
  - 审核掩码（Audit Mask）：动态审核策略
  - 审核回调（Audit Callback）：运行时动态决策
- **审核掩码 API**：
  - koss_set_audit_mask：设置审核掩码
  - koss_get_audit_mask：获取当前审核掩码
- **审核回调 API**：
  - koss_check_sandbox：注册/清除同步审核回调
- **审核调试模式**：
  - koss_enable_audit_debug：启用/禁用调试模式
  - 错误消息优化：区分能力错误（KossCapabilityError）和审核错误（KossSecurityError）
- **FFI 沙箱测试**：15 个 FFI 能力位测试
- **综合沙箱测试**：81 个沙箱安全测试
- **KossJS 全局对象**：自动获取版本号和运行时信息

### 修复

- **跨平台编译修复**：
  - iOS/Android/鸿蒙：gate FFI/libloading 依赖
  - Linux aarch64：统一 c_char 类型
  - OHOS：排除 ohos target 的 libffi/libloading 依赖
  - 非桌面平台：stub 函数签名修复
- **内存管理修复**：
  - 回调 buffer 生命周期统一由 Rust 侧管理
  - 移除 Python 侧手动 free 回调 buffer 的逻辑
- **沙箱审核回调修复**：ctypes 兼容性问题
- **跨平台 CI 修复**：
  - Ubuntu：KossInstance 结构体字段 drop 顺序问题
  - macOS：dylib 文件名不匹配
  - Windows：临时目录路径问题

### 变更

- 移除 runtime.rs 中重复的能力位常量，统一使用 sandbox 模块
- is_capability_enabled 使用新的 28 位复合常量

---

## 0.1.0-dev.7 → 0.1.0-dev.8

### 新增功能

- **stable 模式**：控制实例的生产就绪模式
  - stable 参数（默认 true）：禁用 FFI 和 Worker 等不稳定功能
  - koss_is_stable() C ABI 函数：查询实例是否处于稳定模式
  - stable=True 时自动剥离 FFI 和 Worker 能力位
  - stable=True 且 caps 包含 FFI/Worker 时，注册 stub 函数（调用时抛出明确错误）
  - stable=True 时 equire('worker_threads') 被模块加载器拦截
  - C ABI 6 个 worker 函数添加 stable 感知错误消息
  - Worker 类错误消息提示设置 stable=false
- **TypeScript 接口封装**：kossjs_interface.ts
  - 基于 koffi 的完整封装
  - 支持所有 C ABI 函数
  - 支持能力位控制、审核掩码、审核回调、稳定模式
- **Python 接口新增**：
  - get_capabilities()：查询当前能力位掩码
  - is_stable 属性：查询实例是否处于稳定模式
- **C 头文件新增**：
  - koss_is_stable() 函数声明
  - 旧 koss_create/koss_create_with_modules 改为 static inline 向后兼容
- **worker_threads 模块能力位**：从 DYNAMIC_CODE 改为 KOSS_CAP_WORKER

### 测试

- 新增 	est_stable_mode.py：11 个稳定模式测试
- 更新现有测试：FFI/Worker 相关测试添加 stable=False

### 文档

- 新增 TypeScript 接口使用文档
- 更新安全与沙箱指南：28 位能力位、审核掩码、审核回调、调试模式、稳定模式
- 更新 API 概览：新增稳定模式、审核 API、TypeScript 接口
- 更新版本管理规范：新增 dev.6, dev.7, dev.8 版本历史
- 更新快速开始：新增稳定模式、沙箱能力位示例
- 更新 Python 接口文档：新增稳定模式、沙箱安全、能力常量
- 新增 API 文档：koss_is_stable, koss_set_audit_mask, koss_get_audit_mask, koss_check_sandbox, koss_enable_audit_debug

### 移除

- 删除过时的设计实现步骤文档：
  - 安全与沙箱设计_实现步骤.md
  - 运行时 API 获取设计_实现步骤.md
  - docs/superpowers/plans/2026-06-11-sandbox-security-v1.4.md

---

## 0.1.0-dev.8 后续更新（内置库简化重构）

> 提交：d481465 — 2026-06-23

### 重构

- **Node.js 内置库实现简化**：移除 Node.js 官方源码依赖，替换为自定义精简实现
  - 移除对 `internalBinding()`、`primordials` 等 Node.js 内部 API 的依赖
  - 从 crypto.js、net.js、http.js、https.js、stream.js、zlib.js、dgram.js、tls.js、dns.js、util.js、diagnostics_channel.js、perf_hooks.js、trace_events.js 中移除复杂的 Node.js 官方实现
  - 替换为基于 `__koss_*` Rust 原生函数的自定义实现
  - 代码量减少约 10 万行

### 新增功能

- **zlib 压缩支持**：添加 `flate2` Rust crate 依赖
  - `gzip()` / `gzipSync()`：gzip 压缩
  - `gunzip()` / `gunzipSync()`：gzip 解压缩
  - `deflate()` / `deflateSync()`：deflate 压缩
  - `inflate()` / `inflateSync()`：deflate 解压缩
  - `constants`：zlib 常量定义

- **TCP Socket 持久化**：在 `runtime.rs` 中实现 TCP 连接持久化管理
  - TCP socket 存储机制
  - TCP 连接的持久化管理
  - TCP 服务器的存储和管理功能

### 内置库实现变更

| 模块 | 实现方式 | 说明 |
|------|---------|------|
| **crypto** | 自定义 JS shim + `__koss_hash`/`__koss_random_bytes`/`__koss_random_uuid` | randomBytes, createHash(sha256/sha1/md5), randomUUID, timingSafeEqual, randomFill, randomFillSync, getHashes |
| **net** | 自定义 JS shim + `__koss_tcp_*` | Socket, Server, connect(), createServer(), isIP(), isIPv4(), isIPv6() |
| **http** | 自定义 JS shim | createServer(), IncomingMessage, ServerResponse, METHODS, STATUS_CODES（仅服务端） |
| **https** | 基于 http + net 封装 | createServer(), request(), get()（无实际 TLS） |
| **stream** | 自定义 JS shim | Readable, Writable, Duplex, Transform, PassThrough, pipeline(), finished() |
| **zlib** | 自定义 JS shim + `__koss_gzip*`（flate2 crate） | gzip/gunzip, deflate/inflate（sync + async）, constants |
| **dgram** | 自定义 JS shim（基于 TCP 桥接） | createSocket(), socket.bind/send/close/address() |
| **tls** | 基于 net 模块轻量封装 | connect(), createServer(), TLSSocket（无实际加密） |
| **dns** | 自定义 JS shim + `__koss_dns_lookup` | lookup(), resolve(), resolve4(), resolve6(), promises.lookup() |
| **util** | 自定义 JS shim | format(), inspect(), deprecate(), promisify(), callbackify(), inherits(), debuglog(), types.* |
| **diagnostics_channel** | 自定义 JS shim | channel(), subscribe(), unsubscribe(), publish(), hasSubscribers() |
| **perf_hooks** | 自定义 JS shim | performance(now/mark/measure), PerformanceObserver, createHistogram(), timerify() |
| **trace_events** | 自定义 JS shim | createTracing(), getEnabledCategories(), Tracing class |

### 测试

- **新增 7 个测试文件**：
  - test_crypto.py：加密模块测试
  - test_diagnostics_channel.py：诊断通道测试
  - test_net.py：网络模块测试
  - test_perf_hooks.py：性能钩子测试
  - test_trace_events.py：跟踪事件测试
  - test_util.py：工具函数测试
  - test_zlib_dgram.py：zlib 和数据报测试

- **更新现有测试**：
  - test_fetch.py：修复 fetch 测试
  - test_timers.py：修复定时器测试
  - test_unsupported.py：更新不支持功能测试

- **测试统计**：528 passed, 8 skipped

### 已知限制

- `http` 模块仅支持服务端，客户端（ClientRequest、get()、request()）未实现
- `https` 模块无实际 TLS 加密
- `tls` 模块无实际 TLS 加密，仅包装 TCP socket
- `dgram` 模块基于 TCP 桥接，非真实 UDP
- `zlib` 模块的异步函数实际为同步实现
- `stream` 模块的 promises.pipeline/finished 返回 rejected promises
- `perf_hooks` 模块的 monitorEventLoopDelay() 为 stub

---

## 统计

| 版本 | 新增文件 | 修改文件 | 新增测试 |
|------|---------|---------|---------|
| dev.5 → dev.6 | ~10 | ~20 | ~50 |
| dev.6 → dev.7 | ~15 | ~30 | ~100 |
| dev.7 → dev.8 | ~5 | ~15 | ~15 |
| dev.8 内置库重构 | 7（测试） | 28 | ~100 |
| **总计** | **~37** | **~93** | **~265** |
