import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class AddClass extends Component {
    constructor(){
        super();
        this.state = {
            name: "",
            nihil: null,
            walikelas: "",
            ukuran: 0,   
        };
    }
    
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    }  

    onSubmit = (e) => {
        e.preventDefault();

        const newClass = {
            name: this.state.name,
            nihil: this.state.email,
            walikelas: this.state.walikelas,
            ukuran: this.state.ukuran
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    render() {
        document.title = "Schooly - Tambah Kelas"
        const { errors } = this.state;

        return (
            <div> 
                <div className="col s12" style={{paddingLeft: "11.250px"}}>
                    <h4>
                        <b> Fill up Class details to add class</b>
                    </h4>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                    <div className="input-field col s12">
                        <input 
                            onChange={this.onChange}
                            value={this.state.name}
                            error={errors.name}
                            id="name"
                            type="text"
                            className={classNames("", {
                                invalid: errors.name
                            })}
                        />
                        <label htmlFor="name">Name</label>
                        <span className="red-text">{errors.name}</span>
                    </div>

                    <div className="input-field col s12">
                        <input 
                            onChange={this.onChange}
                            value={this.state.nihil}
                            error={errors.nihil}
                            id="nihil"
                            type="radio"
                            className={classNames("", {
                                invalid: errors.nihil
                            })}
                        />
                        <label htmlFor="nihil">Nihil</label>
                        <span className="red-text">{errors.nihil}</span>
                    </div>

                    <div className="input-field col s12">
                        <input 
                            onChange={this.onChange}
                            value={this.state.walikelas}
                            error={errors.walikelas}
                            id="walikelas"
                            type="text"
                            className={classNames("", {
                                invalid: errors.walikelas
                            })}
                        />
                        <label htmlFor="walikelas">Walikelas</label>
                        <span className="red-text">{errors.walikelas}</span>
                    </div>

                    <div className="input-field col s12">
                        <input 
                            onChange={this.onChange}
                            value={this.state.ukuran}
                            error={errors.ukuran}
                            id="ukuran"
                            type="number"
                            className={classNames("", {
                                invalid: errors.ukuran
                            })}
                        />
                        <label htmlFor="ukuran">Ukuran</label>
                        <span className="red-text">{errors.ukuran}</span>
                    </div>
                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                        <button 
                            style={{
                                width: "150px",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem",
                            }} 
                            type="submit"
                            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                            >
                                Add Class
                            </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddClass

