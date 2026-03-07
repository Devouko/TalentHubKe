'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Surface, GlowLayer } from '@/components/ui/surface'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassInput, GlassTextarea } from '@/components/ui/glass-input'
import { useGSAPMount, useGSAPHover } from '@/hooks/useGSAP'
import { Database, Shield, FileText, Download, Settings, Clock, AlertTriangle, CheckCircle, Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Backup {
  id: string
  type: string
  status: string
  size: number
  createdAt: string
  createdByUser: { name: string }
}

interface SecuritySettings {
  autoBackupEnabled: boolean
  backupFrequency: string
  maxLoginAttempts: number
  sessionTimeout: number
  twoFactorRequired: boolean
  passwordMinLength: number
}

interface SystemLog {
  id: string
  type: string
  message: string
  createdAt: string
  user?: { name: string }
  ipAddress?: string
}

export default function BackupSecurityManager() {
  const containerRef = useGSAPMount('.glass-card')
  const hoverProps = useGSAPHover()
  const [backups, setBackups] = useState<Backup[]>([])
  const [settings, setSettings] = useState<SecuritySettings>({
    autoBackupEnabled: true,
    backupFrequency: 'DAILY',
    maxLoginAttempts: 5,
    sessionTimeout: 120,
    twoFactorRequired: false,
    passwordMinLength: 8
  })
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('backup')
  const [skills, setSkills] = useState<any[]>([])
  const [newSkill, setNewSkill] = useState({ name: '', category: '', description: '' })
  const [editingSkill, setEditingSkill] = useState<any>(null)

  useEffect(() => {
    fetchBackups()
    fetchSettings()
    fetchLogs()
    fetchSkills()
  }, [])

  const fetchBackups = async () => {
    try {
      const response = await fetch('/api/admin/backup')
      const data = await response.json()
      setBackups(data.backups || [])
    } catch (error) {
      toast.error('Failed to fetch backups')
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/security')
      const data = await response.json()
      setSettings(data.settings)
    } catch (error) {
      toast.error('Failed to fetch security settings')
    }
  }

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs?limit=20')
      const data = await response.json()
      setLogs(data.logs || [])
    } catch (error) {
      toast.error('Failed to fetch system logs')
    }
  }

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/admin/skills')
      const data = await response.json()
      setSkills(data.skills || [])
    } catch (error) {
      toast.error('Failed to fetch skills')
    }
  }

  const createSkill = async () => {
    if (!newSkill.name || !newSkill.category) {
      toast.error('Name and category are required')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill)
      })

      if (response.ok) {
        toast.success('Skill created successfully')
        setNewSkill({ name: '', category: '', description: '' })
        fetchSkills()
      } else {
        toast.error('Failed to create skill')
      }
    } catch (error) {
      toast.error('Skill creation failed')
    } finally {
      setLoading(false)
    }
  }

  const updateSkill = async (skill: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill)
      })

      if (response.ok) {
        toast.success('Skill updated successfully')
        setEditingSkill(null)
        fetchSkills()
      } else {
        toast.error('Failed to update skill')
      }
    } catch (error) {
      toast.error('Skill update failed')
    } finally {
      setLoading(false)
    }
  }

  const deleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/skills?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Skill deleted successfully')
        fetchSkills()
      } else {
        toast.error('Failed to delete skill')
      }
    } catch (error) {
      toast.error('Skill deletion failed')
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'manual' })
      })

      if (response.ok) {
        toast.success('Backup created successfully')
        fetchBackups()
      } else {
        toast.error('Failed to create backup')
      }
    } catch (error) {
      toast.error('Backup creation failed')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast.success('Security settings updated')
      } else {
        toast.error('Failed to update settings')
      }
    } catch (error) {
      toast.error('Settings update failed')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      COMPLETED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      FAILED: 'bg-red-100 text-red-800'
    }
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'ERROR': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'SECURITY': return <Shield className="w-4 h-4 text-purple-500" />
      case 'BACKUP': return <Database className="w-4 h-4 text-blue-500" />
      default: return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  return (
    <div ref={containerRef} className="space-y-8 p-6">
      <div className="relative">
        <GlowLayer />
        <div className="relative flex items-center justify-between">
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">Backup & Security</h1>
          <div className="flex gap-3">
            {['backup', 'security', 'skills', 'logs'].map((tab) => (
              <GlassButton
                key={tab}
                variant={activeTab === tab ? 'primary' : 'secondary'}
                onClick={() => setActiveTab(tab)}
                className="capitalize glass-card"
              >
                {tab === 'backup' && <Database className="w-4 h-4 mr-2" />}
                {tab === 'security' && <Shield className="w-4 h-4 mr-2" />}
                {tab === 'skills' && <Settings className="w-4 h-4 mr-2" />}
                {tab === 'logs' && <FileText className="w-4 h-4 mr-2" />}
                {tab}
              </GlassButton>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Surface glow className="glass-card" {...hoverProps}>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-[var(--accent)]" />
                <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Database Backup</h2>
              </div>
              
              <div className="bg-[var(--accent-soft)] border border-[var(--accent)]/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-[var(--text-primary)]">
                  <strong>Note:</strong> Regular backups are recommended to prevent data loss. 
                  Configure automatic backups for better data security.
                </p>
              </div>
              
              <GlassButton 
                onClick={createBackup} 
                disabled={loading}
                className="w-full mb-6"
              >
                {loading ? 'Creating Backup...' : 'Create Manual Backup'}
              </GlassButton>

              <div className="space-y-4">
                <Label className="text-[var(--text-primary)] font-medium">Auto Backup Settings</Label>
                <div className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
                  <span className="text-sm font-medium text-[var(--text-primary)]">Enable Auto Backup</span>
                  <Switch
                    checked={settings.autoBackupEnabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, autoBackupEnabled: checked }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[var(--text-muted)]">Backup Frequency</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) => 
                      setSettings(prev => ({ ...prev, backupFrequency: value }))
                    }
                  >
                    <SelectTrigger className="bg-[var(--surface)] border-[var(--border-subtle)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOURLY">Every Hour</SelectItem>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Surface>

          <Surface className="glass-card" {...hoverProps}>
            <div className="p-8">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Recent Backups</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {backups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl hover:bg-[var(--accent-soft)] transition-all duration-300">
                    <div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusBadge(backup.status)}>
                          {backup.status}
                        </Badge>
                        <span className="text-sm font-medium text-[var(--text-primary)]">{backup.type}</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {new Date(backup.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        By: {backup.createdByUser.name} • {formatFileSize(backup.size || 0)}
                      </p>
                    </div>
                    <GlassButton variant="secondary" className="p-2">
                      <Download className="w-4 h-4" />
                    </GlassButton>
                  </div>
                ))}
              </div>
            </div>
          </Surface>
        </div>
      )}

      {activeTab === 'security' && (
        <Surface glow className="glass-card" {...hoverProps}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-6 h-6 text-[var(--accent)]" />
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Security Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[var(--text-primary)] font-medium">Maximum Login Attempts</Label>
                  <GlassInput
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))
                    }
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[var(--text-primary)] font-medium">Session Timeout (minutes)</Label>
                  <GlassInput
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))
                    }
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[var(--text-primary)] font-medium">Minimum Password Length</Label>
                  <GlassInput
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl">
                  <div>
                    <Label className="text-lg font-medium text-[var(--text-primary)]">Two-Factor Authentication</Label>
                    <p className="text-sm text-[var(--text-muted)] mt-2">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorRequired}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, twoFactorRequired: checked }))
                    }
                  />
                </div>
              </div>
            </div>
            
            <GlassButton onClick={updateSettings} disabled={loading} className="w-full mt-8">
              {loading ? 'Updating...' : 'Update Security Settings'}
            </GlassButton>
          </div>
        </Surface>
      )}

      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Surface glow className="glass-card" {...hoverProps}>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-[var(--accent)]" />
                <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Add New Skill</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[var(--text-primary)] font-medium">Skill Name</Label>
                  <GlassInput
                    value={newSkill.name}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., React Development"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[var(--text-primary)] font-medium">Category</Label>
                  <Select
                    value={newSkill.category}
                    onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-[var(--surface)] border-[var(--border-subtle)]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Writing">Writing</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[var(--text-primary)] font-medium">Description (Optional)</Label>
                  <GlassTextarea
                    value={newSkill.description}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the skill"
                    rows={3}
                  />
                </div>
                
                <GlassButton onClick={createSkill} disabled={loading} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {loading ? 'Adding...' : 'Add Skill'}
                </GlassButton>
              </div>
            </div>
          </Surface>

          <Surface className="glass-card" {...hoverProps}>
            <div className="p-8">
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Skills Management</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {skills.map((skill) => (
                  <div key={skill.id} className="p-4 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl hover:bg-[var(--accent-soft)] transition-all duration-300">
                    {editingSkill?.id === skill.id ? (
                      <div className="space-y-4">
                        <GlassInput
                          value={editingSkill.name}
                          onChange={(e) => setEditingSkill(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Select
                          value={editingSkill.category}
                          onValueChange={(value) => setEditingSkill(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger className="bg-[var(--surface)] border-[var(--border-subtle)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Development">Development</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Writing">Writing</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-3">
                          <GlassButton onClick={() => updateSkill(editingSkill)} className="flex-1">
                            Save
                          </GlassButton>
                          <GlassButton variant="secondary" onClick={() => setEditingSkill(null)} className="flex-1">
                            Cancel
                          </GlassButton>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium text-[var(--text-primary)]">{skill.name}</span>
                            <Badge className="bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/20">{skill.category}</Badge>
                            {!skill.isActive && <Badge className="bg-red-100 text-red-800">Inactive</Badge>}
                          </div>
                          {skill.description && (
                            <p className="text-sm text-[var(--text-muted)]">{skill.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <GlassButton
                            variant="secondary"
                            onClick={() => setEditingSkill(skill)}
                            className="p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </GlassButton>
                          <GlassButton
                            variant="secondary"
                            onClick={() => deleteSkill(skill.id)}
                            className="p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </GlassButton>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Surface>
        </div>
      )}

      {activeTab === 'logs' && (
        <Surface glow className="glass-card" {...hoverProps}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-[var(--accent)]" />
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">System Logs</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl hover:bg-[var(--accent-soft)] transition-all duration-300">
                  {getLogIcon(log.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/20">{log.type}</Badge>
                      <span className="text-xs text-[var(--text-muted)]">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)] mb-2">{log.message}</p>
                    {log.user && (
                      <p className="text-xs text-[var(--text-muted)]">User: {log.user.name}</p>
                    )}
                    {log.ipAddress && (
                      <p className="text-xs text-[var(--text-muted)]">IP: {log.ipAddress}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Surface>
      )}
    </div>
  )
}