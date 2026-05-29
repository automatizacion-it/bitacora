import { useState, useMemo } from 'react'
import { useProjects, useAccounts } from './hooks/useProjects'
import ProjectCard from './components/ProjectCard'
import FilterBar from './components/FilterBar'
import AccountsPanel from './components/AccountsPanel'
import RepoPickerModal from './components/RepoPickerModal'

const countByEstado = (projects, estado) => projects.filter((p) => p.estado === estado).length

export default function App() {
  const [filter, setFilter] = useState('todos')
  const [selectedAccount, setSelectedAccount] = useState(null)

  const { allProjects, addProject, removeProject } = useProjects()
  const { accounts, addAccount, removeAccount } = useAccounts()

  const visible = useMemo(
    () => filter === 'todos' ? allProjects : allProjects.filter((p) => p.estado === filter),
    [filter, allProjects]
  )

  const projectIds = allProjects.map((p) => p.id)

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
          <StatCard label="Corriendo" value={countByEstado(allProjects, 'corriendo')} color="text-green-400" />
          <StatCard label="Pausados" value={countByEstado(allProjects, 'pausado')} color="text-yellow-400" />
          <StatCard label="En espera" value={countByEstado(allProjects, 'backlog')} color="text-slate-400" />
          <StatCard label="Completados" value={countByEstado(allProjects, 'completado')} color="text-blue-400" />
        </div>

        {/* Cuentas GitHub */}
        <AccountsPanel
          accounts={accounts}
          onAddAccount={addAccount}
          onRemoveAccount={removeAccount}
          onSelectAccount={setSelectedAccount}
        />

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
              <ProjectCard
                key={p.id}
                project={p}
                onRemove={p._account ? () => removeProject(p.id) : null}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal selector de repos */}
      {selectedAccount && (
        <RepoPickerModal
          username={selectedAccount}
          existingIds={projectIds}
          onAdd={addProject}
          onClose={() => setSelectedAccount(null)}
        />
      )}
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
