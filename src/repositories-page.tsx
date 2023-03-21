import { memo } from "react";
import prettyBytes from "pretty-bytes";
import type {
  ListResults,
  Repository as ApiRepository,
} from "./list-repositories-api";
import { Link } from "./nav";


// eslint-disable-next-line prefer-arrow-callback
const RepositoriesList = memo(function RepositoriesList({
  results,
}: {
  results: ListResults;
}) {
  const {
    stats: { fileCount, indexBytes, contentBytes },
    repositories,
  } = results;
  const sorted = Array.from(repositories)
    .sort(({ name: a }, { name: b }) => a.localeCompare(b))
    .sort(({ id: a }, { id: b }) => a - b)
    .sort(({ rank: a }, { rank: b }) => a - b);
  return (
    <>
      <h1 className="text-xs py-1">
        {repositories.length}{" "}
        {repositories.length === 1 ? "repository" : "repositories"} containing{" "}
        {fileCount} files consuming{" "}
        {prettyBytes(indexBytes + contentBytes, { space: false })} of RAM
      </h1>
      <div className="overflow-x-auto">
        <table className="border-collapse text-sm w-full text-center">
          <thead>
            <tr className="border bg-slate-100">
              <th className="p-1">Repository</th>
              <th className="p-1">File count</th>
              <th className="p-1">Branches</th>
              <th className="p-1">Content size in RAM</th>
              <th className="p-1">Index size in RAM</th>
              <th className="p-1">Last indexed</th>
              <th className="p-1">Last commit</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((repo) => (
              <Repository key={repo.name} repository={repo} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

const Repository = ({
  repository: {
    name,
    url,
    lastIndexed,
    lastCommit,
    branches,
    stats: { fileCount, indexBytes, contentBytes },
  },
}: {
  repository: ApiRepository;
}) => (
  <tr className="border">
    <td className="p-1">
      {url.length > 0 ? <Link to={url}>{name}</Link> : name}
    </td>
    <td className="p-1">{fileCount}</td>
    <td className="p-1">
      {branches
        .map(({ name: branchName, version }) => `${branchName}@${version}`)
        .join(" ")}
    </td>
    <td className="p-1">{prettyBytes(contentBytes, { space: false })}</td>
    <td className="p-1">{prettyBytes(indexBytes, { space: false })}</td>
    <td className="p-1">{toISOStringWithoutMs(lastIndexed)}</td>
    <td className="p-1">{toISOStringWithoutMs(lastCommit)}</td>
  </tr>
);

// Trying to make these strings less obnoxiously long.
const toISOStringWithoutMs = (d: Date) =>
  d.toISOString().replace(/\.\d{3}Z$/, "Z");

export { RepositoriesList }