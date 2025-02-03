import { useLocation } from "react-router-dom";

const NotFound = () => {
  const {pathname} = useLocation();

  return (
    <div>
      <h1>Pagina niet gevonden</h1>
      <p>Er is geen pagina op deze url {pathname}, probeer iets anders.</p>
    </div>
  );
};

export default NotFound;
