import axios from 'redaxios'

let tokenData
let jwt
let curatedAssets

const apiEndPoint = process.env.VUE_APP_API_ENDPOINT
const apiKey = process.env.VUE_APP_XAPP_KEY

const accessToken = () => {
    if(jwt) return jwt
    else {
        jwt = tokenData.token
        return jwt
    }
}

const headers = (getJWT) => {
    if(getJWT) return { headers: { 'x-api-key': apiKey } }
    else return { headers: { Authorization: accessToken(), 'x-api-key': apiKey } }
}

const getTokenData = async (ott) => {
    if(!tokenData) {
        try {
            const res = await axios.get(`${apiEndPoint}/xapp/ott/${ott}`, headers(true))
            tokenData = res.data
            jwt = res.data.token
            return tokenData
        } catch(e) {
            throw 'Error getting Token Data'
        }
    } else {
        return tokenData
    }    
}

const sendCommandtoXumm = (command) => {
    if (typeof window.ReactNativeWebView === 'undefined') throw new Error('This is not a react native webview')
    window.ReactNativeWebView.postMessage(JSON.stringify(command))
}

const openSignRequest = (uuid) => {
    try {
        sendCommandtoXumm({
            command: 'openSignRequest',
            uuid: uuid
        })
    } catch(e) {
        throw e
    }
}

const closeXapp = () => {
    try {
        sendCommandtoXumm({
            command: "close",
            refreshEvents: false
        })
    } catch(e) {
        throw e
    }
}

const openExternalBrowser = (url) => {
    try {
        sendCommandtoXumm({
            command: 'openBrowser',
            url: url
        })
    } catch(e) {
        throw e
    }
}

const openTxViewer = (tx, account) => {
    try {
        sendCommandtoXumm({
            command: 'txDetails',
            tx,
            account
        })
    } catch(e) {
        throw e
    }
}

const getCuratedAssets = async () => {
    if(curatedAssets && Object.keys(curatedAssets).length > 0 && curatedAssets.constructor === Object) return curatedAssets
    try {
        const res = await axios.get(`${apiEndPoint}/curated-assets`, headers())
        curatedAssets = res.data
        return curatedAssets
    } catch(e) {
        throw e
    }
}

const status = () => {
    return new Promise((resolve, reject) => {
        function message(event) {
            window.removeEventListener("message", message)
            document.removeEventListener("message", message)

            const data = JSON.parse(event.data)
            if(data.method !== 'payloadResolved') return reject('')
            if(data.reason === 'SIGNED') return resolve()
            else return reject('')
        }
        //iOS
        window.addEventListener('message', message)
        //Android
        document.addEventListener('message', message)
    })
}

const payload = async (payload) => {
    try {
        const res = await axios.post(`${apiEndPoint}/payload`, payload, headers())
        openSignRequest(res.data.uuid)
        await status()
        const result = await axios.get(`${apiEndPoint}/payload/${res.data.uuid}`, headers())
        return result
    } catch(e) {
        if (e === '') throw { msg: 'closed', error: false }
        throw e
    }
}

export default {
    getTokenData,
    closeXapp,
    signPayload: payload,
    getCuratedAssets,
    openExternalBrowser,
    openTxViewer
}

// export default {
//     install: (app, options) => {
//         const urlParams = new URLSearchParams(window.location.search)
//         const ott = urlParams.get('xAppToken')
//         const theme = urlParams.get('xAppStyle') || 'MOONLIGHT'

//         const themeStyles = {
//             '--var-white': '#FFFFFF',
//             '--var-black': '#000000',
//             '--var-blue': '#3052FF',
//             '--var-lightblue': '#F3F5FF',
//             '--var-orange': '#F8BF4C',
//             '--var-lightorange': '#FFFBF4',
//             '--var-green': '#3BDC96',
//             '--var-lightgreen': '#F3FDF9',
//             '--var-red': '#FF5B5B',
//             '--var-lightred': '#FFF5F5',

//             '--var-silver': '#ACB1C1',
//             '--var-lightgrey': '#f1f1f1',

//             '--var-txt-light': '#FFF',
//             '--var-txt-dark': '#000',

//             '--var-LIGHT': '#FFFFFF',
//             '--var-DARK': '#000000',
//             '--var-MOONLIGHT': '#181A21',
//             '--var-ROYAL': '#030B36',

//             '--red': '#fa4c50',
//             '--green': '#24ae64',

//             '--var-bg-color': `var(--var-${theme})`,
//             '--var-txt-color': theme === 'LIGHT' ? 'var(--var-txt-dark)' : 'var(--var-txt-light)',
//             '--var-primary': theme === 'LIGHT' ? 'var(--var-blue)' : 'var(--var-orange)',
//             '--var-secondary': theme === 'LIGHT' ? 'var(--var-silver)' : 'var(--var-black)',

//             '--var-border': theme === 'LIGHT' ? 'var(--var-silver)' : 'rgba(255, 255, 255, 0.26)',
//             '--var-backdrop': theme === 'LIGHT' ? '255, 255, 255' : '0, 0, 0',

//             'background-color': 'var(--var-bg-color)',
//             'color': 'var(--var-txt-color)'
//         }
//     }
// }