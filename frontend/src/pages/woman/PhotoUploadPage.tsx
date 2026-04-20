import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { getMyPhotos, uploadPhoto, deletePhoto, setPrimaryPhoto } from '../../api'
import type { Photo } from '../../types'

export default function PhotoUploadPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)

  const load = () => getMyPhotos().then(r => setPhotos(r.data))
  useEffect(() => { load() }, [])

  const onDrop = useCallback(async (files: File[]) => {
    if (photos.length >= 8) { toast.error('Máximo 8 fotos'); return }
    setUploading(true)
    for (const file of files.slice(0, 8 - photos.length)) {
      try {
        await uploadPhoto(file)
      } catch (err: any) {
        toast.error(err.response?.data?.detail || 'Error al subir foto')
      }
    }
    await load()
    setUploading(false)
    toast.success('Fotos subidas')
  }, [photos])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, multiple: true,
  })

  const handleDelete = async (id: number) => {
    await deletePhoto(id)
    setPhotos(p => p.filter(x => x.id !== id))
    toast.success('Foto eliminada')
  }

  const handlePrimary = async (id: number) => {
    await setPrimaryPhoto(id)
    await load()
    toast.success('Foto de portada actualizada')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Fotos ({photos.length}/8)</h1>

      {/* Dropzone */}
      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer mb-8 transition ${isDragActive ? 'border-primary bg-pink-50' : 'border-gray-300 hover:border-primary'}`}>
        <input {...getInputProps()} />
        {uploading ? <p className="text-gray-500">Subiendo...</p> : (
          <>
            <p className="text-4xl mb-2">📸</p>
            <p className="text-gray-600 font-medium">Arrastra fotos aquí o haz clic para seleccionar</p>
            <p className="text-gray-400 text-sm mt-1">JPEG, PNG, WEBP — máximo 8 fotos</p>
          </>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
            <img src={photo.photo_url} alt="" className="w-full h-full object-cover" />
            {photo.is_primary === 1 && (
              <span className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full">Portada</span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              {photo.is_primary !== 1 && (
                <button onClick={() => handlePrimary(photo.id)} title="Portada"
                  className="bg-white text-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-yellow-50">⭐</button>
              )}
              <button onClick={() => handleDelete(photo.id)} title="Eliminar"
                className="bg-white text-red-500 rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-50">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
