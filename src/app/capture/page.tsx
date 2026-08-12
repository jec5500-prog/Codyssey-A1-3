import CaptureForm from '@/components/capture/CaptureForm';

export const metadata = {
  title: 'Capture Spatial Intelligence | SPOT',
  description: 'Upload field photo, parse EXIF GPS & timestamp, analyze design attributes with AI, and verify data.',
};

export default function CapturePage() {
  return <CaptureForm />;
}
