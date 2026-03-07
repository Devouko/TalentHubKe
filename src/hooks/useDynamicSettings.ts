import { useState, useEffect } from 'react'

export function usePlatformSettings() {
  const [settings, setSettings] = useState({
    platformName: 'TalentHub',
    platformTagline: 'Talent Marketplace that developers love',
    primaryColor: '#10b981',
    secondaryColor: '#14b8a6'
  })

  useEffect(() => {
    fetch('/api/admin/platform')
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setSettings(data))
      .catch(() => {})
  }, [])

  return settings
}

export function useCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.ok ? res.json() : [])
      .then(data => Array.isArray(data) && setCategories(data.filter(c => c.isActive)))
      .catch(() => {})
  }, [])

  return categories
}

export function useOffers() {
  const [offers, setOffers] = useState([])

  useEffect(() => {
    fetch('/api/admin/offers')
      .then(res => res.ok ? res.json() : [])
      .then(data => Array.isArray(data) && setOffers(data))
      .catch(() => {})
  }, [])

  return offers
}
