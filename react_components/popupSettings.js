class PopupSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show:true,
            timeContentHeight:0,
            gpsContentHeight:0,
            login:this.props.user.login,
            pass:this.props.user.password,
            aTob:this.props.user.intervals.aTob,
            bToc:this.props.user.intervals.bToc,
            cTod:this.props.user.intervals.cTod
        };
    }


    componentWillReceiveProps = (prop) => {
        this.setState({show:true,
            timeContentHeight:0,
            gpsContentHeight:0,
            login:prop.user.login,
            pass:prop.user.password,
            aTob:prop.user.intervals.aTob,
            bToc:prop.user.intervals.bToc,
            cTod:prop.user.intervals.cTod
        })
    }


    closeBtn = () => {
        this.setState({ show:false})
    }
    handleChangeLogin = (e) => {
        this.setState({login:e.target.value})
    }
    handleChangePass = (e) => {
        this.setState({pass:e.target.value})
    }
    handleChangeaTob = (e) => {
        this.setState({aTob:e.target.value})
    }
    handleChangebToc = (e) => {
        this.setState({bToc:e.target.value})
    }
    handleChangecTod = (e) => {
        this.setState({cTod:e.target.value})
    }
    submitBtn = () => {
        this.props.user.login = this.state.login;
        this.props.user.password = this.state.pass;
        this.props.user.intervals.aTob = this.state.aTob;
        this.props.user.intervals.bToc = this.state.bToc;
        this.props.user.intervals.cTod = this.state.cTod;
        this.setState({ show:false});

    }
    timeCollapseBtn = () => {
        if (this.state.timeContentHeight == 0) {
            this.setState({timeContentHeight:200})
        } else {
            this.setState({timeContentHeight:0})
        }
    }
    gpsCollapseBtn = () => {
        if (this.state.gpsContentHeight == 0) {
            this.setState({gpsContentHeight:200})
        } else {
            this.setState({gpsContentHeight:0})
        }
    }
    render() {
        console.log(this.props.user)
        if (this.state.show) {
            return (
                <div className="popup active">
                <form className="form-sett" >
                    <label>
                    Логин:
                        <input type="text" value={this.state.login} onChange={this.handleChangeLogin} />
                    </label>
                    <label>
                    Пароль:
                        <input type="password" value={this.state.pass} onChange={this.handleChangePass}  />
                    </label>
                    <button className="sett_time_collapse" type="button" onClick={this.timeCollapseBtn}>Время выполнения</button>
                    <label style={{maxHeight:this.state.timeContentHeight, display: "block", overflow: "hidden"}}>
                    Подтверждена: {this.state.aTob} минут
                        <input className="range" type="range" min="1" max="100" value={this.state.aTob} onChange={this.handleChangeaTob} />
                    В пути: {this.state.bToc} минут
                        <input className="range" type="range" min="1" max="100" value={this.state.bToc} onChange={this.handleChangebToc} />
                    На обьекте: {this.state.cTod} минут
                        <input className="range" type="range" min="1" max="100" value={this.state.cTod} onChange={this.handleChangecTod} />
                    </label>
                    <button className="sett_gps_collapse" type="button" onClick={this.gpsCollapseBtn}>Местоположение</button>
                    <label style={{maxHeight:this.state.gpsContentHeight, display: "block", overflow: "hidden"}}>
                        
                        <input type="text" value="48.4646372" step="0.000001" style={{width:"80px",borderRadius:"0",opacity:"0.7"}} />
                        <input type="text" value="48.4646372" step="0.000001" style={{width:"80px",borderRadius:"0",borderLeft:"1px solid #222",opacity:"0.7"}} />
                        <button type="button" style={{height:"21px",borderRadius:"0",marginTop:"0",background:"#ebebeb",width: "16px"}}>-</button>
                        Координаты (широта долгота)
                        <input type="number" step="0.000001" style={{width:"80px",borderRadius:"0"}} />
                        <input type="number" step="0.000001" style={{width:"80px",borderRadius:"0",borderLeft:"1px solid #222"}} />
                        <button type="button" style={{height:"21px",borderRadius:"0",marginTop:"0",background:"#ebebeb"}}>+</button>
                    </label>
                    <button className="popup_update" type="button" onClick={this.submitBtn}>Сохранить</button>
                    <button className="popup_close" type="button" onClick={this.closeBtn}>Закрыть</button>
                </form> 
              </div>
            )             
        } else {
            return null
        }
    }
}