// NFDRecordInAddress
interface NFD {
  [key: string]: {
    appID: number;
    state: string;
    expired: boolean;
    timeChanged: string;
    depositAccount: string;
    name: string;
    owner: string;
    properties: {
      userDefined?: {
        avatar?: string;
      };
      verified?: {
        avatar?: string;
      };
    };
    caAlgo: string[];
  };
}

export async function lookUpNFDAddress(address: string): Promise<NFD | null> {
  // TODO: fetch multiple NFDs, up to 20, in one query
  const url = `https://api.nf.domains/nfd/lookup?address=${address}&view=thumbnail`;
  const response = await fetch(url);
  
  if (response.status === 200) {
    return await response.json();
  }

  return null;
}

// Get the Avatar image
export async function fetchNFDAvatar(nfd: NFD) {
  // TODO: fetch multiple NFDs, up to 20, in one query
  const data = nfd[Object.keys(nfd)[0]];

    if (data.properties?.userDefined?.avatar && data.properties.userDefined.avatar.includes("http")) {
      return data.properties.userDefined.avatar;
    }
    
    // IPFS-hosted Avatar
    if (data.properties?.verified?.avatar && data.properties.verified.avatar.includes("ipfs")) {
      const ipfsURL = data.properties.verified.avatar;
      return await checkARC3(ipfsURL);
    }

  return null;
}

// An ARC3 NFD is a JSON object hosted on IPFS with an 
// "image" property we extract out in a secondary step.
// An NFD avatar could also staright up just be the image itself
async function checkARC3(avatarIPFS: string): Promise<string | null> {
  const URL = `https://ipfs.algonode.xyz/ipfs/${avatarIPFS.split("://")[1]}`;
  const response = await fetch(URL);

  if (response.status === 200) {
    const contentType = response.headers.get('content-type');
    
    // IF the content type is JSON, then it's an ARC3 NFD
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      // ARC3 JSON object with data.image set
      if (data.image && data.image.includes("ipfs")) {
        return `https://ipfs.algonode.xyz/ipfs/${data.image.split("://")[1]}`;
      }
    } 
    // IF the content type is an image, then it's the avatar itself
    else if (contentType && contentType.includes('image')) {
      return URL;
    }
  }

  return null;
}