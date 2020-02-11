class Navbar extends Component {
    render() {
      return (
        <div >
          <center>
          {/* <nav className="z-depth-0">
            <div className="nav-wrapper white"> */}
              <Link
                to="/"
                style={{
                  fontFamily: "monospace"
                }}
                className="col s5 brand-logo center black-text"
              >
                <img src={logo} alt="logo" className="schooly" />
              </Link>
            {/* </div>
          </nav> */}
          </center>
        </div>
      );
    }
  }
  
  export default Navbar;