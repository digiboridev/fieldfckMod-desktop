'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  log() {
    console.log('asdasd')
  }
  render() {
    if (this.state.liked) {
      setTimeout(() => {
        this.setState({ liked: false });
        this.log()
      }, 5000);
      console.log(loopStatus)
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

// const domContainer = document.querySelector('#like_button_container');
// ReactDOM.render(e(LikeButton), domContainer);
