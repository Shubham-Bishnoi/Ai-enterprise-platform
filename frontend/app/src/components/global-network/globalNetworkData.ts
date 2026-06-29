export type HubType = 'active' | 'future';

export type HubLabelAlign = 'start' | 'end';

export interface Hub {
  id: string;
  label: string;
  x: number;
  y: number;
  type: HubType;
  color: string;
  labelDx: number;
  labelDy: number;
  labelAlign: HubLabelAlign;
}

export type ArcType = 'active' | 'future';

export interface Arc {
  id: string;
  from: string;
  to: string;
  type: ArcType;
  path: string;
  duration: number;
}

export const HUBS: Hub[] = [
  {
    id: 'usa',
    label: 'USA',
    x: 235,
    y: 275,
    type: 'future',
    color: '#F59E0B',
    labelDx: -18,
    labelDy: -14,
    labelAlign: 'end',
  },
  {
    id: 'london',
    label: 'LONDON',
    x: 475,
    y: 230,
    type: 'active',
    color: '#8B5CF6',
    labelDx: 18,
    labelDy: -16,
    labelAlign: 'start',
  },
  {
    id: 'middle-east',
    label: 'MIDDLE EAST',
    x: 500,
    y: 330,
    type: 'future',
    color: '#EC4899',
    labelDx: 18,
    labelDy: -10,
    labelAlign: 'start',
  },
  {
    id: 'india',
    label: 'INDIA',
    x: 655,
    y: 400,
    type: 'active',
    color: '#FF2D45',
    labelDx: 22,
    labelDy: 16,
    labelAlign: 'start',
  },
  {
    id: 'singapore',
    label: 'SINGAPORE',
    x: 715,
    y: 300,
    type: 'active',
    color: '#178BFF',
    labelDx: 28,
    labelDy: -2,
    labelAlign: 'start',
  },
  {
    id: 'australia',
    label: 'AUSTRALIA',
    x: 780,
    y: 500,
    type: 'future',
    color: '#06B6D4',
    labelDx: 18,
    labelDy: 18,
    labelAlign: 'start',
  },
];

export const ARCS: Arc[] = [
  {
    id: 'london-india',
    from: 'london',
    to: 'india',
    type: 'active',
    path: 'M 475 230 C 535 195, 610 255, 655 400',
    duration: 3.6,
  },
  {
    id: 'india-singapore',
    from: 'india',
    to: 'singapore',
    type: 'active',
    path: 'M 655 400 C 660 380, 695 345, 715 300',
    duration: 3.1,
  },
  {
    id: 'singapore-london',
    from: 'singapore',
    to: 'london',
    type: 'active',
    path: 'M 715 300 C 705 235, 575 155, 475 230',
    duration: 4.2,
  },
  {
    id: 'london-usa',
    from: 'london',
    to: 'usa',
    type: 'future',
    path: 'M 475 230 C 380 160, 285 190, 235 275',
    duration: 7.4,
  },
  {
    id: 'india-middle-east',
    from: 'india',
    to: 'middle-east',
    type: 'future',
    path: 'M 655 400 C 615 325, 590 315, 570 330',
    duration: 6.6,
  },
  {
    id: 'singapore-australia',
    from: 'singapore',
    to: 'australia',
    type: 'future',
    path: 'M 715 300 C 760 410, 805 460, 780 500',
    duration: 6.9,
  },
];
