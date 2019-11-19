class Profiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selected: ''};
    }
    deleteHandler = (a) => {
        console.log(a)
        el.remote.getGlobal('sharedObject').removeUser(a)
        this.props.forceUpdate()
    }

    render() {
        // console.log(this.props.users)
        return (
            <div className="profiles noselect">
                <ul>
                    {this.props.users.map(x =>
                        <li className={"card" + (x.login == this.props.selected ? " active" : "")} key={x.login} onClick={(e) => this.props.selectHandler(x.login,e)} >
                            <h3 className="card-header">{x.login}</h3>
                            <div className="card-info">
                                <p>{x.nowOn}</p>
                                <p>{x.status}</p>
                            </div>
                            <div className="close" onClick={(e) => this.deleteHandler(x.login,e)}></div>
                            <div className="info"></div>
                        </li>
                    )}
                    <li className="add-card">
                        <div className="add"></div>
                    </li>
                </ul>
            </div>
        )
    }
}