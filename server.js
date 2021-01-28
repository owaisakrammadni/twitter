
var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var app = express();
var path = require("path")
var SERVER_SECRET = process.env.SECRET || "1234";
var jwt = require('jsonwebtoken')
var { userModel, tweetmodel } = require('./dbcon/module');
var authRoutes = require('./route/auth')
var http = require("http");
var socketIO = require("socket.io");
var server = http.createServer(app);
var io = socketIO(server);
var fs = require("fs")
var multer = require("multer")
// var admin = require("firebase-admin")



const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})

var upload = multer({ storage: storage })

const admin = require("firebase-admin");

// var serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
var serviceAccount = {
    "type": "service_account",
    "project_id": "chat-app-633ed",
    "private_key_id": "c226464ec900b651be84312d1bc7e1a66f0c2c23",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC368DkPK9EtivY\ngNePqF4eVS42a3v4Fy7j/vPoRvg72eXpQ2N9aFc2d0Gk7FjUKkAC6ollsEemommk\nKEP4rl/L9VNsDaSIha5voVaDWDkRlfr1B5UP9ivZ/EvwwUyU5YRt1kEgB3OW12f5\nmCHjw4YV7nQDBnDwiMa+3aPV727QObX8dARf7P10BoXpJg1XwSkgH4ojrRCYr4wR\njLdXdfGde81Mj1oea5d7HWZZlZmNoKOP+R2N3O3smOyybhDEl3lDodhy8HtJu5yT\nX8G8l806WlK9hayP2j/MHnfQhy35NYVfXSsQJ4Bh/7UqmuVJnMIEcV0NpYi1gX8B\n+YSaHFcZAgMBAAECggEABWCDFykfBqc8yOubYbvOZJyg6T5jNXGYEVpWzyekAjvw\nmM07j2MJibIa3TN7tVg23t70fWCV960v4Xi74/1VF6VodvQ/Jy6hVuokmVpu8LCt\n0ZQTK5BK3+icX8GG96NuJ7fn14PgQTyy8X0dIIeK2AFMqvn5O08EYHgiXhLN7pB0\npI4+20e/nbLInGLb6qFHnTYn9Rhpskk9zGUVqjcsH8Upp3bsVkz1QXakiqhW4A7k\njwXuwI5y98qLRTWvUZlU6fn/au+xCgVkYqvJiAM/8p1C0mK0BhdVj7eAnaQenpKz\nH4YWJ6AjXhfeXcEy3KBBtkI3jKWxa/HrVJ+i+t75MQKBgQDpwcuZRWMk4JM4ttmq\nYsiJbF0navLIh71t0flK+65AOucSTCTRZ0hol+uTMpbfXZKDkHGcOH5Pf0SeclTL\nl1s3cEJXfnqUlHlKAXfGW9PBK/BcbM7S/5YZFHAJOD2lzbZTvYzLrS2cC4yEHxqE\nvDUmb48qUu20QZx0Et66x5yvXwKBgQDJa/m7mexU6KQpf90uYdanYtJDSgw2mnDF\nT8It6/gD1MfY2Mo5/PoXDFxQCgRmwsqzyK7RKvzg7v90OqBqJjNexznn+nVeutAp\n8YyQg+9XstytJK+Ug4Z4FIhxHUQnE0U/OwneWzABbyL2ksZOq/xn8EiSAzyhdh7c\nGO3yo72khwKBgQDZoaxEzu03cD6hFtwgXkgGafVwtYnEWVxr2ooW3aul8TEhP/Mn\nYtlvR8H0Ea2V2DCIfPrJT2+J5BumyRtZUVmDi+i4PPEzU+h4llVFQEkuGBJ4enU0\nzPCZ+QU2ED6VF6kg3eEv39QO7FGu0KaH3hI97q+D4CGfKVbYWpkznJSsUQKBgBYk\n1cbHLFFFZk7drM5dmUC7v4wARwl1vzIiC6IK0DBzoyj25HytkD0accem4kb94VUU\nmguK41RDUjhP/bTN0FX6JyaWxXKNrTb/REnbB2Qn2NT8NIVqVE09TKbK5eQ53SIP\ndo1IjyWJN1nOVxjtFYnDw+axjmfd2ZSu9PH5CG9fAoGAVXuHxjVJNJG0zSAEE2ih\nbQuzNC8OuLNSRFYFsoKPniLzM06r8kniIINYVU4xkbok3t1oedF8gT62Nk1KcHyj\n0KZna9XEo0iMhrqtZkUjG0qBi95qJ6B1m8luUDW5PpAKfR93XxYcXPlLnPIYodIe\n1fmmROJnZwBEH8D9XhNlaxc=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-412lb@chat-app-633ed.iam.gserviceaccount.com",
    "client_id": "113017695016539960929",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-412lb%40chat-app-633ed.iam.gserviceaccount.com"
  }
  
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chat-app-633ed-default-rtdb.firebaseio.com/"
});
const bucket = admin.storage().bucket("gs://chat-app-633ed.appspot.com");

//==============================================


io.on("connection", () => {
    console.log("user Connected")
})


app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(morgan('dev'));

app.use("/", express.static(path.resolve(path.join(__dirname, "public"))))

app.use('/', authRoutes);
// app.use('/',authRoutes);

app.use(function (req, res, next) {

    console.log("req.cookies: ", req.cookies.jToken);
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate;

            if (diff > 300000) {
                res.status(401).send("token expired")
            } else {
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})

app.get("/profile", (req, res, next) => {

    console.log(req.body)

    userModel.findById(req.body.jToken.id, 'name email phone gender  createdOn profilePic',
        function (err, doc) {
            if (!err) {
                res.send({
                    profile: doc
                })

            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })
})
app.post("/tweet", (req, res, next) => {


console.log("dsadsadadads    " +    req.body.userEmail)
    userModel.findOne({ email: req.body.userEmail }, (err, user) => {
        console.log("khsajhfkjdha" + user)
        if (!err) {
            tweetmodel.create({
                "name": req.body.userName,
                "tweet": req.body.tweet,
                "profilePic": user.profilePic
            }).then((data) => {
                console.log( "jdjhkasjhfdk" +  data)
                res.send({
                    status: 200,
                    message: "Post created",
                    data: data
                })

                console.log(data)
                io.emit("NEW_POST", data)

            }).catch(() => {
                console.log(err);
                res.status(500).send({
                    message: "user create error, " + err
                })
            })
        }
        else {
            console.log(err)
        }
    })

})

// app.post('/tweet', (req, res, next) => {
//     // console.log(req.body)

//     if (!req.body.userName && !req.body.tweet || !req.body.userEmail) {
//         res.status(403).send({
//             message: "please provide email or tweet/message"
//         })
//     }
//     var newTweet = new tweetmodel({
//         "name": req.body.userName,
//         "tweet": req.body.tweet
//     })
//     newTweet.save((err, data) => {
//         if (!err) {
//             res.send({
//                 status: 200,
//                 message: "Post created",
//                 data: data
//             })
//             console.log(data.tweet)
//             io.emit("NEW_POST", data)
//         } else {
//             console.log(err);
//             res.status(500).send({
//                 message: "user create error, " + err
//             })
//         }
//     });
// })

app.get('/getTweets', (req, res, next) => {

    console.log(req.body)
    tweetmodel.find({}, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
            // data = data[data.length -1]
            res.send(data)
        }
    })
})

/////////////////////////////// profile

app.post("/upload", upload.any(), (req, res, next) => {

    console.log("req.body: ", req.body);
    console.log("req.body: ", JSON.parse(req.body.myDetails));
    console.log("req.files: ", req.files);

    console.log("uploaded file name: ", req.files[0].originalname);
    console.log("file type: ", req.files[0].mimetype);
    console.log("file name in server folders: ", req.files[0].filename);
    console.log("file path in server folders: ", req.files[0].path);

    bucket.upload(
        req.files[0].path,
        // {
        //     destination: `${new Date().getTime()}-new-image.png`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
        // },
        function (err, file, apiResponse) {
            if (!err) {
                // console.log("api resp: ", apiResponse);

                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {
                    if (!err) {
                        console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                        console.log(req.body.email)
                        userModel.findOne({ email: req.body.email }, (err, users) => {
                            console.log(users)
                            if (!err) {
                                users.update({ profilePic: urlData[0] }, {}, function (err, data) {
                                    console.log(users)
                                    res.send({
                                        status: 200,
                                        message: "image uploaded",
                                        picture: users.profilePic
                                    });
                                })
                            }
                            else {
                                res.send({
                                    message: "error"
                                });
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)

                        } catch (err) {
                            console.error(err)
                        }


                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})