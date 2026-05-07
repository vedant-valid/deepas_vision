import { NextRequest } from 'next/server'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { createClient } from '@/lib/supabase/server'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/astro/interpret'
import type { InterpretationTopic, KundliData } from '@/lib/astro/types'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: 'Sign in to generate interpretations' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { chartId, topic } = await req.json() as {
    chartId: string
    topic: InterpretationTopic
  }

  const { data: chart, error: chartErr } = await supabase
    .from('charts')
    .select('kundli_data')
    .eq('id', chartId)
    .single()

  if (chartErr || !chart) {
    return new Response(JSON.stringify({ error: 'Chart not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Return cached interpretation if it exists (in AI SDK stream format)
  const { data: cached } = await supabase
    .from('interpretations')
    .select('content')
    .eq('chart_id', chartId)
    .eq('topic', topic)
    .single()

  if (cached) {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(cached.content)}\n`))
        controller.enqueue(encoder.encode(`d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`))
        controller.close()
      },
    })
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1',
      },
    })
  }

  const kundliData = chart.kundli_data as KundliData
  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: buildSystemPrompt(),
    prompt: buildUserPrompt(kundliData, topic),
    onFinish: async ({ text }) => {
      await supabase.from('interpretations').upsert({
        chart_id: chartId,
        topic,
        content: text,
        model: 'claude-sonnet-4-6',
      }, { onConflict: 'chart_id,topic' })
    },
  })

  return result.toDataStreamResponse()
}
