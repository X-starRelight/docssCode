# If/Else 表达式

BON 支持编译期条件表达式，用于基于参数或变量的值选择不同配置。

## 语法

```bon
if (condition) { expr } else { expr }
if (condition) { expr } else if (condition) { expr } else { expr }
if (condition) { expr }
```

## 基本用法

```bon
# 简单条件
{"mode": if (true) { "enabled" } else { "disabled" }}
# 输出: {"mode": "enabled"}
```

## 比较表达式

```bon
{"status": if (5 > 3) { "big" } else { "small" }}
# 输出: {"status": "big"}
```

## 链式 else-if

```bon
{"result": if (false) { "a" } else if (true) { "b" } else { "c" }}
# 输出: {"result": "b"}
```

## 与参数结合

```bon
# config.bon
{
    "timeout": if ($env == "prod") { 30 } else { 5 },
    "debug": if ($debug) { true } else { false }
}
```

## 返回值

- 条件为真时返回 `then` 分支的值
- 条件为假时返回 `else` 分支的值
- 没有 `else` 分支时在条件为假返回 `null`

## 限制

- 条件必须是布尔类型
- 表达式必须是合法的 BON 表达式
- 所有分支必须类型一致（推荐）

## 应用场景

- 环境特定配置（生产/开发）
- 端口开闭控制
- 功能开关