# Pet Portrait AI

Pet Portrait AI 是一款基于 Expo SDK 54 的移动应用。用户上传一张宠物照片，选择场景或艺术风格并调整风格强度后，应用调用火山引擎图像生成接口制作宠物肖像。结果可以进行原图对比、保存、分享，并保留最近的生成历史。

## 当前功能

- 24 个场景化设计，分为礼物、回忆、节日、趣味和艺术五类。
- 上传、裁剪并压缩宠物照片，生成前统一处理为最大 1024×1024 的 JPEG。
- 调整生成风格强度。
- 调用豆包 Seedream 5.0 Lite 生成 2K 图片。
- 生成接口超时 120 秒，失败时最多重试 2 次。
- 查看生成结果、原图和滑动对比。
- 保存到系统相册或调用系统分享。
- 本机保存最近 10 条生成历史。
- 1 次免费体验，之后使用一次性购买的生成积分。
- iOS、Android 和 Web 开发入口；应用内购买仅在移动端可用。

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 应用框架 | Expo SDK 54、React Native 0.81、React 19 |
| 路由 | Expo Router 6 |
| AI 生成 | 火山引擎 Ark API、豆包 Seedream 5.0 Lite |
| 本地存储 | AsyncStorage |
| 内购 | react-native-iap |
| 图片处理 | expo-image-picker、expo-image-manipulator |
| 保存与分享 | expo-media-library、expo-sharing |
| 构建发布 | GitHub Actions、EAS CLI |
| 商店素材 | Node.js、Sharp、FFmpeg（由素材脚本调用） |

## 快速开始

环境要求：

- Node.js 20 或兼容版本。
- npm。
- Expo/EAS 所需的 iOS 或 Android 开发环境。
- 可用的火山引擎 Ark API 密钥。

安装并启动：

```powershell
Copy-Item .env.example .env
npm ci
npm start
```

在 `.env` 中填写：

```dotenv
ARK_API_KEY=你的火山引擎密钥
```

常用命令：

| 命令 | 用途 |
| --- | --- |
| `npm start` | 启动 Expo 开发服务器 |
| `npm run android` | 在 Android 环境打开 |
| `npm run ios` | 在 iOS 环境打开 |
| `npm run web` | 启动 Web 版本 |
| `npm run typecheck` | 运行 TypeScript 类型检查 |
| `npm run store:assets` | 重新生成商店截图、置顶大图和视频素材 |

详细的开发配置、密钥管理和排错方法见[开发与配置](docs/开发与配置.md)。

## 商品与免费次数

项目沿用 App Store Connect 和 Google Play Console 中已经存在的消耗型商品，不使用订阅：

| 商品 ID | 生成次数 | 代码中的离线备用价格 |
| --- | ---: | ---: |
| `gen_10_1` | 10 | 0.99 美元 |
| `gen_30` | 30 | 1.99 美元 |
| `gen_60` | 60 | 2.99 美元 |

应用优先显示商店返回的本地化价格；上表价格只在商店信息不可用时作为备用显示。新用户有 1 次免费生成机会。积分、免费次数和已处理交易标识保存在当前设备上。

除非商品 ID、积分数量或计费模式发生变化，否则不要重新创建商品。购买流程和已知边界见[构建发布与商店](docs/构建发布与商店.md)。

## 商店素材

运行 `npm run store:assets` 后，最终素材写入 `store-assets/final`：

- `google-play-feature-1024x500.png`：Google Play 置顶大图。
- `screenshots/01-one-photo-keepsake.png` 至 `05-simple-pricing.png`：5 张商店截图。
- `pet-portrait-preview-1080x1920.mp4`：竖版预览视频母版。
- `video-slides`：生成预览视频所使用的静态画面。

Google Play 的商品详情视频字段只接受公开或“不公开列出”的 YouTube 地址，不能直接上传仓库里的 MP4。YouTube 视频必须关闭广告和年龄限制。

2026-08-09 已将默认 `en-US` 商品详情的短说明、完整说明、手机截图、7 英寸平板截图、10 英寸平板截图和置顶大图共 6 项变更提交 Google 审核。该日期是发布记录，不代表当前实时审核状态；当前状态应以 Google Play Console 的“发布概览”为准。

## 项目结构

```text
app/                 页面与路由
components/          可复用界面组件
lib/                 API、内购、存储、分析、风格与主题
assets/              应用图标、启动图和网页图标
scripts/             商店素材生成和 Google Play 上传脚本
store-assets/        商店素材源文件、生成说明和最终产物
.github/workflows/   iOS、Android 和模拟器构建流程
docs/                开发、架构、发布和测试文档
app.config.js        Expo 应用配置
eas.json             EAS 构建和提交配置
privacy.html         对外隐私政策网页
```

## 文档导航

- [开发与配置](docs/开发与配置.md)：环境、命令、配置、密钥和常见问题。
- [架构与数据](docs/架构与数据.md)：页面、模块、生成流程、本地存储、第三方服务和安全边界。
- [构建发布与商店](docs/构建发布与商店.md)：GitHub Actions、EAS、双平台发布、商品和商店素材。
- [测试清单](docs/测试清单.md)：发布前的功能、内购、权限、异常和商店检查。
- [商店素材生成说明](store-assets/PROMPTS.md)：源图要求、生成指令和最终素材用途。

## 当前已知限制

- `ARK_API_KEY` 通过 Expo `extra` 注入客户端，发布包中的密钥可能被提取。正式扩大用户量前应改为由受控后端代理调用 AI 服务。
- 购买积分、免费次数和交易去重主要在本机完成，没有服务端收据校验或跨设备同步。
- 分析事件目前只写入本机队列，没有上传到远程分析平台，因此还不能用于查看真实转化漏斗。
- 生成历史只保存在当前设备，最多 10 条；卸载应用或清除应用数据会丢失。
- Web 版本不支持应用内购买。
- 项目目前有类型检查，但没有自动化单元测试、端到端测试和代码检查命令。

这些限制不阻止当前小规模上线验证，但涉及密钥、付费和数据分析的三项在扩大投放前应优先处理。
