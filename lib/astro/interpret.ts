import type { KundliData, InterpretationTopic } from './types'

const TOPIC_FOCUS: Record<InterpretationTopic, string> = {
  lagna: 'The Ascendant sign, Lagna lord (its sign, house, and strength), physical constitution, personality traits, and overall life approach.',
  moon: 'Moon sign, nakshatra, and house. Emotional nature, mind, mental habits, relationship with mother, and psychological tendencies.',
  career: '10th house sign and lord, planets in the 10th house, Sun placement. Suitable career fields, professional strengths, and timing of career growth.',
  relationships: '7th house sign and lord, Venus placement, Mars placement. Nature of partnerships, spouse qualities, and relationship patterns.',
  health: '6th house sign and lord, Lagna lord strength, Mars and Saturn placements. Constitutional strengths, vulnerable areas, and health tendencies.',
}

export function buildSystemPrompt(): string {
  return `You are a senior Jyotishi with 30 years of expertise in classical Parashari Vedic astrology. Interpret birth charts with precision, grounding every insight in the actual planetary positions provided. Write in warm, accessible English — insightful and specific, not generic. 2–3 paragraphs per topic. Do not repeat the planet data back to the reader; interpret it.`
}

export function buildUserPrompt(data: KundliData, topic: InterpretationTopic): string {
  const planetLines = data.planets
    .map(p => {
      const retro = p.retrograde ? ' ℞' : ''
      const dig = p.dignity !== 'neutral' ? ` [${p.dignity}]` : ''
      return `${p.name}: ${p.sign} ${p.degree.toFixed(1)}° — House ${p.house} — ${p.nakshatra} pada ${p.pada}${retro}${dig}`
    })
    .join('\n')

  return `Interpret the topic "${topic.toUpperCase()}" for this Vedic birth chart:

Lagna (Ascendant): ${data.lagna.sign} ${data.lagna.degree.toFixed(1)}° — ${data.lagna.nakshatra} pada ${data.lagna.pada}

Planets:
${planetLines}

Focus specifically on: ${TOPIC_FOCUS[topic]}`
}
