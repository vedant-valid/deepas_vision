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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {TOPICS.map(t => (
          <button
            key={t.id}
            onClick={() => handleTopicChange(t.id)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              activeTopic === t.id
                ? 'bg-[#68020d] text-white'
                : 'bg-[#f5ede0] text-[#68020d] hover:bg-[#ead5b5]'
            }`}
          >
            {t.label}
            {topicResults[t.id] ? ' ✓' : ''}
          </button>
        ))}
      </div>

      <div className="min-h-[120px] border-l-4 border-[#9c6b2e] pl-4">
        {!isAuthenticated ? (
          <p className="text-sm text-gray-400 italic">
            Sign in to generate AI interpretations for your chart.
          </p>
        ) : displayText ? (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{displayText}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Click Generate to receive an interpretation for <strong>{activeTopic}</strong>.
          </p>
        )}
        {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
      </div>

      {isAuthenticated && (
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="self-start bg-[#68020d] text-white px-4 py-1.5 rounded text-xs tracking-wider uppercase hover:bg-[#4a0109] disabled:opacity-60 transition-colors"
        >
          {isLoading ? 'Generating...' : `Generate — ${TOPICS.find(t => t.id === activeTopic)?.label}`}
        </button>
      )}
    </div>
  )
}
