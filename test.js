let express = require("express");

let app = new express();


app.listen(3000, () => {//3000是端口号，可以自己设置
    console.log("3000running");
})

//设置一个路由--不使用模块化
//语法：app.get("/自定义一个名字",callback)
//语法：app.post("/自定义一个名字",callback)
app.get("/home", (req, res) => {
    // req 请求---向服务器请求资源
    // res 响应--给前端发送数据
    res.send("home页面")
})
