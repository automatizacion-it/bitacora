import { useState, useEffect } from 'react'
import staticProjects from '../data/projects.json'

const LS_PROJECTS = 'bitacora_projects'
const LS_ACCOUNTS = 'bitacora_accounts'

export function useProjects() {
  const [localProjects, setLocalProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_PROJECTS) ?? '[]')
    } catch {
      return []
    }
  })

  const allProjects = [
    ...staticProjects,
    ...localProjects.filter((lp) => !staticProjects.find((sp) => sp.id === lp.id)),
  ]

  function addProject(project) {
    setLocalProjects((prev) => {
      const updated = [...prev.filter((p) => p.id !== project.id), project]
      localStorage.setItem(LS_PROJECTS, JSON.stringify(updated))
      return updated
    })
  }

  function removeProject(id) {
    setLocalProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id)
      localStorage.setItem(LS_PROJECTS, JSON.stringify(updated))
      return updated
    })
  }

  return { allProjects, localProjects, addProject, removeProject }
}

export function useAccounts() {
  const [accounts, setAccounts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_ACCOUNTS) ?? '[]')
    } catch {
      return []
    }
  })

  function addAccount(username) {
    setAccounts((prev) => {
      if (prev.includes(username)) return prev
      const updated = [...prev, username]
      localStorage.setItem(LS_ACCOUNTS, JSON.stringify(updated))
      return updated
    })
  }

  function removeAccount(username) {
    setAccounts((prev) => {
      const updated = prev.filter((a) => a !== username)
      localStorage.setItem(LS_ACCOUNTS, JSON.stringify(updated))
      return updated
    })
  }

  return { accounts, addAccount, removeAccount }
}
