
class Control_buttons extends React.Component {
    constructor(props) {
        super(props);
        this.startLoop = this.startLoop.bind(this);
        this.stopLoop = this.stopLoop.bind(this);
        this.state = { started: el.remote.getGlobal('sharedObject').getLoopStatus.started };
    }

    startLoop() {
        ipcRenderer.send('loop-start', { msg: 'hello from renderer' })
        this.setState({ started: true });
    }

    stopLoop() {
        ipcRenderer.send('loop-stop', { msg: 'hello from renderer' })
        this.setState({ started: false });
    }

    forceProcess() {
        ipcRenderer.send('processNow', { msg: 'hello from renderer' })
    }

    forceUpdate() {
        ipcRenderer.send('updateNow', { msg: 'hello from renderer' })
    }
    loadUsers(){
        ipcRenderer.send('loadUsers', { msg: 'hello from renderer' })
    }
    saveUsers(){
        ipcRenderer.send('saveUsers', { msg: 'hello from renderer' })
    }


    render() {
        return (
            <div className="buttons">
                <button title="start loop" className={"start-button " + (this.state.started ? 'active' : '')} disabled={this.state.started} onClick={this.startLoop}></button>
                <button title="stop loop" className={"stop-button " + (!this.state.started ? 'active' : '')} disabled={!this.state.started} onClick={this.stopLoop}></button>
                <button title="process now" className="process-button" onClick={this.forceProcess}></button>
                <button title="update data" className="update-button" onClick={this.forceUpdate}></button>
                <p className={"status " + (this.state.started ? 'start' : '')}>{(this.state.started ? 'workin' : 'nothin')}</p>
                <button title="Save users to file" className="saveUsers-button" onClick={this.saveUsers}></button>
                <button title="Load users from file" className="loadUsers-button" onClick={this.loadUsers}></button>
            </div>
        )
    }
}