# 美团 Hark 去广告规则

适用于 Hark 的美团 App / 美团外卖广告拦截规则。保留现有精准广告接口和素材路径拦截，并增加对指定响应内容的清理，不对整个图片域名或美团主域名做宽泛拦截。

## 使用

将 [`Meituan-hark.yaml`](./Meituan-hark.yaml) 导入 Hark。HTTPS URL 重写和响应体脚本需要开启 MITM 并信任对应证书；MITM 主机仅列出配置中实际匹配的精确域名。如遇到加载异常，可先停用规则定位影响项。

## 响应脚本效果

`Meituan-hark.js` 使用 Hark/Egern 的 `ctx.response.json()` 读取 JSON，并通过返回 `{ body: data }` 修改响应；解析失败或响应结构不符合预期时会原样放行。它按 Surge 参考模块的效果处理以下接口：

- 首页导航隐藏 `video`、`xiaotuan`，并确保保留 `homepage`、`mine`。
- 清空 `gwc_feed1_2265`、`personalcenter_2154` 两个 feed 场景。
- 个人中心移除 `mine_cross_recommend`。
- 清空搜索默认词与指定热词卡片/AI 搜索气泡。
- 清空 AI 技能卡、购物车顶部 banner 和开屏图片区域。

其中部分处理会隐藏推荐或入口，不限于传统广告；如不需要这些效果，可在 Hark 中停用该响应脚本。

## 规则来源

- [ihxperfect/loon-plugin：AdBlock.plugin](https://github.com/ihxperfect/loon-plugin/blob/main/AdBlock.plugin)
- [BlueGrave/Surge：WhiteList.sgmodule](https://github.com/BlueGrave/Surge/blob/master/Module/WhiteList.sgmodule)
- [用户提供的 SurgeRules 美团模块](https://raw.githubusercontent.com/muktsoen/SurgeRules/main/MT.sgmodule)
- [ZenmoFeiShi/Qx 上游响应脚本](https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/MT.js)
- [Egern JavaScript API：响应脚本](https://egernapp.com/zh-CN/docs/javascript-api)
- [Egern 脚本配置文档](https://egernapp.com/zh-CN/docs/configuration/scriptings/)

社区规则可能随 App 更新而失效，请反馈可复现的误拦截或漏拦截路径。

## 腾讯文档

腾讯文档规则单独保存在 [`TencentDocs-hark.yaml`](./TencentDocs-hark.yaml)，可单独导入 Hark。规则精确匹配两个 `GetAds` 接口，并兼容带或不带查询参数的请求；HTTPS URL 重写需要开启 MITM 并信任对应证书。

## 中国移动小组件

- 导入配置：[china-mobile-hark-ios27.yaml](https://raw.githubusercontent.com/zhaohaibao19-cmyk/meituan-hark-rules/776661285af29a24c6077009fd7d107213b9f574/china-mobile-hark-ios27.yaml)
- 配套脚本：[china-mobile-hark-ios27.js](https://raw.githubusercontent.com/zhaohaibao19-cmyk/meituan-hark-rules/776661285af29a24c6077009fd7d107213b9f574/china-mobile-hark-ios27.js)
- 安装与排障：[中国移动 Hark iOS 27 风格小组件说明](./中国移动-Hark-iOS27-安装与排障说明.md)

该组件需要安装并信任 Egern CA，并在中国移动 App 中完成首次短信验证码登录。请先阅读安装与排障说明，了解证书信任、登录参数捕获和本地会话数据保存方式。
