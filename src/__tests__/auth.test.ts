import request from "supertest";
import app from "../app";

describe("auth Routes", () => {
    describe("POST /api/v1/auth/signup", () => {
        it("should return 201 on valid registration", async () => {
            const res = await request(app)
                .post("/api/v1/auth/signup")
                .send({
                    name: "testUser1",
                    email: "test@test.com",
                    password: "test123456",
                });

            expect(res.statusCode).toBe(201);
        });

        it("should return 400 when name and email are missing", async () => {
            const res = await request(app)
                .post("/api/v1/auth/signup")
                .send({ password: "test123456" });

            expect(res.statusCode).toBe(400);
        });
    });

    describe("POST /api/v1/auth/signin", () => {
        beforeEach(async () => {
            // create the user fresh before each signin test
            await request(app).post("/api/v1/auth/signup").send({
                name: "testUser1",
                email: "test@test.com",
                password: "test123456",
            });
        });

        it("should return 200 and a valid token", async () => {
            const res = await request(app)
                .post("/api/v1/auth/signin")
                .send({ email: "test@test.com", password: "test123456" });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("token");
        });

        it("should return 401 with wrong password", async () => {
            const res = await request(app)
                .post("/api/v1/auth/signin")
                .send({ email: "test@test.com", password: "wrongpassword" });

            expect(res.statusCode).toBe(401);
        });

        it("should return 401 with non-existent email", async () => {
            const res = await request(app)
                .post("/api/v1/auth/signin")
                .send({ email: "nobody@test.com", password: "test123456" });

            expect(res.statusCode).toBe(401);
        });
    });
});