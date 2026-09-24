import { QuestCard, type Quest, type QuestStatus } from '@entities/quest'
import { Button } from '@shared/ui/button'
import styles from './quest-list.module.css'

interface QuestListProps {
  quests: Quest[]
  isBoardEmpty: boolean
  onStatusChange: (id: string, status: QuestStatus) => void
  onReset: (id: string) => void
  onRemove: (id: string) => void
  onClearFilters: () => void
}

export function QuestList({
  quests,
  isBoardEmpty,
  onStatusChange,
  onReset,
  onRemove,
  onClearFilters,
}: QuestListProps) {
  console.log('[render] QuestList', quests.map((q) => q.title))

  if (quests.length === 0) {
    return (
      <div className={styles.empty}>
        {isBoardEmpty ? (
          <>
            <h3>The board is empty</h3>
            <p>Every quest has been abandoned. Post a new one to get the guild moving.</p>
          </>
        ) : (
          <>
            <h3>No quests match your filters</h3>
            <p>Try another status, difficulty or search term.</p>
            <Button onClick={onClearFilters}>Clear filters</Button>
          </>
        )}
      </div>
    )
  }

  return (
    <ul className={styles.grid}>
      {quests.map((quest) => (
        // The key is the quest's stable id, so a card keeps its local state
        // (ticked objectives, notes) wherever it moves after filtering or sorting.
        // resetCount is appended on purpose: bumping it changes the key,
        // React sees a *different* component and mounts it with fresh state.
        <li key={`${quest.id}:${quest.resetCount}`} className={styles.item}>
          <QuestCard
            quest={quest}
            onStatusChange={onStatusChange}
            onReset={onReset}
            onRemove={onRemove}
          />
        </li>
      ))}
    </ul>
  )
}
