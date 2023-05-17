const { connectJest, disconnect } = require("../src/db");
const { emptyDatabase } = require("./helper.db");
const request = require("supertest");
const app = require("../src/app");
const {
    UserType,
    StoreType,
    AdvertisementType,
} = require("../src/utils/enums");
const bcrypt = require("bcrypt");
const { faker, it } = require("@faker-js/faker");

const User = require("../src/user/model");
const Store = require("../src/store/model");
const Advertisement = require("../src/advertisement/model");
const Category = require("../src/category/model");

beforeAll(async () => {
    await connectJest();
    await emptyDatabase();
});

afterAll(async () => {
    await emptyDatabase();
    await disconnect();
});

describe("Browse Catalogues and View Own Deals integration test", () => {
    const params = {};

    beforeAll(async () => {
        const user = await User.create({
            firstName: "John",
            lastName: "Doe",
            type: UserType.Student,
            username: "johnny",
            email: "sc1908360@qu.edu.qa",
            password: await bcrypt.hash("123456", 10),
            phoneNumber: "55555555",
            verified: true,
        });

        const res = await request(app).post("/api/auth/signIn").send({
            email: "sc1908360@qu.edu.qa",
            password: "123456",
        });

        params.userId = user._id.toString();
        params.authToken = res.body.userToken;
    });

    beforeEach(async () => {
        await Store.deleteMany({});
        await Advertisement.deleteMany({});
        await Category.deleteMany({});
    });

    describe("For an inexistent store", () => {
        beforeAll(async () => {
            params.res = await request(app)
                .get("/api/advertisement/store/111111111111111111111111")
                .set("Authorization", `Bearer ${params.authToken}`)
                .query({ limit: 5 });
        });

        test("Should respond with a status of 200", () => {
            expect(params.res.status).toBe(200);
        });

        test("Should respond with an empty array", () => {
            expect(params.res.body.advertisements.length).toBe(0);
        });
    });

    describe('For a store with at most "limit" advertisements', () => {
        const advertisementCount = 3;
        const limit = 5;

        beforeAll(async () => {
            const store = await Store.create({
                name: "default store",
                type: StoreType.Default,
                image: { public_id: "something", url: "something else" },
            });
            const storeId = store._id.toString();
            const category = await Category.create({ name: "Books" });
            const categoryId = category._id.toString();

            for (let i = 1; i <= advertisementCount; i++) {
                await Advertisement.create({
                    userId: params.userId,
                    storeId,
                    categoryId,
                    title: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    type: AdvertisementType.Product,
                    price: faker.commerce.price(),
                    stock: Math.floor(Math.random() * 10),
                    images: [],
                });
            }

            params.advertisements = await Advertisement.find({ storeId }).limit(
                limit
            );
            params.advertisements = JSON.parse(
                JSON.stringify(params.advertisements)
            );

            params.res = await request(app)
                .get(`/api/advertisement/store/${storeId}`)
                .set("Authorization", `Bearer ${params.authToken}`)
                .query({ limit });
        });

        test("Should respond with a status of 200", () => {
            expect(params.res.status).toBe(200);
        });

        test('Should respond with an array of at most "limit" advertisements', () => {
            expect(params.res.body.advertisements.length).toBeLessThanOrEqual(
                limit
            );
        });

        test("Should respond with the store's limited advertisements", () => {
            expect(params.res.body.advertisements).toEqual(
                params.advertisements
            );
        });
    });

    describe('For a store with more than "limit" advertisements', () => {
        const advertisementCount = 7;
        const limit = 5;

        beforeAll(async () => {
            const store = await Store.create({
                name: "default store",
                type: StoreType.Default,
                image: { public_id: "something", url: "something else" },
            });
            const storeId = store._id.toString();
            const category = await Category.create({ name: "Books" });
            const categoryId = category._id.toString();

            for (let i = 1; i <= advertisementCount; i++) {
                await Advertisement.create({
                    userId: params.userId,
                    storeId,
                    categoryId,
                    title: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    type: AdvertisementType.Product,
                    price: faker.commerce.price(),
                    stock: Math.floor(Math.random() * 10),
                    images: [],
                });
            }

            params.advertisements = await Advertisement.find({ storeId }).limit(
                limit
            );
            params.advertisements = JSON.parse(
                JSON.stringify(params.advertisements)
            );

            params.res = await request(app)
                .get(`/api/advertisement/store/${storeId}`)
                .set("Authorization", `Bearer ${params.authToken}`)
                .query({ limit });
        });

        test("Should respond with a status of 200", () => {
            expect(params.res.status).toBe(200);
        });

        test('Should respond with an array of exactly "limit" advertisements', () => {
            expect(params.res.body.advertisements.length).toBe(limit);
        });

        test("Should respond with the store's limited advertisements", () => {
            expect(params.res.body.advertisements).toEqual(
                params.advertisements
            );
        });
    });
});
