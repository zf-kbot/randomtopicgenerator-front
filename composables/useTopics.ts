import enTopics from '@/content/en/topics.json'
import enQuestions from '@/content/en/questions.json'
import enWords from '@/content/en/words.json'
import zhTopics from '@/content/zh/topics.json'
import zhQuestions from '@/content/zh/questions.json'
import zhWords from '@/content/zh/words.json'
import esTopics from '@/content/es/topics.json'
import esQuestions from '@/content/es/questions.json'
import esWords from '@/content/es/words.json'
import deTopics from '@/content/de/topics.json'
import deQuestions from '@/content/de/questions.json'
import deWords from '@/content/de/words.json'
import frTopics from '@/content/fr/topics.json'
import frQuestions from '@/content/fr/questions.json'
import frWords from '@/content/fr/words.json'
import jaTopics from '@/content/ja/topics.json'
import jaQuestions from '@/content/ja/questions.json'
import jaWords from '@/content/ja/words.json'
import koTopics from '@/content/ko/topics.json'
import koQuestions from '@/content/ko/questions.json'
import koWords from '@/content/ko/words.json'
import ruTopics from '@/content/ru/topics.json'
import ruQuestions from '@/content/ru/questions.json'
import ruWords from '@/content/ru/words.json'

export type Mode = 'topics' | 'questions' | 'words'
export type Depth = 'casual' | 'moderate' | 'deep'

export interface Prompt {
  id: string
  title: string
  talkingPoints?: string[]
  depth: Depth
}

export interface Category {
  id: string
  icon: string
  name: string
}

export interface ModeFile {
  categories?: Category[]
  prompts: Record<string, Prompt[]>
}

const DATA: Record<string, Record<Mode, ModeFile>> = {
  en: { topics: enTopics as ModeFile, questions: enQuestions as ModeFile, words: enWords as ModeFile },
  zh: { topics: zhTopics as ModeFile, questions: zhQuestions as ModeFile, words: zhWords as ModeFile },
  es: { topics: esTopics as ModeFile, questions: esQuestions as ModeFile, words: esWords as ModeFile },
  de: { topics: deTopics as ModeFile, questions: deQuestions as ModeFile, words: deWords as ModeFile },
  fr: { topics: frTopics as ModeFile, questions: frQuestions as ModeFile, words: frWords as ModeFile },
  ja: { topics: jaTopics as ModeFile, questions: jaQuestions as ModeFile, words: jaWords as ModeFile },
  ko: { topics: koTopics as ModeFile, questions: koQuestions as ModeFile, words: koWords as ModeFile },
  ru: { topics: ruTopics as ModeFile, questions: ruQuestions as ModeFile, words: ruWords as ModeFile }
}

// The three prompt modes share one category list (mirrors randomtopicgen.com).
export const MODES: { id: Mode; icon: string }[] = [
  { id: 'topics', icon: '🎯' },
  { id: 'questions', icon: '❓' },
  { id: 'words', icon: '🔤' }
]

export function getCategories(locale: string): Category[] {
  const d = DATA[locale] ?? DATA.en
  return d.topics.categories ?? []
}

export function getPrompts(locale: string, mode: Mode, categoryId: string): Prompt[] {
  const d = DATA[locale] ?? DATA.en
  return d[mode].prompts?.[categoryId] ?? []
}
