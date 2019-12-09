class PopupAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = { show:true,status:"" , login: "", pass:"",data:{}};
    }

    componentWillReceiveProps = (prop) => {
        this.setState({show:true,status:"",login: "", pass:"",data:{}})
    }

    findBtn = () => {
        this.setState({status:"Загрузка"})
        el.remote.getGlobal('sharedObject').modelFinder(this.state.login,this.state.pass)
        .then((a) => {
            console.log(a)
            this.setState({status:a.name})
            this.setState({data:a})         
        })
        .catch((a) => {
            console.log(a)
            this.setState({status:JSON.stringify(a).substring(0,200)})
            this.setState({data:{}}) 
        })
    }
    addBtn = () => {
        if (el.remote.getGlobal('sharedObject').checkUser(this.state.data.login) == undefined) {
            el.remote.getGlobal('sharedObject').addUser({
                login:this.state.data.login,
                password:this.state.data.password,
                email: this.state.data.email,
                id: this.state.data.id,
                job: this.state.data.job,
                mobile: this.state.data.mobile,
                name: this.state.data.name
            })
            this.setState({status:"Добавлен"})
            renderApp()
        } else {
            this.setState({status:"Уже добавлен"})
        }
        
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

    render() {
        console.log(this.state)
        if (this.state.show) {
            console.log("showing")
            return (
                <div className="popup active">
                <form className="form-check" >
                    <label>
                    Логин:
                        <input type="text" value={this.state.login} onChange={this.handleChangeLogin}  />
                    </label>
                    <label>
                    Пароль:
                        <input type="password" value={this.state.pass} onChange={this.handleChangePass}  />
                    </label>
                    <button className="popup_find" type="button" onClick={this.findBtn} disabled={this.state.login == "" || this.state.pass == "" ? true : false} >Найти</button>
                    <button className="popup_add" type="button" onClick={this.addBtn} disabled={this.state.data.name == undefined}>Добавить</button>
                    <button className="popup_close" type="button" onClick={this.closeBtn}>Закрыть</button>
                    <div className={"form-status" + (this.state.status == "Загрузка" ? " loading" : "")}>{this.state.status}</div>
                </form> 
              </div>
            )
        } else {
            console.log("hide")
            return null
        }  
        
    }
}