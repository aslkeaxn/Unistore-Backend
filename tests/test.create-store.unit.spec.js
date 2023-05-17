jest.mock("../src/store/service.js");
jest.mock("../src/store/repository.js");
jest.mock("../src/user/repository.js");
jest.mock("../src/utils/cloudinary.js");

describe("Create Small Business unit tests", () => {
    describe("StoreHandler", () => {
        const StoreHandler = jest.requireActual("../src/store/handlers.js");
        const StoreService = jest.requireMock("../src/store/service.js");

        describe("createStore(req, res, next)", () => {
            const userId = "userId";
            const decodedToken = { userId };
            const name = "name";
            const description = "description";
            const body = { name, description };
            const image = "image";
            const file = image;

            const req = { decodedToken, body, file };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            const next = jest.fn();

            const store = { userId, name, description, image };
            const newStore = {};
            StoreService.createStore.mockResolvedValue(newStore);

            const message = "Store successfully created";

            beforeAll(async () => {
                await StoreHandler.createStore(req, res, next);
            });

            it("Should call StoreService.createStore once with store", () => {
                expect(StoreService.createStore).toHaveBeenCalledTimes(1);
                expect(StoreService.createStore).toHaveBeenCalledWith(store);
            });

            it("Should respond with a status code of 201", () => {
                expect(res.status).toHaveBeenCalledTimes(1);
                expect(res.status).toHaveBeenCalledWith(200);
            });

            it("Should respond with the new store object and the message: Store successfully created", () => {
                expect(res.json).toHaveBeenCalledTimes(1);
                expect(res.json).toHaveBeenCalledWith({
                    store: newStore,
                    message,
                });
            });
        });
    });

    describe("StoreService", () => {
        const StoreService = jest.requireActual("../src/store/service.js");
        const StoreRepository = jest.requireMock("../src/store/repository.js");
        const UserRepository = jest.requireMock("../src/user/repository.js");
        const Cloudinary = jest.requireMock("../src/utils/cloudinary.js");

        describe("createStore(store)", () => {
            const userId = "userId";
            const name = "name";
            const image = {};
            const store = { userId, name, image };

            const storeExists = false;
            StoreRepository.readStoreByUserId.mockResolvedValue(storeExists);

            const storeNameExists = false;
            StoreRepository.readStoreByName.mockResolvedValue(storeNameExists);

            const validateStore = jest
                .spyOn(StoreService, "validateStore")
                .mockImplementation((store) => {});

            const type = "type";
            UserRepository.readById.mockResolvedValue({ type });

            const targetFolder = "store_images";
            Cloudinary.upload.mockImplementation((image, targetFolder) => {});

            StoreRepository.create.mockImplementation((store) => {});

            beforeAll(async () => {
                await StoreService.createStore(store);
            });

            it("Should call StoreRepository.readStoreByUserId once with userId", () => {
                expect(StoreRepository.readStoreByUserId).toHaveBeenCalledTimes(
                    1
                );
                expect(StoreRepository.readStoreByUserId).toHaveBeenCalledWith(
                    userId
                );
            });

            it("Should call StoreRepository.readStoreByName once with storeName", () => {
                expect(StoreRepository.readStoreByName).toHaveBeenCalledTimes(
                    1
                );
                expect(StoreRepository.readStoreByName).toHaveBeenCalledWith(
                    name
                );
            });

            it("Should call StoreService.validateStore once with store", () => {
                expect(StoreService.validateStore).toHaveBeenCalledTimes(1);
                expect(StoreService.validateStore).toHaveBeenCalledWith(store);
            });

            it("Should call UserRepository.readById once with userId", () => {
                expect(UserRepository.readById).toHaveBeenCalledTimes(1);
                expect(UserRepository.readById).toHaveBeenCalledWith(userId);
            });

            it("Should call Cloudinary.upload once with image and targetFolder", () => {
                expect(Cloudinary.upload).toHaveBeenCalledTimes(1);
                expect(Cloudinary.upload).toHaveBeenCalledWith(
                    image,
                    targetFolder
                );
            });

            it("Should call StoreRepository.create once with store", () => {
                expect(StoreRepository.create).toHaveBeenCalledTimes(1);
                expect(StoreRepository.create).toHaveBeenCalledWith(store);
            });
        });
    });
});
