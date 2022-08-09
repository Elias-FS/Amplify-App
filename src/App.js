import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react'

function App({ signOut, user }) {
  return (
    <div className="App">
      {user.attributes.email}
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default withAuthenticator(App, {socialProviders: ['apple','google']});