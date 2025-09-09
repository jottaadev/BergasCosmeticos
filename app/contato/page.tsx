'use client'

import { Input, Textarea, Button } from '@heroui/react'

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contato</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg text-gray-600 mb-6">
              Fale com a nossa equipe. Responderemos o mais rápido possível.
            </p>
            <div className="space-y-4">
              <Input label="Nome" variant="bordered" className="w-full" />
              <Input label="E-mail" type="email" variant="bordered" className="w-full" />
              <Textarea label="Mensagem" variant="bordered" className="w-full" minRows={6} />
              <Button color="primary">Enviar</Button>
            </div>
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-2">Informações</h2>
            <p className="text-gray-600">Email: contato@bergas.com</p>
            <p className="text-gray-600">WhatsApp: (11) 99999-9999</p>
          </div>
        </div>
      </section>
    </main>
  )
}



