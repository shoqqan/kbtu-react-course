export type QuestStatus = 'available' | 'active' | 'completed'

export type Difficulty = 'easy' | 'normal' | 'hard' | 'legendary'

export interface Quest {
  /** Stable identity — used as the React key, never the array index. */
  id: string
  title: string
  region: string
  giver: string
  difficulty: Difficulty
  /** Reward in gold coins. */
  reward: number
  status: QuestStatus
  /** Objectives the hero ticks off inside the card (card-local state). */
  steps: string[]
  /**
   * Part of the card's key. Bumping it gives the card a new identity,
   * so React unmounts the old one and mounts a fresh one with clean state.
   */
  resetCount: number
}

export type NewQuest = Omit<Quest, 'id' | 'status' | 'resetCount'>
