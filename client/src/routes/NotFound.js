const NotFound = () => {
    return ( 
        <div style={{
            display:"grid",
            placeItems:"center",
            height:'100%'
        }} className="not-found">
            <h1>Ooops! an error occurred with a status of </h1>
            <h2>404</h2><br/><br/>
            <h3>page not found</h3>
        </div>
     );
}
 
export default NotFound;