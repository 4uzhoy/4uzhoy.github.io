const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');



const PORT = 8080;

const APP_ID = 
const APP_CERTIFICATE = 

const app = express();

const nocache = (req, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

const generateAccessToken = (req, resp) => {
    resp.header('Access-Control-Allow-Origin', '*');
    const channelName = req.query.channelName;
    if (!channelName) {
        return resp.status(500).json({ 'error': 'channel is required' });


    }
    let uid = req.query.uid;
    if (!uid || uid == '') {
        uid = 0;
    }
    let role = RtcRole.SUBSCRIBER;
    if (req.query.role == 'publisher') {
        role = RtcRole.PUBLISHER;
    }
    let expireTime = req.query.expireTime;
    if (!expireTime || expireTime == '') {
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime, 10);
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime)
    return resp.json({'token':token});

}

app.get('/access_token', nocache, generateAccessToken);

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})