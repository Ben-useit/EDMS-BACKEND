require('dotenv');
const express = require('express');
const documentRouter = require('./routes/document');
const searchRouter = require('./routes/search');
const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const fileUpload = require('express-fileupload');
const cors = require('cors');
// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const errorHandler = require('./middleware/error-middleware');
const notFoundMiddleware = require('./middleware/not-found');
const swaggerDocument = YAML.load('./swagger.yaml');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());
app.use(cors());
app.use(express.static('/media'));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/documents', documentRouter);
app.use('/api/v1/register', registerRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/user', userRouter);

app.get('/', (req, res) => {
  res.send('<h1>EDMS API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(errorHandler);
app.use(notFoundMiddleware);
const port = process.env.PORT || 5000;

app.listen(5000, console.log(`Server is listening on port ${port}`));
