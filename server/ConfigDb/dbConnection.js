import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', false);

const connectionToDB = async () => {
  try {
    // console.log('MongoDB URL:', process.env.MONGO_URL);

    const { connection } = await mongoose.connect(process.env.MONGO_URL);

    console.log(`Connected to MongoDB: ${connection.host}`);
  } catch (e) {
    console.error('Error connecting to MongoDB:', e.message);
    process.exit(1); 
  }
};

export default connectionToDB;
