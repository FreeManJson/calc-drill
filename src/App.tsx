import { ResultPage } from './pages/ResultPage'
import { PlayPage } from './pages/PlayPage'
import { ScorePage } from './pages/ScorePage'
import { SettingsPage } from './pages/SettingsPage'
import { TopPage } from './pages/TopPage'
import './App.css'

function App() {
  return (
    <main className="page-list">
      <TopPage />
      <SettingsPage />
      <PlayPage />
      <ScorePage />
      <ResultPage />
    </main>
  )
}

export default App
