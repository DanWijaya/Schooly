import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from "classnames";
import { editClass, updateClass } from '../../../actions/ClassActions';
import { connect } from 'react-redux';
import { getTeachers , getStudents} from "../../../actions/AuthActions";
import { Multiselect } from 'multiselect-react-dropdown';
import { InputLabel } from '@material-ui/core';

class EditClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            nihil: true,
            walikelas: null,
            ukuran: 0,
            errors: {},
            classesCollection: [],
            ketua_kelas: null,
            sekretaris: null,
            bendahara: null
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
        var next_ketua_kelas = {"name" : "Not selected"}
        var next_bendahara = {"name" : "Not selected"}
        var next_sekretaris = {"name" : "Not selected"}

        if(nextProps.classesCollection.ketua_kelas)
            next_ketua_kelas = nextProps.classesCollection.ketua_kelas

        if(nextProps.classesCollection.sekretaris)
            next_sekretaris = nextProps.classesCollection.sekretaris

        if(nextProps.classesCollection.bendahara)
            next_bendahara = nextProps.classesCollection.bendahara

        if(!name){
            this.setState({
                name: nextProps.classesCollection.name,
                nihil: nextProps.classesCollection.nihil,
                walikelas: nextProps.classesCollection.walikelas,
                ukuran: nextProps.classesCollection.ukuran,
                ketua_kelas: next_ketua_kelas,
                sekretaris: next_sekretaris,
                bendahara: next_bendahara
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
            ukuran: this.state.ukuran,
            ketua_kelas: this.state.ketua_kelas,
            sekretaris: this.state.sekretaris,
            bendahara: this.state.bendahara,
            errors: {}
        }

        this.props.updateClass(classObject, classId, this.props.history);
        }

    onSelectTeacher = (selectedList, selectedItem) => {
        if(selectedList.length === 0)
            selectedList.push(this.state.walikelas)
        if(selectedList.length > 1)
            selectedList.shift()

        this.setState({ walikelas: selectedList[0]})
        }

    onSelectKetuaKelas = (selectedList, selectedItem) => {
        if(selectedList.length === 0)
            selectedList.push(this.state.ketua_kelas)
        if(selectedList.length > 1)
            selectedList.shift()

        this.setState({ ketua_kelas: selectedList[0]})
    }

    onSelectSekretaris = (selectedList, selectedItem) => {
        if(selectedList.length === 0)
            selectedList.push(this.state.sekretaris)
        if(selectedList.length > 1)
            selectedList.shift()

        this.setState({ sekretaris: selectedList[0]})
    }

    onSelectBendahara = (selectedList, selectedItem) => {
        if(selectedList.length === 0)
            selectedList.push(this.state.bendahara)
        if(selectedList.length > 1)
            selectedList.shift()

        this.setState({ bendahara: selectedList[0]})
    }

    componentDidMount() {
        this.props.getTeachers()
        this.props.getStudents()
    }

    render() {
        document.title = "Schooly - Edit Class"
        const { errors } = this.state;

        const { all_teachers} = this.props.auth;
        const { all_students } = this.props.auth;

        var teacher_options = all_teachers
        var student_options = all_students

        console.log(teacher_options)
        console.log(this.state.walikelas)

        return(
            <div className="container">
                <div className="col s8 offset-s2">
                <div className="col s12" style={{paddingLeft: "11.250px"}}>
                    <h4>
                        <b> Edit Class</b>
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
                        {/* <label htmlFor="name">Name</label> */}
                        {this.state.name === "" ?
                        <label htmlFor="name">Name</label> :
                        <label htmlFor="name" class="active">Name</label>}
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

                    <div className=" col s12">
                    <InputLabel id="walikelas">Walikelas</InputLabel>
                     {this.state.walikelas ? <Multiselect id="walikelas" options={teacher_options} onSelect={this.onSelectTeacher} selectedValues={[this.state.walikelas]} onRemove={this.onRemove} displayValue="name" error={errors.walikelas} showCheckBox={true}
                    className={classnames("", {
                        invalid: errors.walikelas
                    })}/> : ""}
                    </div>

                    <div className="input-field col s12">
                        <input
                            onChange={this.onChange}
                            value={this.state.ukuran}
                            error={errors.ukuran}
                            name="editinput"
                            id="ukuran"
                            type="number"
                            className={classnames("", {
                                invalid: errors.ukuran
                            })}
                        />
                        {/* <label htmlFor="ukuran">Ukuran</label> */}
                        {this.state.ukuran === "" ?
                        <label htmlFor="ukuran">Ukuran</label> :
                        <label htmlFor="ukuran" class="active">Ukuran</label>}
                        <span className="red-text">{errors.ukuran}</span>
                    </div>

                    <div className="col s12">
                    <InputLabel id="ketuakelas">Ketua Kelas</InputLabel>
                      {this.state.ketua_kelas ? <Multiselect id="ketuakelas" options={student_options} onSelect={this.onSelectKetuaKelas} selectedValues={[this.state.ketua_kelas]} onRemove={this.onRemove} displayValue="name" error={errors.ketua_kelas} showCheckBox={true}
                    className={classnames("", {
                        invalid: errors.ketuakelas
                    })}/> : ""}
                    </div>

                    <div className="col s12">
                    <InputLabel id="sekretaris">Sekretaris</InputLabel>
                      {this.state.sekretaris ? <Multiselect id="sekretaris" options={student_options} onSelect={this.onSelectSekretaris} selectedValues={[this.state.sekretaris]} onRemove={this.onRemove} displayValue="name" error={errors.sekretaris} showCheckBox={true}
                    className={classnames("", {
                        invalid: errors.sekretaris
                    })}/> : ""}
                    </div>

                    <div className="col s12">
                    <InputLabel id="">Bendahara</InputLabel>
                      {this.state.bendahara ? <Multiselect id="ketuakelas" options={student_options} onSelect={this.onSelectBendahara} selectedValues={[this.state.bendahara]} onRemove={this.onRemove} displayValue="name" error={errors.bendahara} showCheckBox={true}
                    className={classnames("", {
                        invalid: errors.bendahara
                    })}/> : ""}
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
    getTeachers: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    classesCollection: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    errors: state.errors,
    auth: state.auth,
    classesCollection: state.classesCollection
})

export default connect(
    mapStateToProps, { editClass, updateClass , getTeachers, getStudents}
) (EditClass)
