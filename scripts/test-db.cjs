#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')

function loadEnvFile(filePath = path.join(__dirname, '..', '.env')) {
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const rawValue = trimmed.slice(separatorIndex + 1).trim()

    const value = rawValue.replace(/^['"]|['"]$/g, '').replace(/(^|\s)#.*$/, '')

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile()

;(async () => {
  const host = process.env.MYSQL_HOST
  const user = process.env.MYSQL_USER
  const password = process.env.MYSQL_PASSWORD
  const database = process.env.MYSQL_DATABASE
  const port = Number(process.env.MYSQL_PORT || 3306)

  if (!host || !user || !password || !database) {
    console.error('Missing MySQL environment variables. Please set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE in your environment or .env file.')
    process.exit(1)
  }

  try {
    const pool = mysql.createPool({ host, user, password, database, port, connectionLimit: 5 })
    const [rows] = await pool.query('SELECT 1 AS ok')
    console.log('DB test success:', rows)
    await pool.end()
    process.exit(0)
  } catch (err) {
    console.error('DB test failed:', err)
    process.exit(1)
  }
})()
