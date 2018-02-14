
import express from "express";
const app = express();
import bodyParser from "body-parser";
import mongoose from "mongoose";
mongoose.connect('mongodb://localhost/bears');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const router = express.Router();

import Bear from "../public/bear";

//middleware to use for all requests
router.use((req, res, next) => {
  console.log('Something is happening.');
  next();
});
//makes sure we go to the next routes and don't stop here

router.get('/', (req, res) => {
  res.json({message: 'yay! welcome to your api!'});
});

//on routes that end in /bears
router.route('/bears')
  .post((req, res) => {
    const bear = new Bear();
    bear.name = req.body.name;
    bear.save(err => {
      if(err)
        res.send(err);

      res.json({message: 'Bear created!'});
    });
  })
  .get((req, res) => {
    Bear.find((err, bears) => {
      if(err)
        res.send(err);

      res.json(bears);
    });
  });

router.route('/bears/:bear_id')
  .get((req, res) => {
    Bear.findById(req.params.bear_id, (err, bear) => {
      if(err)
        res.send(err);
      res.json(bear);
    });
  })
  .put((req, res) => {
    Bear.findById(req.params.bear_id, (err, bear) => {
      if (err)
        res.send(err);
      bear.name = req.body.name;
      bear.save(err => {
        if (err)
          res.send(err);
        res.json({message: 'Bear updated!'});
      });
    });
  })
  .delete((req, res) => {
    Bear.remove({
      _id: req.params.bear_id
    }, (err, bear) => {
      if (err)
        res.send(err);
      res.json({message: 'Successfully deleted'});
    });
  });


//REGISTER OUR ROUTES ---------------------------------

app.use('/api', router);
app.listen(port);
console.log(`Magic happens on port ${port}`);
