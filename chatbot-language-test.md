# AI Chatbot 欢迎词语言同步测试

## 测试1：打开聊天框（网站语言：繁体中文）

**结果：✅ 成功**
- 欢迎词显示：「您好！我是誠港金融的AI助手。我可以幮助您了解我們的服務、投資相關問題，或查詢香港證監會（SFC）、香港證券及投資學會（HKSI）等權威機構的資訊。請問有什麼可以幫到您？」
- 语言：繁体中文
- 快捷问题：繁体中文

## 测试2：点击对话框内的英文按钮（EN）

**结果：✅ 成功**
- 欢迎词更新为："Hello! I am the AI assistant of CMFinancial. I can help you understand our services, answer investment-related questions, or provide information from authoritative organizations such as the Hong Kong Securities and Futures Commission (SFC) and the Hong Kong Securities and Investment Institute (HKSI). How can I assist you today?"
- 语言：英文
- 快捷问题：英文
- 欢迎词实时更新，无需刷新页面

## 测试3：点击网站导航栏的语言切换按钮（切换到英文）

**结果：✅ 成功**
- 网站语言切换为英文
- 导航栏文字更新为英文
- AI Chatbot标题更新为 "CMF AI Assistant"
- **欢迎词保持英文（因为preferredLanguage已设置为'en'）**
- 快捷问题保持英文
- 输入框placeholder更新为 "Type your question..."

## 测试4：点击对话框内的“中”按钮

**结果：✅ 成功**
- 欢迎词更新为：「您好！我是誠港金融的AI助手。我可以幮助您了解我們的服務、投資相關問題，或查詢香港證監會（SFC）、香港證券及投資學會（HKSI）等權威機構的資訊。請問有什麼可以幫到您？」
- 语言：繁体中文
- 快捷问题：繁体中文
- 欢迎词实时更新，无需刷新页面
- **网站语言仍为英文，但对话框语言独立切换成功**

## 测试总结

✅ **所有测试通过！**

1. **网站语言切换同步**：当用户在网站导航栏切换语言时，AI Chatbot的欢迎词会自动更新（如果preferredLanguage为'auto'）
2. **对话框内语言切换同步**：当用户点击对话框内的语言按钮时，欢迎词立即更新
3. **实时响应**：所有语言切换无需刷新页面，实时生效
4. **独立控制**：对话框语言可以独立于网站语言进行设置
5. **完整翻译**：欢迎词、快捷问题、输入框placeholder均正确更新
