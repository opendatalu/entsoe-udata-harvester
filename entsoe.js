import { fetchThrottle } from './utils.js'
import dotenv from 'dotenv'
import { HttpsProxyAgent } from 'https-proxy-agent'
import ProxyFromEnv from 'proxy-from-env'

dotenv.config()

let proxyAgent = null
if (process.env.https_proxy !== undefined) {
  proxyAgent = new HttpsProxyAgent(process.env.https_proxy)
}


const countries = {
    'lu': '10YLU-CEGEDEL-NQ',
    'be': '10YBE----------2',
    'de': '10Y1001A1001A83F'
}

const biddingZones = {
    'de-lu': '10Y1001A1001A82H'
}


async function getXMLFromEntsoe(params) {
    const queryParams = {
        "headers": {
            "Accept": "text/xml"
        },
        "method": "GET"
    }
    if (proxyAgent !== null && ProxyFromEnv.getProxyForUrl(process.env.entsoeURL)) {
        queryParams.agent = proxyAgent
    }


    try {
        const res = await fetchThrottle(`${process.env.entsoeURL}?securityToken=${process.env.entsoeAPIKey}&${params}`, queryParams)
        // if there is an error in a request, the API will answer 4xx in most cases (when no data is found 200 is given)
        if (!res.ok) {
            res.text().then(t => { throw t})
        }
        return res.text()
    } catch (e) {
        console.error(e)
        return {}
    }
}

export { countries, biddingZones, getXMLFromEntsoe }
