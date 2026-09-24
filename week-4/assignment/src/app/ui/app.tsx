import { useState } from 'react'
import {
  DIFFICULTY_RANK,
  SEED_QUESTS,
  type NewQuest,
  type Quest,
  type QuestStatus,
} from '@entities/quest'
import { AddQuestForm } from '@features/add-quest'
import { BoardStats } from '@widgets/board-stats'
import { QuestList } from '@widgets/quest-list'
import { Toolbar, type DifficultyFilter, type SortBy, type StatusFilter } from '@widgets/toolbar'
import styles from './app.module.css'

function App() {
  console.log('[render] App')

  // Parent-owned state: the quest data itself plus how the list is viewed.
  const [quests, setQuests] = useState<Quest[]>(SEED_QUESTS)
  const [status, setStatus] = useState<StatusFilter>('all')
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('posted')
  const [reversed, setReversed] = useState(false)

  function addQuest(newQuest: NewQuest) {
    const quest: Quest = {
      ...newQuest,
      id: crypto.randomUUID(),
      status: 'available',
      resetCount: 0,
    }
    // Newest quests go on top of the board.
    setQuests((prev) => [quest, ...prev])
  }

  function removeQuest(id: string) {
    setQuests((prev) => prev.filter((q) => q.id !== id))
  }

  function changeStatus(id: string, next: QuestStatus) {
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, status: next } : q)))
  }

  function resetQuest(id: string) {
    // Only the key of that card changes, so only that card loses its local state.
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, resetCount: q.resetCount + 1 } : q)),
    )
  }

  function clearFilters() {
    setStatus('all')
    setDifficulty('all')
    setSearch('')
  }

  // Everything below is derived during render — no extra state, no effects.
  const counts: Record<StatusFilter, number> = {
    all: quests.length,
    available: quests.filter((q) => q.status === 'available').length,
    active: quests.filter((q) => q.status === 'active').length,
    completed: quests.filter((q) => q.status === 'completed').length,
  }
  const goldEarned = quests
    .filter((q) => q.status === 'completed')
    .reduce((sum, q) => sum + q.reward, 0)

  const query = search.trim().toLowerCase()
  const visibleQuests = quests.filter(
    (q) =>
      (status === 'all' || q.status === status) &&
      (difficulty === 'all' || q.difficulty === difficulty) &&
      (query === '' ||
        [q.title, q.region, q.giver].some((text) => text.toLowerCase().includes(query))),
  )
  if (sortBy === 'reward') visibleQuests.sort((a, b) => b.reward - a.reward)
  if (sortBy === 'difficulty') {
    visibleQuests.sort((a, b) => DIFFICULTY_RANK[b.difficulty] - DIFFICULTY_RANK[a.difficulty])
  }
  if (reversed) visibleQuests.reverse()

  return (
    <>
      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <div className={styles.brand}>
            <span className={styles.crest} aria-hidden="true">
              ✦
            </span>
            <div>
              <h1>Guild Quest Board</h1>
              <p>Pick a contract, track your objectives, claim the gold.</p>
            </div>
          </div>
          <BoardStats
            total={counts.all}
            active={counts.active}
            completed={counts.completed}
            goldEarned={goldEarned}
          />
        </div>
      </header>

      <main className={`${styles.shell} ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <AddQuestForm onAdd={addQuest} />
        </aside>

        <section className={styles.board} aria-label="Quests">
          <Toolbar
            counts={counts}
            status={status}
            onStatusChange={setStatus}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
            reversed={reversed}
            onReverse={() => setReversed((r) => !r)}
          />
          <QuestList
            quests={visibleQuests}
            isBoardEmpty={quests.length === 0}
            onStatusChange={changeStatus}
            onReset={resetQuest}
            onRemove={removeQuest}
            onClearFilters={clearFilters}
          />
        </section>
      </main>

      <footer className={`${styles.shell} ${styles.footer}`}>
        <span>Guild Quest Board · KBTU React course, Task 3</span>
        <span>Open DevTools → Console to watch components re-render</span>
      </footer>
    </>
  )
}

export default App
