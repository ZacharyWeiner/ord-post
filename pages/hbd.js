import CommentForm from '@/components/CommentForm.component';
import ProfilePage from '@/components/Profile.component';
import CommentList from '@/components/comments/CommentList.component';
import Link from 'next/link';
import { useState } from 'react';

export default function HBD() {
  return (
    <div className="container mx-auto p-6 min-h-screen">
        <h2> Happy Birthday Satoshi</h2>
        <div className='max-w-4xl video-container'>
        <video src="https://v3.ordinals.gorillapool.io/content/4c684fd3b394d10f8657cbdda41bbad0828a5218b0f97c58f4575aba158e720c_0" autoplay loop controls></video>
        </div>
        <div className='max-w-4xl video-container'>
        <CommentForm txid={'4c684fd3b394d10f8657cbdda41bbad0828a5218b0f97c58f4575aba158e720c_0'}></CommentForm>
        <CommentList txid={'4c684fd3b394d10f8657cbdda41bbad0828a5218b0f97c58f4575aba158e720c_0'}></CommentList>
        </div>
    </div>
  );
}
