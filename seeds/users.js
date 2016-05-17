exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({ name: 'Joe Friel', pass:  'N67lPFWQNy' }),
    knex('users').insert({ name: 'Sara Johnson', pass: 'P36qLMNOPb' }),
    knex('users').insert({ name: 'Connie Chung', pass: 'B45uRABINt' })
  );
};
