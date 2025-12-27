const { Client } = require('pg')
require('dotenv').config({ path: '.env.local' })

const connectionString = process.env.POSTGRES_URL_NON_POOLING?.replace(/\?.*$/, '')

const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})

async function verifyData() {
  try {
    console.log('Connecting to database...')
    await client.connect()
    console.log('Connected!\n')

    console.log('Querying users table...')
    const result = await client.query('SELECT * FROM users ORDER BY created_at DESC LIMIT 5')

    console.log(`Found ${result.rows.length} user(s):\n`)

    result.rows.forEach((user, index) => {
      console.log(`--- User ${index + 1} ---`)
      console.log(`ID: ${user.id}`)
      console.log(`Emoji: ${user.emoji}`)
      console.log(`Title: ${user.title}`)
      console.log(`Project: ${user.project}`)
      console.log(`Bio: ${user.bio}`)
      console.log(`Interests: ${user.interests.join(', ')}`)
      console.log(`Moods: ${user.moods.join(', ')}`)
      console.log(`WeChat: ${user.wechat || 'N/A'}`)
      console.log(`Created: ${user.created_at}`)
      console.log(`Answers: ${user.answers.length} question(s) answered`)
      console.log('')
    })

    console.log('✅ Database verification complete!')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

verifyData()
