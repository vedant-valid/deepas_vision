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
    streamProtocol: 'text',
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
      {/* Topic tabs */}
      <div className="flex flex-wrap gap-2">
        {TOPICS.map(t => (
          <button
            key={t.id}
            onClick={() => handleTopicChange(t.id)}
            className={`px-4 py-1.5 text-[12px] tracking-wide rounded-sm transition-colors ${
              activeTopic === t.id
                ? 'bg-[#68020d] text-white'
                : 'bg-[#fdf0eb] text-[#68020d] hover:bg-[#f5e0d5]'
            }`}
          >
            {t.label}
            {topicResults[t.id] ? ' ✓' : ''}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[120px] border-l-2 border-[#68020d]/25 pl-4">
        {!isAuthenticated ? (
          <p className="text-[13px] text-[#68020d]/50 italic leading-relaxed">
            Sign in to generate AI interpretations for your chart.
          </p>
        ) : displayText ? (
          <p className="text-[13px] text-[#3d1a0a] leading-[1.9] whitespace-pre-wrap">{displayText}</p>
        ) : (
          <p className="text-[13px] text-[#68020d]/40 italic">
            Click Generate to receive an interpretation for <span className="font-medium text-[#68020d]/60">{activeTopic}</span>.
          </p>
        )}
        {error && <p className="text-[12px] text-red-700 mt-2">{error.message}</p>}
      </div>

      {isAuthenticated && (
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="self-start bg-[#68020d] hover:bg-[#4a0109] text-white px-5 py-2.5 text-[12px] tracking-wider uppercase rounded-sm disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Generating...' : `Generate — ${TOPICS.find(t => t.id === activeTopic)?.label}`}
        </button>
      )}
    </div>
  )
}
