import type { Request, Response } from "express";

export class HealthController {
  static check(_req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      message: "Server is healthy",
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
    });
  }
}
