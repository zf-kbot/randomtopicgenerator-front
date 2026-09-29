import enTopics from '@/content/en/topics.json'
import enQuestions from '@/content/en/questions.json'
import enWords from '@/content/en/words.json'
import zhTopics from '@/content/zh/topics.json'
import zhQuestions from '@/content/zh/questions.json'
import zhWords from '@/content/zh/words.json'

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
  zh: { topics: zhTopics as ModeFile, questions: zhQuestions as ModeFile, words: zhWords as ModeFile }
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
