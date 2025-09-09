'use client'

import { useRef, useState } from 'react'

export function ImageUploader({ value, onChange, label = 'Imagem', disabled }: { value?: string; onChange: (url: string) => void; label?: string; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    setUploading(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Falha no upload')
      onChange(data.url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {value && (
          <button type="button" className="text-sm text-red-600" onClick={() => onChange('')} disabled={disabled || uploading}>Remover</button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50" onClick={() => inputRef.current?.click()} disabled={disabled || uploading}>
          {uploading ? 'Enviando...' : 'Selecionar arquivo'}
        </button>
        {value && (
          <img src={value} alt="Preview" className="w-20 h-20 object-cover rounded border" />
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const f = e.target.files?.[0]
        if (f) handleFile(f)
      }} />
    </div>
  )
}


