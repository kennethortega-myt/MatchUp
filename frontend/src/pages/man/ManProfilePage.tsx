import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getManProfile, updateManProfile, uploadManPhoto, deleteManPhoto, setManPrimaryPhoto } from '../../api'
import type { ManProfile } from '../../types'
import { COUNTRIES, getCitiesForCountry } from '../../data/locations'

const AGES = Array.from({ length: 53 }, (_, i) => i + 18) // 18–70

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold text-[#F5F0E8]/50 tracking-widest uppercase mb-5">{children}</h2>
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[10px] font-bold text-[#F5F0E8]/30 uppercase tracking-[0.18em] mb-2">
      {children}{required && <span className="text-primary ml-1">*</span>}
    </label>
  )
}

export default function ManProfilePage() {
  const [profile, setProfile] = useState<ManProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '',
    age: 25,
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
          age: p.age || 25,
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
    if (!form.age || form.age < 18 || form.age > 70) { toast.error('Selecciona una edad válida'); return }
    if (!form.occupation.trim()) { toast.error('La ocupación es obligatoria'); return }
    if ((profile?.photos.length ?? 0) === 0) { toast.error('Sube al menos una foto'); return }
    setSaving(true)
    try {
      const res = await updateManProfile(form)
      setProfile(res.data)
      toast.success(isSetup ? '¡Perfil creado!' : 'Perfil actualizado')
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
    } catch { toast.error('Error al eliminar') }
  }

  const handleSetPrimary = async (photoId: number) => {
    try {
      await setManPrimaryPhoto(photoId)
      setProfile(prev => prev ? {
        ...prev, photos: prev.photos.map(p => ({ ...p, is_primary: p.id === photoId ? 1 : 0 }))
      } : prev)
    } catch { toast.error('Error al actualizar') }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070509] flex items-center justify-center">
        <svg className="w-8 h-8 text-primary/50 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    )
  }

  const photos = profile?.photos || []
  const canUpload = photos.length < 3

  return (
    <div className="min-h-screen bg-[#070509] text-[#F5F0E8]">

      {/* Setup notice */}
      {isSetup && (
        <div className="border-b border-primary/[0.1] bg-primary/[0.05]">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            <p className="text-sm text-[#F5F0E8]/60">
              <span className="text-[#F5F0E8]/80 font-semibold">Completa tu perfil</span> — Sube al menos 1 foto y llena tus datos básicos antes de explorar.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] text-primary tracking-[0.22em] uppercase font-bold mb-2">Mi cuenta</p>
            <h1 className="text-3xl font-black tracking-tight">{isSetup ? 'Crear perfil' : 'Mi Perfil'}</h1>
            <p className="text-[#F5F0E8]/30 text-sm mt-1">Información que verán las mujeres</p>
          </div>
          {!isSetup && (
            <Link to="/man/browse"
              className="flex items-center gap-1.5 text-sm text-[#F5F0E8]/35 hover:text-primary transition font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Explorar
            </Link>
          )}
        </div>

        {/* Photos */}
        <div className="bg-[#0F0C18] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <SectionTitle>Mis fotos</SectionTitle>
              <p className="text-xs text-[#F5F0E8]/25 -mt-4">
                {photos.length}/3 fotos{isSetup && <span className="text-primary ml-1">· Obligatorio</span>}
              </p>
            </div>
            {canUpload && (
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 bg-primary/[0.08] text-primary rounded-lg text-xs font-bold hover:bg-primary/[0.15] disabled:opacity-50 transition">
                {uploading ? 'Subiendo...' : '+ Foto'}
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>

          {photos.length === 0 ? (
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="w-full border border-dashed border-primary/20 bg-primary/[0.03] rounded-xl py-12 flex flex-col items-center gap-3 hover:border-primary/40 hover:bg-primary/[0.06] transition">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 text-primary/40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
              </svg>
              <span className="text-sm text-primary/60 font-medium">Subir primera foto</span>
              <span className="text-xs text-[#F5F0E8]/20">Las fotos aumentan tus chances de match</span>
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {photos.map(photo => (
                <div key={photo.id} className="relative group aspect-[3/4] rounded-xl overflow-hidden bg-[#0A0812]">
                  <img src={photo.photo_url} alt="" className="w-full h-full object-contain" />
                  {photo.is_primary === 1 && (
                    <div className="absolute top-1.5 left-1.5 border border-primary/40 bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wide uppercase backdrop-blur-sm">
                      Principal
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                    {photo.is_primary !== 1 && (
                      <button onClick={() => handleSetPrimary(photo.id)}
                        className="text-xs bg-primary/90 text-[#0F0C18] px-3 py-1.5 rounded-lg font-bold hover:bg-primary transition">
                        Principal
                      </button>
                    )}
                    <button onClick={() => handleDelete(photo.id)}
                      className="text-xs bg-red-500/90 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {canUpload && (
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="aspect-[3/4] rounded-xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-1.5 hover:border-primary/30 hover:bg-primary/[0.04] transition">
                  <span className="text-2xl text-[#F5F0E8]/20 font-light">+</span>
                  <span className="text-[10px] text-[#F5F0E8]/20 uppercase tracking-widest">Añadir</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-[#0F0C18] border border-white/[0.06] rounded-2xl p-6 space-y-5">
          <SectionTitle>Información personal</SectionTitle>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Nombre</FieldLabel>
              <input type="text" value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                placeholder="Tu nombre" className="input-agara" />
            </div>
            <div>
              <FieldLabel required>Edad</FieldLabel>
              <select value={form.age} onChange={e => setForm(f => ({ ...f, age: Number(e.target.value) }))}
                className="select-agara">
                <option value="" disabled>Seleccionar</option>
                {AGES.map(a => <option key={a} value={a}>{a} años</option>)}
              </select>
            </div>
          </div>

          <div>
            <FieldLabel required>Ocupación</FieldLabel>
            <input type="text" value={form.occupation}
              onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))}
              placeholder="Ingeniero, Médico, Empresario..." className="input-agara" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>País</FieldLabel>
              <select value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value, city: '' }))}
                className="select-agara">
                <option value="" disabled>Seleccionar</option>
                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Ciudad</FieldLabel>
              <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                disabled={!form.country} className="select-agara disabled:opacity-40">
                <option value="" disabled>Seleccionar</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>

          <div>
            <FieldLabel>Sobre mí</FieldLabel>
            <textarea rows={4} value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Cuéntanos sobre ti, tus intereses, qué buscas..." className="textarea-agara" />
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-gold">
            {saving ? 'Guardando...' : isSetup ? 'Crear perfil y explorar' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
