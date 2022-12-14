const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const sorted = require('jest-sorted');


afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("STATUS: 404 - not an end point", () => {
  test(" responds with a status code 404 if endpoint is incorrect/spelling erros", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found!");
      });
  });
});

describe("GET /api/topics", () => {
  describe("STATUS: 200", () => {
    test("endpoint responds with 200 status and an array of all topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { allTopics } = body;
          expect(allTopics).toBeInstanceOf(Array);
          expect(allTopics[0]).toBeInstanceOf(Object);
          expect(allTopics).toHaveLength(3);
        });
    });
    test("endpoint responds with an array of topic objects, which include description and slug as keys and correct data types", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { allTopics } = body;
          allTopics.forEach((topic) => {
            expect(topic).toHaveProperty("description", expect.any(String));
            expect(topic).toHaveProperty("slug", expect.any(String));
          });
        });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  describe("STATUS 200", () => {
    test("responds with status 200 and returns relevant article", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            author: "butter_bridge",
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            body: "I find this existence challenging",
            created_at: "2020-07-09T21:11:00.000Z",
            votes: 100,
            comment_count: "11",
          });
        });
    });
  });
  describe("STATUS 400s", () => {
    test("Status 400 - invalid id", () => {
      return request(app)
        .get("/api/articles/invalidId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input data type");
        });
    });
    test("STATUS 404 - article doesn't exist", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found!");
        });
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  describe("STATUS 200", () => {
    test("Responds with 200 and returns relevant article with incremented votes", () => {
      const newVote = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T21:11:00.000Z",
            votes: 101,
          });
        });
    });
    test("Responds with 200 and returns relevant article with decremented votes", () => {
      const newVote = { inc_votes: -100 };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T21:11:00.000Z",
            votes: 0,
          });
        });
    });
    test("Responds with 200 and returns relevant article with votes decremented into negative numbers", () => {
      const newVote = { inc_votes: -150 };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T21:11:00.000Z",
            votes: -50,
          });
        });
    });
  });
  describe("STATUS 400s", () => {
    test("Status 400 - invalid id", () => {
      return request(app)
        .patch("/api/articles/invalidId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input data type");
        });
    });
    test("STATUS 404 - article doesn't exist", () => {
      return request(app)
        .patch("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found!");
        });
    });
    test("STATUS 400 - wrong data type", () => {
      const newVote = { inc_votes: "wrong data type" };
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input data type");
        });
    });
    test("STATUS 400 - missing required fields", () => {
      const newVote = {};
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing required fields.");
        });
    });
  });
});

describe("GET /api/users", () => {
  describe("STATUS: 200", () => {
    test("endpoint responds with 200 status and an array of all user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { allUsers } = body;
          expect(allUsers).toBeInstanceOf(Array);
          expect(allUsers[0]).toBeInstanceOf(Object);
          expect(allUsers).toHaveLength(4);
        });
    });
    test("endpoint responds with an array of user objects, which include username, name and avatar_url as keys and correct data types", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { allUsers } = body;
          allUsers.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
  });
});

describe("GET api/articles/:article_id (comment count)", () => {
  describe("STATUS 200", () => {
    test("Article response object should also include comment count key with value of all comments matching it's ID", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            author: "butter_bridge",
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            body: "I find this existence challenging",
            created_at: "2020-07-09T21:11:00.000Z",
            votes: 100,
            comment_count: "11",
          });
        });
    });
    test("Responds with correct article and comment_count as 0 if there are no comments", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            author: "icellusedkars",
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            body: "Call me Mitchell. Some years ago???never mind how long precisely???having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people???s hats off???then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T06:03:00.000Z",
            votes: 0,
            comment_count: "0",
          });
        });
    });
  });
});

describe("GET /api/articles", () => {
  describe("STATUS: 200", () => {
    test("endpoint responds with 200 status and an array of all article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          expect(allArticles).toBeInstanceOf(Array);
          expect(allArticles[0]).toBeInstanceOf(Object);
          expect(allArticles).toHaveLength(12);
        });
    });
    test("endpoint responds with an array of article objects, which include specified keys and correct data types", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          allArticles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty("comment_count", expect.any(Number));
          });
        });
    });
  });
  describe("STATUS: 200 - queries", () => {
    test("article objects within the array should be sorted by creation day", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          expect(allArticles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("article objects within the array should be sorted by descending creation day by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          expect(allArticles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("articles can be sorted by any valid column", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          expect(allArticles).toBeSortedBy("author", { descending: true });
        });
    });
    test("articles can be sorted by any valid column", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          expect(allArticles).toBeSortedBy("comment_count", {
            descending: true,
          });
        });
    });
    test("articles can be sorted by any valid column", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          expect(allArticles).toBeSortedBy("votes", { descending: true });
        });
    });
    test("articles can be sorted by any valid column in ascending or descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order_by=asc")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          expect(allArticles).toBeSortedBy("votes");
        });
    });
    test("articles can be sorted by any valid column in ascending or descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count&order_by=asc")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          expect(allArticles).toBeSortedBy("comment_count");
        });
    });
    test("articles can be filtered by topic, sorted by creation date in descending order by default ", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          expect(allArticles).toBeSortedBy("created_at", { descending: true });
          expect(allArticles).toHaveLength(11);
        });
    });
    test("articles can be filtered by topic, sorted by creation date in descending order by default ", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          expect(allArticles).toHaveLength(1);
        });
    });
    
    test("articles can be filtered by topic, sorted by creation date in descending order by default ", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=comment_count&order_by=asc")
        .expect(200)
        .then(({ body }) => {
          const { allArticles } = body;
          expect(allArticles).toBeSortedBy("comment_count", {
            descending: false,
          });
          expect(allArticles).toHaveLength(11);
        });
    });
    test("STATUS 200 - returns empty array if topic is valid but no associated articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({body}) => {
          const { allArticles } = body;
          expect(allArticles).toEqual([]);
        });
    });
  })
  describe("STATUS: 400s - queries", () => {
    test("STATUS 404 - topic doesn't exist - non existent topic", () => {
      return request(app)
        .get("/api/articles?topic=dogs")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic not found!");
        });
    });
    test("STATUS 400 - invalid sort by", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=invalidSortBy")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("STATUS 400 - invalid order by", () => {
      return request(app)
        .get("/api/articles?topic=mitch&order_by=invalidSortBy")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  describe("STATUS 200", () => {
    test("endpoint responds with 200 status and an array of comments objects matching article id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { allComments } = body;
          expect(allComments).toBeInstanceOf(Array);
          expect(allComments[0]).toBeInstanceOf(Object);
          expect(allComments).toHaveLength(11);
        });
    });
    test("returns an empty array if there are no comments for a given article id", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          const { allComments } = body;
          expect(allComments).toBeInstanceOf(Array);
          expect(allComments).toHaveLength(0);
        });
    });
    test("endpoint responds with an array of comment objects, which include specified keys", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { allComments } = body;
          allComments.forEach((comment) => {
            expect(comment.hasOwnProperty("comment_id")).toBe(true);
            expect(comment.hasOwnProperty("votes")).toBe(true);
            expect(comment.hasOwnProperty("created_at")).toBe(true);
            expect(comment.hasOwnProperty("author")).toBe(true);
            expect(comment.hasOwnProperty("body")).toBe(true);
          });
        });
    });
    test("each object contains correct data type", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          const { allComments } = body;
          allComments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("STATUS 400", () => {
    test("STATUS 404 - article doesn't exist", () => {
      return request(app)
        .get("/api/articles/99/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found!");
        });
    });
    test("Status 400 - invalid id", () => {
      return request(app)
        .get("/api/articles/invalidId/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input data type");
        });
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  describe("STATUS 201", () => {
    test("Responds with 201 and returns created comment", () => {
      const newComment = { username: "butter_bridge", body: "some text" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.addedComment).toEqual({
            comment_id: 19,
            body: "some text",
            article_id: 1,
            author: "butter_bridge",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
  });
  describe("STATUS 400s", () => {
    test("Status 400 - invalid id", () => {
      const newComment = { username: "butter_bridge", body: "some text" };
      return request(app)
        .post("/api/articles/invalidId/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input data type");
        });
    });
    test("STATUS 404 - article doesn't exist", () => {
      const newComment = { username: "butter_bridge", body: "some text" };
      return request(app)
        .post("/api/articles/999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article not found!");
        });
    });
    test("STATUS 400 - missing required fields", () => {
      const newComment = { username: "butter_bridge" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing required fields.");
        });
    });
    test("STATUS 404 - username doesn't exist", () => {
      const newComment = { username: "butter", body: "some text" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found!");
        });
    });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("Status 204 - deletes comment by comment id and returns no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("Status 404 - comment not found, valid but not existent comment id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found!");
      });
  });
  test("Status 400 - invalid id", () => {
    return request(app)
      .delete("/api/comments/notvalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input data type");
      });
  });
});
describe("GET /api", () => {
  test("", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const {endPoints} = body
        expect(endPoints).toBeInstanceOf(Object)
        expect(Object.keys(endPoints).length).toBe(9)
      });
  });    
});
