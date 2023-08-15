import express from 'express';
import hbs from 'hbs';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { insertUser, likeFun, readPost, readPosts, readUser, shareFun } from './operations.js';

const app = express();

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser())

app.get('/', (req, res) => {
  res.render("login");
});

app.post('/login', async (req, res) => {
  const output = await readUser(req.body.profile);
  const password = output[0].password;

  if (password === req.body.password) {
    const secret = "83e423678ebf832932b8059930f5b189870df3be868127cf69029e8d648e49e9092ba104e560ab33154c0d7b116897c3452751ed8174405f493dabee1350a0df";
    const payload = {
      "profile": output[0].profile,
      "name": output[0].name,
      "headline": output[0].headline
    };

    const tokenSecret = process.env.TOKEN_SECRET || secret;
    const token = jwt.sign(payload, tokenSecret);

    console.log(token);
    res.cookie("token", token);
    res.redirect("/posts");
  } else {
    res.send("Incorrect UserName or Password");
  }

  console.log(output);
});

app.get('/posts', verifyLogin, async(req, res) => {
    const output = readPosts()
  res.render("posts", {
    data: output,
    userInfo: req.payload
  });
});

app.post('/like',async(req, res)=>{
  await likeFun(req.body.content)
  res.redirect('/posts')
})

app.post('/share',async(req, res)=>{
  await shareFun(req.body.content)
  res.redirect('/posts')
})

function verifyLogin(req, res, next) {
    const secret = "83e423678ebf832932b8059930f5b189870df3be868127cf69029e8d648e49e9092ba104e560ab33154c0d7b116897c3452751ed8174405f493dabee1350a0df";
    const token = req.cookies["token"];
    jwt.verify(token, secret, (err, payload)=>{
        if (err) return res.sendStatus(403)
        req.payload = payload
    })
    next()
}
app.post('/addusers',async(req, res)=>{
    if(req.body.password === req.body.cnfpassword)
    {
        await insertUser(req.body.name, req.body.profile, req.body.password, req.body.headline)
        res.redirect('/')
    }
    else{
        res.send("Password and confirm password is not matching!")
    }
})

app.get('/register', (req, res)=>{
    res.render("register")
})

app.listen(3000, () => {
  console.log("Listening.....");
});
