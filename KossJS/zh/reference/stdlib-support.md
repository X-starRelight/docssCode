# KossJS 标准库支持状态

KossJS 采用**三层架构**：底层 Rust 绑定（L1）→ koss 标准库模块（L2）→ 兼容层 shim（L3）。
本文档从全局视角总结所有可用的标准库模块、兼容层 API 以及 Web API。

Web API（如 `fetch`、`Headers`、`Response`）作为全局对象直接可用。

---

## 一、koss 标准库（`koss:*`）

由 `KOSS_BUILTIN_KOSS`（`1 << 3`）标志控制，共 **23 个模块**。

| 模块 | 导入路径 | 说明 |
|------|----------|------|
| assert | `require('koss:assert')` | 断言库 |
| buffer | `require('koss:buffer')` | Buffer、Blob、TextEncoder/Decoder |
| constants | `require('koss:constants')` | 文件系统/操作系统常量 |
| crypto | `require('koss:crypto')` | 加密（哈希/HMAC/AES-GCM/Ed25519/随机数） |
| data | `require('koss:data')` | 编码（Hex/Base64）与字节操作 |
| diagnostics_channel | `require('koss:diagnostics_channel')` | 诊断通道 |
| events | `require('koss:events')` | 事件发射器 |
| ffi | `require('koss:ffi')` | 外部函数接口（桌面平台，stable 不可用） |
| http | `require('koss:http')` | HTTP 服务器与客户端 |
| io | `require('koss:io')` | 统一 I/O（文件/网络/流/DNS） |
| net | `require('koss:net')` | TCP 网络（Socket/Server） |
| os | `require('koss:os')` | 操作系统信息（arch/platform/cpus/hostname 等） |
| path | `require('koss:path')` | 路径处理（posix/win32） |
| process | `require('koss:process')` | 进程信息（process 全局引用） |
| stream | `require('koss:stream')` | 流操作（Readable/Writable/Transform） |
| string_decoder | `require('koss:string_decoder')` | 字符串解码器 |
| system | `require('koss:system')` | 系统与进程（pid/env/cwd/exit/memory） |
| timers | `require('koss:timers')` | 定时器（setTimeout/Interval/Immediate） |
| trace_events | `require('koss:trace_events')` | 追踪事件 |
| url | `require('koss:url')` | URL 解析与格式化 |
| util | `require('koss:util')` | 工具函数（format/inspect/promisify/callbackify） |
| worker | `require('koss:worker')` | 工作线程（stable 不可用） |
| zlib | `require('koss:zlib')` | 压缩/解压（gzip/deflate/brotli） |

---

## 二、Node.js 兼容层（`koss:node/*` / `node:*` / 裸名）

由 `KOSS_BUILTIN_NODE`（`1 << 0`）标志控制，共 **25 个模块**。
底层实现委托给 `koss:*` 标准库模块。

### 完整支持（19 个）

| 模块 | 导入路径 | 底层实现 | 说明 |
|------|----------|----------|------|
| assert | `require('assert')` | `koss:assert` | 断言库 |
| buffer | `require('buffer')` | `koss:buffer` | Buffer、Blob、File |
| constants | `require('constants')` | `koss:constants` | 系统常量 |
| diagnostics_channel | `require('diagnostics_channel')` | `koss:diagnostics_channel` | 诊断通道 |
| events | `require('events')` | `koss:events` | EventEmitter |
| fs | `require('fs')` | `koss:io` + 包装 | 文件系统（同步+回调+Promise） |
| http | `require('http')` | `koss:http` | HTTP 服务器/客户端 |
| https | `require('https')` | `koss:http` + 封装 | HTTPS（无实际 TLS） |
| net | `require('net')` | `koss:net` | TCP 网络 |
| os | `require('os')` | `koss:os` | 操作系统信息 |
| path | `require('path')` | `koss:path` | 路径处理（posix/win32） |
| process | `require('process')` | `koss:process` | 进程全局对象 |
| querystring | `require('querystring')` | `koss:querystring` | 查询字符串 |
| stream | `require('stream')` | `koss:stream` | 流操作 |
| string_decoder | `require('string_decoder')` | `koss:string_decoder` | 字符串解码器 |
| timers | `require('timers')` | `koss:timers` | 定时器 |
| trace_events | `require('trace_events')` | `koss:trace_events` | 追踪事件 |
| url | `require('url')` | `koss:url` | URL 解析 |
| util | `require('util')` | `koss:util` | 工具函数 |
| zlib | `require('zlib')` | `koss:zlib` | 压缩/解压 |

### 部分支持（6 个）

| 模块 | 可用 API | 限制 |
|------|----------|------|
| crypto | `randomBytes`, `createHash` (sha256/sha1/md5), `randomUUID`, `timingSafeEqual`, `randomFill`, `getHashes` | 有限算法集 |
| dgram | `createSocket`, `bind`, `send`, `close` | 基于 TCP 桥接，非真实 UDP |
| dns | `lookup`, `resolve`, `resolve4`, `resolve6`, `promises.*` | `lookupService` 为 stub |
| perf_hooks | `performance.now/mark/measure`, `PerformanceObserver`, `createHistogram` | `monitorEventLoopDelay` 为 stub |
| tls | `connect`, `createServer`, `TLSSocket`, `createSecureContext` | 无实际 TLS 加密 |

### ESM 导入支持

所有 Node 兼容模块同时支持以下导入方式：

```javascript
// koss: 协议
import fs from 'koss:node/fs';

// node: 前缀
import fs from 'node:fs';

// 裸名
import fs from 'fs';
```

### 不使用架构否决

| 模块 | 原因 |
|------|------|
| child_process, cluster | 破坏沙箱隔离 |
| wasi | 与能力位模型不兼容 |
| v8, inspector, async_hooks | Boa 引擎无对应接口 |
| readline, repl | 嵌入式场景无意义 |
| vm | 沙箱冲突 |
| punycode | 已废弃 |

---

## 三、Bun 兼容层（`koss:bun`）

由 `KOSS_BUILTIN_BUN`（`1 << 1`）标志控制，位于 `src/js_shims/bun_shim.js`。
底层委托 `koss:io`、`koss:crypto`、`koss:system` 实现。

### 可用 API

| API | 类型 | 说明 |
|-----|------|------|
| `Bun.version` | `string` | '1.1.42' |
| `Bun.build` | `string` | 'koss-bun-compat' |
| `Bun.env` | `object` | 环境变量（`koss:system.env()`） |
| `Bun.argv` | `string[]` | 命令行参数 |
| `Bun.write(path, data)` | `function` | 写入文件 |
| `Bun.file(path)` | `function` | 文件对象（size/text/json/arrayBuffer/exists） |
| `Bun.serve(options)` | `function` | HTTP 服务器 |
| `Bun.sleep(ms)` | `function` | 延迟（Promise） |
| `Bun.inspect(value)` | `function` | 检查值 |
| `Bun.peek(iterable)` | `function` | 窥视迭代器第一个元素 |
| `Bun.which(cmd)` | `function` | 查找可执行文件路径 |
| `Bun.randomUUIDv7()` | `function` | 生成 UUID v4 |
| `Bun.resolve(path)` | `function` | 解析绝对路径 |
| `Bun.hash(algorithm, data)` | `function` | 计算哈希值 |

### 不支持

| API | 原因 |
|-----|------|
| `Bun.readable` | ReadableStream 不可用 |
| `Bun.malloc` | 未实现 |
| `Bun.gc` | 未实现 |
| `Bun.sql` | 需 SQLite |
| `Bun.spawn` | 需 child_process |
| `Bun.build` | 无 bundler |

---

## 四、Deno 兼容层（`koss:deno`）

由 `KOSS_BUILTIN_DENO`（`1 << 2`）标志控制，位于 `src/js_shims/deno_shim.js`。
底层委托 `koss:io`、`koss:crypto`、`koss:system` 实现。

### 可用 API

| API | 类型 | 说明 |
|-----|------|------|
| `Deno.version` | `object` | `{deno, v8, typescript}` |
| `Deno.env` | `object` | 环境变量 |
| `Deno.args` | `string[]` | 命令行参数 |
| `Deno.pid` | `number` | 进程 ID |
| `Deno.noColor` | `boolean` | 是否禁用彩色输出 |
| `Deno.readTextFile(path)` | `function` | 读取文本文件 |
| `Deno.writeTextFile(path, data)` | `function` | 写入文本文件 |
| `Deno.readFile(path)` | `function` | 读取二进制文件 |
| `Deno.writeFile(path, data)` | `function` | 写入二进制文件 |
| `Deno.stat(path)` | `function` | 文件状态 |
| `Deno.lstat(path)` | `function` | 符号链接状态 |
| `Deno.mkdir(path, options)` | `function` | 创建目录 |
| `Deno.remove(path)` | `function` | 删除文件/目录 |
| `Deno.rename(old, new)` | `function` | 重命名 |
| `Deno.realPath(path)` | `function` | 解析真实路径 |
| `Deno.cwd()` | `function` | 当前工作目录 |
| `Deno.chdir(path)` | `function` | 切换工作目录 |
| `Deno.exit(code)` | `function` | 退出进程 |
| `Deno.memoryUsage()` | `function` | 内存使用 |
| `Deno.serve(handler, options)` | `function` | HTTP 服务器 |
| `Deno.listen(options)` | `function` | TCP 监听 |
| `Deno.connect(options)` | `function` | TCP 连接 |
| `Deno.resolveDns(host)` | `function` | DNS 解析 |
| `Deno.setTimeout/clearTimeout` | `function` | 定时器 |
| `Deno.setInterval/clearInterval` | `function` | 间隔定时器 |
| `Deno.crypto.getRandomValues` | `function` | 随机值 |
| `Deno.crypto.randomUUID` | `function` | UUID v4 |
| `Deno.crypto.subtle.digest` | `async` | 摘要计算 |
| `Deno.crypto.subtle.encrypt` | `async` | 加密（AES-GCM） |
| `Deno.crypto.subtle.decrypt` | `async` | 解密 |
| `Deno.crypto.subtle.generateKey` | `async` | 密钥生成 |
| `Deno.crypto.subtle.sign` | `async` | 签名 |
| `Deno.crypto.subtle.verify` | `async` | 验证 |

### 错误类型

| 类 | 说明 |
|----|------|
| `Deno.errors.NotFound` | 未找到 |
| `Deno.errors.PermissionDenied` | 权限拒绝 |
| `Deno.errors.ConnectionRefused` | 连接被拒绝 |
| `Deno.errors.ConnectionReset` | 连接重置 |
| `Deno.errors.AlreadyExists` | 已存在 |
| `Deno.errors.InvalidData` | 数据无效 |
| `Deno.errors.TimedOut` | 超时 |
| `Deno.errors.BadResource` | 资源错误 |
| `Deno.errors.BrokenPipe` | 管道断裂 |
| `Deno.errors.UnexpectedEof` | 意外 EOF |
| `Deno.errors.WriteZero` | 写入为零 |
| `Deno.errors.Interrupted` | 中断 |
| `Deno.errors.Other` | 其他错误 |

### 信号常量

30+ POSIX 信号，如 `Deno.signals.SIGINT` (2)、`Deno.signals.SIGTERM` (15) 等。

### 不支持

| API | 原因 |
|-----|------|
| `Deno.run` | 未实现 |
| `Deno.spawn` | 未实现 |
| `Deno.permissions` | 使用 Capability 位替代 |

---

## 五、Web API（全局可用，无需 require）

| API | 说明 | 实现方式 |
|-----|------|---------|
| **fetch** | `fetch(url, init)` 标准 Web API | Rust reqwest + rustls |
| **Headers** | Web API Headers 类 | 纯 JS |
| **Response** | Web API Response 类 | 纯 JS |
| **URL** | 全局 URL 类 | 原生 / koss:url |
| **URLSearchParams** | 全局 URLSearchParams 类 | 原生 / koss:url |
| **setTimeout / clearTimeout** | 全局定时器 | 原生 |
| **setInterval / clearInterval** | 全局间隔 | 原生 |

---

## 六、模块统计

| 分类 | 数量 |
|------|------|
| koss 标准库模块 (`koss:*`) | 23 |
| Node.js 兼容模块 (`koss:node/*`) | 25 |
| Bun 兼容层 (`koss:bun`) | 1 个命名空间 |
| Deno 兼容层 (`koss:deno`) | 1 个命名空间 |
| Web API (全局) | 6+ |
| 架构否决 | 11 |
| 搁置（未来可能） | 4 |

---

## 相关文档

- [内置模块系统指南](/zh/guide/builtin-modules) — Builtin Flags 与三层架构
- [ESM Import 支持指南](/zh/guide/esm-import) — import 语法说明
- [koss: 协议模块参考](/zh/reference/koss-protocol) — 模块解析规则
- [Koss 原生模块参考](/zh/reference/koss-native-modules) — 23 个 koss:\* 模块完整 API
- [Node.js 兼容层参考](/zh/reference/node-compat-layer) — 25 个 Node 模块 API
- [Bun 兼容层参考](/zh/reference/bun-compat-layer) — Bun API 详情
- [Deno 兼容层参考](/zh/reference/deno-compat-layer) — Deno API 详情
