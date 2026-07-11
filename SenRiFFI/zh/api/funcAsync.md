# funcAsync — 异步函数绑定

绑定一个 C 函数为异步调用，返回一个 async 函数。每次调用返回 `Promise`。

> [!NOTE]
> 此 API 暂时仅 JavaScript/TypeScript 版支持。Python 版暂时不支持异步 FFI 调用。

## 导入

```ts
import { Library, types } from '@tt23xrstudio/senri_ffi';
```

## 签名

```ts
const asyncFn = lib.funcAsync(name, returnType, [argTypes]);
const result = await asyncFn(...args);
```

## 异步实现因语言/运行时而异

| 语言/运行时 | 实现方式 |
|------------|---------|
| KossJS | 真实系统线程 (`std::thread`) + libffi |
| Deno | 原生非阻塞 (`nonblocking: true`) |
| Node.js | 单 Worker (`worker_threads`) |
| Bun | 单 Worker (Bun 的 `worker_threads` polyfill) |

---

**详细文档**:
- [funcAsync() (JavaScript)](/zh/js/api/funcAsync-js)
