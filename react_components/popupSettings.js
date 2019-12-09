class PopupSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show:true,login:this.props.user.login,pass:this.props.user.password};
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
    render() {
        console.log(this.props.user)
        if (this.state.show) {
            return (
                <div className="popup active">
                <form className="form-check" >
                    <label>
                    Логин:
                        <input type="text" value={this.state.login} onChange={this.handleChangeLogin} />
                    </label>
                    <label>
                    Пароль:
                        <input type="password" value={this.state.pass} onChange={this.handleChangePass}  />
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