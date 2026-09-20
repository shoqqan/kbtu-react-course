import { Icon } from '@shared/ui/icon/icon.tsx'
// Replace this file with your own photo (e.g. ../assets/avatar.jpg) — the import is the only change needed.
import avatar from '../assets/avatar.svg'
import styles from './hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div>
        <p className={styles.badge}>
          <span className={styles.dot} />
          Open to Senior positions
        </p>

        <h1 className={styles.name}>
          Shokan Tatayev
          <span className={styles.role}>full-stack developer</span>
        </h1>

        <p className={styles.tagline}>
          Informational Systems student at KBTU. I build interfaces in React and
          TypeScript, and I am just as happy writing the API they talk to.
        </p>

        <div className={styles.actions}>
          <a className={styles.primary} href="#contact">
            Get in touch
            <Icon name="arrow" size={18} />
          </a>
          <a
            className={styles.secondary}
            href="https://github.com/shoqqan"
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" size={18} />
            View GitHub
          </a>
        </div>
      </div>

      <div className={styles.portrait}>
        <div className={styles.ring} />
        <img
          className={styles.photo}
          src={avatar}
          width={340}
          height={340}
          alt="Portrait of Shokan Tatayev"
        />
        <div className={styles.chip}>
          <Icon name="spark" size={18} />
          <span>
            <span className={styles.chipValue}>KBTU</span>
            <span className={styles.chipLabel}>Informational Systems</span>
          </span>
        </div>
      </div>
    </section>
  )
}
