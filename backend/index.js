const app = require('./src/server');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Employee Management API running on http://localhost:${PORT}`);
});
