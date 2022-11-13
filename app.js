const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const favicon = require("serve-favicon");
const path = require("path");




const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(favicon(__dirname+"/public/favicon.ico"));
 

mongoose.connect("mongodb+srv://devinicius:test123@cluster0.zmdlysn.mongodb.net/todoListDB");

const itemsSchema = { name: String };
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({ name: "Welcome to your todoList" });
const item2 = new Item({ name: "Here you can add your daily tasks" });
const defaultItems = [item1, item2];



app.get("/", (req, res) => {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB");
        }
      });
      res.redirect("/");
    } else{
      res.render("list", { kindOfDay: "Today", newListItems: foundItems });
    }

  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  
  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/")
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, (err) =>{
    if(!err){console.log("Successfully deleted ")}
    res.redirect("/");
  })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
  console.log("server started successfully");
});
