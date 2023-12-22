const { Pool } = require('pg');
const path = require('path');
const { response } = require('express');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sharecount', // Nom de la base de données que vous avez créée
    password: 'postgres',
    port: 5432,
});

function getLogin(username, response) {
    pool.query('SELECT login, password FROM utilisateurs WHERE login = $1 LIMIT 1', [username], (error, results) => {
      if (error) {
        console.error('Erreur lors de la requête SQL :', error);
        response.sendStatus(500);
      } else {
        if (results.rows.length === 0) {
          // Aucun utilisateur trouvé avec ce nom d'utilisateur
          response.sendStatus(401);
        } else {
          // Utilisateur trouvé, retournez les informations
          console.log(results.rows);
          response.status(200).json(results.rows);
        }
      }
    });
  }
  

  function getGroups(request, response) {
    login = request.session.userid;
    pool.query('select id from utilisateurs where login = $1;', [login], (error, results) => {
        if (error) {
            throw error;
        }
        userId = results.rows[0].id;
        pool.query('SELECT g.* FROM groupe g INNER JOIN utilisateur_group ug ON g.id = ug.id_groupe WHERE ug.id_utilisateur = $1;', [userId], (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        });
    });
    
}


function getUsers(request, response) {
    const groupId = request.params.groupId;

    pool.query(
        'SELECT utilisateurs.* FROM utilisateur_group INNER JOIN utilisateurs ON utilisateur_group.id_utilisateur  = utilisateurs.id WHERE utilisateur_group.id_groupe = $1;',
        [groupId],
        (error, results) => {
            if (error) {
                response.status(500).json({ error });
            } else {
                response.status(200).json(results.rows);
            }
        }
    );
}



function addMember(request, response){
    pool.query('select nom from users where nom = $1', [request.body.nom], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows.length === 0) {
            pool.query('INSERT INTO users (nom, prenom) VALUES ($1, $2)', [request.body.nom, request.body.prenom], (error, results) => {
                if (error) {
                    throw error;
                }
                response.status(200).json(results.rows);
            }
            );
        }
        else {
            response.status(200).json(results.rows);
        }
    }
    );
}



function createUser(request, response, nom, prenom, photo, username, password) {
    pool.query('select login from utilisateurs where login = $1', [username], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows.length === 0) {
            pool.query('INSERT INTO utilisateurs (nom, prenom, photo, login, password) VALUES ($1, $2, $3, $4, $5)', [nom, prenom, photo, username, password], (error, results) => {
                if (error) {
                    throw error;
                }
                response.status(200).json(results.rows);
            }
            );
        }
        else {
            response.status(400).json({ error: 'username_already_exists' });
                }
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

function blobImage(request, response) {
    console.log(request.body);
    const { image } = request.body.photo;
    const base64 = image.toString('base64');
    const mimeType = image.mimetype;
    const imageEncoded = `data:${mimeType};base64,${base64}`;

    response.status(200).json({ imageEncoded });
}

module.exports = {
    getUsers,
    createUser,
    deleteById,
    addMember,
    getGroups,
    getLogin,
    blobImage
};
