import { useState } from 'react';
import { ArrowRight, ChevronRight, CircleDot, Factory, FlaskConical, Gauge, Hammer, Rocket, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CTAButton } from '../components/shared';
import type { JourneyStage } from '../lib/siteContent';
import { garageFoundryFactoryJourney, siteContainerClass } from '../lib/siteContent';

const stageIcons = [FlaskConical, Hammer, Factory, Settings2, Gauge, Rocket];
const stageColors = ['#FF3040', '#FF9F1A', '#1173BC', '#00A3FF', '#A855F7', '#C03C85'];

export default function GarageFoundryFactoryJourney() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section id="garage-foundry-factory" className="relative overflow-hidden py-20 lg:py-28">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(17,115,188,0.06), transparent 40%), radial-gradient(circle at 80% 20%, rgba(192,60,133,0.05), transparent 35%)',
        }}
      />

      <div className={siteContainerClass}>
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-[0.24em]"
            style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--chip-bg)', color: 'var(--text-secondary)' }}
          >
            <CircleDot className="h-3.5 w-3.5" />
            Journey
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Garage <span style={{ color: 'var(--text-muted)' }}>→</span> Foundry <span style={{ color: 'var(--text-muted)' }}>→</span>{' '}
            <span className="text-gradient">Factory</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            From AI discovery to engineered systems to enterprise-scale operations.
          </motion.p>
        </div>

        {/* Pipeline - Desktop Horizontal / Mobile Vertical */}
        <div className="relative mt-16">
          {/* Desktop timeline */}
          <div className="relative hidden lg:block">
            {(() => {
              const progressPercent = (activeStage / (garageFoundryFactoryJourney.length - 1)) * 100;

              return (
                <>
                  <div className="grid grid-cols-6 gap-6">
                    {garageFoundryFactoryJourney.map((stage: JourneyStage, index: number) => {
                      const Icon = stageIcons[index];
                      const isActive = activeStage === index;
                      const isPast = index < activeStage;
                      const color = stageColors[index];

                      return (
                        <motion.button
                          key={stage.title}
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.08 }}
                          onClick={() => setActiveStage(index)}
                          className="group relative z-20 flex w-full flex-col items-center text-center"
                        >
                          <div
                            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all duration-500"
                            style={{
                              borderColor: isActive ? color : isPast ? `${color}66` : 'var(--border-default)',
                              backgroundColor: isActive ? `${color}15` : isPast ? `${color}08` : 'var(--chip-bg)',
                              boxShadow: isActive ? `0 0 32px ${color}28` : isPast ? `0 0 18px ${color}14` : 'none',
                            }}
                          >
                            <Icon
                              className="h-6 w-6 transition-colors duration-300"
                              style={{ color: isActive || isPast ? color : 'var(--text-muted)' }}
                            />
                          </div>

                          <div
                            className="mt-3 h-8 w-px transition-colors duration-500"
                            style={{ backgroundColor: isActive || isPast ? `${color}66` : 'rgba(255,255,255,0.12)' }}
                          />
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="relative mx-auto mt-1 max-w-[980px] px-8">
                    <div className="relative h-6">
                      <div
                        className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
                        style={{ backgroundColor: 'var(--border-default)' }}
                      />
                      <motion.div
                        className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gff-gradient"
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                      />

                      <div className="absolute inset-0 flex items-center justify-between">
                        {garageFoundryFactoryJourney.map((stage: JourneyStage, index: number) => {
                          const isComplete = index <= activeStage;
                          const color = stageColors[index];

                          return (
                            <div
                              key={`${stage.title}-dot`}
                              className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full border"
                              style={{
                                borderColor: isComplete ? `${color}88` : 'rgba(255,255,255,0.14)',
                                backgroundColor: isComplete ? color : 'var(--bg-secondary)',
                                boxShadow: isComplete ? `0 0 14px ${color}22` : 'none',
                              }}
                            >
                              <div
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: isComplete ? '#ffffff' : 'rgba(255,255,255,0.35)' }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-6 gap-6">
                    {garageFoundryFactoryJourney.map((stage: JourneyStage, index: number) => {
                      const isActive = activeStage === index;
                      const color = stageColors[index];

                      return (
                        <button
                          key={`${stage.title}-label`}
                          onClick={() => setActiveStage(index)}
                          className="group flex flex-col items-center text-center"
                        >
                          <h3
                            className="font-display text-lg font-bold transition-colors duration-300"
                            style={{ color: isActive ? color : 'var(--text-primary)' }}
                          >
                            {stage.title}
                          </h3>
                          <span
                            className="mt-1 inline-block text-xs font-mono uppercase tracking-wider"
                            style={{ color: isActive ? color : 'var(--text-muted)' }}
                          >
                            Stage {index + 1}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Mobile / tablet vertical timeline */}
          <div className="space-y-4 lg:hidden">
            {garageFoundryFactoryJourney.map((stage: JourneyStage, index: number) => {
              const Icon = stageIcons[index];
              const isActive = activeStage === index;
              const isPast = index < activeStage;
              const color = stageColors[index];

              return (
                <motion.button
                  key={stage.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onClick={() => setActiveStage(index)}
                  className="group relative flex w-full items-start gap-4 rounded-[24px] border p-4 text-left transition-all duration-300"
                  style={{
                    borderColor: isActive ? `${color}55` : 'var(--border-default)',
                    backgroundColor: isActive ? `${color}08` : 'var(--bg-glass)',
                    boxShadow: isActive ? `0 0 26px ${color}12` : 'none',
                  }}
                >
                  <div className="relative flex shrink-0 flex-col items-center">
                    <div
                      className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-500"
                      style={{
                        borderColor: isActive ? color : isPast ? `${color}66` : 'var(--border-default)',
                        backgroundColor: isActive ? `${color}15` : isPast ? `${color}08` : 'var(--chip-bg)',
                        boxShadow: isActive ? `0 0 24px ${color}24` : 'none',
                      }}
                    >
                      <Icon
                        className="h-5 w-5 transition-colors duration-300"
                        style={{ color: isActive || isPast ? color : 'var(--text-muted)' }}
                      />
                    </div>

                    {index < garageFoundryFactoryJourney.length - 1 && (
                      <div className="relative flex h-12 w-6 items-center justify-center">
                        <div
                          className="absolute top-0 h-full w-px"
                          style={{ backgroundColor: index < activeStage ? `${color}55` : 'rgba(255,255,255,0.12)' }}
                        />
                        <ChevronRight className="relative h-4 w-4 rotate-90" style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pt-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3
                          className="font-display text-lg font-bold transition-colors duration-300"
                          style={{ color: isActive ? color : 'var(--text-primary)' }}
                        >
                          {stage.title}
                        </h3>
                        <span
                          className="mt-1 inline-block text-xs font-mono uppercase tracking-wider"
                          style={{ color: isActive ? color : 'var(--text-muted)' }}
                        >
                          Stage {index + 1}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {stage.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="mt-12"
          >
            <div
              className="overflow-hidden rounded-[28px] border lg:grid lg:grid-cols-[1fr_0.5fr]"
              style={{
                backgroundColor: 'var(--bg-glass)',
                borderColor: 'var(--border-default)',
                boxShadow: `inset 0 1px 0 0 ${stageColors[activeStage]}22`,
              }}
            >
              {/* Left - Details */}
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${stageColors[activeStage]}15` }}
                  >
                    {(() => {
                      const Icon = stageIcons[activeStage];
                      return <Icon className="h-5 w-5" style={{ color: stageColors[activeStage] }} />;
                    })()}
                  </div>
                  <div>
                    <h4 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {garageFoundryFactoryJourney[activeStage].title}
                    </h4>
                  </div>
                </div>

                <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {garageFoundryFactoryJourney[activeStage].description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {garageFoundryFactoryJourney[activeStage].bullets.map((bullet: string) => (
                    <span
                      key={bullet}
                      className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm"
                      style={{ borderColor: 'var(--chip-border)', backgroundColor: 'var(--chip-bg)', color: 'var(--text-secondary)' }}
                    >
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stageColors[activeStage] }} />
                      {bullet}
                    </span>
                  ))}
                </div>

                <div className="mt-8">
                  <CTAButton to={garageFoundryFactoryJourney[activeStage].link}>
                    Explore {garageFoundryFactoryJourney[activeStage].title}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </CTAButton>
                </div>
              </div>

              {/* Right - Visual */}
              <div
                className="hidden lg:flex items-center justify-center border-l p-8"
                style={{
                  borderColor: 'var(--border-default)',
                  background: `radial-gradient(circle at center, ${stageColors[activeStage]}10, transparent 70%)`,
                }}
              >
                <div className="text-center">
                  <div
                    className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl border"
                    style={{
                      borderColor: `${stageColors[activeStage]}40`,
                      backgroundColor: `${stageColors[activeStage]}10`,
                      boxShadow: `0 0 60px ${stageColors[activeStage]}15`,
                    }}
                  >
                    {(() => {
                      const Icon = stageIcons[activeStage];
                      return <Icon className="h-12 w-12" style={{ color: stageColors[activeStage] }} />;
                    })()}
                  </div>
                  <p className="font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {garageFoundryFactoryJourney[activeStage].bullets.join(' · ')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
