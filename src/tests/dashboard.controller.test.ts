import { Request, Response } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { getUserDashboard } from "../services/dashboard.service";

jest.mock("../services/dashboard.service");

describe("Dashboard Controller", () => {

  it("doit retourner le dashboard utilisateur", async () => {

    const fakeDashboard = {
      favorites: [],
      cryptos: [],
      stats: { total: 0 }
    };

    (getUserDashboard as jest.Mock).mockResolvedValue(fakeDashboard);

    const req = {
      user: { _id: "user123" }
    } as any as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as any as Response;

    await dashboardController(req, res);

    expect(getUserDashboard).toHaveBeenCalledWith("user123");
    expect(res.json).toHaveBeenCalledWith(fakeDashboard);
  });

});
