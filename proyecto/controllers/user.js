const User = require("../models").User;
const Service = require("../models").Service;
const Portfolio = require("../models").Portfolio;
const Application = require("../models").Application;
const bcrypt = require('bcrypt');
const config = require('../config');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

module.exports = {
  list(req, res) {
    return User
      .findAll({
        order: [
          ['createdAt', 'DESC'],
        ],
      })
      .then((users) => res.status(200).send(users))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return User
      .findByPk(req.params.id, {
        include: [Service, Portfolio, Application],
      })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User not found.',
          });
        }
        return res.status(200).send(user);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return User
      .create({
        user_names: req.body.user_names,
        user_lastnames: req.body.user_lastnames,
        user_email: req.body.user_email,
        user_login: req.body.user_login,
        user_password: bcrypt.hashSync(req.body.user_password, config.saltRounds),
        user_birthdate: req.body.user_birthdate,
      })
      .then((user) => res.status(201).send(user))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return User
      .findByPk(req.params.id, {
      })
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User not found.',
          });
        }
        return user
          .update({
            user_names: req.body.user_names || user.user_names,
            user_lastnames: req.body.user_lastnames || user.user_lastnames,
            user_email: req.body.user_email || user.user_email,
            user_login: req.body.user_login || user.user_login,
            user_password: bcrypt.hashSync(req.body.user_password, config.saltRounds) || user.user_password,
            user_birthdate: req.body.user_birthdate || user.user_birthdate,
          })
          .then(() => res.status(200).send(user))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return User
      .findByPk(req.params.id)
      .then(user => {
        if (!user) {
          return res.status(400).send({
            message: 'User not found.',
          });
        }
        return user
          .destroy()
          .then(() => res.status(200).send(user))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  authenticate(req, res) {
    return User
      .findOne({
        where: Sequelize.or({
          user_login: req.body.login,
        },{
          user_email: req.body.login,
        })
      })
      .then(user => {
        if (!user) {
          return res.status(400).send({
            message: 'User not found.',
          })
        }
        else if (!bcrypt.compareSync(req.body.password || '', user.user_password)) {
          return res.status(400).send({
            message: 'Wrong password.',
          });
        }
        else {
          const payload = {
            login: user.user_login,
            id: user.id,
            time: new Date()
          };

          var token = jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.tokenExpireTime
          });
          const array={
            id:user.id,
            token:token
          };
          return res.status(200).send(array);
        }
      }).catch(error => res.status(400).send(error));
  }
}