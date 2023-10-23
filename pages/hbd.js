import CommentForm from '@/components/CommentForm.component';
import ProfilePage from '@/components/Profile.component';
import CommentList from '@/components/comments/CommentList.component';
import Link from 'next/link';
import { useState } from 'react';

export default function HBD() {
  return (
    <div className="container mx-auto p-6 min-h-screen">

        <img src="https://v3.ordinals.gorillapool.io/content/1449fc1004a46fd97bc250fa59c4dbeaec1dd1728920449ba78a81001637f5c7_0" />
        <CommentForm txid={'1449fc1004a46fd97bc250fa59c4dbeaec1dd1728920449ba78a81001637f5c7_0'}></CommentForm>
        <CommentList txid={'1449fc1004a46fd97bc250fa59c4dbeaec1dd1728920449ba78a81001637f5c7_0'}></CommentList>
    </div>
  );
}
