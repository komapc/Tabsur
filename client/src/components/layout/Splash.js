import React, {Component} from 'react';

import Logo from "../../resources/logo.png"
function LoadingMessage() {
  return (
    <div className="splash">
      <img src={Logo} alt="Logo" width="30%"/>
      <h2>
      Food sharing <br/>and social dining <br/>application
      </h2>
    </div>
  );
}

function withSplashScreen(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
      };
    }

    async componentDidMount() {
      try {
     //   await auth0Client.loadSession();
        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 1000)
      } catch (err) {
        console.log(err);
        this.setState({
          loading: false,
        });
      }
    }

    render() {
      if (this.state.loading) 
        return LoadingMessage();

      // otherwise, show the desired route
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withSplashScreen;