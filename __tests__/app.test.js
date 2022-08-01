const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const data = require('../db/data/test-data')


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
          .get("/api/topics").expect(200)
          .then(({ body }) => {
            const { allTopics } = body;
            expect(allTopics).toBeInstanceOf(Array)
            expect(allTopics[0]).toBeInstanceOf(Object);
            expect(allTopics).toHaveLength(3);
          })
    })
    test("endpoint responds with an array of topic objects, which include description and slug as keys", () => {
        return request(app)
          .get("/api/topics").expect(200)
          .then(({ body }) => {
            const { allTopics } = body;
            allTopics.forEach((topic) => {
                expect(topic.hasOwnProperty("description")).toBe(true);
                expect(topic.hasOwnProperty("slug")).toBe(true)
            })
          })
    })
   })
   describe("STATUS: 404", () => {
    test(" responds with a status code 404 if endpoint is incorrect/spelling erros", () => {
        return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found! Please check path.");
      });
    })
   })
});

describe("GET /api/articles/:article_id", () => {
    describe("STATUS 200", () => {
        test("responds with status 200 and returns relevant article", () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((res) => {
                const date = new Date(1594329060000).toJSON();
              expect(res.body.article).toEqual({
                username: 'butter_bridge',
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                body: "I find this existence challenging",
                created_at: date,
                votes: 100
              });
            });
        })
    })
    describe("STATUS 400s", () => {
        test("Status 400 - invalid id", () => {
            return request(app)
            .get('/api/articles/invalidId')
            .expect(400)
            .then((res) => {
            expect(res.body.msg).toBe('Invalid id');
            });
        })
        test("STATUS 404 - article doesn't exist", () => {
            return request(app).get('/api/articles/999').expect(404).then((res) => {
            expect(res.body.msg).toBe("Article doesn't exist");
             });
        })
    })
})