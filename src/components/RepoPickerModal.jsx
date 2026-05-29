import { useState, useEffect } from 'react'

const ESTADOS = ['corriendo', 'pausado', 'backlog', 'completado']

export default function RepoPickerModal({ username, onClose, onAdd, existingIds }) {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ estado: 'backlog', progreso: 0, notas: '' })

  useEffect(() => {
    async function fetchRepos() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
        )
        if (!res.ok) throw new Error('No se pudieron cargar los repos')
        const data = await res.json()
        setRepos(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchRepos()
  }, [username])

  const filtered = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.description ?? '').toLowerCase().includes(search.toLowerCase())
  )

  function handleSelect(repo) {
    setSelected(repo)
    setForm({ estado: 'backlog', progreso: 0, notas: '' })
  }

  function handleAdd() {
    if (!selected) return
    const techs = [
      selected.language,
      ...(selected.topics ?? []),
    ].filter(Boolean)

    onAdd({
      id: `${username}-${selected.name}`,
      nombre: selected.name,
      descripcion: selected.description ?? '',
      estado: form.estado,
      tecnologias: techs.length ? techs : ['—'],
      progreso: Number(form.progreso),
      fechaInicio: selected.created_at?.slice(0, 10) ?? '',
      fechaCierreEst: '',
      repo: selected.html_url,
      notas: form.notas,
      _account: username,
    })
    onClose()
  }

  const alreadyAdded = selected ? existingIds.includes(`${username}-${selected.name}`) : false

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <img
              src={`https://github.com/${username}.png?size=32`}
              alt={username}
              className="w-7 h-7 rounded-full"
            />
            <div>
              <h3 className="text-white font-semibold text-sm leading-none">{username}</h3>
              <p className="text-slate-500 text-xs mt-0.5">{repos.length} repositorios públicos</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Lista repos */}
          <div className="w-1/2 flex flex-col border-r border-slate-700">
            <div className="px-4 py-3 border-b border-slate-700">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar repositorio..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-slate-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
                  Cargando repos...
                </div>
              )}
              {error && (
                <div className="p-4 text-red-400 text-sm">{error}</div>
              )}
              {!loading && !error && filtered.map((repo) => {
                const id = `${username}-${repo.name}`
                const added = existingIds.includes(id)
                const isSelected = selected?.id === repo.id
                return (
                  <button
                    key={repo.id}
                    onClick={() => handleSelect(repo)}
                    disabled={added}
                    className={`w-full text-left px-4 py-3 border-b border-slate-700/50 transition-colors cursor-pointer
                      ${isSelected ? 'bg-blue-600/20 border-l-2 border-l-blue-500' : 'hover:bg-slate-700/40'}
                      ${added ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-200 font-medium truncate">{repo.name}</span>
                      {added && <span className="text-xs text-slate-500 shrink-0">Agregado</span>}
                    </div>
                    {repo.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{repo.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {repo.language && (
                        <span className="text-xs text-slate-500">{repo.language}</span>
                      )}
                      <span className="text-xs text-slate-600">
                        {new Date(repo.updated_at).toLocaleDateString('es')}
                      </span>
                    </div>
                  </button>
                )
              })}
              {!loading && !error && filtered.length === 0 && (
                <p className="text-slate-600 text-sm px-4 py-6 text-center">Sin resultados</p>
              )}
            </div>
          </div>

          {/* Panel configurar proyecto */}
          <div className="w-1/2 flex flex-col">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-slate-600 text-sm px-6 text-center">
                Selecciona un repositorio de la lista para configurarlo
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <div>
                  <p className="text-white font-medium text-sm">{selected.name}</p>
                  {selected.description && (
                    <p className="text-slate-400 text-xs mt-0.5">{selected.description}</p>
                  )}
                  <a
                    href={selected.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline mt-0.5 inline-block"
                  >
                    {selected.html_url}
                  </a>
                </div>

                {/* Estado */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Estado del flujo</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ESTADOS.map((e) => (
                      <button
                        key={e}
                        onClick={() => setForm((f) => ({ ...f, estado: e }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize
                          ${form.estado === e
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progreso */}
                <div>
                  <label className="text-xs text-slate-400 flex justify-between mb-1.5">
                    Progreso <span className="text-slate-300">{form.progreso}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={form.progreso}
                    onChange={(e) => setForm((f) => ({ ...f, progreso: e.target.value }))}
                    className="w-full accent-blue-500"
                  />
                </div>

                {/* Notas */}
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">Notas</label>
                  <textarea
                    rows={3}
                    value={form.notas}
                    onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))}
                    placeholder="Estado actual, pendientes..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-slate-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Botón agregar */}
            <div className="px-5 py-4 border-t border-slate-700">
              <button
                onClick={handleAdd}
                disabled={!selected || alreadyAdded}
                className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {alreadyAdded ? 'Ya está en el dashboard' : '+ Agregar al dashboard'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
