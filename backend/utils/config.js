import 'dotenv/config';

const PORT = process.env.PORT;
const MONGODB_URI = process.env.NODE_ENV === 'test'? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI;
const SECRET_KEY = process.env.SECRET_KEY;

export default { PORT , MONGODB_URI, SECRET_KEY };