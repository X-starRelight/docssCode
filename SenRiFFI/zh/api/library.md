# Library

`Library` 类用于加载原生共享库，是 SenRi FFI 的入口。加载后可通过 `func()`、`funcAsync()` 等方法绑定 C 函数。

## 导入

```ts
import { Library } from '@tt23xrstudio/senri_ffi';
```

---

## `Library.load(path)` — 加载共享库

加载指定路径的原生共享库，返回一个 `Library` 实例。

```ts
const lib = Library.load(
  process.platform === 'win32' ? 'user32.dll' : 'libm.so.6'
);
```

### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `path` | `string` | 共享库的文件路径。Windows: `.dll`、Linux: `.so`、macOS: `.dylib` |

### 返回值

`Library` 实例。

### 各运行时实现

| 运行时 | 实现 |
|--------|------|
| KossJS | `_senri_ffi.open(path)` |
| Bun | `Bun.FFI.dlopen(path, {})` |
| Deno | `Deno.dlopen(path, {})` |
| Node.js | `koffi.load(path)` |

### 错误处理

加载失败时抛出 `FFIError`:

```ts
try {
  const lib = Library.load('/path/to/nonexistent.so');
} catch (e) {
  console.error(e.message); // "Failed to load library..."
}
```

---

**下一步**:
- [func() — 同步函数绑定](/zh/api/func)
- [funcAsync() — 异步函数绑定](/zh/api/funcAsync)
- [close() — 同步关闭库](/zh/api/close)
- [closeAsync() — 异步关闭库](/zh/api/closeAsync)
