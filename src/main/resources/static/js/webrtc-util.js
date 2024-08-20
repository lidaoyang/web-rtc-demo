//端点对象
let rtcPeerConnection;

let localVideo = document.getElementById('localVideo');
let remoteVideo = document.getElementById('remoteVideo');

//本地视频流
let localMediaStream = null;

//ice服务器信息, 用于创建 SDP 对象
let iceServers = {
    "iceServers": [
        {"urls": "stun:stun.l.google.com:19302"},
        // {"urls": ["stun:159.75.239.36:3478"]},
        // {"urls": ["turn:159.75.239.36:3478"], "username": "chr", "credential": "123456"},
    ]
};

/**
 * 本地音频信息, 用于打开本地音频流
 */
const mediaConstraints = {
    audio: {
        echoCancellation: true, // 开启回声消除
        noiseSuppression: true, // 开启噪声抑制
        autoGainControl: true, // 开启自动增益控制
    }
};

/**
 * 音视频约束对象, 用于打开本地音视频流
 * @type {{video: bigint, audio: {echoCancellation: boolean, autoGainControl: boolean, noiseSuppression: boolean}}}
 */
const mediaConstraintsAll = {
    video: true,
    audio: {
        echoCancellation: true, // 开启回声消除
        noiseSuppression: true, // 开启噪声抑制
        autoGainControl: true, // 开启自动增益控制
    }
};


/**
 * 1、打开本地音视频流
 * @param type
 * @param callback
 */
const openLocalMedia = (type, callback) => {
    console.log('打开本地视频流,type:', type);
    let constraints = type === 'audio' ? mediaConstraints : mediaConstraintsAll;
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            localMediaStream = stream;
            //将 音视频流 添加到 端点 中
            for (const track of localMediaStream.getTracks()) {
                rtcPeerConnection.addTrack(track, localMediaStream);
            }
            callback(localMediaStream);
        })
}
/**
 * 2、创建 PeerConnection 对象
 */
const createPeerConnection = () => {
    console.log('创建 PeerConnection 对象');
    rtcPeerConnection = new RTCPeerConnection(iceServers);
}

/**
 * 创建 offer 的配置对象
 * @type {{iceRestart: boolean, offerToReceiveAudio: boolean}}
 */
const offerOptions = {
    iceRestart: true,
    offerToReceiveAudio: true, //如果没有麦克风，当请求音频，会报错，不过不会影响视频流播放
};

/**
 * 3、创建用于 offer 的 SDP 对象
 * @param callback
 */
const createOffer = (callback) => {
    // 调用PeerConnection的 CreateOffer 方法创建一个用于 offer的SDP对象，SDP对象中保存当前音视频的相关参数。
    rtcPeerConnection.createOffer(offerOptions)
        .then(desc => {
            // 保存自己的 SDP 对象
            rtcPeerConnection.setLocalDescription(desc)
                .then(() => callback(desc));
        })
        .catch(() => console.log('createOffer 失败'));
}
/**
 * 4、创建用于 answer 的 SDP 对象
 * @param callback
 */
const createAnswer = (callback) => {
    // 调用PeerConnection的 CreateAnswer 方法创建一个 answer的SDP对象
    rtcPeerConnection.createAnswer(offerOptions)
        .then(desc => {
            // 保存自己的 SDP 对象
            rtcPeerConnection.setLocalDescription(desc)
                .then(() => callback(desc));
        })
        .catch(() => console.log('createAnswer 失败'))
}

/**
 * 5、保存远程的 SDP 对象
 * @param desc 创建offer或answer产生session描述对象,(包含字段 type,sdp)
 * @param callback
 */
const saveSdp = (desc, callback) => {
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(desc))
        .then(callback);
}

/**
 * 6、保存 candidate 信息
 * @param candidate
 */
const saveIceCandidate = (candidate) => {
    let iceCandidate = new RTCIceCandidate(candidate);
    console.log('addIceCandidate');
    rtcPeerConnection.addIceCandidate(iceCandidate)
        .then(() => console.log('addIceCandidate 成功'));
}

/**
 * 7、收集 candidate 的回调
 * @param callback
 */
const bindOnIceCandidate = (callback) => {
    console.log('绑定 收集 candidate 的回调');
    // 绑定 收集 candidate 的回调
    rtcPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            callback(event.candidate);
        }
    };
};

/**
 * 8、获得 远程视频流 的回调
 * @param callback
 */
const bindOnTrack = (callback) => {
    console.log('绑定 获得 远程视频流 的回调');
    rtcPeerConnection.ontrack = (event) => callback(event.streams[0]);
};

const hangup = (callback) => {
    if (remoteVideo.srcObject){
        console.log('通知对方关闭视频流');
        // 执行回调,发送挂断信息通知对方
        callback();
    }
    console.log('关闭视频流');
    // 关闭视频流
    stopTracks(localVideo);
    stopTracks(remoteVideo);

    console.log('关闭 PeerConnection');
    if (rtcPeerConnection) {
        rtcPeerConnection.ontrack = null;
        rtcPeerConnection.onremovetrack = null;
        rtcPeerConnection.onremovestream = null;
        rtcPeerConnection.onicecandidate = null;
        rtcPeerConnection.oniceconnectionstatechange = null;
        rtcPeerConnection.onsignalingstatechange = null;
        rtcPeerConnection.onicegatheringstatechange = null;
        rtcPeerConnection.onnegotiationneeded = null;

        rtcPeerConnection.close();
        rtcPeerConnection = null;
    }
}

function stopTracks(videoDom) {
    let stream = videoDom.srcObject;
    if (!stream) {
        return;
    }
    stream.getTracks().forEach(track => {
        track.stop();
        stream.removeTrack(track);
    });
    videoDom.srcObject = null;
}
