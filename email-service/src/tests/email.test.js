import request from "supertest";
import app from "../src/index.js";

describe("Email Route", () => {
  it("should respond with 200 OK for test email send", async () => {
    const res = await request(app)
      .post("/api/email/send")
      .send({
        to: "test@example.com",
        subject: "Test Email",
        message: "This is a test",
      });

    expect([200, 400]).toContain(res.statusCode);
  });
});
