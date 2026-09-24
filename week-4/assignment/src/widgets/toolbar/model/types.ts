import type { Difficulty, QuestStatus } from '@entities/quest'

export type StatusFilter = 'all' | QuestStatus
export type DifficultyFilter = 'all' | Difficulty
export type SortBy = 'posted' | 'reward' | 'difficulty'
