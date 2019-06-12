const express = require('express');
const bodyParser = require('body-parser');
const next = require('next');
const mongoose = require('mongoose');

const { LincoonDocument } = require('./models.js');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const mongodbUrl =
  'mongodb://lincoon:lincoon1234@ds161483.mlab.com:61483/heroku_vg5dg6q6';

mongoose.connect(mongodbUrl, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected !');

  app
    .prepare()
    .then(initApp)
    .catch(ex => {
      console.error(ex.stack);
      process.exit(1);
    });
});

const initApp = () => {
  const server = express();
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  server.get('/api/getAll', async (req, res) => {
    const documents = await LincoonDocument.find();
    res.jsonp(documents);
  });

  server.get('/api/clearAll', async (req, res) => {
    await LincoonDocument.deleteMany({});
    res.jsonp({ done: true });
  });

  server.get('/api/:key', async (req, res) => {
    const { key } = req.params;
    const doc = await LincoonDocument.findOne({ key });
    res.jsonp(doc);
  });

  server.post('/api/:key', async (req, res) => {
    const { key } = req.params;
    const { text } = req.body;

    // 이미 존재하는 doc을 찾는다.
    const oldDoc = await LincoonDocument.findOne({ key });

    if (oldDoc) {
      // 이미 있다면 업데이트.
      oldDoc.key = key;
      oldDoc.title = key;
      oldDoc.text = text;
      await oldDoc.save();

      console.log(`Update - key: ${key}, value: ${JSON.stringify(oldDoc)}`);
    } else {
      // 없으면 추가.
      const newDoc = new LincoonDocument({
        key,
        title: key,
        text,
      });
      await newDoc.save();

      console.log(`Add - key: ${key}, value: ${JSON.stringify(newDoc)}`);
    }

    res.jsonp({ done: true });
  });

  server.delete('/api/:key', async (req, res) => {
    const { key } = req.params;
    await LincoonDocument.deleteMany({ key });
    res.jsonp({ done: true });
  });

  server.get('/p/:key', (req, res) => {
    const actualPage = '/post';
    const queryParams = { key: req.params.key };
    app.render(req, res, actualPage, queryParams);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, err => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
};
