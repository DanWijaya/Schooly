import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from "classnames";
import { editClass, updateClass } from '../../../actions/ClassActions';
import { connect } from 'react-redux';

class EditClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            nihil: true,
            walikelas: '',
            ukuran: 0,
            errors: {},
            classesCollection: []
        }
        const { classId } = this.props.location.state;
        console.log(classId);
        console.log("Aduh");
        this.props.editClass(classId)
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value});
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log("Class props is received")
        const { name } = this.state;
        if(!name){
            this.setState({ 
                name: nextProps.classesCollection.name,
                nihil: nextProps.classesCollection.nihil,
                walikelas: nextProps.classesCollection.walikelas,
                ukuran: nextProps.classesCollection.ukuran
            });
        }

        
    }
    onSubmit = (e) => {
        e.preventDefault()

        const { classId } = this.props.location.state;
        const classObject = {
            name: this.state.name,
            nihil: this.state.nihil,
            walikelas: this.state.walikelas,
            nihil: this.state.nihil
        }

        this.props.updateClass(classObject, classId, this.props.history);
        this.setState({name: '', nihil: true, walikelas: '', ukuran: 0})
        }

    
    render() {
        document.title = "Schooly - Edit Class"
        const { errors } = this.state;

        return(
            <div className="container">
                <div className="col s8 offset-s2"> 
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
                            className={classnames("", {
                                invalid: errors.name
                            })}
                        />
                        <label htmlFor="name">Name</label>
                        <span className="red-text">{errors.name}</span>
                    </div>

                    {/* <div className="input-field col s12">
                        <input 
                            onChange={this.onChange}
                            value={this.state.nihil}
                            error={errors.nihil}
                            id="nihil"
                            type="radio"
                            className={classnames("", {
                                invalid: errors.nihil
                            })}
                        />
                        <label htmlFor="nihil">Nihil</label>
                        <span className="red-text">{errors.nihil}</span>
                    </div> */}

                    <div className="input-field col s12">
                        <input 
                            onChange={this.onChange}
                            value={this.state.walikelas}
                            error={errors.walikelas}
                            id="walikelas"
                            type="text"
                            className={classnames("", {
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
                            className={classnames("", {
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
                                Edit Class
                            </button>
                    </div>
                </form>
            </div>
        </div>
        )
    }
}

EditClass.propTypes = {
    editClass: PropTypes.func.isRequired,
    updateClass: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    classesCollection: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    errors: state.errors,
    classesCollection: state.classesCollection
})

export default connect(
    mapStateToProps, { editClass, updateClass } 
) (EditClass)


