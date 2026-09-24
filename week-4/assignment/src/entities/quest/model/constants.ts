import type { Difficulty, QuestStatus } from './types'

export const STATUSES: QuestStatus[] = ['available', 'active', 'completed']

export const STATUS_LABEL: Record<QuestStatus, string> = {
  available: 'Available',
  active: 'In progress',
  completed: 'Completed',
}

export const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard', 'legendary']

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  normal: 'Normal',
  hard: 'Hard',
  legendary: 'Legendary',
}

/** Used to sort quests by difficulty. */
export const DIFFICULTY_RANK: Record<Difficulty, number> = {
  easy: 0,
  normal: 1,
  hard: 2,
  legendary: 3,
}

export const REGIONS = [
  'Whispering Woods',
  'Ashen Peaks',
  'Saltmarsh Coast',
  'Old Capital',
  'Sunken Catacombs',
]
