describe('Wallet API - Bonus Engine - Wagering Template Tests', () => {
    const testConfiguration = {};

    before(() => {
        cy.fixture('api/environment.json').then((environment) => {
            testConfiguration.walletAPIHost = environment.hosts.wallet;
        });

        cy.fixture('api/wallet/bonus-history.fixture.json').then((bonusHistoryTestData) => {
            testConfiguration.bonusHistoryTestData = bonusHistoryTestData;
        });
    });

    let createdTemplateId = null;

    it('GET - Should contain default template as first element in response', () => {
        cy.request(`${testConfiguration.walletAPIHost}/bonus-engine/wagering`)
            .then((res) => {
                expect(res.status).to.be.eq(200);
                expect(res.body).not.to.be.empty;
                expect(res.body).to.be.a('array');
                const arrayOfObjects = res.body;
                arrayOfObjects.sort((a, b) => Number(a['id']) - Number(b['id']));
                const actualTemplate = arrayOfObjects[0];
                expect(actualTemplate).to.be.a('object');
                expect(actualTemplate.name).to.be.a('string');
                expect(actualTemplate.gameCategoryWagering).to.be.a('object');
            });
    });


    it('POST - Should successfully create Wagering Template and return correct response', () => {
        const testPayload = testConfiguration.bonusHistoryTestData.testCreatePayload;

        cy.request('POST', `${testConfiguration.walletAPIHost}/bonus-engine/wagering`, testPayload)
            .then((res) => {
                expect(res.status).to.be.eq(200);
                expect(res.body).not.to.be.empty;
                expect(res.body).to.be.a('object');
                const actualTemplate = res.body;
                expect(actualTemplate.name).to.be.eq(testPayload.name);
                expect(actualTemplate.defaultTemplate).to.be.eq(testPayload.defaultTemplate);
                expect(actualTemplate.gameCategoryWagering).to.be.a('object');
                expect(actualTemplate.gameCategoryWagering["Slots"]).to.be.eq(testPayload.gameCategoryWagering["Slots"]);
                expect(actualTemplate.gameCategoryWagering["XGames"]).to.be.eq(testPayload.gameCategoryWagering["XGames"]);
                expect(actualTemplate.gameCategoryWagering["Live casino"]).to.be.eq(testPayload.gameCategoryWagering["Live casino"]);
                expect(actualTemplate.gameCategoryWagering["Scratch cards"]).to.be.eq(testPayload.gameCategoryWagering["Scratch cards"]);
                expect(actualTemplate.gameCategoryWagering["Table games"]).to.be.eq(testPayload.gameCategoryWagering["Table games"]);
                createdTemplateId = actualTemplate.id;
            });
    })

    it('PUT - Should successfully update Wagering Template and return correct response', () => {
        const testPayload = testConfiguration.bonusHistoryTestData.testUpdatePayload;

        cy.request('PUT', `${testConfiguration.walletAPIHost}/bonus-engine/wagering/${createdTemplateId}`, testPayload)
            .then((res) => {
                expect(res.status).to.be.eq(200);
                expect(res.body).not.to.be.empty;
                expect(res.body).to.be.a('object');
                const actualTemplate = res.body;
                expect(actualTemplate.name).to.be.eq(testPayload.name);
                expect(actualTemplate.gameCategoryWagering).to.be.a('object');
                expect(actualTemplate.gameCategoryWagering["Slots"]).to.be.eq(testPayload.gameCategoryWagering["Slots"]);
                expect(actualTemplate.gameCategoryWagering["XGames"]).to.be.eq(testPayload.gameCategoryWagering["XGames"]);
                expect(actualTemplate.gameCategoryWagering["Live casino"]).to.be.eq(testPayload.gameCategoryWagering["Live casino"]);
                expect(actualTemplate.gameCategoryWagering["Scratch cards"]).to.be.eq(testPayload.gameCategoryWagering["Scratch cards"]);
                expect(actualTemplate.gameCategoryWagering["Table games"]).to.be.eq(testPayload.gameCategoryWagering["Table games"]);
            });
    })

    it('DELETE - Should successfully delete Wagering Template and return correct response', () => {
        cy.request('DELETE', `${testConfiguration.walletAPIHost}/bonus-engine/wagering/${createdTemplateId}`)
            .then((res) => {
                expect(res.status).to.be.eq(204);
            });
    })
});