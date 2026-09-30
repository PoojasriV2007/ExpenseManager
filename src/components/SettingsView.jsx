import { useState } from 'react'
import { RotateCcw, Trash2 } from 'lucide-react'

export default function SettingsView({ name, onSaveName, onLoadSamples, onClearAll, count }) {
  const [draft, setDraft] = useState(name)

  return (
    <div className="settings-grid">
      <section className="card settings-card">
        <h2 className="card-title">Profile</h2>
        <form
          className="settings-form"
          onSubmit={(e) => {
            e.preventDefault()
            onSaveName(draft.trim().slice(0, 30))
          }}
        >
          <label htmlFor="settings-name">Your name <span className="muted">(shown in the greeting)</span></label>
          <div className="inline-field">
            <input id="settings-name" className="field-input" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={30} placeholder="e.g. Sachin" />
            <button type="submit" className="btn-gradient">Save</button>
          </div>
        </form>
      </section>

      <section className="card settings-card">
        <h2 className="card-title">Data</h2>
        <p className="muted">You have {count} expense{count === 1 ? '' : 's'} saved in this browser.</p>
        <div className="settings-actions">
          <button type="button" className="btn-ghost" onClick={onLoadSamples}><RotateCcw size={18} /> Load sample data</button>
          <button type="button" className="btn-danger" onClick={onClearAll} disabled={!count}><Trash2 size={18} /> Delete all expenses</button>
        </div>
      </section>
    </div>
  )
}
