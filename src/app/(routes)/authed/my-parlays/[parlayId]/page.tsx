import { SingleParlay } from '@/components/my-parlays/single-parlay/SingleParlay';

interface ParlayDetailPageProps {
  params: Promise<{ parlayId: string }>;
}

export default async function ParlayDetailPage({
  params,
}: ParlayDetailPageProps) {
  const { parlayId } = await params;

  return <SingleParlay parlayId={parlayId} />;
}
