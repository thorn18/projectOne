import express from 'express';
import * as user from './user';
import { updateUserClaims } from './user';
import userService from './user.service';

const router = express.Router();

router.get('/', (req: any, res, next) => {
  console.log("Inside NORMAL GET");
  let u = {...req.session.user};
  res.send(JSON.stringify(u));
});

router.get('/:username', (req: any, res, next) => {
  console.log("Inside Specific GET");
  console.log("Specific params:" + req.params.username);
  userService.getUserByName(req.params.username).then((val) => {
    console.log("U =" + JSON.stringify(val));
    res?.send(JSON.stringify(val));
  });

});

router.put('/:supervisor', (req: any, res, next) => {
  console.log("Supervisor PUT");
  let sup =   req.body;
  let updatedSup = updateUserClaims(sup);
  res.send(JSON.stringify(updatedSup));
});

router.put('/', (req: any, res, next) => {
  console.log("USER PUT");
  req.session.user = req.body;
  req.session.save();
  console.log(req.session.user);
  updateUserClaims(req.session.user);
  res.send(JSON.stringify(req.session.user));
});


// Legacy route, do not use.
router.get('/logout', (req, res, next) => {
  req.session.destroy((err)=> console.log(err));
  res.redirect('/');
});

// Much more restful
router.delete('/', (req, res, next) => {
  req.session.destroy((err) => console.error(err));
  res.sendStatus(204);
})


router.post('/', function(req: any, res, next) {
  console.log(req);
  user.login(req.body.name, req.body.password).then((user) => {
    if(user === null) {
      res.sendStatus(401);
    }
    req.session.user = user;
    res.send(JSON.stringify(user))
  }).catch((err) => console.log(err));
});

export default router;
