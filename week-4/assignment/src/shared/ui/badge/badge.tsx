import type { ReactNode } from 'react'
import styles from './badge.module.css'

export type BadgeTone = 'easy' | 'normal' | 'hard' | 'legendary' | 'gold' | 'neutral'

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
}
