import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const labs = [
  {
    id: 1,
    title: 'Agentic AI Lab',
    image: '/assets/62305f1bc87f62a738cc57630a9dd8706a661ad8.jpg',
    desc: 'Services Across Singapore, UK & India. GFF AI continues expanding its enterprise AI consulting, engineering, AI training, and Agentic AI capabilities.',
    focus: 'Multi-agent systems, autonomous workflows, agent orchestration',
    tech: ['LangChain', 'AutoGen', 'CrewAI', 'OpenAI Assistants'],
  },
  {
    id: 2,
    title: 'Generative AI Lab',
    image: '/assets/62305f1bc87f62a738cc57630a9dd8706a661ad8.jpg',
    desc: 'Pushing the boundaries of large language models, image generation, and multimodal AI for enterprise applications.',
    focus: 'LLMs, RAG systems, prompt engineering, fine-tuning',
    tech: ['GPT-4', 'Claude', 'Llama', 'Stable Diffusion'],
  },
  {
    id: 3,
    title: 'Data Intelligence Lab',
    image: '/assets/62305f1bc87f62a738cc57630a9dd8706a661ad8.jpg',
    desc: 'Building next-generation data platforms and real-time analytics engines for the AI-powered enterprise.',
    focus: 'Data lakes, streaming, vector DBs, knowledge graphs',
    tech: ['Apache Kafka', 'Pinecone', 'Neo4j', 'dbt'],
  },
  {
    id: 4,
    title: 'Responsible AI Lab',
    image: '/assets/62305f1bc87f62a738cc57630a9dd8706a661ad8.jpg',
    desc: 'Ensuring AI systems are fair, transparent, explainable, and aligned with human values and regulatory requirements.',
    focus: 'Bias detection, explainability, compliance, ethics',
    tech: ['SHAP', 'LIME', 'Fairlearn', 'What-If Tool'],
  },
];

export default function AILabs() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="ai-labs" className="py-24 lg:py-32 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-3">
            AI LAB & <span className="text-gradient">INNOVATION ENVIRONMENTS</span>
          </h2>
        </motion.div>

        {/* Lab Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {labs.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-card rounded-xl overflow-hidden hover:glow-border-blue transition-all duration-500"
              whileHover={{ y: -8 }}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={lab.image}
                  alt="AI Lab"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ transitionTimingFunction: 'ease' }}
                />
                <div className="absolute inset-0 bg-black/35 pointer-events-none" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, rgba(154,0,3,0.15), rgba(17,115,188,0.15))',
                    transitionTimingFunction: 'ease',
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-display font-bold text-white mb-2 group-hover:text-gradient transition-all">
                  {lab.title}
                </h3>
                <p className="text-xs text-muted-text leading-relaxed mb-4 line-clamp-3">{lab.desc}</p>
                <button
                  onClick={() => setExpanded(expanded === lab.id ? null : lab.id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-white/90 hover-text-gradient transition-colors group/btn"
                >
                  EXPLORE LAB
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expanded Detail */}
        <AnimatePresence>
          {expanded !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {(() => {
                const lab = labs.find((l) => l.id === expanded);
                if (!lab) return null;
                return (
                  <div className="mt-6 glass-card rounded-2xl p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="lg:w-1/3">
                        <img src={lab.image} alt="AI Lab" className="w-full h-48 object-cover rounded-xl" />
                      </div>
                      <div className="lg:w-2/3">
                        <h3 className="text-2xl font-display font-bold text-white mb-3">{lab.title}</h3>
                        <p className="text-muted-text mb-4">{lab.desc}</p>
                        <div className="mb-4">
                          <span className="text-xs font-mono text-gradient mb-2 block">FOCUS AREAS</span>
                          <p className="text-sm text-white/80">{lab.focus}</p>
                        </div>
                        <div>
                          <span className="text-xs font-mono text-gradient mb-2 block">TECH STACK</span>
                          <div className="flex flex-wrap gap-2">
                            {lab.tech.map((t) => (
                              <span key={t} className="px-3 py-1 rounded-full text-xs bg-gff-gradient-soft text-white/90 border border-white/10">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
