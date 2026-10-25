// Hark/Egern HTTP response script for Meituan.
// Reference behavior: https://raw.githubusercontent.com/ZenmoFeiShi/Qx/refs/heads/main/MT.js
// Response API: https://egernapp.com/zh-CN/docs/javascript-api

const KEEP_TABS = new Set(["homepage", "mine"]);
const HIDE_TABS = new Set(["video", "xiaotuan"]);
const HIDE_MINE_CHILDREN = new Set(["mine_cross_recommend"]);
const HIDE_SEARCH_PAGES = new Set([
  "EntranceHotwordsV2Hotwords",
  "EntranceHotwordsV2ContentCard",
]);

const URLS = {
  tab: /^https?:\/\/apimobile\.meituan\.com\/aggroup\/indexTab(?:[/?#]|$)/,
  feed: /^https?:\/\/feedguess\.meituan\.com\/lycoris\/scene\/(?:gwc_feed1_2265|personalcenter_2154)(?:\?|$)/,
  mine: /^https?:\/\/mt-personalcenter\.meituan\.com\/usercenter\/display(?:[/?#]|$)/,
  defaultWord: /^https?:\/\/apimobile\.meituan\.com\/group\/v1\/deal\/searchpage\/defaultword(?:[/?#]|$)/,
  hotRecommend: /^https?:\/\/apimobile\.meituan\.com\/group\/v1\/deal\/searchpage\/hotword\/city\/divide\/hotrecommend\//,
  aiSkill: /^https?:\/\/assistify\.meituan\.com\/assistant\/getAppClientHornConfig(?:[/?#]|$)/,
  shoppingCart: /^https?:\/\/mop\.meituan\.com\/mop\/entry\/shoppingCartEntry(?:[/?#]|$)/,
  startupPicture: /^https?:\/\/mop\.meituan\.com\/api\/entryModule\/startupPicture(?:[/?#]|$)/,
};

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function cleanTabs(obj) {
  const resource = obj && obj.data && obj.data.resource;
  if (!isObject(resource) || !Array.isArray(resource.tabArea)) return false;

  const names = resource.tabArea.map((tab) => (isObject(tab) ? tab.tabName : ""));
  if (!Array.from(KEEP_TABS).every((name) => names.includes(name))) return false;

  const kept = resource.tabArea.filter(
    (tab) => !(isObject(tab) && HIDE_TABS.has(tab.tabName)),
  );
  if (kept.length === resource.tabArea.length) return false;
  resource.tabArea = kept;
  return true;
}

function cleanFeed(obj) {
  if (!isObject(obj) || !Array.isArray(obj.data)) return false;
  let changed = false;

  if (obj.data.length) {
    obj.data = [];
    changed = true;
  }
  if (obj.bottom !== true) {
    obj.bottom = true;
    changed = true;
  }
  if (!isObject(obj.ext)) {
    obj.ext = {};
    changed = true;
  }
  if (obj.ext.forbidByExp !== true) {
    obj.ext.forbidByExp = true;
    changed = true;
  }
  return changed;
}

function cleanMine(obj) {
  if (!isObject(obj) || !Array.isArray(obj.children)) return false;
  const kept = obj.children.filter(
    (child) => !(isObject(child) && HIDE_MINE_CHILDREN.has(child.name)),
  );
  if (kept.length === obj.children.length) return false;
  obj.children = kept;
  return true;
}

function cleanDefaultWords(obj) {
  const response = obj && obj.searchIntroduceResponse;
  if (!isObject(response)) return false;
  let changed = false;

  const defaultWord = response.defaultWordRes;
  if (isObject(defaultWord) && Array.isArray(defaultWord.defaultWordItems) && defaultWord.defaultWordItems.length) {
    defaultWord.defaultWordItems = [];
    changed = true;
  }
  if (Array.isArray(response.HotWordInfos) && response.HotWordInfos.length) {
    response.HotWordInfos = [];
    changed = true;
  }
  return changed;
}

function cleanHotRecommendations(obj) {
  const data = obj && obj.data;
  if (!isObject(data) || !Array.isArray(data.segmentsV2)) return false;

  let changed = false;
  const keptSegments = [];
  data.segmentsV2.forEach((segment) => {
    if (!isObject(segment) || !Array.isArray(segment.hotwordSegments)) {
      keptSegments.push(segment);
      return;
    }
    const keptHotwords = segment.hotwordSegments.filter(
      (item) => !(isObject(item) && HIDE_SEARCH_PAGES.has(item.pageName)),
    );
    if (keptHotwords.length === segment.hotwordSegments.length) {
      keptSegments.push(segment);
      return;
    }
    changed = true;
    if (keptHotwords.length) {
      segment.hotwordSegments = keptHotwords;
      keptSegments.push(segment);
    }
  });
  if (changed) data.segmentsV2 = keptSegments;

  const bubble = data.aiSearchBubble;
  if (isObject(bubble) && Array.isArray(bubble.bubbleTexts) && bubble.bubbleTexts.length) {
    bubble.bubbleTexts = [];
    changed = true;
  }
  return changed;
}

function cleanAiSkills(obj) {
  if (!isObject(obj) || typeof obj.data !== "string") return false;
  const data = JSON.parse(obj.data);
  if (!isObject(data) || !isObject(data.skills) || !Object.keys(data.skills).length) return false;
  data.skills = {};
  obj.data = JSON.stringify(data);
  return true;
}

function clearArea(root, key) {
  const holders = [root, root && root.data];
  let changed = false;
  holders.forEach((holder) => {
    if (!isObject(holder)) return;
    [holder.resourcesMap, holder.resource].forEach((resource) => {
      if (isObject(resource) && Array.isArray(resource[key]) && resource[key].length) {
        resource[key] = [];
        changed = true;
      }
    });
  });
  return changed;
}

function transform(url, obj) {
  if (URLS.tab.test(url)) return cleanTabs(obj);
  if (URLS.feed.test(url)) return cleanFeed(obj);
  if (URLS.mine.test(url)) return cleanMine(obj);
  if (URLS.defaultWord.test(url)) return cleanDefaultWords(obj);
  if (URLS.hotRecommend.test(url)) return cleanHotRecommendations(obj);
  if (URLS.aiSkill.test(url)) return cleanAiSkills(obj);
  if (URLS.shoppingCart.test(url)) return clearArea(obj, "topBannerArea");
  if (URLS.startupPicture.test(url)) return clearArea(obj, "startupPicArea");
  return false;
}

export default async function (ctx) {
  const url = (ctx && ctx.request && ctx.request.url) || "";
  if (!url || !ctx || !ctx.response) return;

  let data;
  try {
    data = await ctx.response.json();
  } catch (error) {
    return;
  }
  if (!isObject(data)) return;

  try {
    if (transform(url, data)) return { body: data };
  } catch (error) {
    // Fail open: malformed or unexpected responses pass through unchanged.
  }
}
