import { ContentPageTemplate } from '@/components/shared/ContentPageTemplate';
import { buildPage } from '@/lib/siteContent';

export default function Build() {
  return <ContentPageTemplate page={buildPage} />;
}
