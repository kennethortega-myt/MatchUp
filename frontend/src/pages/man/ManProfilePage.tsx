import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getManProfile, updateManProfile, uploadManPhoto, deleteManPhoto, setManPrimaryPhoto } from '../../api'
import type { ManProfile } from '../../types'
import { COUNTRIES, getCitiesForCountry } from '../../data/locations'

export default function ManProfilePage() {
  const [profile, setProfile] = useState<ManProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '',
    age: 18,
    bio: '',
    country: '',
    city: '',
    occupation: '',
  })

  const isSetup = !profile?.first_name

  useEffect(() => {
    getManProfile()
      .then(res => {
        const p = res.data
        setProfile(p)
        setForm({
          first_name: p.first_name || '',
          age: p.age || 18,
          bio: p.bio || '',
          country: p.country || '',
          city: p.city || '',
          occupation: p.occupation || '',
        })
      })
      .catch(() => toast.error('Error al cargar el perfil'))
      .finally(() => setLoading(false))
  }, [])

  const cities = getCitiesForCountry(form.country)

  const handleSave = async () => {
    if (!form.first_name.trim()) { toast.error('El nombre es obligatorio'); return }
    if (!form.age || form.age < 18 || form.age > 99) { toast.error('La edad debe ser entre 18 y 99'); return }
    if (!form.occupation.trim()) { toast.error('La ocupación es obligatoria'); return }
    if ((profile?.photos.length ?? 0) === 0) { toast.error('Sube al menos una foto'); return }
    setSaving(true)
    try {
      const res = await updateManProfile(form)
      setProfile(res.data)
      toast.success(isSetup ? '¡Perfil creado! Exploremos 🔍' : 'Perfil actualizado')
      if (isSetup) navigate('/man/browse')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadManPhoto(file)
      setProfile(prev => prev ? { ...prev, photos: [...prev.photos, res.data] } : prev)
      toast.success('Foto subida')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al subir foto')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleDelete = async (photoId: number) => {
    try {
      await deleteManPhoto(photoId)
      setProfile(prev => prev ? { ...prev, photos: prev.photos.filter(p => p.id !== photoId) } : prev)
      toast.success('Foto eliminada')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const handleSetPrimary = async (photoId: number) => {
    try {
      await setManPrimaryPhoto(photoId)
      setProfile(prev => prev ? {
        ...prev,
        photos: prev.photos.map(p => ({ ...p, is_primary: p.id === photoId ? 1 : 0 }))
      } : prev)
    } catch {
      toast.error('Error al actualizar')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-5xl animate-pulse">👤</div>
      </div>
    )
  }

  const photos = profile?.photos || []
  const canUpload = photos.length < 3

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {isSetup ? 'Completa tu perfil 👋' : 'Mi Perfil'}
            </h1>
            <p className="text-xs text-gray-400">
              {isSetup ? 'Las mujeres verán esto al recibir tu solicitud' : 'Información que verán las mujeres'}
            </p>
          </div>
          {!isSetup && (
            <Link to="/man/browse" className="text-sm text-blue-500 font-medium hover:text-blue-600">← Explorar</Link>
          )}
        </div>
      </div>

      {/* Setup banner */}
      {isSetup && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="font-semibold text-sm">Antes de explorar, completa tu perfil</p>
              <p className="text-blue-100 text-xs mt-0.5">Sube al menos 1 foto y llena tus datos básicos</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Photos */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-800">
                Mis fotos {isSetup && <span className="text-red-400 text-xs ml-1">*obligatorio</span>}
              </h2>
              <p className="text-xs text-gray-400">{photos.length}/3 fotos · máximo 3</p>
            </div>
            {canUpload && (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {uploading ? '⏳' : '+ Foto'}
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>

          {photos.length === 0 ? (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-blue-200 rounded-2xl py-12 flex flex-col items-center gap-3 hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <span className="text-5xl">📷</span>
              <span className="text-sm text-blue-500 font-semibold">Subir primera foto</span>
              <span className="text-xs text-gray-400">Las fotos aumentan tus chances de match</span>
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {photos.map(photo => (
                <div key={photo.id} className="relative group aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                  <img src={photo.photo_url} alt="" className="w-full h-full object-contain" />
                  {photo.is_primary === 1 && (
                    <div className="absolute top-1.5 left-1.5 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                      Principal
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                    {photo.is_primary !== 1 && (
                      <button onClick={() => handleSetPrimary(photo.id)} className="text-xs bg-white text-gray-800 px-2 py-1 rounded-lg font-medium hover:bg-blue-50">
                        ⭐ Principal
                      </button>
                    )}
                    <button onClick={() => handleDelete(photo.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg font-medium hover:bg-red-600">
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {canUpload && (
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="aspect-[3/4] rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition">
                  <span className="text-2xl text-blue-400">+</span>
                  <span className="text-xs text-blue-400">Añadir</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-bold text-gray-800">Información personal</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Edad <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={18} max={99}
                value={form.age === 0 ? '' : form.age}
                onChange={e => setForm(f => ({ ...f, age: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Ocupación <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.occupation}
              onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Ej: Ingeniero de software, Médico, Empresario..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">País</label>
              <select
                value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value, city: '' }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              >
                <option value="">Seleccionar...</option>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ciudad</label>
              <select
                value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                disabled={!form.country}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white disabled:opacity-50"
              >
                <option value="">Seleccionar...</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Sobre mí <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Cuéntanos sobre ti, tus intereses, qué buscas..."
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition shadow-sm"
          >
            {saving
              ? 'Guardando...'
              : isSetup
              ? 'Crear perfil y explorar →'
              : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
