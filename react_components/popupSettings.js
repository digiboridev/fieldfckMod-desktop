class PopupSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="popup active">
            <form className="form-check" >
                <label>
                Логин:
                    <input type="text"  />
                </label>
            </form> 
          </div>
        ) 
    }
}