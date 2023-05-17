jest.mock("../src/advertisement/service.js");

describe("Add Item to Catalogue and Add Deal unit tests", () => {
    describe("AdvertisementHandler", () => {
        const AdvertisementHandler = jest.requireActual(
            "../src/advertisement/handlers.js"
        );
        const AdvertisementService = jest.requireMock(
            "../src/advertisement/service.js"
        );

        describe("createAdvertisement(req, res, next)", () => {
            const decodedToken = { userId: "userId" };
            const body = {
                storeId: "storeId",
                categoryId: "categoryId",
                title: "title",
                description: "description",
                type: "type",
                price: "price",
                stock: "stock",
            };
            const files = [];

            const req = { body, decodedToken, files };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            const next = jest.fn();

            const advertisement = {
                userId: decodedToken.userId,
                ...body,
                images: files,
            };

            AdvertisementService.createAdvertisement.mockImplementation(
                (advertisement) => {}
            );

            beforeAll(async () => {
                await AdvertisementHandler.createAdvertisement(req, res, next);
            });

            it("Should call AdvertisementService.createAdvertisement once", () => {
                expect(
                    AdvertisementService.createAdvertisement
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call AdvertisementService.createAdvertisement with the advertisement object", () => {
                expect(
                    AdvertisementService.createAdvertisement
                ).toHaveBeenCalledWith(advertisement);
            });

            it("Should respond with a status of 201", () => {
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(201);
            });

            const message = "An advertisement has been created";

            it(`Should respond with a the following message: ${message}`, () => {
                expect(res.json).toHaveBeenCalledWith({ message });
            });
        });
    });
});
