#!/bin/bash


node ./cli.js get --filter "year=1987..2012&type=album" \
    --atomic-parsley /Users/rungsikorn/Repositories/freyr-js/bins/AtomicParsley \
    --sources "yt_music,!youtube" --config ./conf.json $@

# node ./cli.js get --filter "type=album" \
#     --atomic-parsley /Users/rungsikorn/Repositories/freyr-js/bins/AtomicParsley \
#     --sources "yt_music,!youtube" --config ./conf.json $@


# console.log(document.querySelectorAll("div[aria-label=Albums] div[data-testid=product-lockup]").entries().toArray().map(node => ({
#     link: node[1].querySelector('a[data-testid=product-lockup-link]').href,
#     year: node[1].querySelector('span[data-testid=product-lockup-subtitle]').innerHTML,
#     album: node[1].querySelector('a[data-testid=product-lockup-link]').innerHTML,
# })).reduce((curr, next) => curr += '# ' + next.year + ' ' + next.album + '\n' + next.link + "\n", ''))