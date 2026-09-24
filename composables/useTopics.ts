import enTopics from '@/content/en/topics.json'
import zhTopics from '@/content/zh/topics.json'

export interface Topic {
  id: string
  title: string
  talkingPoints: string[]
  depth: 'casual' | 'moderate' | 'deep'
}

export interface Category {
  id: string
  icon: string
  name: string
  topics: Topic[]
}

export interface TopicsData {
  categories: Category[]
}

export function getCategories(locale: string): Category[] {
  const data = (locale === 'zh' ? zhTopics : enTopics) as TopicsData
  return data.categories
}
