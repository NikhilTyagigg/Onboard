var express = require('express');
const db = require('../../../models');
const moment = require('moment')
const logger = require('../../../helper/logger');

const { NotAuthorizedError, ApplicationError, UserError, ConflictError, NotFoundError, ForbiddenError } = require('../../../helper/errors')
const { grantAccess, refreshAccessToken, checkAccess, removeAccess, removeAccessForToken } = require('../../../auth/jwt');
const { successBody, runAsyncWrapper, sha512 } = require('../../../helper/utility');

var router = express.Router();

var Joi = require('joi');


router.get('/me', checkAccess,
  function (req, res, next) {
    return res.json(req.user);
});

router.post('/login', //checkUserLoggedIn, 
  runAsyncWrapper (async (req, res, next) => {
  const { email, password } = req.body;
  logger.info(`BODYYYYY: ${req.body}`)
  const timezone = req.headers['tz-full'];
  var today_date = moment.utc().toDate();
  let clientDate = moment.tz(today_date, timezone).format('YYYY-MM-DD')
  var expire_time = moment.utc(today_date).add(15, 'minutes').format('YYYY-MM-DD HH:mm:ssZ');
  
  try {

    var user = await db.User.findOne({
        where: {
            email,
            password: sha512(password),
        },
    })

    if (!user) {
        throw new NotAuthorizedError('Invalid email or password');
    }

    grantAccess({ userId: user.userId, email: user.email, role: user.role})
      .then(async (tokens) => {
        //TODO: Log Activity

        res.send(successBody({
            userId: user.userId,
            email: user.email,
            name: user.name,
            role:user.role,
            date: clientDate,
            ...tokens
        }));
      })
  }
  catch(error) {
    next(error)
  };
}));

/* refresh the token*/
router.get('/token', function (req, res, next) {
    var refreshToken = req.headers['refreshtoken'];
    if (!refreshToken || refreshToken.trim().length === 0) {
        next(new NotAuthorizedError());
        return;
    }
    refreshAccessToken(refreshToken).
        then((accessToken) => {
          res.send({ token: accessToken });
        }).
        catch(err => {
          console.log(err)
            if (err instanceof ApplicationError) {
                next(err);
            } else {
                next(new UserError('Invalid request'));
            }
        });
});

router.post('/logout', checkAccess, 
  runAsyncWrapper (async (req, res, next) => {
    
  //TODO: :og Activity
  
    removeAccess(req).
        then(() => {
          res.status(200).send({});
        })  
  }));

router.post('/register',
runAsyncWrapper(async(req,res,next)=>{
  let {name, role, password, email} = req.body
  try{
    if(!name || !role || !password || !email){
      throw new UserError('Please fill all the mandatory fields!!')
    }
    let user = await db.User.findOne({
      where:{
        email: email
      }
    })
    if(user){
      throw new ConflictError('Email Already registered!!')
    }

    user = await db.User.create({
      name: name,
      password: sha512(password),
      email : email,
      role : role
    })
    res.send(successBody({
      msg: 'User created successfully. Please login!!'
    }))
  }catch(e){
    logger.error(e)
    throw new Error(e)
  }
}))

module.exports = router;