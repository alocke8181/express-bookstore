process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require ('./app');
const db = require('./db');
const Book = require('./models/book');
const book1 = {
    isbn : 'testISBN',
    amazon_url : 'testURL',
    author : 'testAuth',
    language : 'testLang',
    pages : 100,
    publisher : 'testPub',
    title : 'testTitle',
    year : 2023
}


describe('Books Tests', ()=>{

    beforeEach(async () =>{
        await db.query('DELETE FROM books');

        let book1Res = await Book.create(book1);
    })

    afterAll (async () =>{
        await db.end();
    });

    describe('GET Tests', () =>{
        test('Get all', async () =>{
            let res = await request(app).get('/books');
            expect(res.body).not.toBeNull();
            expect(res.body.books[0]).toEqual(book1);
        });
        test('Get a valid book', async ()=>{
            let res = await request(app).get('/books/testISBN');
            expect(res.body).not.toBeNull();
            expect(res.body.book).toEqual(book1);
        });
        test('Get invalid book', async()=>{
            let res = await request(app).get('/books/asdf');
            expect(res.body).not.toBeNull();
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual("There is no book with an isbn 'asdf");
        });
    });
    
    describe('POST Tests', ()=>{
        test('Valid post test', async ()=>{
            let book2 = {
                isbn : 'testISBN2',
                amazon_url : 'testURL2',
                author : 'testAuth2',
                language : 'testLang2',
                pages : 1002,
                publisher : 'testPub2',
                title : 'testTitle2',
                year : 20232 
            };
            let res = await request(app).post('/books').send({
                isbn : 'testISBN2',
                amazon_url : 'testURL2',
                author : 'testAuth2',
                language : 'testLang2',
                pages : 1002,
                publisher : 'testPub2',
                title : 'testTitle2',
                year : 20232 
            });
            expect(res.body).not.toBeNull();
            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual({
                book : book2
            });
        });
        test('Invalid post test missing property', async ()=>{
            let res = await request(app).post('/books').send({
                isbn : 'testISBN2',
                author : 'testAuth2',
                language : 'testLang2',
                pages : 1002,
                publisher : 'testPub2',
                title : 'testTitle2',
                year : 20232 
            });
            expect(res.body).not.toBeNull();
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual(["instance requires property \"amazon_url\""]); 
        });
        test('Invalid post test invalid property type', async ()=>{
            let res = await request(app).post('/books').send({
                isbn : 'testISBN2',
                amazon_url : 'testURL2',
                author : 'testAuth2',
                language : 'testLang2',
                pages : '1002',
                publisher : 'testPub2',
                title : 'testTitle2',
                year : 20232 
            });
            expect(res.body).not.toBeNull();
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual(["instance.pages is not of a type(s) integer"]); 
        });
    });

    describe('PUT tests', ()=>{
        test('Valid put', async ()=>{
            let bookUpdated = {
                isbn : 'testISBN',
                amazon_url : 'testURL3',
                author : 'testAuth3',
                language : 'testLang3',
                pages : 1003,
                publisher : 'testPub3',
                title : 'testTitle3',
                year : 20233 
            };
            let res = await request(app).put('/books/testISBN').send(bookUpdated);
            expect(res.body).not.toBeNull();
            expect(res.body.book).toEqual(bookUpdated);
        });
        test('Invalid book 404', async ()=>{
            let res = await request(app).put('/books/asdf').send({
                isbn : 'testISBN',
                amazon_url : 'testURL3',
                author : 'testAuth3',
                language : 'testLang3',
                pages : 1003,
                publisher : 'testPub3',
                title : 'testTitle3',
                year : 20233 
            });
            expect(res.body).not.toBeNull();
            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toEqual("There is no book with an isbn 'asdf");
        });
        test('Invalid put test missing property', async ()=>{
            let res = await request(app).put('/books/testISBN').send({
                isbn : 'testISBN',
                author : 'testAuth2',
                language : 'testLang2',
                pages : 1002,
                publisher : 'testPub2',
                title : 'testTitle2',
                year : 20232 
            });
            expect(res.body).not.toBeNull();
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual(["instance requires property \"amazon_url\""]); 
        });
        test('Invalid put test invalid property type', async ()=>{
            let res = await request(app).put('/books/testISBN').send({
                isbn : 'testISBN',
                amazon_url : 'testURL2',
                author : 'testAuth2',
                language : 'testLang2',
                pages : '1002',
                publisher : 'testPub2',
                title : 'testTitle2',
                year : 20232 
            });
            expect(res.body).not.toBeNull();
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toEqual(["instance.pages is not of a type(s) integer"]); 
        });
    });

});