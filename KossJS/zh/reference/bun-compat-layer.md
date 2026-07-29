# Bun 兼容层参考

本文档详细列出 KossJS 的 Bun 兼容层（`koss:bun`）所有 API。

> **版本锚定**：基于 Bun **v1.1.x** 实现  
> **Builtin 标志**：`KOSS_BUILTIN_BUN`（`1 << 1`）  
> **文件位置**：`src/js_shims/bun_shim.js`（160 行）  
> **底层依赖**：委托 `koss:io`、`koss:crypto`、`koss:system` 实现

---

## 模块导入

```javascript
// ES Module (import)
import Bun from 'koss:bun';
import { version, write, file, serve } from 'koss:bun';

// CommonJS (require)
const Bun = require('koss:bun');
```

---

## API 列表

### Bun.version

**类型：** `string`  
**值：** `'1.1.42'`

返回 Bun 兼容层的版本号。

```javascript
console.log(Bun.version);  // '1.1.42'
```

---

### Bun.build

**类型：** `string`  
**值：** `'koss-bun-compat'`

返回构建标识符。

```javascript
console.log(Bun.build);  // 'koss-bun-compat'
```

---

### Bun.env

**类型：** `object`

返回环境变量对象（底层使用 `koss:system.env()`）。

```javascript
const PATH = Bun.env.PATH;
const HOME = Bun.env.HOME;
```

---

### Bun.argv

**类型：** `string[]`

返回命令行参数列表（当前简化实现，返回空数组）。

```javascript
console.log(Bun.argv);  // ['node', 'script.js', '--flag']
```

---

### Bun.write(path, data)

**类型：** `function`  
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| `path` | `string` | 文件路径 |
| `data` | `string \| Uint8Array` | 要写入的数据 |

向文件写入数据（同步）。

```javascript
Bun.write('/tmp/hello.txt', 'Hello Bun!');
Bun.write('/tmp/data.bin', new Uint8Array([1, 2, 3]));
```

> 注意：不支持文件描述符写入，仅支持文件路径。

---

### Bun.file(path)

**类型：** `function`  
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| `path` | `string` | 文件路径 |

返回 File 对象，支持链式调用。

**返回值：**

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `.size()` | `number` | 文件大小（同步） |
| `.text()` | `string` | 读取为 UTF-8 文本（同步） |
| `.json()` | `any` | 解析为 JSON（同步） |
| `.arrayBuffer()` | `ArrayBuffer` | 读取为 ArrayBuffer（同步） |
| `.exists()` | `boolean` | 文件是否存在（同步） |
| `.stream()` | `never` | 抛出错误（不支持） |

```javascript
const file = Bun.file('/tmp/hello.txt');
console.log(file.size());      // 文件大小
console.log(file.text());      // 文件内容
console.log(file.json());      // JSON 解析
console.log(file.exists());    // 是否存在
```

---

### Bun.serve(options)

**类型：** `function`  
**参数：**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `options.port` | `number` | `3000` | 监听端口 |
| `options.hostname` | `string` | `'0.0.0.0'` | 监听主机 |

启动 HTTP 服务器（同步）。

**返回值：**

| 属性 | 类型 | 说明 |
|------|------|------|
| `.port` | `number` | 监听端口 |
| `.hostname` | `string` | 监听主机 |
| `.stop()` | `function` | 停止服务器 |
| `.reload(options)` | `function` | 重新加载（no-op） |
| `.ref()` | `function` | 引用计数增加 |
| `.unref()` | `function` | 引用计数减少 |

```javascript
const server = Bun.serve({ port: 3000, hostname: '0.0.0.0' });
console.log(`Server running on ${server.hostname}:${server.port}`);
server.stop();
```

---

### Bun.sleep(ms)

**类型：** `function`  
**参数：**
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `ms` | `number` | — | 延迟毫秒数 |

返回 Promise，在指定毫秒后 resolve。

```javascript
await Bun.sleep(1000);  // 延迟 1 秒
console.log('1 second later');
```

---

### Bun.inspect(value)

**类型：** `function`  
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| `value` | `any` | 要检查的值 |

返回 JSON 格式的字符串表示。

```javascript
console.log(Bun.inspect({ a: 1, b: [2, 3] }));
// 输出：{
//   "a": 1,
//   "b": [
//     2,
//     3
//   ]
// }
```

---

### Bun.peek(iterable)

**类型：** `function`  
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| `iterable` | `Iterable` | 可迭代对象 |

返回可迭代对象的第一个元素，但不消耗它。如果为空则返回 `undefined`。

```javascript
const first = Bun.peek([1, 2, 3]);  // 1
const empty = Bun.peek([]);          // undefined
```

---

### Bun.which(cmd)

**类型：** `function`  
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| `cmd` | `string` | 命令名称 |

查找可执行文件路径（简化实现，直接返回输入）。

```javascript
const node = Bun.which('node');
```

---

### Bun.randomUUIDv7()

**类型：** `function`

生成 UUID v4 字符串。

```javascript
const uuid = Bun.randomUUIDv7();
// 例如：'550e8400-e29b-41d4-a716-446655440000'
```

---

### Bun.resolve(path)

**类型：** `function`  
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| `path` | `string` | 文件路径 |

解析文件路径为绝对路径。

```javascript
const resolved = Bun.resolve('/tmp/../hello.txt');
console.log(resolved);  // '/hello.txt'
```

---

### Bun.hash(algorithm, data)

**类型：** `function`  
**参数：**
| 参数 | 类型 | 说明 |
|------|------|------|
| `algorithm` | `string` | 哈希算法（`'sha256'` 等） |
| `data` | `string` | 要哈希的数据 |

计算数据的哈希值。

```javascript
const hash = Bun.hash('sha256', 'hello');
```

---

### Bun.malloc(size)

**类型：** `function`  
**状态：** ❌ 不支持（抛出错误）

```javascript
try {
    Bun.malloc(1024);
} catch (e) {
    console.log(e.message);  // Bun malloc is not implemented in KossJS
}
```

---

### Bun.gc()

**类型：** `function`  
**状态：** ❌ 不支持（抛出错误）

```javascript
try {
    Bun.gc();
} catch (e) {
    console.log(e.message);  // Bun.gc is not implemented in KossJS
}
```

---

### Bun.readable(path)

**类型：** `function`  
**状态：** ❌ 不支持（抛出错误）

```javascript
try {
    Bun.readable('/tmp/file.txt');
} catch (e) {
    console.log(e.message);  // ReadableStream is not supported
}
```

---

## 未实现 API

以下 API 抛出明确的 `NotImplementedError`：

| API | 错误消息 |
|-----|----------|
| `Bun.sql()` | `Bun.sql is not implemented in KossJS (requires SQLite)` |
| `Bun.spawn()` | `Bun.spawn is not implemented in KossJS (requires child_process)` |
| `Bun.build()` | `Bun.build is not implemented in KossJS (no bundler)` |

---

## 使用示例

### 完整示例

```javascript
import { version, write, file, serve, sleep } from 'koss:bun';

// 版本信息
console.log(`Bun v${version}`);

// 写入文件
Bun.write('/tmp/bun-test.txt', 'Hello from Bun!');

// 读取文件
const content = Bun.file('/tmp/bun-test.txt').text();
console.log(content);

// 延迟
await Bun.sleep(500);

// 启动服务器
const server = Bun.serve({ port: 3000 });
console.log(`Listening on port ${server.port}`);
```

### 混合使用

```javascript
const io = require('koss:io');
const Bun = require('koss:bun');

// Bun 文件操作
Bun.write('/tmp/data.json', JSON.stringify({ hello: 'bun' }));

// Koss 原生文件操作
const data = io.readText('/tmp/data.json');
console.log(data);
```

---

## 相关文档

- [内置模块系统指南](/zh/guide/builtin-modules)
- [ESM Import 支持指南](/zh/guide/esm-import)
- [Node.js 兼容层参考](/zh/reference/node-compat-layer)
- [Deno 兼容层参考](/zh/reference/deno-compat-layer)
- [Koss 原生模块参考](/zh/reference/koss-native-modules)
