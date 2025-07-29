"use client"

import { useEffect, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import Prism.js
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-markup' // For HTML
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-php'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  onLanguageChange?: (language: string) => void
  placeholder?: string
  readOnly?: boolean
  showLanguageSelector?: boolean
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'markup', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'php', label: 'PHP' }
]

export function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  placeholder = "Enter your code here...",
  readOnly = false,
  showLanguageSelector = false
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (preRef.current) {
      // Highlight the code
      const codeToHighlight = value || placeholder
      const languageGrammar = Prism.languages[language]
      
      if (languageGrammar && codeToHighlight) {
        const highlighted = Prism.highlight(
          codeToHighlight,
          languageGrammar,
          language
        )
        preRef.current.innerHTML = highlighted
      } else {
        // Fallback for unsupported languages or empty content
        preRef.current.textContent = codeToHighlight
      }
    }
  }, [value, language, placeholder])

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  const syncScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop
      preRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  return (
    <div className="space-y-2">
      {showLanguageSelector && onLanguageChange && (
        <div className="flex items-center gap-2">
          <Label className="text-sm">Language:</Label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="relative">
        <div className="relative overflow-hidden rounded-md border border-input bg-background">
          {/* Syntax highlighted code display */}
          <pre
            ref={preRef}
            className="absolute inset-0 p-3 text-sm leading-6 text-transparent pointer-events-none overflow-auto whitespace-pre-wrap break-words"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            }}
            aria-hidden="true"
          />
          
          {/* Actual textarea for input */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            readOnly={readOnly}
            className="relative z-10 w-full h-64 p-3 text-sm leading-6 bg-transparent border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              caretColor: isFocused ? 'currentColor' : 'transparent',
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  )
} 