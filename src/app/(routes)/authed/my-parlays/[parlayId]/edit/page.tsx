import { EditParlayPage } from '@/components/my-parlays/edit/EditParlayPage';

interface EditParlayPageProps {
  params: Promise<{ parlayId: string }>;
}

export default async function EditParlayPageRoute({
  params,
}: EditParlayPageProps) {
  const { parlayId } = await params;

  return <EditParlayPage parlayId={parlayId} />;
}
