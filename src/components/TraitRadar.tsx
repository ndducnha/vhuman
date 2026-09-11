import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import type { TraitScores } from '@/types'
import { TRAIT_LABEL, TRAIT_ORDER } from '@/utils/format'
import { useThemeColors } from '@/hooks/useThemeColors'

/**
 * Neutral, analytical radar: deliberately not a zodiac wheel.
 * Colours come from design tokens so the chart follows light/dark.
 */
export function TraitRadar({
  traits,
  compare,
  height = 280,
  label = 'Hồ sơ',
}: {
  traits: TraitScores
  compare?: { label: string; traits: TraitScores }
  height?: number
  label?: string
}) {
  const c = useThemeColors()

  const data = TRAIT_ORDER.map((trait) => ({
    trait: TRAIT_LABEL[trait],
    value: traits[trait],
    compare: compare ? compare.traits[trait] : undefined,
  }))

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke={c.border} strokeDasharray="0" />
          <PolarAngleAxis
            dataKey="trait"
            tick={{ fill: c['fg-muted'], fontSize: 11, fontWeight: 500 }}
            tickLine={false}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          {compare ? (
            <Radar
              name={compare.label}
              dataKey="compare"
              stroke={c['neutral-solid']}
              fill={c['neutral-solid']}
              fillOpacity={0.1}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              isAnimationActive={false}
            />
          ) : null}
          <Radar
            name={label}
            dataKey="value"
            stroke={c['accent-600']}
            fill={c['accent-600']}
            fillOpacity={0.18}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
