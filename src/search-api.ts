import { z } from "zod";
import { listResultSchema } from "./list-repositories-api";

export type SearchQuery = Readonly<{
  query: string;
  contextLines: number;
  files: number;
  matchesPerShard: number;
  totalMatches: number;
}>;

export type SearchResponse =
  | {
      kind: "success";
      results: SearchResults;
    }
  | {
      kind: "error";
      error: string;
    };

export const search = async (
  { query, contextLines, files, matchesPerShard, totalMatches }: SearchQuery,
  abortSignal: AbortSignal
): Promise<SearchResponse> => {

  const response = await fetch("/api/v2/search", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      q: query,
      SearchOpts: {
        ChunkMatches: true,
        NumContextLines: contextLines,
        MaxDocDisplayCount: files,
        ShardMaxMatchCount: matchesPerShard,
        TotalMaxMatchCount: totalMatches,
        IncludeRepoURLsAndLineFragments: false,
      },
    }),
    signal: abortSignal,
  });

  if (!response.ok) {
    if (response.status === 400) {
      const { Error: error } = await response.json();
      return { kind: "error", error };
    } else {
      const responseBody = await response.text();
      return {
        kind: "error",
        error: `Search failed, HTTP ${response.status}: ${
          response.statusText
        } ${responseBody ? ` - ${responseBody}` : ""}
        `,
      };
    }
  }

  return {
    kind: "success",
    results: searchResultSchemaV2.parse(await response.json()),
  };
};

// All of the properties of the returned JSON are uppercased. Hail Golang. We
// laboriously instruct zod to transform them all to lowercase, picking better
// names for some of them along the way.
const locationSchema = z
  .object({
    ByteOffset: z.number(),
    LineNumber: z.number(),
    Column: z.number(),
  })
  .transform(({ ByteOffset, LineNumber, Column }) => ({
    byteOffset: ByteOffset,
    lineNumber: LineNumber,
    column: Column,
  }));


const normalResultSchema = z.object({
      Duration: z.number(),
      FileCount: z.number(),
      MatchCount: z.number(),
      FilesSkipped: z.number(),
      Files: z
        .array(
          z
            .object({
              Repository: z.string(),
              FileName: z.string(),
              Branches: z.array(z.string()),
              Language: z.string(),
              Version: z.string(),
              ChunkMatches: z.array(
                z
                  .object({
                    Content: z.string(),
                    ContentStart: locationSchema,
                    FileName: z.boolean(),
                    Ranges: z.array(
                      z
                        .object({ Start: locationSchema, End: locationSchema })
                        .transform(({ Start, End }) => ({
                          start: Start,
                          end: End,
                        }))
                    ),
                  })
                  .transform(({ Content, ContentStart, FileName, Ranges }) => ({
                    contentBase64: Content,
                    contentStart: ContentStart,
                    isFileNameChunk: FileName,
                    matchRanges: Ranges,
                  }))
              ),
            })
            .transform(
              ({
                Repository,
                FileName,
                Branches,
                Language,
                Version,
                ChunkMatches,
              }) => ({
                repository: Repository,
                fileName: FileName,
                branches: Branches,
                language: Language,
                version: Version,
                chunks: ChunkMatches,
              })
            )
        )
        .nullable()
        .transform((val) => val ?? []),
    })
    .transform(
      ({
        Duration,
        FileCount,
        MatchCount,
        FilesSkipped,
        Files,
      }) => ({
        duration: Duration,
        fileCount: FileCount,
        matchCount: MatchCount,
        filesSkipped: FilesSkipped,
        files: Files,
      })
    );

  const searchResultSchemaV2 = z.object({
    Results: normalResultSchema,
    RepoResults: listResultSchema,
    SearchType: z.enum(["default", "repo_only", "filename_only"])
  })

export type SearchResults = z.infer<typeof searchResultSchemaV2>;
export type ResultFile = SearchResults["Results"]["files"][number];
export type Chunks = ResultFile["chunks"][number];
export type MatchRange = Chunks["matchRanges"][number];
export type ContentLocation = z.infer<typeof locationSchema>;
