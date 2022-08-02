const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
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
    test("endpoint responds with an array of topic objects, which include description and slug as keys", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { allTopics } = body;
          allTopics.forEach((topic) => {
            expect(topic.hasOwnProperty("description")).toBe(true);
            expect(topic.hasOwnProperty("slug")).toBe(true);
          });
        });
    });
  });
  describe("STATUS: 404", () => {
    test(" responds with a status code 404 if endpoint is incorrect/spelling erros", () => {
      return request(app)
        .get("/api/topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found!");
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
        .then((res) => {
          const date = new Date(1594329060000).toJSON();
          expect(res.body.article).toEqual({
            username: "butter_bridge",
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            body: "I find this existence challenging",
            created_at: date,
            votes: 100,
          });
        });
    });
  });
  describe("STATUS 400s", () => {
    test("Status 400 - invalid id", () => {
      return request(app)
        .get("/api/articles/invalidId")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid input data type");
        });
    });
    test("STATUS 404 - article doesn't exist", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Article not found!");
        });
    });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  describe("STATUS 200", () => {
    test("Responds with 200 and returns relevant article with incremented votes", () => {
      const newVote = { inc_votes: 1 };
      const date = new Date(1594329060000).toJSON();
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
            created_at: date,
            votes: 101,
          });
        });
    });
    test("Responds with 200 and returns relevant article with decremented votes", () => {
      const newVote = { inc_votes: -100 };
      const date = new Date(1594329060000).toJSON();
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
            created_at: date,
            votes: 0,
          });
        });
    });
    test("Responds with 200 and returns relevant article with votes decremented into negative numbers", () => {
      const newVote = { inc_votes: -150 };
      const date = new Date(1594329060000).toJSON();
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
            created_at: date,
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
        .then((res) => {
          expect(res.body.msg).toBe("Invalid input data type");
        });
    });
    test("STATUS 404 - article doesn't exist", () => {
      return request(app)
        .patch("/api/articles/999")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Article not found!");
        });
    });
    test("STATUS 404 - path not found", () => {
      return request(app)
        .patch("/api/article/1")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not Found!");
        });
    });
    test("STATUS 400 - wrong data type", () => {
      const newVote = { inc_votes: "wrong data type"};
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid input data type");
        });
    });
    test("STATUS 400 - missing required fields", () => {
      const newVote = {};
      return request(app)
        .patch("/api/articles/1")
        .send(newVote)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Missing required fields.");
        });
    });
  });
});
