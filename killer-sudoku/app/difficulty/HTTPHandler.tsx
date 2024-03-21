import express, { Request, Response } from 'express';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define an interface for the data
interface Data {
  message: string;
}

// GET endpoint
app.get('/api/data', (req: Request, res: Response) => {
  // Access the 'difficulty' query parameter
  const difficulty = req.query.difficulty;

  console.log(`Difficulty: ${difficulty}`);
  const data: Data = {
    message: 'Hello from the server! You\'ve selected ' + difficulty + " difficulty"
  };
  res.json(data);
});

// POST endpoint
app.post('/api/data', (req: Request, res: Response) => {
  console.log(req.body); // Log the request body
  res.status(200).send('Received your data!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
