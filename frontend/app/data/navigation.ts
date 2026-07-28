export type NavLink = {
  label: string
  href: string
}

export const navLinks: NavLink[] = [
  { label: 'How We Work', href: '/how-gff-ai-works' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Industries', href: '/industries' },
  { label: 'Platforms', href: '/platforms' },
  { label: 'Build With GFF', href: '/build-with-gff' },
  { label: 'Company', href: '/company' },
]

export const footerNav = {
  company: [
    { label: 'How GFF AI Works', href: '/how-gff-ai-works' },
    { label: 'Company', href: '/company' },
    { label: 'Build With GFF', href: '/build-with-gff' },
    { label: 'Contact', href: '/contact' },
    { label: 'Client Portal', href: '/portal' },
  ],
  offering: [
    { label: 'Capabilities', href: '/capabilities' },
    { label: 'Industries', href: '/industries' },
    { label: 'Platforms', href: '/platforms' },
    { label: 'Research & Intelligence', href: '/capabilities#research-intelligence' },
  ],
}
