
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

    render() {
        return (
            <div className="buttons">
                <button className={"start-button " + (this.state.started ? 'active' : '')} disabled={this.state.started} onClick={this.startLoop}></button>
                <button className={"stop-button " + (!this.state.started ? 'active' : '')} disabled={!this.state.started} onClick={this.stopLoop}></button>
                <button className="process-button" onClick={this.forceProcess}></button>
                <button className="update-button" onClick={this.forceUpdate}></button>
            </div>
        )
    }
}