import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('URI:', process.env.MONGODB_URI);
    await connectDB();
    return Response.json({ 
      success: true, 
      message: 'MongoDB connected successfully!' 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}