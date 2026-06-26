# 语言规范概览

BON（Better Object Notation）是一门**编译期执行的、声明式的数据转换语言**，是 JSON 的超集。

## 核心原则

1. **完全兼容 JSON**：所有标准 JSON 文件均是合法的 BON 文件
2. **零宿主负担**：所有逻辑在解析时求值完成，宿主拿到的永远是纯 JSON
3. **确定性**：图灵不完备（无循环、无随机、无系统时间），相同源码输出一致

## 语法结构总览

| 章节 | 说明 | 链接 |
|------|------|------|
| 注释 | 支持 `#` 和 `//` 两种单行注释 | [注释](/zh/reference/syntax/comments) |
| 数据类型 | 完全支持 JSON 六种类型 | [数据类型](/zh/reference/syntax/data-types) |
| 标识符 | 命名规则与约束 | [标识符](/zh/reference/syntax/identifiers) |
| 运算符 | 算术、比较、一元运算符 | [运算符](/zh/reference/syntax/operators) |
| 模板系统 | 消除重复配置的宏 | [模板系统](/zh/reference/syntax/templates) |
| 类 | 可复用的数据结构 | [类](/zh/reference/syntax/classes) |
| 继承 | 单继承机制 | [继承](/zh/reference/syntax/inheritance) |
| 导入系统 | 多文件拆分 | [导入系统](/zh/reference/syntax/imports) |

## 编译流程

```
BON 源码 → [词法分析] → [语法分析] → [导入解析] → [模板展开] → [实例化与常量折叠] → 纯 JSON
```

详细说明：[编译阶段](/zh/reference/compilation-phases)

## 错误处理

BON 提供 8 种错误类型（E001–E008），涵盖模板、类、继承、导入等场景。

详细说明：[错误处理](/zh/reference/error-handling)
