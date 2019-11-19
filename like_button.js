// 'use strict';

// const eE = React.createElement;

class LikeButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = { liked: false };
    }
  
    log() {
      console.log('asdasd')
    }
    render() {
      console.log(this.props.data)
      if (this.state.liked) {
        setTimeout(() => {
          this.setState({ liked: false });
          this.log()
        }, 5000);
        console.log(loopStatus)
        return 'You liked this.';
      }
  
      return <button onClick={() => this.setState({ liked: true })}>Like</button>;
      
      // return eE(
      //   'button',
      //   { onClick: () => this.setState({ liked: true }) },
      //   'Like'
      // );
    }
  }


