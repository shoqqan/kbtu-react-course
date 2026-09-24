import { DIFFICULTIES, DIFFICULTY_LABEL, STATUSES, STATUS_LABEL } from '@entities/quest'
import { Button } from '@shared/ui/button'
import type { DifficultyFilter, SortBy, StatusFilter } from '../model/types'
import styles from './toolbar.module.css'

interface ToolbarProps {
  counts: Record<StatusFilter, number>
  status: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  difficulty: DifficultyFilter
  onDifficultyChange: (difficulty: DifficultyFilter) => void
  search: string
  onSearchChange: (search: string) => void
  sortBy: SortBy
  onSortChange: (sortBy: SortBy) => void
  reversed: boolean
  onReverse: () => void
}

const TABS: StatusFilter[] = ['all', ...STATUSES]

export function Toolbar(props: ToolbarProps) {
  console.log('[render] Toolbar')

  return (
    <div className={styles.toolbar}>
      <div className={styles.tabs} role="tablist" aria-label="Filter by status">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={props.status === tab}
            className={styles.tab}
            onClick={() => props.onStatusChange(tab)}
          >
            {tab === 'all' ? 'All' : STATUS_LABEL[tab]}
            <span className={styles.count}>{props.counts[tab]}</span>
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <label className={styles.search}>
          <span className="visually-hidden">Search quests</span>
          <input
            type="search"
            value={props.search}
            onChange={(e) => props.onSearchChange(e.target.value)}
            placeholder="Search by name, region or giver"
          />
        </label>

        <label className={styles.select}>
          <span className="visually-hidden">Difficulty</span>
          <select
            value={props.difficulty}
            onChange={(e) => props.onDifficultyChange(e.target.value as DifficultyFilter)}
          >
            <option value="all">Any difficulty</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABEL[d]}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.select}>
          <span className="visually-hidden">Sort by</span>
          <select value={props.sortBy} onChange={(e) => props.onSortChange(e.target.value as SortBy)}>
            <option value="posted">Newest first</option>
            <option value="reward">Highest reward</option>
            <option value="difficulty">Hardest first</option>
          </select>
        </label>

        <Button onClick={props.onReverse} aria-pressed={props.reversed}>
          <span aria-hidden="true" className={props.reversed ? styles.flipped : undefined}>
            ↓
          </span>
          Reverse
        </Button>
      </div>
    </div>
  )
}
