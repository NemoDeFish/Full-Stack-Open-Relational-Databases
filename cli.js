require("dotenv").config();

const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);
/* Solution: includes `dialectOptions`, but not needed as I'm using Fly.io instead of Heroku */

const main = async () => {
  try {
    /* Solution: includes `await sequelize.authenticate()`, but the reason why I didn't include is because it still works without and the output is slightly different with `EXECUTING 1+1` */
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT });
    /* Solution: immediately destructure the 'blog' object with { title, author, likes } and use 'likes' immediately instead of using 'blog.likes' */
    blogs.forEach((blog) => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    });
    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();
