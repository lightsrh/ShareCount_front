const { Pool } = require('pg');

const pool = new Pool({
    user: 'test',
    host: 'postgresql.local',
    database: 'base_test',
    password: 'test',
    port: 5432,
});

function getGroups(request, response) {
    pool.query('SELECT * FROM groups;', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

function getAll(request, response) {
    pool.query('SELECT * FROM utilisateurs;', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

function addMember(request, response){
    pool.query('INSERT INTO utilisateurs (nom, prenom) VALUES ($1, $2)', [request.body.nom, request.body.prenom], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    }
    );
}

function create(request, response) {
    const { id, nom, prenom, depense } = request.body;

    pool.query(
        'INSERT INTO table_test (id, nom, prenom, depense) VALUES ($1, $2, $3, $4)',
        [id, nom, prenom, depense],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(201).send(`User added with ID: ${results.rows[0].id}`);
        }
    );
}

function deleteById(request, response) {
    const id = parseInt(request.params.id);

    pool.query('DELETE FROM table_test WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
}

module.exports = {
    getAll,
    create,
    deleteById,
    addMember,
    getGroups
};
