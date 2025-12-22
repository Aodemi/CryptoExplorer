import { Request, Response } from "express";
import { listCryptosDB, rechercherCrypto } from "../controllers/listCrypto.controller";
import { getCryptos } from "../services/crypto.service";

jest.mock("../services/crypto.service");

describe("Crypto DB Controller", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("doit lister les cryptos depuis la DB", async () => {

    const fakeResult = {
      count: 2,
      data: [
        { name: "Bitcoin", symbol: "BTC" },
        { name: "Ethereum", symbol: "ETH" }
      ]
    };

    (getCryptos as jest.Mock).mockResolvedValue(fakeResult);

    const req = {
      query: {}
    } as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as any as Response;

    await listCryptosDB(req, res);

    expect(getCryptos).toHaveBeenCalledWith({
      page: 1,
      limit: 20,
      search: undefined
    });

    expect(res.json).toHaveBeenCalledWith(fakeResult);
  });

  it("doit rechercher une crypto par nom", async () => {

    const fakeResult = {
      count: 1,
      data: [{ name: "Bitcoin", symbol: "BTC" }]
    };

    (getCryptos as jest.Mock).mockResolvedValue(fakeResult);

    const req = {
      params: { name: "bitcoin" }
    } as any as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as any as Response;

    await rechercherCrypto(req, res);

    expect(getCryptos).toHaveBeenCalledWith({
      search: "bitcoin",
      page: 1,
      limit: 1
    });

    expect(res.json).toHaveBeenCalledWith(fakeResult.data[0]);
  });

});
