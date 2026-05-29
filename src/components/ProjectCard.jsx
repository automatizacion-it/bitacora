import StatusBadge from './StatusBadge'

const progressColor = {
  corriendo: 'bg-green-500',
  pausado: 'bg-yellow-500',
  backlog: 'bg-slate-500',
  completado: 'bg-blue-500',
}

export default function ProjectCard({ project, onRemove }) {
  const { nombre, descripcion, estado, tecnologias, progreso, fechaInicio, fechaCierreEst, repo, notas, _account } = project

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-slate-800/60 border border-slate-700/50 p-5 hover:border-slate-600 transition-colors relative group">

      {/* Botón eliminar (solo repos importados) */}
      {onRemove && (
        <button
          onClick={onRemove}
          title="Quitar del dashboard"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-400 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {_account && (
            <div className="flex items-center gap-1 mb-1">
              <img src={`https://github.com/${_account}.png?size=16`} alt={_account} className="w-3.5 h-3.5 rounded-full" />
              <span className="text-xs text-slate-500">{_account}</span>
            </div>
          )}
          <h3 className="font-semibold text-slate-100 truncate text-base leading-snug">{nombre}</h3>
          <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{descripcion}</p>
        </div>
        <StatusBadge estado={estado} />
      </div>

      {/* Progreso */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-500">Progreso</span>
          <span className="text-xs font-medium text-slate-300">{progreso}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-700">
          <div
            className={`h-1.5 rounded-full ${progressColor[estado] ?? 'bg-slate-500'} transition-all`}
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Tecnologías */}
      <div className="flex flex-wrap gap-1.5">
        {tecnologias.map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-md bg-slate-700/70 text-slate-300 text-xs">
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-700/50 mt-auto">
        <div className="text-xs text-slate-500 space-y-0.5">
          <div>Inicio: <span className="text-slate-400">{fechaInicio}</span></div>
          <div>Cierre est.: <span className="text-slate-400">{fechaCierreEst}</span></div>
        </div>
        {repo && (
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Repo
          </a>
        )}
      </div>

      {/* Notas */}
      {notas && (
        <p className="text-xs text-slate-500 italic border-t border-slate-700/50 pt-2">
          {notas}
        </p>
      )}
    </div>
  )
}
