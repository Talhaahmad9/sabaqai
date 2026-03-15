import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Material from '@/lib/models/Material';
import User from '@/lib/models/User';
import { deleteFileFromS3 } from '@/lib/s3';

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { materialId } = await params;
    if (!materialId) {
      return NextResponse.json({ message: 'Material ID is required' }, { status: 400 });
    }

    await connectDB();

    // Find user to get their ID for security check
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Find material and ensure it belongs to the user
    const material = await Material.findOne({ _id: materialId, userId: user._id });
    if (!material) {
      return NextResponse.json({ message: 'Material not found' }, { status: 404 });
    }

    // Delete from S3
    try {
      await deleteFileFromS3(material.s3Key);
    } catch (err) {
      console.error('S3 delete failed:', err);
      // continue with DB deletion even if S3 delete fails
    }

    // Delete from MongoDB
    await Material.deleteOne({ _id: materialId });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Material delete error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
