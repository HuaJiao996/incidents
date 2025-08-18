# Rule Engine 测试

这个目录包含了规则引擎模块的单体测试。

## 测试文件

- `rule-engine.test.ts` - RuleEngine 类的测试
- `expression-engine.test.ts` - ExpressionEngine 类的测试

## 运行测试

### 运行所有规则引擎测试
```bash
bun test packages/common/src/rengine/
```

### 运行特定测试文件
```bash
# 只运行 RuleEngine 测试
bun test packages/common/src/rengine/rule-engine.test.ts

# 只运行 ExpressionEngine 测试
bun test packages/common/src/rengine/expression-engine.test.ts
```

### 运行测试并显示详细输出
```bash
bun test packages/common/src/rengine/ --verbose
```

## 测试覆盖范围

### RuleEngine 测试覆盖
- ✅ 规则添加和验证
- ✅ 错误处理（空表达式、无效类型等）
- ✅ 优先级排序
- ✅ 规则执行逻辑
- ✅ 泛型类型支持
- ✅ 边界情况处理（空facts、null/undefined等）

### ExpressionEngine 测试覆盖
- ✅ 基本表达式评估（同步和异步）
- ✅ 日期相关transforms（date, after, before）
- ✅ 字符串相关transforms（contains, startsWith, endsWith, matches）
- ✅ 错误处理和边界情况
- ✅ 复杂表达式组合
- ✅ 嵌套对象处理
- ✅ 数组操作

## 测试架构说明

### Mock 策略
- `rule-engine.test.ts` 使用 mock 来隔离 ExpressionEngine 依赖
- `expression-engine.test.ts` 使用真实的 Jexl 引擎来测试实际功能

### 测试数据
测试使用各种模拟数据来验证不同场景：
- 用户数据（年龄、角色、状态）
- 事件数据（名称、时间戳）
- 告警数据（服务、严重程度）
- 标签数组

## 注意事项

1. **Jexl 语法**：测试中使用 `==` 而不是 `===` 进行比较，因为 Jexl 使用不同的比较语法
2. **Console 输出**：某些测试会模拟 console.log 和 console.error 以避免测试输出中的噪音
3. **异步处理**：所有涉及表达式评估的测试都正确处理了异步操作

## 扩展测试

如果需要添加新的测试用例：

1. 对于 RuleEngine，在 mock 中添加新的表达式模式
2. 对于 ExpressionEngine，直接使用真实的 Jexl 表达式
3. 确保测试覆盖正常情况和边界情况
4. 添加适当的错误处理测试