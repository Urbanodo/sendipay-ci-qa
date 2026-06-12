import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const PROVIDERS = ['Wave', 'Orange Money', 'WorldRemit', 'Western Union', 'Autre']

export default function Transfers() {
  const [transfers, setTransfers] = useState([])
  const [stats,     setStats]     = useState({})
  const [showForm,  setShowForm]  = useState(false)
  const [form,      setForm]      = useState({ amount: '', currency: 'EUR', provider: 'Wave', fees: '', exchangeRate: '', note: '' })

  const load = async () => {
    try {
      const { data } = await api.get('/transfers')
      setTransfers(data.transfers)
      setStats(data.stats)
    } catch { toast.error('Erreur de chargement') }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async e => {
    e.preventDefault()
    try {
      await api.post('/transfers', form)
      toast.success('Transfert ajouté !')
      setShowForm(false)
      setForm({ amount: '', currency: 'EUR', provider: 'Wave', fees: '', exchangeRate: '', note: '' })
      load()
    } catch { toast.error('Erreur lors de l\'ajout') }
  }

  const handleDelete = async id => {
    if (!window.confirm('Supprimer ce transfert ?')) return
    try {
      await api.delete(`/transfers/${id}`)
      toast.success('Supprimé')
      load()
    } catch { toast.error('Erreur') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes envois</h1>
          <p className="text-gray-500 mt-1">Historique et statistiques de vos transferts</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2 rounded-lg transition-colors">
          + Ajouter un envoi
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total envoyé', value: `${stats.totalSent?.toFixed(0) || 0} €` },
          { label: 'Total frais payés', value: `${stats.totalFees?.toFixed(2) || 0} €` },
          { label: 'Nombre de transferts', value: stats.count || 0 }
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800">Ajouter un transfert</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Montant envoyé', key: 'amount', type: 'number', placeholder: '100' },
              { label: 'Frais payés', key: 'fees', type: 'number', placeholder: '3.99' },
              { label: 'Taux de change', key: 'exchangeRate', type: 'number', placeholder: '655.95' },
              { label: 'Note (optionnel)', key: 'note', type: 'text', placeholder: 'Famille, loyer…' }
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opérateur</label>
              <select value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                {PROVIDERS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
              <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                <option>EUR</option><option>USD</option><option>GBP</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2 rounded-lg transition-colors">
              Enregistrer
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {transfers.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucun transfert enregistré</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Opérateur</th>
                <th className="px-5 py-3 text-right">Montant</th>
                <th className="px-5 py-3 text-right">Frais</th>
                <th className="px-5 py-3 text-right">Reçu (XOF)</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transfers.map(t => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-500">{new Date(t.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-5 py-3 font-medium">{t.provider}</td>
                  <td className="px-5 py-3 text-right">{t.amount} {t.currency}</td>
                  <td className="px-5 py-3 text-right text-red-500">{t.fees} {t.currency}</td>
                  <td className="px-5 py-3 text-right font-semibold">{t.amountReceived?.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleDelete(t._id)} className="text-red-400 hover:text-red-600 text-xs">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
