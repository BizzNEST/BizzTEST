import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { lookup } from 'mime-types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 })
    }

    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-_]/g, '_')
    
    const filePath = join(process.cwd(), 'public', 'uploads', sanitizedFilename)
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read the file
    const fileBuffer = readFileSync(filePath)
    
    // Get the MIME type
    const mimeType = lookup(sanitizedFilename) || 'application/octet-stream'
    
    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 