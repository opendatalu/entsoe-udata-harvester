# entsoe-udata-harvester

an harvester for the [ENTSO-E transparency platform](https://transparency.entsoe.eu/).

This harvester will download the data for Luxembourg from the ENTSO-E transparency platform and update datasets on [data.public.lu](https://data.public.lu).

## Configuration

Copy the `.env-template` file into a file named `.env`. Adjust the following variales to your needs:

- odpURL: URL of the udata instance
- odpAPIKey: API key needed to access the udata API
- entsoeURL: URL of the ENTSO-E transparency platform API
- entsoeAPIKey: API of the ENTSO-E transparency platform (should be requested)
- callRateNrCalls: this setting and the following are related to rate limiting. This is the max number of calls per period. By default 1.
- callRateDuration: this setting defines the duration of the period for rate limiting in milliseconds. By default 1000ms.
- totalLoadId: ID of the dataset presenting the total load
- actualGenerationId: ID of the dataset presenting the actual generation
- xborderFlowsId: ID of the dataset presenting cross-border flows
- dayAheadPricesId: ID of the dataset presenting day ahead prices
- installedCapacityId: ID of the dataset presenting the installed capacity

## Run

You can launch the synchronization with the command `npm run main`. 
The script named `run-win.sh` launches the synchronization on Windows and creates a log file. Bash.exe is needed, it can be found in [git for Windows](https://git-scm.com/download/win). 

## License
This software is (c) [Information and press service](https://sip.gouvernement.lu/en.html) of the luxembourgish government and licensed under the MIT license.
