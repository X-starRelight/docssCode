# KossJS Node.js 内置库支持状态

> 更新时间：2026-06-23
> 测试统计：528 passed, 8 skipped

KossJS 定位为**同时兼容 Node.js 与 Web 标准**的嵌入式运行时。
Node.js 模块通过 `require()` 加载；Web API（如 `fetch`、`Headers`、`Response`）作为全局对象直接可用。

---

## 完整支持（可直接 require）

| 模块 | 说明 | 实现方式 |
|------|------|---------|
| **assert** | 完整 Node.js 断言库 | Node.js 源码适配 |
| **buffer** | Buffer、Blob、TextEncoder/Decoder | Rust binding + JS 包装 |
| **constants** | 系统常量（信号、错误码等） | Rust binding |
| **events** | EventEmitter | Node.js 源码适配 |
| **os** | 操作系统信息（部分值硬编码） | 纯 JS shim |
| **path** | 路径处理（posix/win32） | Node.js 源码适配 |
| **process** | process 全局对象 | Rust 运行时注入 |
| **querystring** | 查询字符串解析/序列化 | Node.js 源码适配 |
| **string_decoder** | 字符串解码器 | Node.js 源码适配 |
| **timers** | setTimeout/setInterval/setImmediate | Rust binding + JS 包装 |
| **url** | URL 解析/格式化/URLPattern | Rust binding + JS 包装 |

---

## 部分支持（核心 API 可用）

| 模块 | 支持 API | 实现方式 | 限制 |
|------|---------|---------|------|
| **crypto** | `randomBytes()`, `createHash()`(sha256/sha1/md5), `randomUUID()`, `timingSafeEqual()`, `randomFill()`, `randomFillSync()`, `getHashes()` | 自定义 JS + `__koss_hash`/`__koss_random_bytes`/`__koss_random_uuid` | 非密码学安全哈希 |
| **dns** | `lookup()`(callback + Promise), `resolve()`, `resolve4()`, `resolve6()`, `promises.lookup()` | 自定义 JS + `__koss_dns_lookup` | `lookupService()` 为 stub |
| **http** | `createServer()`, `IncomingMessage`, `ServerResponse`, `METHODS`, `STATUS_CODES` | 自定义 JS | 仅服务端，客户端未实现 |
| **https** | `createServer()`, `request()`, `get()` | 基于 http + net 封装 | 无实际 TLS 加密 |
| **net** | `Socket`(connect/write/end/destroy/on('data')), `Server`(listen/close/on('connection')), `connect()`, `createServer()`, `isIP()`, `isIPv4()`, `isIPv6()` | 自定义 JS + `__koss_tcp_*` | 轮询读取，非事件驱动 |
| **stream** | `Readable`, `Writable`, `Duplex`, `Transform`, `PassThrough`, `pipeline()`, `finished()` | 自定义 JS | `compose()`/`addAbortSignal()` 未实现 |
| **tls** | `connect()`, `createServer()`, `TLSSocket`, `createSecureContext()`, `checkServerIdentity()` | 基于 net 模块轻量封装 | 无实际 TLS 加密 |
| **dgram** | `createSocket()`, `socket.bind()`, `socket.send()`, `socket.close()`, `socket.address()` | 自定义 JS（基于 TCP 桥接） | 非真实 UDP |
| **zlib** | `gzip/gunzip()`, `deflate/inflate()`(sync + async), `constants` | 自定义 JS + `__koss_gzip*`（flate2 crate） | 异步函数实际为同步 |

---

## 纯 JS Shim（基础功能可用）

| 模块 | 支持 API | 说明 |
|------|---------|------|
| **util** | `format()`, `inspect()`, `deprecate()`, `promisify()`, `callbackify()`, `inherits()`, `debuglog()`, `stripVTControlCharacters()`, `getSystemErrorName()`, `types.*` | 自定义 JS shim |
| **trace_events** | `createTracing()`, `getEnabledCategories()`, `Tracing` class | 自定义 JS shim |
| **perf_hooks** | `performance`(now/mark/measure), `PerformanceObserver`, `PerformanceMark/Measure`, `createHistogram()`, `timerify()` | `monitorEventLoopDelay()` 为 stub |
| **diagnostics_channel** | `channel()`, `subscribe()`, `unsubscribe()`, `publish()`, `hasSubscribers()` | 自定义 JS shim |

---

## 不支持的模块（架构级否决）

这些模块**从设计上就不在 KossJS 的能力模型中**，不会支持。

| 模块 | 否决原因 |
|------|---------|
| **child_process** | 无对应能力位，进程派生破坏沙箱隔离 |
| **cluster** | 依赖 child_process.fork() |
| **wasi** | WASI 与 KossJS 能力位模型不兼容 |
| **sea** | 构建时工具，与运行时无关 |
| **punycode** | 已废弃模块 |
| **v8** | Boa 引擎无 V8 C++ 接口 |
| **inspector** | Boa 引擎无 V8 Inspector 协议 |
| **async_hooks** | Boa 无异步资源追踪机制 |
| **readline** | TTY 环境缺失 |
| **repl** | 嵌入式场景无意义 |
| **vm** | 沙箱模型冲突 |

---

## 搁置模块（未来可能支持）

| 模块 | 说明 | 前置条件 |
|------|------|---------|
| **http2** | HTTP/2 协议支持 | 需 Rust h2 crate |
| **quic** | QUIC 协议 | 需 Rust quinn crate |
| **sqlite** | SQLite 数据库 | 需 Rust rusqlite crate |
| **worker_threads** | Web Worker | 能力位已预留，stable 模式剥离 |

---

## Web API（全局可用，无需 require）

| API | 说明 | 实现方式 |
|-----|------|---------|
| **fetch** | `fetch(url, init)` 标准 Web API | Rust reqwest + rustls 完整实现 |
| **Headers** | Web API Headers 类 | 纯 JS |
| **Response** | Web API Response 类 | 纯 JS |

---

## 模块统计

| 分类 | 数量 |
|------|------|
| 完整支持 | 11 |
| 部分支持 | 9 |
| 纯 JS Shim | 4 |
| 不支持（架构否决） | 11 |
| 搁置 | 4 |
| Web API | 3 |
| **总计** | **42** |
