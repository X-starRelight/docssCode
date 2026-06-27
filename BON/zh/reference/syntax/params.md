# 编译时参数

BON 支持通过 `$var` 语法注入编译时参数，用于环境特定的配置值。

## 语法

```bon
${var_name}
```

## 用法

```bon
# config.bon - 使用参数
{
    "env": $env,
    "debug": $debug,
    "replicas": $count
}
```

## CLI 使用

```bash
# 传递参数
bon config.bon --param env=production --param debug=false --param count=3
```

## 程序化使用

### Python

```python
from bon_py.evaluator import evaluate, load

# 字符串中使用参数
result = evaluate('{"env": $env}', params={"env": "production"})

# 从文件加载并传递参数
result = load("config.bon", params={"env": "production", "debug": False})
```

### TypeScript

```typescript
import { evaluate, load } from "bon-ts";

// 字符串中使用参数
const result = evaluate('{"env": $env}', ".", { env: "production" });

// 从文件加载并传递参数
const result = load("config.bon", { env: "production", debug: false });
```

## 参数类型

支持以下类型：
- 字符串：`"production"`, `"dev"`
- 数字：`42`, `3.14`
- 布尔值：`true`, `false`
- null：`null`

## 错误处理

```bon
{"env": $missing}  // 缺失参数会抛出错误 E009
```

## 应用场景

- 多环境配置（dev/staging/prod）
- 动态端口号分配
- 条件编译开关
- 构建参数注入