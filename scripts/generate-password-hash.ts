import bcrypt from 'bcryptjs'

// Script para gerar hash da senha
const password = 'admin'
const saltRounds = 12

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('Senha original:', password)
    console.log('Hash gerado:', hash)
    console.log('\nAdicione esta variável ao seu .env:')
    console.log(`ADMIN_PASSWORD_HASH=${hash}`)
  } catch (error) {
    console.error('Erro ao gerar hash:', error)
  }
}

generateHash()
