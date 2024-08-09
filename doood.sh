#!/bin/bash
node ./cli.js get --filter "type=album,year=1980..2012" \
    --atomic-parsley /Users/rungsikorn/Repositories/freyr-js/bins/AtomicParsley \
    -f --sources "yt_music,!youtube" --config ./conf.json $@
