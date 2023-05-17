jest.mock("../src/advertisement/service.js");
jest.mock("../src/advertisement/repository.js");

describe("Browse Catalogues and View Own Deals unit tests", () => {
    const storeId = "123";
    const limit = 10;
    const advertisements = [{ _id: "1" }, { _id: "2" }, { _id: "2" }];

    describe("AdvertisementHandler", () => {
        const AdvertisementHandler = jest.requireActual(
            "../src/advertisement/handlers"
        );
        const AdvertisementService = jest.requireMock(
            "../src/advertisement/service"
        );

        describe("getStoreAdvertisements(req, res, next)", () => {
            const req = { params: { storeId }, query: { limit } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            beforeAll(async () => {
                AdvertisementService.getStoreAdvertisements.mockResolvedValue(
                    advertisements
                );
                await AdvertisementHandler.getStoreAdvertisements(
                    req,
                    res,
                    next
                );
            });

            it("Calls AdvertisementService.getStoreAdvertisements once", () => {
                expect(
                    AdvertisementService.getStoreAdvertisements
                ).toHaveBeenCalledTimes(1);
            });

            it("Calls AdvertisementService.getStoreAdvertisements with storeId and limit", () => {
                expect(
                    AdvertisementService.getStoreAdvertisements
                ).toHaveBeenCalledWith(storeId, limit);
            });

            it("Responds with a status of 200", () => {
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(200);
            });

            it("Responds with the resolved value of AdvertisementService.getStoreAdvertisements", () => {
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json).toHaveBeenCalledWith({ advertisements });
            });
        });
    });

    describe("AdvertisementService", () => {
        const AdvertisementService = jest.requireActual(
            "../src/advertisement/service.js"
        );
        const AdvertisementRepository = jest.requireMock(
            "../src/advertisement/repository.js"
        );

        describe("getStoreAdvertisements(storeId, limit)", () => {
            let result;

            beforeAll(async () => {
                AdvertisementRepository.readByStoreId.mockResolvedValue(
                    advertisements
                );
                result = await AdvertisementService.getStoreAdvertisements(
                    storeId,
                    limit
                );
            });

            it("Calls AdvertisementRepository.readByStoreId once", () => {
                expect(
                    AdvertisementRepository.readByStoreId
                ).toHaveBeenCalledTimes(1);
            });

            it("Calls AdvertisementRepository.readByStoreId with storeId and limit", () => {
                expect(
                    AdvertisementRepository.readByStoreId
                ).toHaveBeenCalledWith(storeId, limit);
            });

            it("Returns the return value of AdvertisementRepository.readByStoreId", () => {
                expect(result).toEqual(advertisements);
            });
        });
    });
});
