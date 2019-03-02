const Offer = require("../models").Offer;
const Application = require("../models").Application;

module.exports ={
    list(req, res) {
        return Offer
          .findAll({
            order: [
              ['createdAt', 'DESC'],
            ],
          })
          .then((offer) => res.status(200).send(offer))
          .catch((error) => { res.status(400).send(error); });
      },
    
      getById(req, res) {
        return Offer
          .findById(req.params.id,{include: [Application]})
          .then((offer) => {
            if (!offer) {
              return res.status(404).send({
                message: 'Offer not found.',
              });
            }
            return res.status(200).send(offer);
          })
          .catch((error) => res.status(400).send(error));
      },

      add(req, res) {
        return Offer
          .create({
            offer_name: req.body.offer_name,
            offer_terms: req.body.offer_terms,
            offer_banner: req.body.offer_banner,
            offer_begindate: req.body.offer_begindate,
            offer_enddate: req.body.offer_enddate,
            ContractorId: req.body.ContractorId
          })
          .then((offer) => res.status(201).send(offer))
          .catch((error) => res.status(400).send(error));
      },

      update(req, res) {
        return Offer
          .findById(req.params.id, {
          })
          .then(offer => {
            if (!offer) {
              return res.status(404).send({
                message: 'Offer not found.',
              });
            }
            return Offer
              .update({
                offer_name: req.body.offer_name||offer.offer_name,
                offer_terms: req.body.offer_terms||offer.offer_name,
                offer_banner: req.body.offer_banner||offer.offer_name,
                offer_begindate: req.body.offer_begindate||offer.offer_name,
                offer_enddate: req.body.offer_enddate||offer.offer_name
              })
              .then(() => res.status(200).send(offer))
              .catch((error) => res.status(400).send(error));
          })
          .catch((error) => res.status(400).send(error));
      },
    
      delete(req, res) {
        return Offer
          .findById(req.params.id)
          .then(offer => {
            if (!offer) {
              return res.status(400).send({
                message: 'Credit offer not found.',
              });
            }
            return offer
              .destroy()
              .then(() => res.status(200).send(offer))
              .catch((error) => res.status(400).send(error));
          })
          .catch((error) => res.status(400).send(error));
      },
}