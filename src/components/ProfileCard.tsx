import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { TraitBar } from '@/components/ui/TraitBar'
import { TraitRadar } from '@/components/TraitRadar'
import { Badge } from '@/components/ui/Badge'
import { TRAIT_LABEL, TRAIT_ORDER } from '@/utils/format'
import type { AstrologyProfile } from '@/types'
import { Fingerprint } from 'lucide-react'

/**
 * Hồ sơ cá nhân card: bars + radar side by side.
 * Deliberately reads as an analytics panel, not a chart of fate.
 */
export function ProfileCard({
  profile,
  title = 'Hồ sơ cá nhân',
  description = 'Xu hướng cá nhân theo tám chiều đo, dùng để tự đối chiếu.',
  compact,
}: {
  profile: AstrologyProfile
  title?: string
  description?: string
  compact?: boolean
}) {
  return (
    <Card>
      <CardHeader
        icon={<Fingerprint className="h-4 w-4" />}
        title={title}
        description={description}
        action={
          <Badge tone="neutral" className="font-mono text-[10px]">
            {profile.signature}
          </Badge>
        }
      />
      <CardBody>
        <div className={compact ? '' : 'grid gap-6 lg:grid-cols-2'}>
          <div className="space-y-3">
            {TRAIT_ORDER.map((trait) => (
              <TraitBar key={trait} label={TRAIT_LABEL[trait]} value={profile.traits[trait]} tone="neutral" />
            ))}
          </div>
          {!compact ? (
            <div className="flex items-center justify-center">
              <TraitRadar traits={profile.traits} height={320} />
            </div>
          ) : null}
        </div>

        <p className="mt-6 rounded-lg border border-line bg-surface-muted p-4 text-sm leading-relaxed text-ink-soft">
          {profile.narrative}
        </p>
      </CardBody>
    </Card>
  )
}
