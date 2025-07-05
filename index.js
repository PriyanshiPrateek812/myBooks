import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const API_URL = ""
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Books",
  password: "Ilovebubbletea",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async(req, res) => {
  try{
    const result = await db.query("SELECT * FROM myBooks ORDER BY rating DESC");
    let books = result.rows;
    res.render("index.ejs",{
      books: books,
    });
  }
  catch(err){
    console.log(err);
  }
});
app.get("/date", async(req, res)=>{
  try{
    const result = await db.query("SELECT * FROM myBooks ORDER BY review_date DESC");
    let books = result.rows;
    res.render("index.ejs",{
      books: books,
    });
  }
  catch(err){
    console.log(err);
  }
});

app.get("/title", async(req, res)=>{
  try{
    const result = await db.query("SELECT * FROM myBooks ORDER BY title ASC");
    let books = result.rows;
    res.render("index.ejs",{
      books: books,
    });
  }
  catch(err){
    console.log(err);
  }
});
app.get("/new", async(req, res) => {  
  res.render("newbook.ejs",{
    heading: "Add your new book here:",
    submit: "Create Book"
  });
});
app.post("/books", async(req, res)=>{
  const result = req.body;
  try{
    await db.query("INSERT INTO myBooks (title, ISBN, review, review_date, rating) VALUES($1, $2, $3, $4, $5)", [result.title, result.ISBN, result.review, result.review_date, result.rating]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
})

app.get("/edit/:id", async(req, res) => {
  try{
    const result = await db.query("Select * from myBooks WHERE id=$1", [req.params.id]);
    res.render("newbook.ejs",{
      book: result.rows[0],
      isbn: result.rows[0].isbn,
      review_date: result.rows[0].review_date.toISOString().split('T')[0],
      heading: "Update your book here:",
      submit: "Update Book"
    });
    
  }
  catch(err){
    console.log(err);
  }
});
app.post("/books/:id", async(req, res)=>{
  const id = req.params.id;
  const title = req.body.title;
  const isbn = req.body.isbn;
  const review = req.body.review;
  const review_date = req.body.review_date;
  const rating = parseInt(req.body.rating);
  try{
    await db.query("UPDATE myBooks SET title=($1), isbn=($2), review=($3), review_date=($4), rating=($5) WHERE id=$6", [title, isbn, review, review_date, rating, id]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.get("/delete/:id", async(req, res) => {
  const id = req.params.id;
  try{
    await db.query("DELETE FROM myBooks WHERE id=$1", [id]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
