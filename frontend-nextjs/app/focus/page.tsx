import { Metadata } from 'next';
import FocusLab from '@/components/FocusLab/FocusLab';

export const metadata: Metadata = {
  title: 'Vidya Focus Lab - Cognitive Training & Productivity Reset',
  description:
    'Take a 60-second cognitive focus break with Quick Math, Pattern Recognition, Memory Matrix, Science Sprint, and Logic Challenges.',
};

export default function FocusPage() {
  return <FocusLab />;
}
