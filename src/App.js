import './App.css';

import Amplify from 'aws-amplify';
import { withAuthenticator, AmplifySignOut  } from '@aws-amplify/ui-react-v1'
import '@aws-amplify/ui-react/styles.css'

import awsExports from './Configuration';
Amplify.configure(awsExports);

function App() {
  return (
    <div className="App">
      <header>
        <h1>We now have Auth!</h1>
      </header>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);