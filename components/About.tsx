'use client'

import { Heart, Shield, Truck, Award } from 'lucide-react'

const features = [
  {
    icon: Heart,
    title: 'Qualidade Premium',
    description: 'Produtos selecionados com os mais altos padrões de qualidade'
  },
  {
    icon: Shield,
    title: 'Segurança Garantida',
    description: 'Todos os produtos são testados e aprovados por dermatologistas'
  },
  {
    icon: Truck,
    title: 'Entrega Rápida',
    description: 'Receba seus produtos em até 48 horas em todo o Brasil'
  },
  {
    icon: Award,
    title: 'Satisfação Garantida',
    description: 'Política de troca e devolução de 30 dias para sua tranquilidade'
  }
]

export function About() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Por que escolher a BergasCosmeticos?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos especialistas em maquiagem e estamos comprometidos em oferecer os melhores produtos 
            e serviços para realçar sua beleza natural.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  A BergasCosmeticos nasceu da paixão por maquiagem e da vontade de democratizar o acesso a produtos 
                  de qualidade. Desde 2020, temos trabalhado incansavelmente para trazer as melhores marcas 
                  e tendências do mundo da beleza para o Brasil.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Nossa missão é ajudar cada pessoa a expressar sua personalidade única através da maquiagem, 
                  oferecendo produtos seguros, eficazes e acessíveis, sempre com o melhor atendimento e 
                  suporte especializado.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-xl blur opacity-60"></div>
                <img
                  src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&h=700&fit=crop"
                  alt="Maquiagem"
                  className="relative w-full h-72 md:h-80 object-cover rounded-xl shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}