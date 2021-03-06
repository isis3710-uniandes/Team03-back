const Contractor = require('../models').Contractor;
const CreditCard = require('../models').CreditCard;
const Offer = require('../models').Offer;
const Contract = require('../models').Contract;
const Application = require("../models").Application;
const bcrypt = require('bcrypt');
const config = require('../config');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

module.exports = {
  list(req, res) {
    return Contractor
      .findAll({
        order: [
          ['createdAt', 'DESC'],
        ],
      })
      .then((contractors) => res.status(200).send(contractors))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return Contractor
      .findByPk(req.params.id, {
        include: [CreditCard, Offer, Contract],
      })
      .then((contractor) => {
        if (!contractor) {
          return res.status(404).send({
            message: 'Contractor not found.',
          });
        }
        return res.status(200).send(contractor);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return Contractor
      .create({
        contractor_name: req.body.contractor_name,
        contractor_email: req.body.contractor_email,
        contractor_login: req.body.contractor_login,
        contractor_password: bcrypt.hashSync(req.body.contractor_password, config.saltRounds),
        contractor_contracts: req.body.contractor_contracts,
        contractor_offers: req.body.contractor_offers,
        contractor_creditcards: req.body.contractor_creditcards,
      })
      .then((contractor) => res.status(201).send(contractor))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return Contractor
      .findByPk(req.params.id, {
      })
      .then(contractor => {
        if (!contractor) {
          return res.status(404).send({
            message: 'Contractor not found.',
          });
        }
        return contractor
          .update({
            contractor_name: req.body.contractor_name || contractor.contractor_name,
            contractor_email: req.body.contractor_email || contractor.contractor_email,
            contractor_login: req.body.contractor_login || contractor.contractor_login,
            contractor_password: bcrypt.hashSync(req.body.contractor_password, config.saltRounds) || contractor.contractor_password,
            contractor_contracts: req.body.contractor_contracts || contractor.contractor_contracts,
            contractor_offers: req.body.contractor_offers || contractor.contractor_offers,
            contractor_creditcards: req.body.contractor_creditcards || contractor.contractor_creditcards,
          })
          .then(() => res.status(200).send(contractor))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Contractor
      .findByPk(req.params.id)
      .then(contractor => {
        if (!contractor) {
          return res.status(400).send({
            message: 'Contractor not found.',
          });
        }
        return contractor
          .destroy()
          .then(() => res.status(200).send(contractor))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  authenticate(req, res) {
    return Contractor
      .findOne({
        where: Sequelize.or({
          contractor_login: req.body.login,
        },
        {
          contractor_email: req.body.login,
        })
      })
      .then(contractor => {
        if (!contractor) {
          return res.status(404).send({
            message: 'Contractor not found.',
          })
        }
        else if (!bcrypt.compareSync(req.body.password || '', contractor.contractor_password)) {
          return res.status(400).send({
            message: 'Wrong password.',
          });
        }
        else {
          const payload = {
            login: contractor.contractor_login,
            id: contractor.id,
            time: new Date()
          };

          var token = jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.tokenExpireTime
          });

          const array={
            id:contractor.id,
            token:token
          };

          return res.status(200).send(array);
        }
      })
      .catch(error => res.status(400).send(error));
  }
}