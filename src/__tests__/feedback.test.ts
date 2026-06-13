import request from "supertest";
import app from "../app";

describe("feedback Routes test", () => {
    let token: string;
    let feedbackId: string;

    beforeEach(async () => {
        await request(app).post("/api/v1/auth/signup").send({
            name: "testUser",
            email: "feedback@test.com",
            password: "test123456",
        });

        const loginRes = await request(app).post("/api/v1/auth/signin").send({
            email: "feedback@test.com",
            password: "test123456",
        });

        token = loginRes.body.token;

        const res = await request(app)
            .post("/api/v1/feedbacks")
            .set("Authorization", `Bearer ${token}`)
            .field("title", "Dark Mode")
            .field("body", "Please add dark mode support");

        // ADD THIS to see what's actually coming back
        console.log("CREATE FEEDBACK STATUS:", res.statusCode);
        console.log("CREATE FEEDBACK BODY:", JSON.stringify(res.body, null, 2));

        feedbackId = res.body.feedback?._id;
    });
    it("should get all feedbacks", async () => {
        const res = await request(app).get("/api/v1/feedbacks");
        expect(res.statusCode).toBe(200);
        expect(res.body.feedbacks.length).toBeGreaterThan(0);
    });

    it("should return selected feedback", async () => {
        const res = await request(app).get(`/api/v1/feedbacks/${feedbackId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.feedback).toHaveProperty("votes");
    });

    it("should return 404 for non-existent feedback", async () => {
        const res = await request(app).get(
            "/api/v1/feedbacks/000000000000000000000000",
        );
        expect(res.statusCode).toBe(404);
    });

    it("should toggle vote on a feedback", async () => {
        const res = await request(app)
            .patch(`/api/v1/feedbacks/${feedbackId}/vote`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.voted).toBe(true);
        expect(res.body.voteCount).toBe(1);
    });

    it("should return 401 voting without token", async () => {
        const res = await request(app).patch(
            `/api/v1/feedbacks/${feedbackId}/vote`,
        );
        expect(res.statusCode).toBe(401);
    });
});
