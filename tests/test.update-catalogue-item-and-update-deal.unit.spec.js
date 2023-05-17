jest.mock("../src/advertisement/service.js");
jest.mock("../src/advertisement/repository.js");

describe("Update Catalogue Item and Update Deal unit tests", () => {
    describe("AdvertisementHandler", () => {
        const AdvertisementHandler = jest.requireActual(
            "../src/advertisement/handlers.js"
        );
        const AdvertisementService = jest.requireMock(
            "../src/advertisement/service.js"
        );

        describe("updateAdvertisement(req, res, next)", () => {
            const userId = "userId";
            const advertisementId = "advertisementId";
            const body = {
                categoryId: "categoryId",
                title: "title",
                description: "description",
                type: "type",
                price: "price",
                stock: "stock",
                imagesToDelete: "imagesToDelete",
            };
            const files = [];

            const req = {
                decodedToken: { userId },
                params: { advertisementId },
                body,
                files,
            };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            const advertisement = { ...body, images: files, userId };

            AdvertisementService.updateAdvertisement.mockImplementation(
                (userId, advertisementId, advertisement) => {}
            );

            beforeAll(async () => {
                await AdvertisementHandler.updateAdvertisement(req, res, next);
            });

            it("Should call AdvertisementService.updateAdvertisement once", () => {
                expect(
                    AdvertisementService.updateAdvertisement
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call AdvertisementService.updateAdvertisement with userId, advertisementId, and advertisement", () => {
                expect(
                    AdvertisementService.updateAdvertisement
                ).toHaveBeenCalledWith(userId, advertisementId, advertisement);
            });

            it("Should respond with a status code of 201", () => {
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(201);
            });

            it('Should respond with the following message: "Advertisement successfully updated"', () => {
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json).toHaveBeenCalledWith({
                    message: "Advertisement successfully updated",
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

        describe("updateAdvertisement(userId, advertisementId, advertisement)", () => {
            const userId = "userId";
            const advertisementId = "advertisementId";
            const advertisement = {};

            const backendAdvertisement = { userId };
            AdvertisementRepository.readByAdvertisementId.mockResolvedValue(
                backendAdvertisement
            );

            const validateSpy = jest
                .spyOn(AdvertisementService, "validateAdvertisement")
                .mockImplementation((advertisement) => {});

            AdvertisementRepository.updateById.mockImplementation(
                (advertisementId, advertisement) => {}
            );

            beforeAll(async () => {
                await AdvertisementService.updateAdvertisement(
                    userId,
                    advertisementId,
                    advertisement
                );
            });

            it("Should call AdvertisementRepository.updateById once", () => {
                expect(
                    AdvertisementRepository.updateById
                ).toHaveBeenCalledTimes(1);
            });

            it("Should call AdvertisementRepository.updateById with advertisementId and advertisement", () => {
                expect(AdvertisementRepository.updateById).toHaveBeenCalledWith(
                    advertisementId,
                    advertisement
                );
            });

            it("Should call AdvertisementService.validateAdvertisement once", () => {
                expect(validateSpy).toHaveBeenCalledTimes(1);
            });

            it("Should call AdvertisementService.validateAdvertisement with advertisement", () => {
                expect(validateSpy).toHaveBeenCalledWith(advertisement);
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
