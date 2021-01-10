class Activity_data extends React.Component {
    constructor (props) {
        console.log(props);
        super(props);
        this.state = {};
        this.data = {
            activityStatusCollection:JSON.parse(fs.readFileSync(path.join(__dirname, 'ActivityStatusCollection.json'))).results,
            tsiResCategory:JSON.parse(fs.readFileSync(path.join(__dirname, 'TsiResourceTypeTTCollection.json'))),
            tsiTaskCategory:JSON.parse(fs.readFileSync(path.join(__dirname, 'TsiTaskCategoryCollection.json')))
        }
    }
    findStatusName = (id) => {
        let name = '';
        for (var iSt = this.data.activityStatusCollection.length - 1; iSt >= 0; iSt--) {
            if (this.data.activityStatusCollection[iSt].Id == id) {
                name = this.data.activityStatusCollection[iSt].Name
            }
        }
        return name
    }

    findTsiResName = (id) => {
        let name = 'x3';
        for (var iRes = this.data.tsiResCategory.length - 1; iRes >= 0; iRes--) {
            if (this.data.tsiResCategory[iRes].Id == id) {
                name = this.data.tsiResCategory[iRes].Name
            }
        }
        return name
    }

    findTsiTaskName = (id) => {
        let name = 'x3';
        for (var iTask = this.data.tsiTaskCategory.length - 1; iTask >= 0; iTask--) {
            if (this.data.tsiTaskCategory[iTask].Id == id) {
                name = this.data.tsiTaskCategory[iTask].Name
            }
        }
        return name
    }

    rendUndef = () => {
        return (
            <div className="event-card">
                <p className="event-name">Нет данных</p>
                <p className="event-status">-------</p>
                <p className="event-created">-------</p>
                <p className="event-modifyed">-------</p>
                <p className="event-simptoms">-------</p>
                <p className="event-adress">-------</p>
                <p className="event-info">-------</p>
                <p className="event-categorys">-------</p>
                <p className="event-categorys">-------</p>
            </div>
        )
    }
    render () {
        // console.log(this.props.users)
        // console.log(this.props.selected)
        // console.log(this.data)
        return (
            <div className="data-container">
                {this.props.users.map(x =>
                    (<div className={"event-cards " + (x.login == this.props.selected ? "active" : "")} login={x.login} key={x.login}>
                    
                        {x.data.activity == undefined ? this.rendUndef : (x.data.activity[0] == null) ? this.rendUndef() : (
                            x.data.activity.map(a => 
                                (<div className={"event-card " + (this.findStatusName(a.StatusId) !== 'Завершена' ? 'updating' : {})} key={a.Id}>
                                    <p className="event-name">{a.Title}</p>
                                    <p className="event-status">{this.findStatusName(a.StatusId)}</p>
                                    <p className="event-created">Создана: {(new Date(Number(a.CreatedOn.substring(6,19)) + (new Date().getTimezoneOffset()) * 60 * 1000).toString())}</p>
                                    <p className="event-modifyed">Последнее изменение: {(new Date(Number(a.ModifiedOn.substring(6,19)) + (new Date().getTimezoneOffset()) * 60 * 1000).toTimeString()).substring(0,5)}</p>
                                    <p className="event-simptoms">{a.TsiSymptoms}</p>
                                    <p className="event-adress">{a.TsiAddress}</p>
                                    <p className="event-info">{a.TsiDescription}</p>
                                    <p className="event-categorys">{this.findTsiResName(a.TsiResCategoryId)}</p>
                                    <p className="event-categorys">{this.findTsiTaskName(a.TsiTaskCategoryId)}</p>
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