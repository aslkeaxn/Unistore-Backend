jest.mock("../src/advertisement/service.js");
jest.mock("../src/advertisement/repository.js");

describe("Delete Catalogue Item and Delete Deal unit tests", () => {
    describe("AdvertisementHandler", () => {
        const AdvertisementHandler = jest.requireActual(
            "../src/advertisement/handlers.js"
        );
        const AdvertisementService = jest.requireMock(
            "../src/advertisement/service.js"
        );

        describe("deleteAdvertisement(req, res, next)", () => {
            const userId = "userId";
            const advertisementId = "advertisementId";

            const req = {
                decodedToken: { userId },
                params: { advertisementId },
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            AdvertisementService.deleteAdvertisement.mockImplementation(
                (userId, advertisementId) => {}
            );

            beforeAll(async () => {
                await AdvertisementHandler.deleteAdvertisement(req, res, next);
            });

            it("Should call AdvertisementService.deleteAdvertisement once", () => {
                expect(
                    AdvertisementService.deleteAdvertisement
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call AdvertisementService.deleteAdvertisement with userId and advertisementId", () => {
                expect(
                    AdvertisementService.deleteAdvertisement
                ).toHaveBeenCalledWith(userId, advertisementId);
            });

            it("Should respond with a status code of 201", () => {
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(201);
            });

            it('Should respond with the following message: "Advertisement has been deleted"', () => {
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json).toHaveBeenCalledWith({
                    message: "Advertisement has been deleted",
                });
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

        describe("deleteAdvertisement(userId, advertisementId)", () => {
            const userId = "userId";
            const advertisementId = "advertisementId";

            const advertisement = { userId };
            AdvertisementRepository.readByAdvertisementId.mockResolvedValue(
                advertisement
            );

            const deletedAdvertisement = {};
            AdvertisementRepository.deleteById.mockResolvedValue(
                deletedAdvertisement
            );

            beforeAll(async () => {
                await AdvertisementService.deleteAdvertisement(
                    userId,
                    advertisementId
                );
            });

            it("Should call AdvertisementRepository.deleteById once", () => {
                expect(
                    AdvertisementRepository.deleteById
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call AdvertisementRepository.deleteById with advertisementId", () => {
                expect(AdvertisementRepository.deleteById).toHaveBeenCalledWith(
                    advertisementId
                );
            });

            it("Should call AdvertisementRepository.readByAdvertisementId once", () => {
                expect(
                    AdvertisementRepository.readByAdvertisementId
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call AdvertisementRepository.readByAdvertisementId with advertisementId", () => {
                expect(
                    AdvertisementRepository.readByAdvertisementId
                ).toHaveBeenCalledWith(advertisementId);
            });
        });
    });
});
