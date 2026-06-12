import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import api from '../utils/api'
import toast from 'react-hot-toast'

const COLORS = ['#1D9E75', '#3B82F6', '#F59E0B', '#EF4444']

export default function Dashboard() {
  const [amount,   setAmount]   = useState(100)
  const [currency, setCurrency] = useState('EUR')
  const [results,  setResults]  = useState(null)
  const [loading,  setLoading]  = useState(false)

  const compare = async () => {
    if (!amount || amount <= 0) return toast.error('Entrez un montant valide')
    setLoading(true)
    try {
      const { data } = await api.get('/comparator', { params: { amount, from: currency, to: 'XOF' } })
      setResults(data)
    } catch {
      toast.error('Erreur lors de la comparaison')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comparer les frais de transfert</h1>
        <p className="text-gray-500 mt-1">Trouvez l'opérateur le moins cher pour envoyer de l'argent</p>
      </div>

      {/* Formulaire comparateur */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant à envoyer</label>
            <input
              type="number" value={amount} onChange={e => setAmount(e.target.value)}
              min="1" placeholder="100"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="EUR">EUR €</option>
              <option value="USD">USD $</option>
              <option value="GBP">GBP £</option>
            </select>
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500">
              XOF (CFA)
            </div>
          </div>
          <button onClick={compare} disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Recherche...' : 'Comparer'}
          </button>
        </div>
      </div>

      {/* Résultats */}
      {results && (
        <div className="space-y-6">
          {/* Meilleure offre */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-600 font-semibold">✓ Meilleure offre</span>
            </div>
            <p className="text-2xl font-bold text-green-800">
              {results.bestProvider.name}
            </p>
            <p className="text-gray-600 mt-1">
              Le destinataire reçoit <strong>{results.bestProvider.amountReceived.toLocaleString()} XOF</strong>
              {' '}pour {amount} {currency} · Frais : {results.bestProvider.fees} {currency} ({results.bestProvider.feesPercent}%)
            </p>
          </div>

          {/* Graphique comparatif */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Montant reçu par opérateur (XOF)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={results.providers} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`${v.toLocaleString()} XOF`, 'Montant reçu']} />
                <Bar dataKey="amountReceived" radius={[6,6,0,0]}>
                  {results.providers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tableau détaillé */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">Opérateur</th>
                  <th className="px-5 py-3 text-right">Frais</th>
                  <th className="px-5 py-3 text-right">% Frais</th>
                  <th className="px-5 py-3 text-right">Montant reçu (XOF)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.providers.map((p, i) => (
                  <tr key={p.name} className={i === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
                    <td className="px-5 py-3 font-medium">
                      {i === 0 && <span className="text-green-500 mr-1">★</span>}
                      {p.name}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-600">{p.fees} {currency}</td>
                    <td className="px-5 py-3 text-right text-gray-600">{p.feesPercent}%</td>
                    <td className="px-5 py-3 text-right font-semibold">{p.amountReceived.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 text-right">
            Taux de change : 1 {currency} = {results.exchangeRate.toFixed(2)} XOF · Mis à jour : {new Date(results.updatedAt).toLocaleTimeString('fr-FR')}
          </p>
        </div>
      )}
    </div>
  )
}
