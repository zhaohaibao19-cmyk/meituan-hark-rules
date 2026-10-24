# 美团 Hark 去广告规则

适用于 Hark 的美团 App / 美团外卖广告拦截规则。规则仅匹配社区规则中已标记的广告接口和广告素材目录，不对整个图片域名或美团主域名做宽泛拦截。

## 使用

将 [`Meituan-hark.yaml`](./Meituan-hark.yaml) 导入 Hark。HTTPS URL 重写需要开启 MITM 并信任对应证书；如遇到加载异常，可先停用规则定位影响项。

## 规则来源

- [ihxperfect/loon-plugin：AdBlock.plugin](https://github.com/ihxperfect/loon-plugin/blob/main/AdBlock.plugin)
- [BlueGrave/Surge：WhiteList.sgmodule](https://github.com/BlueGrave/Surge/blob/master/Module/WhiteList.sgmodule)

社区规则可能随 App 更新而失效，请反馈可复现的误拦截或漏拦截路径。
