var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")

var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")
var url = require("url")

var app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)

app.use(function (req, res, next) {
  if (req.url == "/home") {
    res.end("Home")
  } else {
    next()
  }
})

app.use(function (req, res, next) {
  var pathForbidden = "http://localhost:3000/forbidden?secret=true"
  var pathParse = url.parse(pathForbidden, true)
  var parsReq = url.parse(req.url, true)
  if (parsReq.pathname == pathParse.pathname) {
    if (parsReq.search == pathParse.search) {
      res.end("Access approved")
    } else {
      res.end("Access denied")
    }
  } else {
    next()
  }
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app