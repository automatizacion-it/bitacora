const config = {
  corriendo: {
    label: 'Corriendo',
    dot: 'bg-green-400 animate-ping',
    dotStatic: 'bg-green-400',
    badge: 'bg-green-400/10 text-green-400 ring-green-400/30',
  },
  pausado: {
    label: 'Pausado',
    dot: 'bg-yellow-400',
    dotStatic: 'bg-yellow-400',
    badge: 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/30',
  },
  backlog: {
    label: 'En espera',
    dot: 'bg-slate-400',
    dotStatic: 'bg-slate-400',
    badge: 'bg-slate-400/10 text-slate-400 ring-slate-400/30',
  },
  completado: {
    label: 'Completado',
    dot: 'bg-blue-400',
    dotStatic: 'bg-blue-400',
    badge: 'bg-blue-400/10 text-blue-400 ring-blue-400/30',
  },
}

export default function StatusBadge({ estado }) {
  const c = config[estado] ?? config.backlog

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${c.badge}`}>
      <span className="relative flex h-2 w-2">
        {estado === 'corriendo' && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${c.dotStatic}`} />
      </span>
      {c.label}
    </span>
  )
}
