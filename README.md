# neogrok

Neogrok is a frontend for [zoekt](https://github.com/sourcegraph/zoekt), a fast
and scalable code search engine. Neogrok exposes zoekt's search APIs in the form
of a modern, snappy UI. This fork contains minor differences, notably livegrep
backwards compatibility, rather than OpenGrok.

## livegrep compatibility

To aid in a transition from livegrep to Zoekt, a few of the UI routes from my
fork of livegrep [xvandish-livegrep](https://github.com/xvandish/livegrep) have
compatibility redirects or notices, namely the `/search` `/view`, `/delve` and
`/experimental` routes, which were used to provide search and fileview
functionailty. Fileviewing is now just handed off to GitHub, and search brings
up a page with some hints and links to rewritten Zoekt queries.
