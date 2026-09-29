<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCategories, getPrompts, MODES, type Mode } from '@/composables/useTopics'

const { locale, t } = useI18n()
const categories = computed(() => getCategories(locale.value))

const mode = ref<Mode>('topics')
const selectedCategory = ref('all')
const count = ref(3)
const depth = ref('all')
const results = ref<Array<{ cat: any; prompt: any }>>([])
const copiedId = ref('')

const modeTabs = computed(() => MODES.map((m) => ({ ...m, label: t('modes.' + m.id) })))

const categoryOptions = computed(() => [
  { id: 'all', icon: '🌐', name: t('controls.all') },
  ...categories.value.map((c: any) => ({ id: c.id, icon: c.icon, name: c.name }))
])

const depthOptions = ['all', 'casual', 'moderate', 'deep']

function generate() {
  const cats =
    selectedCategory.value === 'all'
      ? categories.value
      : categories.value.filter((c: any) => c.id === selectedCategory.value)
  const pool: Array<{ cat: any; prompt: any }> = []
  cats.forEach((c: any) => {
    const list = getPrompts(locale.value, mode.value, c.id)
    list.forEach((p: any) => {
      if (depth.value === 'all' || p.depth === depth.value) {
        pool.push({ cat: c, prompt: p })
      }
    })
  })
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  results.value = pool.slice(0, count.value)
}

const saved = ref<Array<any>>([])
function loadSaved() {
  try {
    saved.value = JSON.parse(localStorage.getItem('rtg-saved') || '[]')
  } catch {
    saved.value = []
  }
}
function isSaved(id: string) {
  return saved.value.some((s) => s.id === id)
}
function toggleSave(item: any) {
  const idx = saved.value.findIndex((s) => s.id === item.prompt.id)
  if (idx >= 0) saved.value.splice(idx, 1)
  else saved.value.push({ id: item.prompt.id, title: item.prompt.title, catId: item.cat.id, mode: mode.value })
  localStorage.setItem('rtg-saved', JSON.stringify(saved.value))
}
function clearSaved() {
  saved.value = []
  localStorage.removeItem('rtg-saved')
}
async function copyTopic(title: string, id: string) {
  try {
    await navigator.clipboard.writeText(title)
    copiedId.value = id
    setTimeout(() => {
      if (copiedId.value === id) copiedId.value = ''
    }, 1500)
  } catch {}
}

function switchMode(m: Mode) {
  mode.value = m
  generate()
}

onMounted(() => {
  loadSaved()
  generate()
})
</script>

<template>
  <div>
    <div class="mode-tabs" role="tablist" :aria-label="t('controls.mode')">
      <button
        v-for="m in modeTabs"
        :key="m.id"
        class="mode-tab"
        :class="{ active: mode === m.id }"
        role="tab"
        :aria-selected="mode === m.id"
        @click="switchMode(m.id)"
      >
        <span class="mode-icon">{{ m.icon }}</span>{{ m.label }}
      </button>
    </div>

    <div class="panel">
      <div class="controls">
        <div class="field">
          <label>{{ t('controls.category') }}</label>
          <select v-model="selectedCategory">
            <option v-for="opt in categoryOptions" :key="opt.id" :value="opt.id">
              {{ opt.icon }} {{ opt.name }}
            </option>
          </select>
        </div>
        <div class="field">
          <label>{{ t('controls.count') }}</label>
          <select v-model.number="count">
            <option :value="1">1</option>
            <option :value="3">3</option>
            <option :value="5">5</option>
            <option :value="10">10</option>
          </select>
        </div>
        <div class="field">
          <label>{{ t('controls.depth') }}</label>
          <select v-model="depth">
            <option v-for="d in depthOptions" :key="d" :value="d">
              {{ d === 'all' ? t('controls.all') : t('controls.' + d) }}
            </option>
          </select>
        </div>
      </div>
      <button class="btn-primary" @click="generate">{{ t('controls.generate') }}</button>

      <div class="results" v-if="results.length">
        <div class="card" v-for="item in results" :key="item.prompt.id">
          <div class="card-top">
            <div>
              <span class="cat-tag">{{ item.cat.icon }} {{ item.cat.name }}</span>
              <h3>{{ item.prompt.title }}</h3>
            </div>
            <div class="card-actions">
              <button class="icon-btn" @click="copyTopic(item.prompt.title, item.prompt.id)">
                {{ copiedId === item.prompt.id ? t('result.copied') : t('result.copy') }}
              </button>
              <button
                class="icon-btn"
                :class="{ active: isSaved(item.prompt.id) }"
                @click="toggleSave(item)"
              >
                {{ isSaved(item.prompt.id) ? t('result.saved') : t('result.save') }}
              </button>
            </div>
          </div>
          <ul v-if="item.prompt.talkingPoints && item.prompt.talkingPoints.length">
            <li v-for="(p, i) in item.prompt.talkingPoints" :key="i">{{ p }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="saved">
      <h2>
        {{ t('saved.title') }}
        <button class="link-btn" v-if="saved.length" @click="clearSaved">{{ t('saved.clear') }}</button>
      </h2>
      <p class="empty" v-if="!saved.length">{{ t('saved.empty') }}</p>
      <ul v-else>
        <li v-for="s in saved" :key="s.id">
          <span>{{ s.title }}</span>
          <button class="link-btn" @click="toggleSave({ prompt: s, cat: { id: s.catId } })">✕</button>
        </li>
      </ul>
    </div>
  </div>
</template>
