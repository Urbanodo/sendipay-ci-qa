import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Alerts() {
  const [alerts,   setAlerts]   = useState([])
  const [form,     setForm]     = useState({ currency: 'EUR', targetRate: '' })
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    try {
      const { data } = await api.get('/alerts')
      setAlerts(data.alerts)
    } catch { toast.error('Erreur de chargement') }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async e => {
    e.preventDefault()
    try {
      await api.post('/alerts', form)
      toast.success('Alerte créée !')
      setShowForm(false)
      setForm({ currency: 'EUR', targetRate: '' })
      load()
    } catch { toast.error('Erreur lors de la création') }
  }

  const handleDelete = async id => {
    try {
      await api.delete(`/alerts/${id}`)
      toast.success('Alerte supprimée')
      load()
    } catch { toast.error('Erreur') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes alertes de taux</h1>
          <p className="text-gray-500 mt-1">Soyez notifié quand le taux de change est favorable</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2 rounded-lg transition-colors">
          + Nouvelle alerte
        </button>
      </div>

      {/* Explication */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-800">
        <strong>Comment ça marche ?</strong> Définissez un taux cible EUR→XOF.
        Dès que le taux du marché dépasse ce seuil, vous recevrez un email d'alerte.
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Créer une alerte</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise source</label>
              <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                <option>EUR</option><option>USD</option><option>GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taux cible (XOF)</label>
              <input type="number" placeholder="ex: 670" value={form.targetRate}
                onChange={e => setForm({ ...form, targetRate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-400 mt-1">Taux actuel fixe EUR/XOF ≈ 655.96</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2 rounded-lg transition-colors">
              Créer l'alerte
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
            Aucune alerte configurée
          </div>
        ) : alerts.map(a => (
          <div key={a._id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">
                {a.currency} → XOF ≥ {a.targetRate}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Créée le {new Date(a.createdAt).toLocaleDateString('fr-FR')}
                {' · '}
                <span className={a.active ? 'text-green-600' : 'text-gray-400'}>
                  {a.active ? 'Active' : 'Déclenchée'}
                </span>
              </p>
            </div>
            <button onClick={() => handleDelete(a._id)} className="text-red-400 hover:text-red-600 text-sm">
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
