class Profiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: '' };
    }

    componentDidMount() {
        function addWheel() {
            function scrollHorizontally(e) {
                e = window.event || e;
                var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                document.getElementById('mshw').scrollLeft -= (delta*-40); // Multiplied by 40
                e.preventDefault();
            }
            document.getElementById('mshw').addEventListener("mousewheel", scrollHorizontally, false);
        };
        addWheel();
    }


    deleteHandler = (a) => {
        console.log(a)
        el.remote.getGlobal('sharedObject').removeUser(a)
        this.props.forceUpdate()
    }
    setupHandler = (a) => {
        renderSettingsPopup(a)
    }
    addBtn = () => {
        renderAddUserPopup()
    }
    render() {
        // console.log(this.props.users)
        return (
            <div className="profiles noselect">
                <ul id="mshw">
                    {this.props.users.map(x =>
                        <li className={"card" + (x.login == this.props.selected ? " active" : "")} key={x.login} onClick={(e) => this.props.selectHandler(x.login, e)} >
                            <h3 className="card-header">{x.login}</h3>
                            <div className="card-info">
                                <p>{x.nowOn}</p>
                                <p>{x.status}</p>
                            </div>
                            <div className="close" onClick={(e) => this.deleteHandler(x.login, e)}></div>
                            <div className="info" onClick={(e) => this.setupHandler(x.login, e)}></div>
                        </li>
                    )}
                    <li className="add-card" onClick={this.addBtn}>
                        <div className="add"></div>
                    </li>
                </ul>
            </div>
        )
    }
}