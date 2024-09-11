const supertest = require('supertest')
const host = 'http://localhost:5000'
const request = supertest(host)


let token
beforeAll((done) => {
    request 
    .post('/api/auth')
    .send({
        email: 'muriel@testing.com',
        password: 'password'
    })
    .end((err, response) => {
        if (err) throw err;
        token = response.body.token;
        // console.log(token)
        done();
    })
});

describe('Obter o token do usuário', () =>{
    test('Obter um token sem informar dadaos obrigatórios', () => {
        return request.get('/api/auth').then((response) => {
            expect(response.statusCode).toBe(401)
        })
    })
    
})

describe('get a user with token', () => {
    it('should get a user', async () => {
        return await request
        .get('/api/auth')
        .set('x-auth-token', token)
        .then((response) => {
            expect(response.statusCode).toBe(200)
            expect(response.type).toBe('application/json')
            expect(response.body.email).toEqual('muriel@testing.com')
        })
    })
})
