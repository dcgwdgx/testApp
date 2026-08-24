# Pet Portrait AI 构建与维护检查表

本文件用于开发和发布时快速核对。完整说明见 `docs` 目录。

## 每次修改后

1. 运行 `npm run typecheck`。
2. 在目标平台验证上传照片、选择风格、生成、保存和分享。
3. 涉及内购时，必须使用商店沙盒或测试账号验证真实商品信息和交易回调。
4. 检查 `git diff`，不要提交 `.env`、商店服务账号 JSON、证书或其他密钥。

## 每次 iOS 构建前

1. 确认 App Store Connect 中最近使用的构建号。
2. GitHub Actions 使用 `github.run_number` 注入 `IOS_BUILD_NUMBER`；手动本地构建时需要自行设置唯一构建号。
3. 确认 `EXPO_TOKEN` 和 App Store 提交凭据有效。
4. 提交并推送后，`master` 分支会触发 iOS 构建与 TestFlight 提交流程。

## 每次 Android 构建前

1. GitHub Actions 使用 `github.run_number` 注入 `ANDROID_VERSION_CODE`。
2. 确认 `EXPO_TOKEN` 和 `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` 可用。
3. `master` 分支会构建 AAB，并尝试提交到 Google Play 生产轨道。
4. 注意 `eas.json` 的 Android 提交状态为草稿，而备用上传脚本会把版本设置为 `completed`；发布前必须在 Google Play Console 核对最终轨道和状态。

## Google Play 商品详情更新

1. 运行 `npm run store:assets` 重新生成素材。
2. 检查 5 张截图和 `google-play-feature-1024x500.png` 的尺寸与内容。
3. 当免费次数、商品模式或设计数量变化时，同步修改短说明和完整说明。
4. 手机、7 英寸平板和 10 英寸平板目前使用同一组 5 张截图。
5. 在 AI 资源声明中标记生成或编辑过的置顶大图和截图。
6. 保存商品详情后，进入“发布概览”提交全部预期变更。
7. 在 `docs/构建发布与商店.md` 的发布记录中补充日期、内容和结果。

Google Play 视频只能填写公开或“不公开列出”的 YouTube 地址。仓库中的 MP4 不能直接上传；视频还必须关闭广告和年龄限制。

## 现有商品

- `gen_10_1`：10 次生成。
- `gen_30`：30 次生成。
- `gen_60`：60 次生成。

这些商品都是消耗型商品。普通版本发布不要重复创建商品；项目当前没有订阅商品。

## 架构摘要

- 框架：Expo SDK 54、Expo Router、React Native。
- AI：火山引擎 Ark API，豆包 Seedream 5.0 Lite。
- 构建：GitHub Actions 调用 EAS CLI。
- iOS 发布：构建 IPA 后提交 TestFlight。
- Android 发布：构建 AAB 后提交 Google Play。
- 数据：图片、历史、积分、交易去重和分析事件主要保存在当前设备。
