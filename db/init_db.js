// code to build and initialize DB goes here
const {
  client,
  createLink,
  getAllLinks,
  getAllTags,
  getLinksByTagName,
  updateLink,
  // other db methods
} = require("./index");

async function buildTables() {
  try {
    client.connect();

    // drop tables in correct order
    console.log("Starting to drop tables...");
    await client.query(`
    DROP TABLE IF EXISTS link_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS links;
  `);
    console.log("Finished dropping tables!");
    // build tables in correct order
    console.log("Starting to build tables...");

    await client.query(`
    CREATE TABLE links (
      id SERIAL PRIMARY KEY,
      url varchar(255) UNIQUE NOT NULL,
      comment varchar(255) NOT NULL,
      date varchar(255) NOT NULL,
      clickCount numeric(255)
    );

    CREATE TABLE tags (
      id SERIAL PRIMARY KEY,
      name varchar(255) UNIQUE NOT NULL
    );

    CREATE TABLE link_tags (
      "linkId" INTEGER REFERENCES links(id),
      "tagId" INTEGER REFERENCES tags(id),
      UNIQUE ("linkId", "tagId")
    );
  `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("error running buildTables");
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data
    console.log("starting to create links...");
    await createLink({
      comment: "Bill Cosby is on Netflix!",
      date: "1/25/2021",
      url: "https://www.youtube.com/watch?v=oGvURV9fngM",
      tags: ["funny", "informative", "cosby"],
    });
    await createLink({
      comment: "Who's he peepin' at though?",
      date: "1/26/2021",
      url: "https://www.youtube.com/watch?v=MC2XkigeXiI",
      tags: ["funny", "walking", "cosby"],
    });
    await createLink({
      comment: "Video I made for school in like 9th grade",
      date: "1/26/2021",
      url: "https://www.youtube.com/watch?v=oAulKa4C4-Q",
      tags: ["ancient", "walking", "reflective"],
    });
    console.log("finished creating test links!");
  } catch (error) {
    throw error;
  }
}

async function testDb() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllLinks");
    const links = await getAllLinks();
    console.log("Result: ", links);

    console.log("Calling getAllTags");
    const tags = await getAllTags();
    console.log("Result: ", tags);

    console.log("Calling getLinksByTagName with 'Cosby'...");
    const linksByTag = await getLinksByTagName("Cosby");
    console.log("Result: ", linksByTag);

    console.log("Calling updateLink on links[0]");
    const updateLinkResult = await updateLink(links[0].id);
    console.log("Result: ", updateLinkResult);

    console.log("Finished testing database.");
  } catch (error) {
    console.log("error testing database");
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .then(testDb)
  .catch(console.error)
  .finally(() => client.end());
