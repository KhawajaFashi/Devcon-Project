import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create text indexes for search functionality
    await Promise.all([
      mongoose.model('Course').collection.createIndex({ title: 'text', description: 'text' }),
      mongoose.model('Lesson').collection.createIndex({ title: 'text', description: 'text' }),
      mongoose.model('User').collection.createIndex({ name: 'text', 'profileDetails.bio': 'text' })
    ]);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;