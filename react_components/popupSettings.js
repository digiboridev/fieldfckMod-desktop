class PopupSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show:true,timeContentHeight:0,login:this.props.user.login,pass:this.props.user.password};
    }
    componentWillReceiveProps = (prop) => {
        this.setState({show:true})
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
    submitBtn = () => {
        
    }
    timeCollapseBtn = () => {
        if (this.state.timeContentHeight == 0) {
            this.setState({timeContentHeight:200})
        } else {
            this.setState({timeContentHeight:0})
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
                    В пути
                        <input type="range" min="1" max="100" />
                    На обьекте
                        <input type="range" min="1" max="100" />
                    </label>
                    <button className="popup_update" type="button" onClick={this.submitBtn}>Обновить</button>
                    <button className="popup_close" type="button" onClick={this.closeBtn}>Закрыть</button>
                </form> 
              </div>
            )             
        } else {
            return null
        }
    }
}