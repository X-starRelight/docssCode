# For 循环表达式

BON 支持编译期循环表达式，用于遍历数组和对象生成 JSON 数组。

## 语法

```bon
for (var) in (iterable) { body }
```

## 遍历数组

```bon
# 基础用法
{"outputs": for x in [1, 2, 3] { x * 2 }}
# 输出: {"outputs": [2, 4, 6]}

# 空数组
{"outputs": for x in [] { x }}
# 输出: {"outputs": []}
```

## 遍历对象

```bon
# 遍历对象值
{"values": for v in {"a": 1, "b": 2} { v }}
# 输出: {"values": [1, 2]}
```

## 嵌套表达式

```bon
# 在对象中使用
{
    "processed": for item in [1, 2, 3, 4, 5] {
        if (item > 3) { item } else { 0 }
    }
}
# 输出: {"processed": [0, 0, 0, 4, 5]}
```

## 变量作用域

循环变量在循环体内有效，循环结束后销毁：

```bon
{
    "result": for x in [1, 2, 3] { x },
    # x 在此处不可用
}
```

## 限制

- 只能遍历数组或对象
- 循环体必须返回单个值
- 返回值始为数组类型
- 不支持对象属性访问（`for k in obj`）

## 应用场景

- 批量生成配置节点
- 数据转换管道
- 数组映射