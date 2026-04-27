import { useState, useEffect, useRef, FormEvent } from 'react'
import toast from 'react-hot-toast'
import { getProfile, updateProfile, getMyPhotos, uploadPhoto, deletePhoto } from '../../api'
import type { WomanProfile, LookingFor, Photo } from '../../types'
import { COUNTRIES, getCitiesForCountry } from '../../data/locations'

/* ── Country phone codes ── */
const PHONE_CODES = [
  { code: '+51',  flag: '🇵🇪', name: 'Perú' },
  { code: '+57',  flag: '🇨🇴', name: 'Colombia' },
  { code: '+52',  flag: '🇲🇽', name: 'México' },
  { code: '+54',  flag: '🇦🇷', name: 'Argentina' },
  { code: '+56',  flag: '🇨🇱', name: 'Chile' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+58',  flag: '🇻🇪', name: 'Venezuela' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+1',   flag: '🇺🇸', name: 'EEUU' },
  { code: '+44',  flag: '🇬🇧', name: 'Reino Unido' },
  { code: '+34',  flag: '🇪🇸', name: 'España' },
]

const AGES = Array.from({ length: 53 }, (_, i) => i + 18) // 18–70

const LOOKING_FOR_OPTIONS: { value: LookingFor; label: string; desc: string; emoji: string }[] = [
  { value: 'relationship', label: 'Relación seria',   desc: 'Busco algo estable',   emoji: '💑' },
  { value: 'casual',       label: 'Casual',           desc: 'Sin compromisos',       emoji: '✨' },
  { value: 'commitment',   label: 'Compromiso',       desc: 'Para siempre',          emoji: '💍' },
  { value: 'outing',       label: 'Salir a conocernos', desc: 'Poco a poco',         emoji: '🌸' },
  { value: 'surprise',     label: 'Sorpréndeme',      desc: 'Abierta a todo',        emoji: '🎲' },
]

function parsePhone(raw?: string): { code: string; number: string } {
  if (!raw) return { code: '+51', number: '' }
  const match = PHONE_CODES.find(p => raw.startsWith(p.code))
  if (match) return { code: match.code, number: raw.slice(match.code.length).trim() }
  return { code: '+51', number: raw }
}

/* ── Shared section header ── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold text-[#F5F0E8]/50 tracking-widest uppercase mb-5">{children}</h2>
}

/* ── Form label ── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[10px] font-bold text-[#F5F0E8]/30 uppercase tracking-[0.18em] mb-2">
      {children}{required && <span className="text-primary ml-1">*</span>}
    </label>
  )
}

export default function ProfileSetupPage() {
  const [form, setForm] = useState<Partial<WomanProfile>>({})
  const [phoneCode, setPhoneCode] = useState('+51')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [lookingFor, setLookingFor] = useState<LookingFor[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      getProfile().then(r => {
        const p = r.data
        setForm(p)
        const { code, number } = parsePhone(p.phone)
        setPhoneCode(code)
        setPhoneNumber(number)
        if (p.looking_for) {
          setLookingFor([p.looking_for as LookingFor])
        }
      }).catch(() => {}),
      getMyPhotos().then(r => setPhotos(r.data)).catch(() => {}),
    ])
      .finally(() => setLoading(false))
  }, [])

  const set = (k: keyof WomanProfile, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const fullPhone = phoneNumber.trim() ? `${phoneCode} ${phoneNumber.trim()}` : ''
    // Backend Enum only accepts a single value — send first selected, or undefined
    const lookingForValue = (lookingFor[0] as LookingFor) || undefined
    try {
      const res = await updateProfile({
        first_name:  form.first_name,
        age:         form.age,
        bio:         form.bio,
        country:     form.country,
        city:        form.city,
        location:    form.location,
        occupation:  form.occupation,
        instagram:   form.instagram,
        telegram:    form.telegram,
        tiktok:      form.tiktok,
        phone:       fullPhone || undefined,
        looking_for: lookingForValue,
      })
      setForm(res.data)
      const { code, number } = parsePhone(res.data.phone)
      setPhoneCode(code)
      setPhoneNumber(number)
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
    } catch { toast.error('Error al eliminar la foto') }
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

  const canUpload = photos.length < 6

  return (
    <div className="min-h-screen bg-[#070509] text-[#F5F0E8]">
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-10">
          <p className="text-[11px] text-primary tracking-[0.22em] uppercase font-bold mb-2">Mi cuenta</p>
          <h1 className="text-3xl font-black tracking-tight">Mi Perfil</h1>
          <p className="text-[#F5F0E8]/30 text-sm mt-1">Así te verán los miembros de Agara</p>
        </div>

        {/* ── Photos ── */}
        <div className="bg-[#0F0C18] border border-white/[0.06] rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <SectionTitle>Mis fotos</SectionTitle>
              <p className="text-xs text-[#F5F0E8]/25 -mt-4">{photos.length}/6 fotos · Se muestran en tu perfil</p>
            </div>
            {canUpload && (
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/30 bg-primary/[0.08] text-primary rounded-lg text-xs font-bold hover:bg-primary/[0.15] disabled:opacity-50 transition">
                {uploading ? 'Subiendo...' : '+ Añadir foto'}
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
              <span className="text-xs text-[#F5F0E8]/20">Las fotos aumentan significativamente las solicitudes</span>
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {photos.map(photo => (
                <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-[#0A0812]">
                  <img src={photo.photo_url} alt="" className="w-full h-full object-cover" />
                  {photo.is_primary === 1 && (
                    <div className="absolute top-1.5 left-1.5 border border-primary/40 bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wide uppercase backdrop-blur-sm">
                      Principal
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button onClick={() => handleDeletePhoto(photo.id)}
                      className="text-xs bg-red-500/90 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {canUpload && (
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="aspect-square rounded-xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-1.5 hover:border-primary/30 hover:bg-primary/[0.04] transition">
                  <span className="text-2xl text-[#F5F0E8]/20 font-light">+</span>
                  <span className="text-[10px] text-[#F5F0E8]/20 uppercase tracking-widest">Añadir</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Profile form ── */}
        <form onSubmit={handleSubmit} className="bg-[#0F0C18] border border-white/[0.06] rounded-2xl p-6 space-y-5">
          <SectionTitle>Información personal</SectionTitle>

          {/* Name + Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Nombre</FieldLabel>
              <input type="text" value={form.first_name ?? ''} onChange={e => set('first_name', e.target.value)}
                placeholder="Tu nombre" className="input-agara" />
            </div>
            <div>
              <FieldLabel>Edad</FieldLabel>
              <select value={form.age ?? ''} onChange={e => set('age', Number(e.target.value))} className="select-agara">
                <option value="" disabled>Seleccionar</option>
                {AGES.map(a => <option key={a} value={a}>{a} años</option>)}
              </select>
            </div>
          </div>

          {/* Country + City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>País</FieldLabel>
              <select value={form.country ?? ''} onChange={e => set('country', e.target.value)} className="select-agara">
                <option value="" disabled>Seleccionar</option>
                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Ciudad</FieldLabel>
              <select value={form.city ?? ''} onChange={e => set('city', e.target.value)}
                disabled={!form.country} className="select-agara disabled:opacity-40">
                <option value="" disabled>Seleccionar</option>
                {getCitiesForCountry(form.country ?? '').map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <FieldLabel>Sobre ti</FieldLabel>
            <textarea value={form.bio ?? ''} onChange={e => set('bio', e.target.value)}
              rows={3} placeholder="Cuéntanos sobre ti, tus intereses..." className="textarea-agara" />
          </div>

          {/* Occupation */}
          <div>
            <FieldLabel>Ocupación</FieldLabel>
            <input type="text" value={form.occupation ?? ''} onChange={e => set('occupation', e.target.value)}
              placeholder="Diseñadora, Estudiante, Empresaria..." className="input-agara" />
          </div>

          {/* Phone with country code */}
          <div>
            <FieldLabel>Teléfono</FieldLabel>
            <div className="flex gap-2">
              <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)}
                className="select-agara w-auto min-w-[110px] flex-shrink-0">
                {PHONE_CODES.map(p => (
                  <option key={p.code} value={p.code}>{p.flag} {p.code}</option>
                ))}
              </select>
              <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                placeholder="999 999 999" className="input-agara flex-1" />
            </div>
          </div>

          {/* Instagram / Telegram / TikTok */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <FieldLabel>Instagram</FieldLabel>
              <input type="text" value={form.instagram ?? ''} onChange={e => set('instagram', e.target.value)}
                placeholder="@usuario" className="input-agara" />
            </div>
            <div>
              <FieldLabel>Telegram</FieldLabel>
              <input type="text" value={form.telegram ?? ''} onChange={e => set('telegram', e.target.value)}
                placeholder="@usuario" className="input-agara" />
            </div>
            <div>
              <FieldLabel>TikTok</FieldLabel>
              <input type="text" value={form.tiktok ?? ''} onChange={e => set('tiktok', e.target.value)}
                placeholder="@usuario" className="input-agara" />
            </div>
          </div>

          {/* Looking for */}
          <div>
            <FieldLabel>¿Qué estás buscando?</FieldLabel>
            <p className="text-[10px] text-[#F5F0E8]/25 -mt-1 mb-3">Puedes elegir más de una opción</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LOOKING_FOR_OPTIONS.map(opt => {
                const active = lookingFor.includes(opt.value)
                return (
                  <button key={opt.value} type="button"
                    onClick={() => setLookingFor(prev =>
                      prev.includes(opt.value) ? prev.filter(v => v !== opt.value) : [...prev, opt.value]
                    )}
                    className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      active
                        ? 'border-primary/40 bg-primary/[0.1] text-[#F5F0E8]'
                        : 'border-white/[0.06] hover:border-primary/25 hover:bg-primary/[0.05] text-[#F5F0E8]/50'
                    }`}>
                    <span className={`text-xl flex-shrink-0 transition-all ${active ? 'scale-110' : 'opacity-50'}`}>{opt.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className="text-[11px] opacity-60 mt-0.5">{opt.desc}</p>
                    </div>
                    {active && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-primary flex-shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-gold">
            {saving ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </form>
      </div>
    </div>
  )
}
