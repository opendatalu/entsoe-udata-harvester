
import { formatWithOptions, subDays, addDays, startOfDay} from 'date-fns/fp'
import { enGB } from 'date-fns/locale'
import { countries, biddingZones, getXMLFromEntsoe } from './entsoe.js'
import { uploadXML, updateResource } from './odp.js'


const dsIds = {
    'total-load': '6284f27a82fb124fc6f2ad00',
    'actual-generation': '6284fa0782fb124fc6f2ad01', 
    'xborder-flows': '6285fca8923a137f86e0b926',
    'day-ahead-prices': '62860455369eeb2667db8bad'
}

const now = new Date()
// dates for most of the files
const start = subDays(1, startOfDay(now)).toISOString().replace(/:[^:]*$/, '').replace(/[-T:]/g, '')
const dateFilename = formatWithOptions({}, 'yyyyMMdd', subDays(1, startOfDay(now)))
const dateText = formatWithOptions({locale: enGB }, 'd MMMM yyyy', subDays(1, startOfDay(now)))
const end = startOfDay(now).toISOString().replace(/:[^:]*$/, '').replace(/[-T:]/g, '')
const dateParams = `periodStart=${start}&periodEnd=${end}`  

// dates for day-ahead prices
const dstart =  startOfDay(now).toISOString().replace(/:[^:]*$/, '').replace(/[-T:]/g, '')
const ddateFilename = formatWithOptions({}, 'yyyyMMdd', startOfDay(now))
const ddateText = formatWithOptions({locale: enGB }, 'd MMMM yyyy', startOfDay(now))
const dend = addDays(1, startOfDay(now)).toISOString().replace(/:[^:]*$/, '').replace(/[-T:]/g, '')
const ddateParams = `periodStart=${dstart}&periodEnd=${dend}`  


// Load -> Total Load – Day Ahead / Actual -> Country -> LU -> Actual Total Load / 6.1.A
async function getTotalLoad() {
    return getXMLFromEntsoe(`documentType=A65&processType=A16&outBiddingZone_Domain=${countries['lu']}&${dateParams}`)
}

// Generation -> Actual Generation per Production Type -> Country -> LU / 16.1.B&C
async function getActualGeneration() {
    return getXMLFromEntsoe(`documentType=A75&processType=A16&in_Domain=${countries['lu']}&${dateParams}`)
}

// Transmission -> Cross-Border Physical Flows -> Border-Country -> LU-BE, BE-LU & LU-DE, DE-LU / 12.1.G / CC-BY
async function getCrossBorderFlow(from, to) {
    return getXMLFromEntsoe(`documentType=A11&in_Domain=${countries[to]}&out_Domain=${countries[from]}&${dateParams}`)
}

// Transmission -> Day-ahead Prices -> Bidding Zone -> BZN DE-LU / 12.1.D
async function getDayAheadPrices() {
    return getXMLFromEntsoe(`documentType=A44&in_Domain=${biddingZones['de-lu']}&out_Domain=${biddingZones['de-lu']}&${ddateParams}`)
} 

async function main() {
    console.log((new Date()).toLocaleString(), 'Syncing starts...')
    const load = await getTotalLoad()
    const resLoad = await uploadXML(`total-load-${dateFilename}.xml`, load, dsIds['total-load'])
    await updateResource(dsIds['total-load'], resLoad.id, `Total load - ${dateText}`, '')
    const actualGeneration = await getActualGeneration()
    const resGen = await uploadXML(`actual-generation-${dateFilename}.xml`, actualGeneration, dsIds['actual-generation'])
    await updateResource(dsIds['actual-generation'], resGen.id, `Actual Generation per Production Type - ${dateText}`, '')

    const crossBorderFlowLUBE = await getCrossBorderFlow('lu', 'be')
    const crossBorderFlowBELU = await getCrossBorderFlow('be', 'lu')
    const crossBorderFlowLUDE = await getCrossBorderFlow('lu', 'de')
    const crossBorderFlowDELU = await getCrossBorderFlow('de' ,'lu')

    const lube = await uploadXML(`cross-border-flow-lu-be-${dateFilename}.xml`, crossBorderFlowLUBE, dsIds['xborder-flows'])
    await updateResource(dsIds['xborder-flows'], lube.id, `Luxembourg > Belgium - ${dateText}`, '')
    const lude = await uploadXML(`cross-border-flow-lu-de-${dateFilename}.xml`, crossBorderFlowLUDE, dsIds['xborder-flows'])
    await updateResource(dsIds['xborder-flows'], lude.id, `Luxembourg > Germany - ${dateText}`, '')    
    const belu = await uploadXML(`cross-border-flow-be-lu-${dateFilename}.xml`, crossBorderFlowBELU, dsIds['xborder-flows'])
    await updateResource(dsIds['xborder-flows'], belu.id, `Belgium > Luxembourg - ${dateText}`, '')
    const delu = await uploadXML(`cross-border-flow-de-lu-${dateFilename}.xml`, crossBorderFlowDELU, dsIds['xborder-flows'])
    await updateResource(dsIds['xborder-flows'], delu.id, `Germany > Luxembourg - ${dateText}`, '')

    const dayAheadPrices = await getDayAheadPrices()
    const resPrices = await uploadXML(`day-ahead-prices-${ddateFilename}.xml`, dayAheadPrices, dsIds['day-ahead-prices'])
    await updateResource(dsIds['day-ahead-prices'], resPrices.id, `Day-ahead prices - ${ddateText}`, '')    

}

main().then(() => {console.log((new Date()).toLocaleString(), 'Sync successful')}).catch(e => {console.error(e)})
