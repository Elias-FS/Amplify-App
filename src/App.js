import './App.css';
import '@aws-amplify/ui-react/styles.css'

import Amplify from 'aws-amplify';
import { withAuthenticator, AmplifySignOut  } from '@aws-amplify/ui-react-v1'
import awsExports from './aws-exports';
import CreateNote from './components/Formulario';

Amplify.configure(awsExports);

function App() {
  
  return (
    <div className="App">
      <AmplifySignOut />
      <CreateNote/>
    </div>
  );
}

export default withAuthenticator(App);