const LivegrepSearch = () => {


  return (
    <div>
      <p>Hello, this is a livegrep search URL. Since not all queries can be cleanly mapped to a zoekt
      query, I've instead opted for this help page that should help you through the process.
      </p>

      <ul className="list-disc">
        <li>given the query "x y", livegrep will search for it literally, while zoekt will
        search for documents containing both "x" and "y"</li>
        <li>regex searches should remain mostly the same, except that Zoekt includes the ability
        for multi-line matches</li>
        <li>for any non-regex query, simply surrounding it in quotes should give you the results
        livegrep would have given you</li>
      </ul>

      <div><span>TKTK: a nice redirect url here or something...</span></div>
    </div>
  );

}

export { LivegrepSearch as Component }
