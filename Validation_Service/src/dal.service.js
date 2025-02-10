const fs = require('fs/promises');
const crypto = require('crypto');
const { default: axios } = require('axios');
const path = require('path');

function init() {
  console.log("init");
  // rpcBaseAddress = process.env.OTHENTIC_CLIENT_RPC_ADDRESS;
  // privateKey = process.env.PRIVATE_KEY_PERFORMER;
  lightHouseApiKey = process.env.LIGHTHOUSE_API_KEY;
  //client = new DisperserClient(EIGEN_ENDPOINT, grpc.credentials.createSsl());
}

async function downloadFromLighthouse(cid, targetPath) {
  try {
    const url = `https://gateway.lighthouse.storage/ipfs/${cid}`;
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer'
    });
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, response.data);
    return true;
  } catch (error) {
    console.error('Download error:', error);
    return false;
  }
}

async function verifySignature(content, signature, publicKey) {
  try {
    const verify = crypto.createVerify('SHA256')
    verify.update(content)
    verify.end()

    const bufferSignature = Buffer.from(signature, 'hex');
    return verify.verify(publicKey, bufferSignature);
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}

module.exports = {
  init,
  downloadFromLighthouse,
  verifySignature
}