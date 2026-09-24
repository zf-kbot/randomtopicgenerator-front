// 种子抓取脚本：从竞品页面抓取 topic 标题清单，存为 seed 供扩题库参考。
// 用法：node scripts/seed-scrape.mjs
// 注意：需网络访问；若本机走代理，请先 export http_proxy / https_proxy。
// 仅取"选题方向"作灵感，正文仍需自行真本地化重写（避免重复内容/版权风险）。

const TARGETS = [
  { slug: 'debate-topics-for-students', url: 'https://randomtopics.app/topics/debate-topics-for-students' },
  { slug: 'ethical-dilemma-questions', url: 'https://randomtopics.app/topics/ethical-dilemma-questions' },
  { slug: 'icebreaker-questions-for-virtual-meetings', url: 'https://randomtopics.app/topics/icebreaker-questions-for-virtual-meetings' },
  { slug: 'presentation-ideas-for-school', url: 'https://randomtopics.app/topics/presentation-ideas-for-school' },
  { slug: 'random-essay-topics-for-college', url: 'https://randomtopics.app/topics/random-essay-topics-for-college' }
]

// 匹配 "NN. Title" 或 "NN) Title" 形式的题号行
const TOPIC_RE = /^\s*(?:\d+[.)])\s+(.+)$/gm

async function scrape(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  // 去掉 HTML 标签，保留纯文本行
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
  const titles = []
  let m
  while ((m = TOPIC_RE.exec(text)) !== null) {
    const t = m[1].replace(/\s+/g, ' ').trim()
    if (t.length > 4 && t.length < 200) titles.push(t)
  }
  return titles
}

async function main() {
  const out = {}
  for (const t of TARGETS) {
    try {
      out[t.slug] = await scrape(t.url)
      console.error(`✓ ${t.slug}: ${out[t.slug].length} topics`)
    } catch (e) {
      out[t.slug] = { error: String(e) }
      console.error(`✗ ${t.slug}: ${e.message}`)
    }
  }
  console.log(JSON.stringify(out, null, 2))
}

main()
