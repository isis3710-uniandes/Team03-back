import React, { Component } from 'react';
import copy from 'copy-to-clipboard';
import M from "materialize-css";
import AddOffer from './AddOffer'
import OfferProfile from '../offerComponents/OfferProfile';
import { FormattedMessage } from 'react-intl';

class ContractorOffers extends Component {

  constructor(props) {
    super(props);

    this.state = {
      idLogged: this.props.idLogged,
      contractor: {},
      portafolios: [],
      agregando: false,
      cambiando: null,
      borrando: null,
      ofertaActiva: null
    }

    this.actualizar = this.actualizar.bind(this);
    this.postOffer = this.postOffer.bind(this);
    this.putOffer = this.putOffer.bind(this);
    this.deleteOffer = this.deleteOffer.bind(this);
    this.toAdd = this.toAdd.bind(this)
    this.toEdit = this.toEdit.bind(this);
    this.toDelete = this.toDelete.bind(this);
    this.toOfferList = this.toOfferList.bind(this);
    this.toOfferProfile = this.toOfferProfile.bind(this);
    this.compartirURL = this.compartirURL.bind(this);

    this.actualizar();
  }

  actualizar() {
    fetch('/api/contractor/' + this.state.idLogged).then(res => res.json()).then(data => {
      if (data.Offers == null) {
        this.setState({
            contractor: data
        });
      }
      else {
        this.setState({
          user: data,
          portafolios: data.Offers
        });
      }
    });
  }

  toAdd() {
    this.setState({
      agregando: true,
      cambiando: null
    })
  }

  toEdit(oferta) {
    this.setState({
      agregando: true,
      cambiando: oferta
    })
  }

  toDelete(oferta) {
    this.setState({
      borrando: oferta
    });
  }

  postOffer() {
    this.setState({
      cambiando: null,
      agregando: false
    });
    this.actualizar();
  }

  putOffer() {
    this.setState({
      cambiando: null,
      agregando: false,
    });
    this.actualizar();
  }

  deleteOffer(id) {
    fetch('/api/contractor/'+this.state.idLogged+'/offer/'+ id).then(res => res.json()).then(data => {

      fetch('/api/contractor/'+this.state.idLogged+'/offer/'+ id, { method: 'DELETE' }).then(res => {
        if (res.ok) {
          M.toast({ html: 'Portafolio eliminado', classes: 'rounded' });
          this.actualizar();
        }
        else {
          throw new Error("El oferta no ha podido eliminar");
        }
      }).catch(error => M.toast({ html: error.message, classes: 'rounded' }));

    });

    this.setState({
      borrando: null
    });
  }

  compartirURL(url) {
    getIP().then((ip) => {
      copy('http://' + ip + ':8082/' + url);
      M.toast({ html: 'URL del oferta copiada en el portapapeles', displayLength: 10000, classes: 'rounded' });
      console.log(ip);
    }).catch((error) => {
      console.error(error);
    });
  }

  toOfferProfile(offer) {
    fetch('/api/contractor/'+this.state.idLogged+'/offer/'+ offer.id).then(res => res.json()).then(data => {
      this.setState({
        cambiando: null,
        agregando: false,
        contestActivo: data
      });
    });
  }

  toOfferList() {
    this.setState({
      cambiando: null,
      agregando: false,
      contestActivo: null
    })
  }

  componentDidMount() {
    document.dispatchEvent(new Event('component'));
  }

  render() {

    const ofertas = this.state.ofertas.map((oferta, i) => {
      return (
        <div className="col s4" key={oferta.id}>
          <div className="card medium sticky-action">
            <div className="card-image waves-effect waves-block waves-light">
              <img className="activator" src={"./supervoicesfiles/images/" + oferta.offer_banner} />
            </div>
            <div className="card-content">
              <span className="card-title activator grey-text text-darken-4">{oferta.offer_name}<i className="material-icons right">more_vert</i></span>
              <p><i>/{oferta.portfolio_url}</i></p>
            </div>
            <div className="card-reveal">
              <span className="card-title grey-text text-darken-4">{oferta.offer_name}<i className="material-icons right">close</i></span>
              <p>
                <b>
                  <FormattedMessage
                    id="Offers.Terms"
                    defaultMessage="Terms"
                  />
                </b>
                {oferta.offer_terms}
              </p>
              <p>
                <b>
                  <FormattedMessage
                    id="Offers.Description"
                    defaultMessage="Description"
                  />
                </b>
                {oferta.portfolio_description}
              </p>
            </div>
            <div className="card-action">
              <a href="#" onClick={() => this.toOfferProfile(oferta)} className="black-text">
                <b>
                  <FormattedMessage
                    id="Offers.Open"
                    defaultMessage="Description"
                  />
                </b>
              </a>
              <a href="#confirmDeleteModal" onClick={() => this.toDelete(oferta.id)} className="modal-trigger black-text">
                <i className="material-icons right">
                  <FormattedMessage
                    id="Offers.Delete"
                    defaultMessage="Delete"
                  />
                </i>
              </a>
              <a href="#" onClick={() => this.toEdit(oferta)} className="black-text">
                <i className="material-icons right"><FormattedMessage
                  id="Offers.Edit"
                  defaultMessage="Edit"
                />
                </i>
              </a>
            </div>
          </div>
        </div>
      )
    })

    return (

      <div>
        {
          this.state.portfolioActivo == null ?
            <div className="container">
              <center><h5> <FormattedMessage
                id="Offers.Title"
                defaultMessage="My Offers"
              /> {!this.state.agregando ? <a onClick={this.toAdd} className="btn-floating btn-large waves-effect waves-light red darken-3"><i className="material-icons">add</i></a> : null}</h5></center>
              <br></br>

              {
                this.state.agregando ?
                  <div className="row">
                    <div className="container">
                      <AddOffer post={this.postOffer} put={this.putOffer} idLogged={this.state.user.id} oferta={this.state.cambiando} />
                    </div>
                    <br></br>
                  </div>
                  : null
              }

              <div className="row">
                {portafolios}
              </div>
            </div>
            :
            <OfferProfile offer={this.state.ofertaActiva} salir={this.toOfferList} externo={false} />
        }

        <div id="confirmDeleteModal" className="modal s6">
          <div className="modal-content">
            <h4>
              <FormattedMessage
                id="Offers.DeleteTitle"
                defaultMessage="Delete Offer?"
              />
            </h4>
            <p>
              <FormattedMessage
                id="Offers.DeleteMessage"
                defaultMessage="If the offer has entries, these will be deleted as well. Are you sure you want to delete this portfolio?"
              />
            </p>
          </div>
          <div className="modal-footer">
            <a href="#" className="modal-close waves-effect waves-green btn-flat">
              <FormattedMessage
                id="App.No"
                defaultMessage="No"
              />
            </a>
            <a onClick={() => this.deleteOffer(this.state.borrando)} className="modal-close waves-effect waves-green btn-flat">
              <FormattedMessage
                id="App.Yes"
                defaultMessage="Yes"
              />
            </a>
          </div>
        </div>

      </div>

    )
  }
}

export default ContractorOffers;