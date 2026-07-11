# closeAsync — 异步关闭库

异步关闭库句柄，等待所有异步任务和 Worker 完成后释放资源。

> [!NOTE]
> 此 API 暂时仅 JavaScript/TypeScript 版支持。Python 版暂时仅有同步 `close()`。

## 签名

```ts
await lib.closeAsync();
```

## 与 close() 的区别

| | `close()` | `closeAsync()` |
|--|----------|---------------|
| 调用方式 | 同步 | `await` 异步 |
| 等待异步任务 | 否 | 是 |
| Worker 清理 | 否 | 是 |

---

**详细文档**:
- [closeAsync() (JavaScript)](/zh/js/api/closeAsync-js)
