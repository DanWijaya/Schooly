import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";
import { createClass } from "../../../actions/classActions"

class CreateClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            nihil: true,
            walikelas: '',
            ukuran: 0,
            errors: {}
        };
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value});
    }

    onSubmit = (e) => {
        e.preventDefault()

        const classObject = {
            name: this.state.name,
            nihil: this.state.nihil,
            walikelas: this.state.walikelas,
            ukuran: this.state.ukuran,
            errors: {}
        };

        // this.props.createClass(classObject);
        // Axios.post('api/classes/create', classObject)
        //     .then((res) => {
        //         console.log(res.data)
        //     }).catch((error) => {
        //         console.log(error)
        //     });
        // this.props.createClass(classObject);
        this.setState({name: '', nihil: true, walikelas: '', ukuran: null})
    }

    // componentDidMount() {
    //     if(this.props.auth.isAuthenticated) {
    //         this.props.history.push("/viewclass");
    //     }
    // }

    render() {
        
        document.title = "Schooly - Membuat Kelas"
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
        )
        }
    }

CreateClass.propTypes = {
    createClass: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

// const mapStateToProps = state => ({
//     errors: state.errors
// })

// export default connect(
//     mapStateToProps, { createClass }
// ) (CreateClass)


export default CreateClass;