import bcrypt from 'bcryptjs'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

async function generateNewCredentials() {
  console.log('🔐 Gerador de Credenciais Seguras\n')
  
  const email = await askQuestion('Digite o novo email: ')
  const password = await askQuestion('Digite a nova senha: ')
  const saltRounds = 12

  try {
    const hash = await bcrypt.hash(password, saltRounds)
    
    console.log('\n✅ Credenciais geradas com sucesso!')
    console.log('\n📋 Adicione estas variáveis ao seu .env:')
    console.log('─'.repeat(50))
    console.log(`ADMIN_EMAIL=${email}`)
    console.log(`ADMIN_PASSWORD_HASH=${hash}`)
    console.log('─'.repeat(50))
    
    console.log('\n🔧 Para Vercel, configure no painel:')
    console.log(`ADMIN_EMAIL = ${email}`)
    console.log(`ADMIN_PASSWORD_HASH = ${hash}`)
    
    console.log('\n⚠️  IMPORTANTE:')
    console.log('- A senha original NÃO fica salva em lugar nenhum')
    console.log('- Use apenas o hash gerado')
    console.log('- Mantenha as credenciais seguras')
    
  } catch (error) {
    console.error('❌ Erro ao gerar hash:', error)
  } finally {
    rl.close()
  }
}

generateNewCredentials()
