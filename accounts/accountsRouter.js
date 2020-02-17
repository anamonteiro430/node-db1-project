const express = require('express');

// database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
	const limit = req.query.limit;
	//list of accounts
	//select from accounts
	//all databases operations return a promise
	db.select('*')
		.from('accounts')
		.limit(limit)
		.then(accounts => {
			res.status(200).json(accounts);
		})
		.catch(error => {
			console.log(error);
			res.status(500).json({ error: 'error' });
		});
});

router.get('/:id', (req, res) => {
	// select * from accounts where id = :id
	getById(req.params.id)
		.then(account => {
			res.status(200).json(account);
		})
		.catch(error => {
			console.log(error);

			res.status(500).json({ error: 'failed to get the account' });
		});
});

router.post('/', (req, res) => {
	// add a post
	// insert into posts () values ()
	db('accounts')
		.insert(req.body, 'id') // will generate a warning on console when using sqlite, ignore that
		.then(ids => {
			// adding that return sends any errors up the chain to be
			// handled by the catch in line 50. Reading up on Promises will make it clearer.
			return getById(ids[0]).then(inserted => {
				res.status(201).json(inserted);
			});
		})
		.catch(error => {
			console.log(error);

			res.status(500).json({ error: 'failed to add the account' });
		});
});

router.put('/:id', (req, res) => {
	// update a post
	const id = req.params.id;
	const changes = req.body;
	db('accounts')
		.where({ id })
		.update(changes)
		.then(count => {
			res.status(200).json(count);
		})
		.catch(error => {
			console.log(error);

			res.status(500).json({ error: 'failed to update the account' });
		});
});

router.delete('/:id', (req, res) => {
	// removes a post
	const id = req.params.id;
	db('accounts')
		.where({ id })
		.del()
		.then(count => {
			console.log('deleting');
			res.status(200).json(count);
		})
		.catch(error => {
			console.log(error);

			res.status(500).json({ error: 'failed to remove the account' });
		});
});

function getById(id) {
	return db('accounts')
		.where({ id })
		.first();
}

module.exports = router;
