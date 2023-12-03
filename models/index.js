const Blog = require("./blog");
const User = require("./user");
const Readinglist = require("./readinglist");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: Readinglist, as: "readings" });
/* Solution: uses 'readers' instead of 'users_marked' */
Blog.belongsToMany(User, { through: Readinglist, as: "users_marked" });

/* Solution: includes the below, however I don't think it is necessary as I already have the above declaration. The examples given also do not include this
Blog.hasMany(Readinglist)
Readinglist.belongsTo(Blog)
*/

/* Solution: includes this since the session references a user, but I didn't include as I did not reference
User.hasMany(Session)
Session.belongsTo(User)
*/
module.exports = {
  Blog,
  User,
  Readinglist,
  Session,
};
