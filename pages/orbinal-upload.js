import OrbinalEncoder from '@/components/OrbinalEncoder.component';
import OrbinalUploader from '@/components/OrbinalUploader.component';
import Link from 'next/link';
import { useState } from 'react';

export default function OrbinalUpload() {
  return (
    <div className="container mx-auto p-6 min-h-screen">

      <OrbinalEncoder></OrbinalEncoder>
      <OrbinalUploader></OrbinalUploader>
    </div>
  );
}
