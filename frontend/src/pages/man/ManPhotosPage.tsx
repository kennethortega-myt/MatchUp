import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getManProfile, uploadManPhoto, deleteManPhoto, setManPrimaryPhoto } from '../../api'
import type { Photo } from '../../types'

export default function ManPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getManProfile()
      .then(res => setPhotos(res.data.photos || []))
      .catch(() => toast.error('Error al cargar fotos'))
      .finally(() => setLoading(false))
  }, [])

  const canUpload = photos.length < 3

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadManPhoto(file)
      setPhotos(prev => [...prev, res.data])
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
      setPhotos(prev => prev.filter(p => p.id !== photoId))
      toast.success('Foto eliminada')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const handleSetPrimary = async (photoId: number) => {
    try {
      await setManPrimaryPhoto(photoId)
      setPhotos(prev => prev.map(p => ({ ...p, is_primary: p.id === photoId ? 1 : 0 })))
      toast.success('Foto principal actualizada')
    } catch {
      toast.error('Error al actualizar')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-5xl animate-pulse">📷</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Mis Fotos</h1>
            <p className="text-xs text-gray-400">{photos.length}/3 fotos · Las mujeres ven tu foto principal</p>
          </div>
          <Link to="/man/profile" className="text-sm text-blue-500 font-medium hover:text-blue-600">← Perfil</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Upload button */}
        {canUpload && (
          <div className="mb-6">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-sm hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition shadow-sm"
            >
              <span className="text-xl">{uploading ? '⏳' : '📷'}</span>
              {uploading ? 'Subiendo...' : `Subir foto (${photos.length}/3)`}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
        )}

        {photos.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-blue-200 py-20 flex flex-col items-center gap-4">
            <span className="text-6xl">📷</span>
            <div className="text-center">
              <p className="font-semibold text-gray-700">No tienes fotos aún</p>
              <p className="text-sm text-gray-400 mt-1">Sube hasta 3 fotos. Tu foto principal es la que las mujeres ven primero.</p>
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition"
            >
              Subir primera foto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                {/* Photo */}
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={photo.photo_url}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Actions */}
                <div className="p-3 space-y-2">
                  {photo.is_primary === 1 ? (
                    <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold">
                      <span>⭐</span>
                      <span>Foto principal</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSetPrimary(photo.id)}
                      className="w-full py-1.5 rounded-xl border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition"
                    >
                      ⭐ Hacer principal
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="w-full py-1.5 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition"
                  >
                    🗑 Eliminar
                  </button>
                </div>
              </div>
            ))}

            {/* Add slot */}
            {canUpload && (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="aspect-[3/4] rounded-3xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <span className="text-4xl text-blue-300">+</span>
                <span className="text-sm text-blue-400 font-medium">Añadir foto</span>
                <span className="text-xs text-gray-400">{3 - photos.length} restante{3 - photos.length !== 1 ? 's' : ''}</span>
              </button>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-sm font-semibold text-blue-700 mb-2">💡 Consejos para tus fotos</p>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Usa una foto de perfil clara donde se vea tu rostro</li>
            <li>• Las fotos de buena calidad aumentan las respuestas</li>
            <li>• La foto marcada como "principal" es la primera que ven</li>
            <li>• Máximo 3 fotos por perfil</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
