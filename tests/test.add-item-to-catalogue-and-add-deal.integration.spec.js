const { connectJest, disconnect } = require("../src/db");
const { emptyDatabase } = require("./helper.db");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/user/model");
const Store = require("../src/store/model");
const {
    UserType,
    StoreType,
    AdvertisementType,
} = require("../src/utils/enums");
const bcrypt = require("bcrypt");
const Advertisement = require("../src/advertisement/model");
const Category = require("../src/category/model");
const { faker, it } = require("@faker-js/faker");

beforeAll(async () => {
    await connectJest();
    await emptyDatabase();
});

afterAll(async () => {
    await emptyDatabase();
    await disconnect();
});

describe("Add Item to Catalogue and Add Deal integration test", () => {
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

        const store = await Store.create({
            name: "default store",
            type: StoreType.Default,
            image: { public_id: "something", url: "something else" },
        });

        params.store = store;

        const category = await Category.create({ name: "Books" });

        /*const advertisement = await Advertisement.create({
            userId: user._id.toString(),
            storeId: store._id.toString(),
            categoryId: category._id.toString(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            type: AdvertisementType.Product,
            price: faker.commerce.price(),
            stock: Math.floor(Math.random() * 10),
            images: [],
        });*/

        const res1 = await request(app)
            .post("/api/auth/signIn")
            .send({ email: user.email, password: "123456" });

        const userToken = res1.body.userToken;

        const advertisement = {
            storeId: store._id.toString(),
            categoryId: category._id.toString(),
            title: "my advertisement",
            description: "my description etc etc etc etc",
            type: AdvertisementType.Product,
            price: 234,
            stock: 5,
        };

        params.advertisement = advertisement;

        let res2 = request(app)
            .post("/api/advertisement")
            .set("Authorization", `Bearer ${userToken}`);

        for (const key of Object.keys(advertisement)) {
            res2 = res2.field(key, advertisement[key]);
        }

        res2 = await res2;

        params.res = res2;
    });

    test("Should add the advertisement to the specified store", async () => {
        const advertisements = await Advertisement.find({
            storeId: params.store._id.toString(),
        });
        expect(advertisements.length).toBe(1);
        const advertisement = params.advertisement;
        expect(advertisement.title).toBe(params.advertisement.title);
        expect(advertisement.description).toBe(
            params.advertisement.description
        );
        expect(advertisement.type).toBe(params.advertisement.type);
    });

    test("Should respond with a status code of 201", () => {
        expect(params.res.status).toBe(201);
    });
});
