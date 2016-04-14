
	module.exports = {
		development: {
		client: 'pg',
		connection: 'postgres://localhost/books-library',
		},

		production: {
		client: 'pg',
		connection: process.env.DATABASE_URL
		}
	};
