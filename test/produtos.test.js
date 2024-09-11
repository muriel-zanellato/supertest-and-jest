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
        console.log(token)
        done();
    })
});



describe('Get all products', () => {
    it('should get all our products', async() => {
      const response =  await request.get('/api/products')
    //   console.log(response)
      expect(response.statusCode).toBe(200);
      expect((await response).body).not.toBeNull();
      expect((response).body).toEqual(expect.arrayContaining(response.body));
    })
})

describe('Create a product without auth', () => {
    it('should fail to create the product', async () => {
        const response = await request.post('/api/products')          
        .send({
            description:'iphone 12',
            category: 'eletronics',
            price: 500,
            brand: 'apple',
            quantity: 50
        })
        expect(response.statusCode).toBe(401)
    })
})

describe('Create a product with auth', () => {
    it('should fail to create the product', async () => {
        const merchantProducts = await request
        .get('/api/products/merchants/66e0d10d68c82afae47ada6f')
        .set('x-auth-token', token)      
    const productsBefore = merchantProducts.body.length;

        const response = await request
        .post('/api/products')
        .set('x-auth-token', token)        
        .send({
            name: 'Celular',
            description:'Iphone 16',
            category: 'eletronics',
            price: 6000,
            brand: 'Apple',
            quantity: 50
        })

        const merchantProductsAfter = await request
            .get('/api/products/merchants/66e0d10d68c82afae47ada6f')
            .set('x-auth-token', token)      
        
    
        expect(response.statusCode).toBe(200);
        expect(merchantProductsAfter.body.length).toEqual(productsBefore + 1);
        
    });
});

describe('Modify a product without auth', () => {
    it('should pass to modification process the product', async () => {
        const response = await request.patch('/api/products/66e0d3a168c82afae47ada81')
        .set('x-auth-token', token)              
        .send({            
            price: 1500
        })
        expect(response.statusCode).toBe(200);
        expect(response.body.price).toBe(1500);
    })
})

describe('Delete a product without auth', () => {
    it('should pass to delete process the product', async () => {
   
      const response = await request
        .delete('/api/products/66e0d2f768c82afae47ada7b')
        .set('x-auth-token', token);   
      
      expect(response.statusCode).toBe(200);  
 
      const merchantProducts = await request
        .get('/api/products/merchants/66e0d10d68c82afae47ada6f')
        .set('x-auth-token', token);   
     
      expect(merchantProducts.statusCode).toBe(200);  
    
      expect(merchantProducts.body).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: '66e0d2f768c82afae47ada7b',
          }),
        ])
      ); 
      
      expect(merchantProducts.body).not.toContainEqual(
        expect.objectContaining({
          _id: '66e0d2f768c82afae47ada7b',
        })
      );
    });
  });