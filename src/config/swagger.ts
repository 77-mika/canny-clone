import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Canny Clone API",
      version: "1.0.0",
      description: "API documentation for Canny Clone",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
          },
        },
        Feedback: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            body: { type: "string" },
            image: { type: "string" },
            author: { $ref: "#/components/schemas/User" },
            votes: {
              type: "array",
              items: { type: "string" },
            },
            voteCount: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/v1/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);