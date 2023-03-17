import { useEffect } from "react";

const LivegrepFileviewerRedirectPage = () => {
  useEffect(() => {
    document.title = "fileviewer redirect";
  });

  var experimentalFileviewReg = /\/experimental\/(.*)\/\+\/(.*):(.*)/;
  var delveFileviewReg = /\/delve\/(.*)\/(blob|tree)\/(\w*)\/(.*)/;
  var viewFileviewReg = /\/view\/([^\/]*)\/([^\/]*)\/(.*)/;

  const getExternalUrl = () :string => {
    const currPath = window.location.pathname; 
    var externalUrl = "https://github.com/";

    if (currPath.startsWith("/view")) {
      var matches = currPath.match(viewFileviewReg);
      if (!matches || matches.length != 4) return "";
      externalUrl = `${externalUrl}${matches[1]}/${matches[2]}/${matches[3]}`;
    } else if (currPath.startsWith("/delve")) {
      var matches = currPath.match(delveFileviewReg); 
      if (!matches || matches.length != 5) return "";
      externalUrl = `${externalUrl}${matches[1]}/${matches[2]}/${matches[3]}/${matches[4]}`;
    } else if (currPath.startsWith("/experimental")) {
      var matches = currPath.match(experimentalFileviewReg);
      if (!matches || matches.length != 4) return "";
      externalUrl = `${externalUrl}${matches[1]}/blob/${matches[2]}/${matches[3]}`;
    }

    // append the hash which should contain the line range
    externalUrl += window.location.hash; 

    return externalUrl;
  }

  const externalUrl = getExternalUrl();

  return (
    <div>
      <p>Hello, this is a livegrep fileviewer URL. During the transition to Zoekt, and for a
      yet undertermined time after, Zoekt will have no fileviewer, so all fileviewer URL's will
      be passed of to GitHub. Please click the link below to view this URL in GitHub.
      </p>
      <br />
      <br />
      {externalUrl === "" ? 
        <p>We failed to transform the URL. Please attempt to do it manually.</p>
      : <a className="text-cyan-700 hover:underline decoration-1" href={externalUrl}>{externalUrl}</a>
      }
    </div>
  );
};

export { LivegrepFileviewerRedirectPage as Component };
