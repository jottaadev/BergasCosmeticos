import crypto from 'crypto'

// Gerador de AUTH_SECRET seguro
function generateAuthSecret() {
  // Gera uma string aleatória de 64 caracteres
  const secret = crypto.randomBytes(32).toString('hex')
  
  console.log('🔐 Gerador de AUTH_SECRET Seguro\n')
  console.log('✅ AUTH_SECRET gerado com sucesso!')
  console.log('\n📋 Adicione esta variável ao seu .env:')
  console.log('─'.repeat(60))
  console.log(`AUTH_SECRET=${secret}`)
  console.log('─'.repeat(60))
  
  console.log('\n🔧 Para Vercel, configure no painel:')
  console.log(`AUTH_SECRET = ${secret}`)
  
  console.log('\n⚠️  IMPORTANTE:')
  console.log('- Mantenha esta chave SECRETA')
  console.log('- NÃO compartilhe com ninguém')
  console.log('- Use apenas em produção')
  console.log('- Se vazar, gere uma nova imediatamente')
  
  console.log('\n🔒 Características da chave:')
  console.log(`- Tamanho: ${secret.length} caracteres`)
  console.log('- Tipo: Hexadecimal (0-9, a-f)')
  console.log('- Entropia: Alta (impossível de adivinhar)')
}

generateAuthSecret()
