# 中国移动 Hark iOS 27 风格小组件：安装与排障

这份说明对应仓库提交 [`7766612`](https://github.com/zhaohaibao19-cmyk/meituan-hark-rules/commit/776661285af29a24c6077009fd7d107213b9f574) 中的 `china-mobile-hark-ios27.yaml` 和 `china-mobile-hark-ios27.js`。小组件可显示剩余话费、通用/其他流量、语音和用量洞察；“iOS 27 风格”指视觉样式，不代表对特定 iOS 版本的兼容性承诺。

## 安装

1. 在 Hark 或 Egern 的模块页面添加并启用配置：
   [导入 YAML](https://raw.githubusercontent.com/zhaohaibao19-cmyk/meituan-hark-rules/main/china-mobile-hark-ios27.yaml)。
2. 在模块设置中填写 `CM_PHONENUMBER`：输入自己的 11 位中国移动手机号。留空时只能使用脚本此前保存的号码；首次使用建议直接填写。若单独配置定时任务中的号码，也要与组件号码一致，或留空使用已保存号码。
3. 安装并信任 Egern CA：按 Egern 的证书设置提示完成安装；然后在 iPhone 打开“设置 → 通用 → 关于本机 → 证书信任设置”，开启该 CA 的完全信任。配置只对 YAML 中列出的中国移动域名启用 MITM：`client.app.coc.10086.cn` 和 `10086.online-cmcc.cn`。
4. 确认模块中的组件、定时保活、登录请求捕获和 Cookie 响应捕获脚本均已启用。首次登录建议使用短信验证码，而不是面容/指纹快捷登录。
5. 打开“中国移动”App，用短信验证码完成登录，并停留片刻。首次捕获成功时应收到“中国移动”通知。之后在 iOS 添加名为 `china-mobile-hark-ios27` 的 Hark/Egern 小组件到主屏幕或锁屏。

如果首次没有通知，先按下方排障项检查；登录捕获脚本默认只在首次捕获或登录恢复时通知。想临时检查每次捕获，可把 `CM_CAPTURE_NOTIFY` 设为 `true`。

## 外观与可选设置

在 `CM_GLASS_APPEARANCE` 中选择：`ultra-clear`（超清透）、`balanced`（均衡，默认）或 `fully-tinted`（全着色）。另外，`CM_SHOW_USED_FLOW=true` 会显示已用流量而不是剩余流量；`CM_TITLE` 可改组件标题；`CM_DEBUG=true` 会在组件上显示诊断信息，排障后建议关闭。

组件请求数据时会显示话费、流量和语音；配置还安排了每 20 分钟一次的后台会话保活。系统可能限制后台任务及小组件刷新，因此 20 分钟和页面上的刷新时间都是请求/刷新目标，不保证 iOS 一定准点执行。

## 常见问题

- **显示“还没抓到登录参数”**：检查四类脚本是否启用、Egern CA 与 iOS 完全信任是否已完成，然后打开“中国移动”App，用短信验证码重新登录并停留片刻。确认 `CM_CAPTURE` 为 `true`。
- **提示填写手机号**：在模块环境变量 `CM_PHONENUMBER` 中填写 11 位中国移动号码；保存后刷新组件。不要把手机号发给他人或贴进公开 issue。
- **查询失败、数据是 `--` 或一直不更新**：先检查网络、模块是否启用及 CA 信任，再重新打开中国移动 App 等几秒，让请求捕获和 Cookie 更新有机会运行，然后刷新组件。仍不行时，重新短信登录；如果刚登录后仍失败，可能是 App 接口或加密参数已变化。
- **登录过期**：配置会尝试自动续期并每 20 分钟保活；持续失败时，按通知提示打开中国移动 App。必要时重新用短信验证码登录，以便重新捕获参数和 Cookie。
- **想停止抓取 App 流量**：将 `CM_CAPTURE` 设为 `false`。这会停止从 App 捕获新的登录参数和 Cookie；再次需要重新登录或捕获时应改回 `true`。停止使用整个模块后，也可在 Egern 中停用模块，并撤销/移除不再需要的 CA 信任。

## 隐私与安全

为解析中国移动 App 的 HTTPS 登录流量，本配置需要信任 Egern CA，并只对上述两个域名执行 MITM。脚本会把捕获到的加密登录参数、Cookie、请求头及手机号（若填写）保存在 Egern 的本地持久化存储，用于查询和续期；不要导出后公开分享模块数据、Cookie 或完整诊断日志。请仅在信任配置来源并确有需要时启用 CA 信任；不再使用时可关闭模块并撤销信任。

## 仓库配置与脚本直链

以下三份 YAML 配置都可以直接导入：

- 美团去广告：[`Meituan-hark.yaml`](https://raw.githubusercontent.com/zhaohaibao19-cmyk/meituan-hark-rules/main/Meituan-hark.yaml)
- 腾讯文档去广告：[`TencentDocs-hark.yaml`](https://raw.githubusercontent.com/zhaohaibao19-cmyk/meituan-hark-rules/main/TencentDocs-hark.yaml)
- 中国移动 iOS 27 小组件：[`china-mobile-hark-ios27.yaml`](https://raw.githubusercontent.com/zhaohaibao19-cmyk/meituan-hark-rules/main/china-mobile-hark-ios27.yaml)；如遇到旧缓存，可用[固定版本链接](https://raw.githubusercontent.com/zhaohaibao19-cmyk/meituan-hark-rules/776661285af29a24c6077009fd7d107213b9f574/china-mobile-hark-ios27.yaml)。

仓库内的独立 JavaScript 脚本是[`china-mobile-hark-ios27.js`](https://raw.githubusercontent.com/zhaohaibao19-cmyk/meituan-hark-rules/main/china-mobile-hark-ios27.js)，由中国移动 YAML 配置调用，不是单独导入的规则；美团和腾讯文档配置都是 YAML 规则，没有额外的仓库内 JS 文件。

## 参考

- [公开仓库](https://github.com/zhaohaibao19-cmyk/meituan-hark-rules)
- [对应提交](https://github.com/zhaohaibao19-cmyk/meituan-hark-rules/commit/776661285af29a24c6077009fd7d107213b9f574)

说明依据上述提交中的配置与脚本整理，未在用户的实际设备上完成登录或小组件实测。当前 YAML 内的脚本地址指向仓库 `main` 分支，因此后续脚本更新会跟随 `main`，不完全锁定在本说明引用的提交。
