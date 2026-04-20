import { useState, useEffect, useRef, FormEvent } from 'react'
import toast from 'react-hot-toast'
import { getProfile, updateProfile, getMyPhotos, uploadPhoto, deletePhoto } from '../../api'
import type { WomanProfile, LookingFor, Photo } from '../../types'
import { COUNTRIES, getCitiesForCountry } from '../../data/locations'

const LOOKING_FOR_OPTIONS: { value: LookingFor; emoji: string; label: string; desc: string }[] = [
  { value: 'relationship', emoji: '💑', label: 'Relación seria',  desc: 'Busco algo estable' },
  { value: 'casual',       emoji: '😊', label: 'Pasar el rato',   desc: 'Sin compromisos' },
  { value: 'commitment',   emoji: '💍', label: 'Compromiso',       desc: 'Para siempre' },
  { value: 'outing',       emoji: '🌸', label: 'Salir a pasear',  desc: 'Conocernos poco a poco' },
  { value: 'surprise',     emoji: '✨', label: 'Sorpréndeme',      desc: 'Estoy abierta a todo' },
]

export default function ProfileSetupPage() {
  const [form, setForm] = useState<Partial<WomanProfile>>({})
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      getProfile().then(r => setForm(r.data)),
      getMyPhotos().then(r => setPhotos(r.data)),
    ])
      .catch(() => toast.error('Error al cargar el perfil'))
      .finally(() => setLoading(false))
  }, [])

  const set = (k: keyof WomanProfile, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      toast.success('Perfil guardado')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadPhoto(file)
      setPhotos(prev => [...prev, res.data])
      toast.success('Foto subida')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al subir foto')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleDeletePhoto = async (photoId: number) => {
    try {
      await deletePhoto(photoId)
      setPhotos(prev => prev.filter(p => p.id !== photoId))
      toast.success('Foto eliminada')
    } catch {
      toast.error('Error al eliminar la foto')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-pulse mb-3">💗</div>
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  const primaryPhoto = photos.find(p => p.is_primary === 1) || photos[0]
  const canUpload = photos.length < 6

  const field = (label: string, key: keyof WomanProfile, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={(form[key] as string) ?? ''}
        placeholder={placeholder}
        onChange={e => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
          <p className="text-gray-500 text-sm mt-1">Así te verán los hombres</p>
        </div>

        {/* Photo section */}
        <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-800">Mis fotos</h2>
              <p className="text-xs text-gray-400">{photos.length}/6 fotos</p>
            </div>
            {canUpload && (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-sm font-medium hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition"
              >
                {uploading ? '⏳ Subiendo...' : '+ Añadir foto'}
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          {photos.length === 0 ? (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-pink-200 rounded-2xl py-12 flex flex-col items-center gap-3 hover:border-pink-400 hover:bg-pink-50 transition"
            >
              <span className="text-5xl">📷</span>
              <span className="text-sm text-pink-500 font-medium">Subir mi primera foto</span>
              <span className="text-xs text-gray-400">Las fotos atraen más solicitudes</span>
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {photos.map(photo => (
                <div key={photo.id} className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100">
                  <img src={photo.photo_url} alt="" className="w-full h-full object-cover" />
                  {photo.is_primary === 1 && (
                    <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                      Principal
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition"
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {canUpload && (
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-2xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center gap-1 hover:border-pink-400 hover:bg-pink-50 transition"
                >
                  <span className="text-2xl text-pink-400">+</span>
                  <span className="text-xs text-pink-400">Añadir</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile form */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-3xl shadow-sm border border-pink-100 p-6">
          <h2 className="font-bold text-gray-800">Información personal</h2>

          <div className="grid grid-cols-2 gap-3">
            {field('Nombre', 'first_name', 'text', 'Tu nombre')}
            {field('Edad', 'age', 'number', '25')}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
              <select
                value={form.country ?? ''}
                onChange={e => set('country', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
              >
                <option value="">Seleccionar...</option>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <select
                value={form.city ?? ''}
                onChange={e => set('city', e.target.value)}
                disabled={!form.country}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white disabled:opacity-50"
              >
                <option value="">Seleccionar...</option>
                {getCitiesForCountry(form.country ?? '').map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={form.bio ?? ''}
              onChange={e => set('bio', e.target.value)}
              rows={3}
              placeholder="Cuéntanos sobre ti..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
            />
          </div>

          {field('Ocupación', 'occupation', 'text', 'Diseñadora, Estudiante...')}
          {field('Teléfono', 'phone', 'tel', '+51 999 999 999')}
          {field('Instagram', 'instagram', 'text', '@tuusuario')}

          {/* Looking for */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">¿Qué estás buscando?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LOOKING_FOR_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('looking_for', form.looking_for === opt.value ? '' : opt.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition ${
                    form.looking_for === opt.value
                      ? 'border-pink-400 bg-pink-50'
                      : 'border-gray-100 hover:border-pink-200 hover:bg-pink-50'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                  {form.looking_for === opt.value && (
                    <span className="ml-auto text-pink-500 text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition disabled:opacity-50 shadow-sm"
          >
            {saving ? 'Guardando...' : 'Guardar Perfil'}
          </button>
        </form>
      </div>
    </div>
  )
}
