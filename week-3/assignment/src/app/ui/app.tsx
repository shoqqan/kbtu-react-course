import { useTheme } from '../../shared/lib/use-theme.ts'
import { ThemeToggle } from '../../shared/ui/theme-toggle'
import { Hero } from '../../widgets/hero'
import { AboutMe } from '../../widgets/about-me'
import { Contact } from '../../widgets/contact'
import styles from './app.module.css'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <a className={styles.brand} href="#home">
            <span className={styles.mark}>ST</span>
            Shokan Tatayev
          </a>

          <nav className={styles.nav}>
            <a className={styles.navLink} href="#about">
              About
            </a>
            <a className={styles.navLink} href="#contact">
              Contacts
            </a>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </nav>
        </div>
      </header>

      <main className={styles.shell}>
        <Hero />
        <AboutMe />
        <Contact />
      </main>

      <footer className={`${styles.shell} ${styles.footer}`}>
        <span>© {new Date().getFullYear()} Shokan Tatayev</span>
        <span>Built with React, TypeScript and Vite · KBTU React course</span>
      </footer>
    </>
  )
}

export default App
