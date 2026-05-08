'use client'

import { useState } from 'react'
import { useCompletion } from '@ai-sdk/react'
import type { InterpretationTopic } from '@/lib/astro/types'

const TOPICS: { id: InterpretationTopic; label: string }[] = [
  { id: 'lagna',         label: 'Lagna' },
  { id: 'moon',          label: 'Moon Sign' },
  { id: 'career',        label: 'Career' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'health',        label: 'Health' },
]

type Props = { chartId: string; isAuthenticated: boolean }

export default function InterpretationPanel({ chartId, isAuthenticated }: Props) {
  const [activeTopic, setActiveTopic] = useState<InterpretationTopic>('lagna')
  const [topicResults, setTopicResults] = useState<Partial<Record<InterpretationTopic, string>>>({})

  const { completion, complete, isLoading, error, setCompletion } = useCompletion({
    api: '/api/kundli/interpret',
    onFinish: (_prompt, completion) => {
      setTopicResults(prev => ({ ...prev, [activeTopic]: completion }))
    },
  })

  function handleTopicChange(topic: InterpretationTopic) {
    setActiveTopic(topic)
    setCompletion(topicResults[topic] ?? '')
  }

  function handleGenerate() {
    complete('', { body: { chartId, topic: activeTopic } })
  }

  const displayText = completion || topicResults[activeTopic] || ''

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {TOPICS.map(t => (
          <button
            key={t.id}
            onClick={() => handleTopicChange(t.id)}
            className={`px-3 py-1.5 text-[8px] tracking-[2px] uppercase transition-colors border ${
              activeTopic === t.id
                ? 'border-[#c9a84c]/60 text-[#c9a84c]'
                : 'border-[#c9a84c]/15 text-[#c9a84c]/40 hover:border-[#c9a84c]/35 hover:text-[#c9a84c]/70'
            }`}
            style={activeTopic === t.id ? { background: 'rgba(201,168,76,0.08)' } : {}}
          >
            {t.label}
            {topicResults[t.id] ? ' ✓' : ''}
          </button>
        ))}
      </div>

      <div className="min-h-[120px] border-l-2 border-[#c9a84c]/30 pl-4">
        {!isAuthenticated ? (
          <p className="text-[11px] text-[#c9a84c]/35 italic leading-relaxed">
            Sign in to generate AI interpretations for your chart.
          </p>
        ) : displayText ? (
          <p className="text-[11px] text-[#e8d5a0]/70 leading-[1.8] whitespace-pre-wrap italic">{displayText}</p>
        ) : (
          <p className="text-[11px] text-[#c9a84c]/30 italic">
            Click Generate to receive an interpretation for <span className="text-[#c9a84c]/50">{activeTopic}</span>.
          </p>
        )}
        {error && <p className="text-[10px] text-[#e07050] mt-2">{error.message}</p>}
      </div>

      {isAuthenticated && (
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="self-start border border-[#c9a84c]/50 text-[#c9a84c] px-5 py-2 text-[8px] tracking-[2px] uppercase hover:border-[#c9a84c] hover:bg-[#c9a84c]/10 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Generating...' : `✦ Generate — ${TOPICS.find(t => t.id === activeTopic)?.label}`}
        </button>
      )}
    </div>
  )
}
