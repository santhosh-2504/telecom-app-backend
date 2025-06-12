// import app from './app.js';


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// server.js
import app from './app.js';

export default function handler(req, res) {
  return app(req, res); // Important for Vercel's serverless model
}
