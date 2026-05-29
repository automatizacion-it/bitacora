import { useState } from 'react'

export default function AccountsPanel({ accounts, onAddAccount, onRemoveAccount, onSelectAccount }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdd(e) {
    e.preventDefault()
    const username = input.trim()
    if (!username) return

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`https://api.github.com/users/${username}`)
      if (!res.ok) throw new Error('Cuenta no encontrada')
      const data = await res.json()
      onAddAccount(data.login) // usa el login real (capitalización correcta)
      setInput('')
      setOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Cuentas GitHub</h2>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar cuenta
        </button>
      </div>

      {accounts.length === 0 ? (
        <p className="text-slate-600 text-sm">Sin cuentas agregadas. Agrega una para importar repositorios.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {accounts.map((username) => (
            <AccountChip
              key={username}
              username={username}
              onClick={() => onSelectAccount(username)}
              onRemove={() => onRemoveAccount(username)}
            />
          ))}
        </div>
      )}

      {/* Modal agregar cuenta */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-1">Agregar cuenta GitHub</h3>
            <p className="text-slate-400 text-sm mb-4">Ingresa el username de la cuenta para importar sus repositorios.</p>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus-within:border-slate-500">
                  <span className="text-slate-500 text-sm">github.com/</span>
                  <input
                    autoFocus
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="username"
                    className="flex-1 bg-transparent text-slate-100 text-sm outline-none placeholder-slate-600"
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setOpen(false); setInput(''); setError('') }}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  {loading ? 'Verificando...' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function AccountChip({ username, onClick, onRemove }) {
  return (
    <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-full pl-1 pr-2 py-1 hover:border-slate-500 transition-colors">
      <img
        src={`https://github.com/${username}.png?size=24`}
        alt={username}
        className="w-5 h-5 rounded-full"
      />
      <button
        onClick={onClick}
        className="text-sm text-slate-300 hover:text-white px-1 cursor-pointer transition-colors"
      >
        {username}
      </button>
      <button
        onClick={onRemove}
        className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer ml-0.5"
        title="Eliminar cuenta"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
