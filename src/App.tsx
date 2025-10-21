import "./App.css";
import PostCreator from "./component/PostCreator";
import { SavedConfigsProvider } from "./context/SavedConfigsContext";

function App() {
  return (
    <SavedConfigsProvider>
      <PostCreator />
    </SavedConfigsProvider>
  );
}

export default App;
