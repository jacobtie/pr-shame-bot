import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import PullRequestPayload from './types/PullRequestPayload';
import isSenderValid from './lib/validate-sender';
import parseMessage from './lib/message-parser';
import shamePR from './lib/shame-pr';

const app = express();

app.use(express.json());

// GitHub Webhook route
app.post('/', async (req, res, next) => {
  try {
    const payload = req.body as PullRequestPayload;
    const hash = req.get('X-Hub-Signature-256');
    if (!hash || !isSenderValid(payload, hash)) {
      return res.sendStatus(401);
    }
    
    const message = parseMessage(payload);
  
    if (message.status === 'bad') {
      return res.sendStatus(200);
    }
  
    await shamePR(message);

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.sendStatus(500);
};
app.use(errorHandler);

const port = process.env.PORT || 1138;

app.listen(port, () => console.log(`Listening on ${port}`));
