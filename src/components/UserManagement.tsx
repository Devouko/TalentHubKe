'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit, Plus } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  type: string
  location: string
  phone: string
  verified: boolean
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const response = await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setUsers(users.filter(user => user.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleUpdate = async (userData: Partial<User>) => {
    if (!editingUser) return
    
    try {
      const response = await fetch(`/api/users?id=${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user))
        setEditingUser(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const UserForm = ({ user, onSubmit, onCancel }: any) => {
    const [formData, setFormData] = useState({
      name: user?.name || '',
      email: user?.email || '',
      type: user?.type || 'freelancer',
      location: user?.location || '',
      phone: user?.phone || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(formData)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-96">
          <h3 className="text-xl font-bold mb-4">{user ? 'Edit User' : 'Add User'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-2 bg-gray-700 rounded"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-2 bg-gray-700 rounded"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-purple-600 px-4 py-2 rounded">
                {user ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={onCancel} className="bg-gray-600 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  if (loading) return <div className="text-center py-8">Loading users...</div>

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-400">ID: {user.id} • {user.email} • {user.type.toUpperCase()}</p>
                <p className="text-sm text-gray-400">{user.location}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingUser(user)
                  setShowForm(true)
                }}
                className="p-2 bg-blue-600 rounded hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="p-2 bg-red-600 rounded hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onSubmit={editingUser ? handleUpdate : async (userData: any) => {
            try {
              const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
              })
              if (response.ok) {
                fetchUsers()
                setShowForm(false)
              }
            } catch (error) {
              console.error('Failed to create user:', error)
            }
          }}
          onCancel={() => {
            setShowForm(false)
            setEditingUser(null)
          }}
        />
      )}
    </div>
  )
}