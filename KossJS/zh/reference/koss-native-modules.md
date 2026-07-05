# Koss 原生模块参考

本文档详细列出 KossJS 的 6 个原生模块（`koss:*`）及其 API。

> **Builtin 标志**：`KOSS_BUILTIN_KOSS`（`1 << 3`）  
> **设计原则**：同步优先、纯 Uint8Array、零外部依赖

---

## 模块总览

| 模块 | 导入路径 | 说明 | 行数 |
|------|----------|------|------|
| koss:io | `require('koss:io')` | 统一 I/O（文件+网络+流） | 172 |
| koss:crypto | `require('koss:crypto')` | 加密与安全 | 73 |
| koss:system | `require('koss:system')` | 系统信息 | 106 |
| koss:data | `require('koss:data')` | 数据编码（Hex/Base64） | 122 |
| koss:ffi | `require('koss:ffi')` | 外部函数接口 | 62 |
| koss:worker | `require('koss:worker')` | 工作线程 | 77 |

---

## koss:io — 统一 I/O 模块

**导入：** `require('koss:io')` 或 `import io from 'koss:io'`

### 文件操作

所有文件操作均为同步 API。

| 函数 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `read(path)` | `string` | `Uint8Array` | 读取文件为字节数组 |
| `readText(path)` | `string` | `string` | 读取文件为 UTF-8 文本 |
| `write(path, data)` | `string, string\|Uint8Array` | `void` | 写入文件 |
| `writeText(path, text)` | `string, string` | `void` | 写入文本文件 |
| `stat(path)` | `string` | `StatObject` | 获取文件元数据 |
| `list(path)` | `string` | `string[]` | 列出目录内容 |
| `mkdir(path, options?)` | `string, object?` | `void` | 创建目录 |
| `rm(path, options?)` | `string, object?` | `void` | 删除文件/目录 |
| `cp(src, dst)` | `string, string` | `void` | 复制文件 |
| `mv(src, dst)` | `string, string` | `void` | 移动/重命名 |
| `exists(path)` | `string` | `boolean` | 检查文件是否存在 |
| `watch(path, callback)` | `string, function` | `Watcher` | 文件监控（轮询） |

**StatObject 结构：**

```javascript
{
    size: number,       // 文件大小（字节）
    mtime: number,      // 修改时间（毫秒时间戳）
    ctime: number,      // 创建时间（毫秒时间戳）
    isFile: boolean,    // 是否为文件
    isDir: boolean,     // 是否为目录
    isSymlink: boolean, // 是否为符号链接
}
```

**Watcher 结构：**

```javascript
{
    close: function()   // 停止监控
}
```

### 网络操作

| 函数 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `connect(host, port)` | `string, number` | `Socket` | 建立 TCP 连接 |
| `serve(options, handler?)` | `object, function?` | `Server` | 启动 TCP 服务器 |
| `fetch(url, options?)` | `string, object?` | `Response` | HTTP 请求 |
| `dns(hostname)` | `string` | `string` | DNS 解析 |

**Server 结构：**

```javascript
{
    port: number,
    hostname: string,
    accept: function(),   // 接受连接
    close: function()     // 关闭服务器
}
```

### 流操作

| API | 类型 | 说明 |
|-----|------|------|
| `ReadStream` | `class` | 可读流 |
| `WriteStream` | `class` | 可写流 |
| `createReadStream(path)` | `function` | 创建可读流 |
| `createWriteStream(path)` | `function` | 创建可写流 |
| `pipeline(src, dst)` | `function` | 流管道传输 |

### 使用示例

```javascript
const io = require('koss:io');

// 文件操作
io.writeText('/tmp/hello.txt', 'Hello KossJS!');
const text = io.readText('/tmp/hello.txt');
const info = io.stat('/tmp/hello.txt');
console.log(info.size, info.isFile);

// 二进制操作
io.write('/tmp/data.bin', new Uint8Array([1, 2, 3]));
const bytes = io.read('/tmp/data.bin');

// 目录操作
io.mkdir('/tmp/testdir', { recursive: true });
const entries = io.list('/tmp');
io.rm('/tmp/testdir', { recursive: true });

// 文件监控
const watcher = io.watch('/tmp/test.txt', (event, path) => {
    console.log(`${event}: ${path}`);
});
watcher.close();

// 网络操作
io.connect('example.com', 80);
const server = io.serve({ port: 8080 }, (req, res) => {});
io.dns('example.com');
```

---

## koss:crypto — 加密与安全模块

**导入：** `require('koss:crypto')` 或 `import crypto from 'koss:crypto'`

| 函数 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `hash(algorithm, data)` | `string, string` | `string` | 计算哈希 |
| `hmac(algorithm, key, data)` | `string, string, string` | `string` | HMAC 计算 |
| `randomBytes(n)` | `number` | `Uint8Array` | 生成 n 字节随机数 |
| `uuid()` | — | `string` | 生成 UUID v4 |
| `pbkdf2(password, salt, iterations, keylen)` | `string, string, number, number` | `Uint8Array` | PBKDF2 密钥派生 |
| `sign(privateKey, data)` | `string, string` | `Uint8Array` | HMAC-SHA256 签名 |
| `verify(publicKey, data, signature)` | `string, string, Uint8Array` | `boolean` | 验证签名 |
| `encrypt(algorithm, key, data)` | `string, string, string` | `Uint8Array` | 基于哈希的加密 |
| `decrypt(algorithm, key, data)` | `string, string, string` | `Uint8Array` | 解密（同 encrypt） |
| `algorithms` | — | `string[]` | 支持的算法列表 |

**支持的算法：** `['sha1', 'sha256', 'sha384', 'sha512', 'md5']`

```javascript
const crypto = require('koss:crypto');

// 哈希
const sha256 = crypto.hash('sha256', 'hello world');
const md5 = crypto.hash('md5', 'test data');

// HMAC
const mac = crypto.hmac('sha256', 'secret-key', 'message');

// 随机数
const bytes = crypto.randomBytes(32);
const id = crypto.uuid();

// 签名与验证
const sig = crypto.sign('my-key', 'important data');
const valid = crypto.verify('my-key', 'important data', sig);

// 密钥派生
const key = crypto.pbkdf2('password', 'salt', 100000, 32);
```

---

## koss:system — 系统与进程模块

**导入：** `require('koss:system')` 或 `import system from 'koss:system'`

| 函数 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `arch()` | — | `string` | CPU 架构（`'x64'`/`'arm64'` 等） |
| `platform()` | — | `string` | 操作系统平台 |
| `hostname()` | — | `string` | 主机名 |
| `cpus()` | — | `object[]` | CPU 信息列表 |
| `memory()` | — | `{total, free, used}` | 内存使用情况（字节） |
| `uptime()` | — | `number` | 进程运行时间（秒） |
| `loadavg()` | — | `[number, number, number]` | 系统负载平均值 |
| `env(key?)` | `string?` | `string \| object` | 环境变量 |
| `pid()` | — | `number` | 当前进程 ID |
| `exit(code?)` | `number?` | 不返回 | 退出进程 |
| `cwd()` | — | `string` | 当前工作目录 |
| `chdir(path)` | `string` | `void` | 切换工作目录 |
| `version()` | — | `string` | Node.js 版本字符串 |
| `versions()` | — | `object` | 各组件版本信息 |
| `nextTick(fn)` | `function` | `void` | 在下一个微任务中执行 |

```javascript
const sys = require('koss:system');

console.log(sys.arch());      // 'x64'
console.log(sys.platform());  // 'win32' / 'linux' / 'darwin'
console.log(sys.hostname());  // 'DESKTOP-ABC'

const mem = sys.memory();
console.log('Used:', mem.used, 'bytes');

const home = sys.env('HOME') || sys.env('USERPROFILE');
console.log('Home:', home);

sys.nextTick(() => {
    console.log('Executed in next tick');
});
```

---

## koss:data — 数据与编码模块

**导入：** `require('koss:data')` 或 `import data from 'koss:data'`

全部基于纯 `Uint8Array` 实现，无 `Buffer` 依赖。

| 函数 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `encode(text)` | `string` | `Uint8Array` | 文本编码为字节（Latin-1） |
| `decode(bytes)` | `Uint8Array` | `string` | 字节解码为文本（Latin-1） |
| `concat(...buffers)` | `Uint8Array...` | `Uint8Array` | 拼接多个字节数组 |
| `compare(a, b)` | `Uint8Array, Uint8Array` | `number` | 比较字节数组（-1/0/1） |
| `isEqual(a, b)` | `Uint8Array, Uint8Array` | `boolean` | 判断两个字节数组是否相等 |
| `toHex(bytes)` | `Uint8Array` | `string` | 字节数组转十六进制字符串 |
| `fromHex(hex)` | `string` | `Uint8Array` | 十六进制字符串转字节数组 |
| `toBase64(bytes)` | `Uint8Array` | `string` | 字节数组转 Base64 字符串 |
| `fromBase64(b64)` | `string` | `Uint8Array` | Base64 字符串转字节数组 |

```javascript
const data = require('koss:data');

// 编码/解码
const bytes = data.encode('Hello KossJS');
const text = data.decode(bytes);

// 拼接
const combined = data.concat(bytes, data.encode(' World'));

// 十六进制
const hex = data.toHex(combined);
const back = data.fromHex(hex);

// Base64
const b64 = data.toBase64(combined);
const original = data.fromBase64(b64);

// 比较
const equal = data.isEqual(bytes, data.encode('Hello KossJS'));
const cmp = data.compare(bytes, data.encode('Other'));
```

---

## koss:ffi — 外部函数接口模块

**导入：** `require('koss:ffi')` 或 `import ffi from 'koss:ffi'`

> **依赖**：桌面平台（Windows、Linux、macOS）  
> **Capability**：需要 FFI 相关能力位（`FFI_OPEN`、`FFI_CALL` 等）  
> **Stable 模式**：`stable=true` 时不可用

| 函数 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `open(path)` | `string` | `NativeLib` | 打开动态库 |
| `dlopen(path)` | `string` | `NativeLib` | 同 `open`（别名） |
| `malloc(size)` | `number` | `Pointer` | 分配内存 |
| `free(pointer)` | `Pointer` | `void` | 释放内存 |
| `addressOf(pointer)` | `Pointer` | `number` | 获取指针地址 |
| `createCallback(fn, signature)` | `function, string` | `Callback` | 创建回调 |
| `strerror(errno)` | `number` | `string` | 获取错误信息 |

**NativeLib 结构：**

```javascript
{
    fn: function(name, options),      // 获取函数引用
    struct: function(name, options),  // 定义结构体
    close: function()                 // 关闭动态库
}
```

```javascript
const ffi = require('koss:ffi');

// 打开动态库
const lib = ffi.open('user32.dll');

// 获取函数
const MessageBox = lib.fn('MessageBoxA', {
    args: ['pointer', 'string', 'string', 'int'],
    returns: 'int'
});

// 调用函数
MessageBox(0, 'Hello', 'KossJS FFI', 0);

// 关闭
lib.close();
```

---

## koss:worker — 工作线程模块

**导入：** `require('koss:worker')` 或 `import worker from 'koss:worker'`

> **Capability**：需要 Worker 能力位  
> **Stable 模式**：`stable=true` 时不可用  
> **数据传递**：使用 JSON 序列化

| 函数 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| `createPool(size?)` | `number?` | `WorkerPool` | 创建线程池（默认 4 线程） |
| `post(data)` | `any` | `void` | 发送消息 |
| `receive()` | — | `any \| null` | 接收消息（非阻塞） |
| `terminate()` | — | `void` | 终止 |

**WorkerPool 结构：**

```javascript
{
    execute: function(code) -> Promise,   // 执行 JS 代码
    post: function(data) -> void,         // 发送消息
    receive: function() -> any | null,    // 接收消息
    terminate: function() -> void,        // 终止
    shutdown: function() -> void          // 关闭
}
```

```javascript
const worker = require('koss:worker');

// 创建线程池
const pool = worker.createPool(4);

// 执行代码
pool.execute('var x = 1 + 2; x;').then(result => {
    console.log('Result:', result);
});

// 消息传递
pool.post({ task: 'compute', data: [1, 2, 3] });
const msg = pool.receive();

// 清理
pool.shutdown();
```

---

## 使用示例

### Koss 原生风格

```javascript
const io = require('koss:io');
const crypto = require('koss:crypto');
const sys = require('koss:system');
const data = require('koss:data');

// 文件 + 加密
io.writeText('/tmp/secret.txt', 'Hello World');
const content = io.readText('/tmp/secret.txt');
const hash = crypto.hash('sha256', content);
const hex = data.toHex(hash);
console.log(`SHA256: ${hex}`);

// 系统信息
console.log(`${sys.platform()} / ${sys.arch()}`);
console.log(`CPU: ${sys.cpus().length} cores`);
```

### ESM 风格

```javascript
import { read, write, stat } from 'koss:io';
import { hash, randomBytes } from 'koss:crypto';
import { arch, platform, memory } from 'koss:system';

const info = stat('/tmp/test.txt');
const sha256 = hash('sha256', 'data');
const mem = memory();
console.log(platform(), arch(), mem.total);
```

### 纯 Uint8Array 操作

```javascript
const io = require('koss:io');
const data = require('koss:data');
const crypto = require('koss:crypto');

// 不需要 Buffer 类
const bytes = io.read('/tmp/data.bin');
const hex = data.toHex(bytes);
const hash = crypto.hash('sha256', data.decode(bytes));
```

---

## 相关文档

- [内置模块系统指南](/zh/guide/builtin-modules)
- [ESM Import 支持指南](/zh/guide/esm-import)
- [Node.js 兼容层参考](/zh/reference/node-compat-layer)
- [Bun 兼容层参考](/zh/reference/bun-compat-layer)
- [Deno 兼容层参考](/zh/reference/deno-compat-layer)
