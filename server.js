const express = require('express');
const cors = require('cors');
const path = require('path');
const expressSession = require('express-session');

const app = express();
const http = require('http').createServer(app);

// Session setup
const session = expressSession({
  secret: 'zohar',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false},
});

// Express app config
app.use(express.json());
app.use(session);
app.use(express.static('public'));

// Cors
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')));
} else {
  // Configuring cors
  const corsOptions = {
    origin: '*',
    credentials: true,
  };
  app.use(cors(corsOptions));
}


const bookRoutes = require('./api/book/book.routes');
// const {connectSockets} = require('./services/socket.service');

app.use('/api/book', bookRoutes);
// connectSockets(http, session);

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const logger = require('./services/logger.service');
const port = process.env.PORT || 3030;

http.listen(port, () => {
  logger.info('Server is running on port: ' + port);
});
