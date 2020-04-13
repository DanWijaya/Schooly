import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { createClass } from "../../../actions/ClassActions"
import { getTeachers } from "../../../actions/AuthActions";
import { Multiselect } from 'multiselect-react-dropdown';
import { InputLabel } from '@material-ui/core';

class CreateClass extends Component {
    constructor() {
        super();

        this.state = {
            name: '',
            nihil: true,
            walikelas: {},
            ukuran: 0,
            // ketua_kelas: {},
            // sekretaris: '',
            // bendahara: '',
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
            ketua_kelas: this.state.ketua_kelas,
            sekretaris: this.state.sekretaris,
            bendahara: this.state.bendahara,
            errors: {}
        };

        this.props.createClass(classObject, this.props.history);
        this.setState({name: '', nihil: true, walikelas: '', ukuran: 0})
    }

    onSelect = (selectedList, selectedItem) => {
        if(selectedList.length > 1)
            selectedList.shift()

        this.setState({ walikelas: selectedList[0]})
      } 
  
      onRemove = (selectedList, selectedItem) => {
        this.setState({ class_assigned: selectedList[0]})
      }

     // UNSAFE_componentWillReceiveProps() is invoked before
    //  a mounted component receives new props. If you need 
    //   update the state in response to prop changes (for example, to reset it), 
    //   you may compare this.props and nextProps and perform state transitions 
    //   using this.setState() in this method.

    UNSAFE_componentWillReceiveProps(nextProps) {
        // if(nextProps.success) {
        //     this.props.history.push('/viewclass');
        // }

        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    componentDidMount() {
        this.props.getTeachers()
    }

    render() {
        const {all_teachers } = this.props.auth
        
        document.title = "Schooly - Create Kelas"
        const { errors } = this.state;
        
        var options = all_teachers
        return (
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

                     <div className=" col s12">
                    <InputLabel id="walikelas">Walikelas</InputLabel>
                    <Multiselect id="walikelas" options={options} onSelect={this.onSelect} 
                    onRemove={this.onRemove} displayValue="name" error={errors.walikelas} showCheckBox={true}
                    className={classnames("", {
                        invalid: errors.walikelas
                    })}/>
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
                                Add Class
                            </button>
                    </div>
                </form>
            </div>
        </div>
        )
        }
    }

CreateClass.propTypes = {
    createClass: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    getTeachers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    errors: state.errors,
    auth: state.auth
})

export default connect(
    mapStateToProps, { createClass , getTeachers}
) (CreateClass)


// export default CreateClass;