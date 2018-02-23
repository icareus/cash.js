### USAGE ###

Prerequisites :
If you intend to use scripts/ you'll need a .env file.
Use your common sense to figure out what's needed or edit the scripts.
```
# Binance stuff
APIKEY=
APISECRET=

# For Docker mounting stuff
LOG_DIR=
```

Build :
```
docker build . -t ubarbaxor/cash.js
```

Run :
```
docker run \
  -e APIKEY=YOUR_API_KEY \
  -e APISECRET=YOUR_API_SECRET \
  ubarbaxor/cash.js
```

Utilities :
`scripts/`: Quick build / run with dev settings (bash scripts, adapt at will)
`src/store/`: Redux store stuff for caching & reading the market (not much)

⚠️ For more advanced usage, read the code bottom-up ⚠️
