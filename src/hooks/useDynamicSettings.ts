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
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  return settings
}

export function useCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => setCategories(data.filter(c => c.isActive)))
      .catch(() => {})
  }, [])

  return categories
}

export function useOffers() {
  const [offers, setOffers] = useState([])

  useEffect(() => {
    fetch('/api/admin/offers')
      .then(res => res.json())
      .then(data => setOffers(data))
      .catch(() => {})
  }, [])

  return offers
}
