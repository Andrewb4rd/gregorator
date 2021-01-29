// Connect to DB
const { Client } = require("pg");
const DB_NAME = "gregorator-dev";
const DB_URL = process.env.DATABASE_URL || {
  user: "postgres",
  host: "localhost",
  database: "gregorator-dev",
  password: "2112",
  port: 5432,
};
const client = new Client(DB_URL);

// database methods

async function createLink({ comment, date, url, tags = [] }) {
  try {
    const {
      rows: [link],
    } = await client.query(
      `
      INSERT INTO links(url, comment, date, clickCount) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (url) DO NOTHING 
      RETURNING *;
      `,
      [url, comment, date, 0]
    );

    const tagList = await createTags(tags);

    return await addTagsToLink(link.id, tagList);
  } catch (error) {
    throw error;
  }
}

async function createTags(tagList) {
  if (tagList.length === 0) {
    return;
  }

  const valuesStringInsert = tagList
    .map((_, index) => `$${index + 1}`)
    .join("), (");

  const valuesStringSelect = tagList
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  try {
    // insert all, ignoring duplicates
    await client.query(
      `
      INSERT INTO tags(name)
      VALUES (${valuesStringInsert})
      ON CONFLICT (name) DO NOTHING;
    `,
      tagList
    );

    // grab all and return
    const { rows: tags } = await client.query(
      `
      SELECT * FROM tags
      WHERE name
      IN (${valuesStringSelect});
    `,
      tagList
    );

    return tags;
  } catch (error) {
    throw error;
  }
}

async function createLinkTag(linkId, tagId) {
  try {
    const {
      rows: [tag],
    } = await client.query(
      `
      INSERT INTO link_tags("linkId", "tagId")
      VALUES ($1, $2)
      ON CONFLICT ("linkId", "tagId") DO NOTHING;
    `,
      [linkId, tagId]
    );
  } catch (error) {
    throw error;
  }
}

async function addTagsToLink(linkId, tagList) {
  try {
    const createLinkTagPromises = tagList.map((tag) =>
      createLinkTag(linkId, tag.id)
    );

    await Promise.all(createLinkTagPromises);

    return await getLinkById(linkId);
  } catch (error) {
    throw error;
  }
}

async function getLinkById(linkId) {
  try {
    const {
      rows: [link],
    } = await client.query(
      `
      SELECT *
      FROM links
      WHERE id=$1;
    `,
      [linkId]
    );

    if (!link) {
      throw {
        name: "LinkNotFoundError",
        message: "Could not find a link with that linkId",
      };
    }

    const { rows: tags } = await client.query(
      `
      SELECT tags.*
      FROM tags
      JOIN link_tags ON tags.id=link_tags."tagId"
      WHERE link_tags."linkId"=$1;
    `,
      [linkId]
    );

    link.tags = tags;

    return link;
  } catch (error) {
    throw error;
  }
}

async function getTagById(tagId) {
  try {
    const {
      rows: [tag],
    } = await client.query(
      `
      SELECT *
      FROM tags
      WHERE id=$1;
    `,
      [tagId]
    );

    if (!tag) {
      throw {
        name: "TagNotFoundError",
        message: "Could not find a tag with that tagId",
      };
    }

    return tag;
  } catch (error) {
    throw error;
  }
}

async function getAllLinks() {
  try {
    const { rows: linkIds } = await client.query(`
SELECT id
FROM links;
`);
    const links = await Promise.all(
      linkIds.map(async (link) => {
        const linkObj = getLinkById(link.id);
        return linkObj;
      })
    );
    return links;
  } catch (error) {
    console.log("error running getAllLinks");
    throw error;
  }
}

async function getLinksByTagName(tagName) {
  try {
    const { rows: linkIds } = await client.query(
      `
      SELECT links.id
      FROM links
      JOIN link_tags ON links.id=link_tags."linkId"
      JOIN tags ON tags.id=link_tags."tagId"
      WHERE LOWER(tags.name)=LOWER($1);
    `,
      [tagName]
    );

    return await Promise.all(linkIds.map((link) => getLinkById(link.id)));
  } catch (error) {
    throw error;
  }
}

async function getAllTags() {
  try {
    const { rows: tagIds } = await client.query(`
SELECT id
FROM tags;
`);
    const tags = await Promise.all(
      tagIds.map(async (tag) => {
        const tagObj = getTagById(tag.id);
        return tagObj;
      })
    );
    return tags;
  } catch (error) {
    console.log("error running getAllTags");
    throw error;
  }
}

async function updateLink(linkId) {
  try {
    await client.query(
      `
        UPDATE links
        SET clickCount = (clickCount + 1)
        WHERE id=${linkId}
        RETURNING *;
      `
    );

    return await getLinkById(linkId);
  } catch (error) {
    throw error;
  }
}

// export
module.exports = {
  client,
  // db methods
  createLink,
  getAllLinks,
  getAllTags,
  getLinksByTagName,
  updateLink,
};
