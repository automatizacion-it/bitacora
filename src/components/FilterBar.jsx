const filters = [
  { value: 'todos', label: 'Todos' },
  { value: 'corriendo', label: 'Corriendo' },
  { value: 'pausado', label: 'Pausado' },
  { value: 'backlog', label: 'En espera' },
  { value: 'completado', label: 'Completado' },
]

const activeClass = {
  todos: 'bg-slate-600 text-white',
  corriendo: 'bg-green-500/20 text-green-400 ring-1 ring-green-400/40',
  pausado: 'bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-400/40',
  backlog: 'bg-slate-500/20 text-slate-400 ring-1 ring-slate-400/40',
  completado: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-400/40',
}

export default function FilterBar({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer
            ${active === f.value
              ? activeClass[f.value]
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
