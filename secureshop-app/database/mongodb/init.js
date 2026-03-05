db = db.getSiblingDB('secureshop');

db.createCollection('sessions');
db.createCollection('logs');
db.createCollection('reviews');

db.reviews.insertMany([
    { productId: 1, userId: 2, rating: 5, comment: "Excellent laptop!", createdAt: new Date() },
    { productId: 2, userId: 3, rating: 4, comment: "Bon casque, confortable", createdAt: new Date() },
    { productId: 3, userId: 2, rating: 3, comment: "Correct pour le prix", createdAt: new Date() }
]);
