# 美团 Hark 去广告规则

适用于 Hark 的美团 App / 美团外卖广告拦截规则。规则仅匹配社区规则中已标记的广告接口和广告素材目录，不对整个图片域名或美团主域名做宽泛拦截。

## 使用

将 [`Meituan-hark.yaml`](./Meituan-hark.yaml) 导入 Hark。HTTPS URL 重写需要开启 MITM 并信任对应证书；如遇到加载异常，可先停用规则定位影响项。

## 规则来源

- [ihxperfect/loon-plugin：AdBlock.plugin](https://github.com/ihxperfect/loon-plugin/blob/main/AdBlock.plugin)
- [BlueGrave/Surge：WhiteList.sgmodule](https://github.com/BlueGrave/Surge/blob/master/Module/WhiteList.sgmodule)

社区规则可能随 App 更新而失效，请反馈可复现的误拦截或漏拦截路径。

## 腾讯文档

腾讯文档规则单独保存在 [`TencentDocs-hark.yaml`](./TencentDocs-hark.yaml)，可单独导入 Hark。规则精确匹配两个 `GetAds` 接口，并兼容带或不带查询参数的请求；HTTPS URL 重写需要开启 MITM 并信任对应证书。

## 中国移动小组件

- 导入配置：[china-mobile-hark-ios27.yaml](https://raw.githubusercontent.com/zhaohaibao19-cmyk/meituan-hark-rules/776661285af29a24c6077009fd7d107213b9f574/china-mobile-hark-ios27.yaml)
- 配套脚本：[china-mobile-hark-ios27.js](https://raw.githubusercontent.com/zhaohaibao19-cmyk/meituan-hark-rules/776661285af29a24c6077009fd7d107213b9f574/china-mobile-hark-ios27.js)
- 安装与排障：[中国移动 Hark iOS 27 风格小组件说明](./中国移动-Hark-iOS27-安装与排障说明.md)

该组件需要安装并信任 Egern CA，并在中国移动 App 中完成首次短信验证码登录。请先阅读安装与排障说明，了解证书信任、登录参数捕获和本地会话数据保存方式。

## 新增小组件的长期规范

以后每个新小组件都按以下要求开发和交付：

- 视觉延续 iOS 27 / Liquid Glass 风格方向，同时保证小、中、大及锁屏等适用尺寸下清晰易读，并适配浅色与深色外观；视觉样式不应被表述为特定 iOS 版本兼容承诺。
- 默认保留原有业务功能、数据处理和登录逻辑；除非另有明确需求，不因改版而删改这些行为。
- 配置名称与组件名称保持一致，便于导入、查找和维护。
- 交付可导入的 YAML 配置 Raw 链接；如有独立 JS 脚本，也单独提供脚本 Raw 链接，并附中文安装与排障说明。
- 发布前检查所有将公开的配置、脚本、说明、示例和日志，确保不包含个人手机号、Cookie、会话令牌、认证请求头或其他账号数据；如需示例，只使用明确虚构且不可用于登录的占位内容。
