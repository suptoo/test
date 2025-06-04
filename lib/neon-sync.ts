// Utility to manually sync with neon_auth.users_sync table
// This would be used if you want to directly query the neon_auth schema

export async function syncFromNeonAuth() {
  try {
    // Direct SQL query to neon_auth.users_sync table
    const { Pool } = require("pg")

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })

    // Query the neon_auth.users_sync table
    const result = await pool.query(`
      SELECT id, email, name, created_at, updated_at, raw_json
      FROM neon_auth.users_sync 
      WHERE deleted_at IS NULL 
      AND email IS NOT NULL
    `)

    return result.rows
  } catch (error) {
    console.error("Error syncing from neon_auth:", error)
    return []
  }
}
