import { useState, useMemo } from 'react'
import projects from './data/projects.json'
import ProjectCard from './components/ProjectCard'
import FilterBar from './components/FilterBar'

const countByEstado = (estado) => projects.filter((p) => p.estado === estado).length

export default function App() {
  const [filter, setFilter] = useState('todos')

  const visible = useMemo(
    () => filter === 'todos' ? projects : projects.filter((p) => p.estado === filter),
    [filter]
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Bitácora de Proyectos</h1>
          <p className="text-slate-400 mt-1">Seguimiento de flujos de trabajo activos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Corriendo" value={countByEstado('corriendo')} color="text-green-400" />
          <StatCard label="Pausados" value={countByEstado('pausado')} color="text-yellow-400" />
          <StatCard label="En espera" value={countByEstado('backlog')} color="text-slate-400" />
          <StatCard label="Completados" value={countByEstado('completado')} color="text-blue-400" />
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <FilterBar active={filter} onChange={setFilter} />
        </div>

        {/* Grid de proyectos */}
        {visible.length === 0 ? (
          <p className="text-slate-500 text-sm mt-10 text-center">No hay proyectos en este estado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 px-4 py-3">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}
