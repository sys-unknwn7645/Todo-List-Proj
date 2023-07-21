// Project using EJS and MongoDB 
// Udemy Course: The Complete 2023 Web Developement Bootcamp
// Acknowledgement: Angela Yu (App Brewery)
// By: sys-unknwn7645

const express = require("express");
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");
const _ = require("lodash");

const mongoose = require("mongoose");

/// dotenv parameters ///
require("dotenv").config();
const USER_ID = process.env.userId;
const PASS = process.env.password;
///                      

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main();

async function main (){
    // await mongoose.connect("mongodb://127.0.0.1:27017/todolistDB"); //placeholder when running locally
    await mongoose.connect("mongodb+srv://"+USER_ID+":"+PASS+"@cluster0.9kyl5he.mongodb.net/todolistDB");

    const toDoSchema = {
        itemName: String
    };

    const Item = mongoose.model("item", toDoSchema);

    const item1 = new Item({
        itemName: "Welcome to your todo list!"
    });

    const item2 = new Item({
        itemName: "Hit the + button to add a new item."
    });

    const item3 = new Item({
        itemName: "<-- Hit this to delete an item."
    });

    const allItemsArry = [item1, item2, item3];

    const listSchema = {
        name: String,
        items: [toDoSchema]
    };

    const List = await mongoose.model("list", listSchema);

    app.get("/:listName", async function (req,res){
        
        const listName = await _.capitalize(req.params.listName);

        if (listName === ("favicon.ico" ||"Favicon.ico")) {
            console.log("no route selected yet")
        } else {
            const result = await List.findOne({name:listName});

                if (!result){

                    const list = new List ({
                        name: listName,
                        items: allItemsArry
                    })
    
                    await list.save();
                    await res.redirect("/"+listName)

                } else {
                    res.render("list", {newListItems: result.items, listTitle: result.name})
                }
            }
    });

    app.get("/", async function (req, res){
        let day = date.getDay();

        let results = await Item.find();

        if (results.length === 0) {
            Item.insertMany(allItemsArry);
            res.redirect("/")
        } else {
            res.render("list", {newListItems: results, listTitle: "Home"})
        }
    });

    app.post("/", async function (req, res) {
        console.log(req.body)
        let newItem = req.body.input;

        if (req.body.list === "Home"){
            await addItem(newItem);
            res.redirect("/")
        } else {
            await addItemList(req.body.list, newItem)
            res.redirect("/"+ req.body.list)
            };
    });

    app.post("/delete", async function (req, res) {

        let delItem = req.body.delitem;
        let list = _.capitalize(req.body.list);
        console.log(req.body)

        if (list === "Home"){
            deleteItem(delItem);
            res.redirect("/")
        } else {
            await List.findOneAndUpdate({name: list},{$pull:{items:{_id:delItem}}})
            res.redirect("/"+list);
        }
    });

    async function addItem(inputItem){
        let addedItem = new Item({
            itemName: inputItem
        });
        await addedItem.save();
    }

    async function addItemList(list,inputItem){
        let addedItem = new Item({
            itemName: inputItem
        });

        await List.findOne({name:list}).then(function(toUpdate){
        toUpdate.items.push(addedItem)

        toUpdate.save();
        });
    }

    async function deleteItem(id){
        await Item.deleteOne({_id:id});
        console.log("Deleted: "+id)
    }
};
//end of main()

app.listen(3000,function(){
    console.log("server started on port 3000")
});


