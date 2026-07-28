'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Image-led editorial split for "What is Enterprise Intelligence Engineering?"
 * ~44% approved copy, ~56% visual. One restrained gradient wash behind the
 * image field; a single entrance reveal (text rises, image settles from
 * scale 0.985) and no parallax.
 */
export function DefinitionSplit() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,44fr)_minmax(0,56fr)] lg:gap-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="flex flex-col gap-5"
      >
        <h2 className="text-balance text-[1.75rem] font-semibold tracking-tight text-navy md:text-[2.25rem]">
          What is Enterprise Intelligence Engineering?
        </h2>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground">
          Enterprise Intelligence Engineering begins by understanding how an organisation operates, where its knowledge
          resides, how decisions are made and which outcomes need improvement.
        </p>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground">
          It then brings together enterprise architecture, organisational knowledge, specialist AI agents, business
          workflows, governance, human oversight and continuous improvement.
        </p>
        <p className="text-pretty text-base leading-relaxed text-navy">
          The objective is not to deploy an isolated AI tool. It is to develop a reusable and governed intelligence
          capability that can grow with the enterprise.
        </p>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative"
      >
        {/* One restrained wash behind the visual */}
        <div
          aria-hidden="true"
          className="absolute -inset-6 rounded-[40px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(21,93,252,0.07) 0%, rgba(192,132,252,0.06) 55%, rgba(255,247,240,0.6) 100%)',
          }}
        />
        <div className="relative aspect-[4/3] overflow-hidden rounded-[32px]">
          <Image
            src="/images/how-gff-ai-works/01-enterprise-thinking.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 54vw, 92vw"
            className="object-cover"
            style={{ objectPosition: '50% 45%' }}
          />
        </div>
      </motion.div>
    </div>
  )
}
