const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>EDMS API</h1>');
});
const port = process.env.PORT || 5000;

app.listen(5000, console.log(`Server is listening on port ${port}`));
