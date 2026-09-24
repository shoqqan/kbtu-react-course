import styles from './board-stats.module.css'

interface BoardStatsProps {
  total: number
  active: number
  completed: number
  goldEarned: number
}

export function BoardStats({ total, active, completed, goldEarned }: BoardStatsProps) {
  console.log('[render] BoardStats')

  const stats = [
    { label: 'Quests on board', value: total },
    { label: 'In progress', value: active },
    { label: 'Completed', value: completed },
    { label: 'Gold earned', value: goldEarned.toLocaleString('en-US'), gold: true },
  ]

  return (
    <dl className={styles.stats}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <dt>{stat.label}</dt>
          <dd className={stat.gold ? styles.gold : undefined}>{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}
