class Activity_data extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        console.log(this.props.users)
        return (
            <div className="data-container">
                {this.props.users.map(x =>
                    (<div className="event-cards active" login={x.login} key={x.login}>
                        {(x.data.activity[0] == null) ? "" : (
                            x.data.activity.map(a => 
                                (<div className="event-card" key={a.Id}>
                                    
                                </div>)
                            )
                        )}
                    </div>)
                )}
            </div>
            
            // <div class="event-cards active" login="vkomelkov">
            //     <div class="event-card updating">
            //         <p class="event-name">№: SR06632095; Усунення пошкоджень ОТА; Роботи: Кабель та дріт зв'язку</p>
            //         <p class="event-status">vk</p>
            //         <p class="event-created">2019-09-16T14:35:10.407Z</p>
            //         <p class="event-modifyed">2019-09-16T14:50:19.407Z</p>
            //         <p class="event-simptoms">не раб.тлф</p>
            //         <p class="event-adress">Донецька область; Добропілля; ул.Первомайская, 125-79.</p>
            //         <p class="event-info">Описание:"Причина: не раб.тлф\nТЗ: 27390"</p>
            //     </div>
            // </div>
        )
    }
}