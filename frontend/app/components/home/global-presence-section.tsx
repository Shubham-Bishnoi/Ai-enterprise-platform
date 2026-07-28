import { PanoramicFeature } from '@/components/ui/enterprise-visuals'
import { ENTERPRISE_VISUALS } from '@/components/ui/enterprise-visuals-data'
import { DeliveryNetworkExplorer } from '@/components/home/delivery-network'

export function GlobalPresenceSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8 md:gap-20">
        {/* Panoramic introduction (approved — do not modify). */}
        <PanoramicFeature
          eyebrow="Global Presence"
          title="Global AI Transformation Presence"
          description="GFF AI operates across strategic, sovereign regions with a single Garage–Foundry–Factory delivery network — from Singapore and India to Australia, and beyond."
          imageSrc={ENTERPRISE_VISUALS.sovereign.src}
          imageAlt={ENTERPRISE_VISUALS.sovereign.alt}
          accent={ENTERPRISE_VISUALS.sovereign.accent}
        />

        {/* Editorial delivery-network explorer with the connected world map. */}
        <DeliveryNetworkExplorer />
      </div>
    </section>
  )
}
