const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const _= require('lodash')


const app = express()


const items = ["By Food", "Cook Food", "Eat Food"]
const workItems   = [];

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect('mongodb+srv://admin-nabin:test12345@atlascluster.mz0pzms.mongodb.net/todolistDB' , {useNewUrlParser: true});

const itemsSchema ={
    name: String,

};

const Item =mongoose.model("Item", itemsSchema);
const Item1 = new Item ({
    name: "welcome to your todolist"
});

const Item2 = new Item ({
    name: "hit + to add"
});

const Item3 = new Item ({
    name: "hir t to delete"});


    const defaultItems = [Item1 , Item2, Item3];

const listSchema ={
    name: String,
    items: [itemsSchema]
}
  const List = mongoose.model("List", listSchema);




  app.get('/', function(req, res) {
    Item.find({})
      .then(foundItems => {
        if (foundItems.length === 0) {
          // Insert default items into the database
          return Item.insertMany(defaultItems);
        } else {
          return foundItems;
        }
      })
      .then(items => {
        // Render the 'list' view with the retrieved or inserted items
        res.render("list", { listTitle: "Today", newlistItems: items });
      })
      .catch(err => {
        console.log(err);
      });
  });
  app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
  
    List.findOne({ name: customListName })
      .then(foundList => {
        if (!foundList) {
          const list = new List({
            name: customListName,
            items: defaultItems
          });
          return list.save();
        } else {
          return foundList;
        }
      })
      .then(list => {
        res.render("list", { listTitle: list.name, newlistItems: list.items });
      })
      .catch(err => {
        console.log(err);
        res.redirect("/");
      });
  });
  

  app.post('/', function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
  
    const item = new Item({
      name: itemName
    });
  
    if (listName === "today") {
      item.save()
        .then(() => {
          res.redirect("/");
        })
        .catch(err => {
          console.log(err);
          res.redirect("/");
        });
    } else {
      List.findOne({ name: listName })
        .then(foundList => {
          if (foundList) {
            foundList.items.push(item);
            return foundList.save();
          } else {
            // List not found, handle the error or redirect to the home page
            console.log("Custom list not found");
            res.redirect("/");
            return null;
          }
        })
        .then(savedList => {
          if (savedList) {
            res.redirect("/" + listName);
          }
        })
        .catch(err => {
          console.log(err);
          res.redirect("/");
        });
    }
  });
  
  
  
  app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
  
    if (listName == "today") {
      if (!checkedItemId || checkedItemId.trim() === '') {
        console.log("Invalid item ID");
        return res.redirect("/");
      }
  
      Item.findByIdAndDelete(checkedItemId)
        .then(() => {
          console.log('Successfully removed');
          res.redirect("/");
        })
        .catch(err => {
          console.log(err);
          res.redirect("/");
        });
    } else {
      List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
        .then(foundList => {
          if (foundList) {
            res.redirect("/" + listName);
          } else {
            // List not found, handle the error or redirect to the home page
            console.log("Custom list not found");
            res.redirect("/");
          }
        })
        .catch(err => {
          console.log(err);
          res.redirect("/");
        });
    }
  });
  
        

    
  
    // Check if the checkbox value exists and is not an empty string
   
  
app.get("/work", function(req, res){

    res.render("list", { listTitle: "Work List", newlistItems: workItems})

})

app.post("/work", function(req, res){

    const item = req.body.newItem;
    workItems
})


app.listen(5000, function(){
    console.log('server started on port 5000');
})
