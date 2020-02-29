import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Sidebar from "react-sidebar";

class SidebarDashboard extends Component {
     
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: true
        };
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open});
    }

    render() {
        return (
            <Sidebar
                sidebar={<b>Sidebar content</b>}
                open={this.state.sidebarOpen}
                onSetOpen={this.onSetSidebarOpen}
                styles={{ sidebar: { background: "white"}}}
                >
                
                <button onClick={this.onSetSidebarOpen(true)}>
                    Open Sidebar
                </button>
                </Sidebar>

        );
    }
    
}

export default SidebarDashboard;

