//index.js

let express = require('express');
let app = express();
app.use(express.static('./')); //public이라는 폴더 사용을 선언함

app.listen(3000, function () {
  console.log('App is running on port 3000');
});

app.get('/', function (req, res) {
  res.sendfile('./index.html'); //public 폴더 안의 index.html을 사용
});
