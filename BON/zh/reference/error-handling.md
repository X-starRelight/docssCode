# 错误处理

BON 秉持"尽早失败 (Fail Fast)"原则。

## 错误类型总览

| 错误类型 | 触发条件 | 错误码 |
|----------|----------|--------|
| `UndefinedTemplateError` | 引用了未定义的模板 | `E001` |
| `RecursiveTemplateError` | 模板循环引用 | `E002` |
| `UndefinedClassError` | 实例化了未定义的类 | `E003` |
| `CircularInheritanceError` | 类循环继承 | `E004` |
| `CircularDependencyError` | 计算属性循环依赖 | `E005` |
| `IndexOutOfBoundsError` | `std.at` 索引越界 | `E006` |
| `TypeError` | 类型不匹配 | `E007` |
| `CircularImportError` | 文件循环导入 | `E008` |

## 错误信息格式

```
E001: UndefinedTemplateError — 引用了未定义的模板 'foo'
  位置: 第 5 行, 第 10 列
```

错误信息包含：
1. **错误码**：唯一标识符（E001–E008）
2. **错误类型**：面向开发者的名称
3. **描述**：人类可读的错误原因
4. **源码位置**：行号和列号，便于定位

## Python 错误处理

```python
from bon_py.evaluator import evaluate, EvalError

try:
    result = evaluate('undefined_var')
except EvalError as e:
    print(f"错误码: {e.code}")    # E001
    print(f"错误信息: {e}")
    if e.pos:
        print(f"位置: 第 {e.pos.line} 行, 第 {e.pos.column} 列")
```

## TypeScript 错误处理

```typescript
import { evaluate, EvalError } from "bon-ts";

try {
  const result = evaluate("undefined_var");
} catch (e) {
  if (e instanceof EvalError) {
    console.log(`错误码: ${e.code}`);  // E001
    console.log(`错误信息: ${e.message}`);
    if (e.pos) {
      console.log(`位置: 第 ${e.pos.line} 行, 第 ${e.pos.column} 列`);
    }
  }
}
```
