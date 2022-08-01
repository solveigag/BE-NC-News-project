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
})