const fetchFromApi = ({ path, method, body }: { path: string; method: string; body?: object }) =>
  fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(response => response.json())
    .catch(error => console.error("Error:", error));

export const addToIPFS = (yourJSON: object) => fetchFromApi({ path: "/api/ipfs/add", method: "Post", body: yourJSON });

export const saveNFTToDB = async (data: any) => {
  try {
    const response = await fetch('/api/nft/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to save NFT data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving NFT data:', error);
    throw error;
  }
};

export const uploadFileToIPFS = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const pinataAPIKEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const pinataAPISECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
  console.log("pinataAPIKEY", pinataAPIKEY);
  console.log("pinataAPISECRET", pinataAPISECRET);
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  try {
    // 构建 headers，确保 API key 和 secret 不为 undefined
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    if (pinataAPIKEY) {
      headers['pinata_api_key'] = pinataAPIKEY;
    }

    if (pinataAPISECRET) {
      headers['pinata_secret_api_key'] = pinataAPISECRET;
    }
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers,  // 使用已经构建好的 headers
      body: formData,
    });
    console.log("response", response);

    if (!response.ok) {
      throw new Error("Failed to upload file to IPFS");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw error;
  }
};


// export const getMetadataFromIPFS = (ipfsHash: string) =>
//   fetchFromApi({ path: "/api/ipfs/get-metadata", method: "Post", body: { ipfsHash } });

export const getMetadataFromIPFS = async (tokenURI: string) => {
  try {
    const response = await fetch(tokenURI);
    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from pinta:", error);
    throw error;
  }
}

export const collectNFT = async (data: any) => {
  try {
    const response = await fetch('/api/nft/collect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to collect NFT');
    }

    return await response.json();
  } catch (error) {
    console.error('Error collecting NFT:', error);
    throw error;
  }
};

export const reportNFT = async (data: any) => {
  try {
    const response = await fetch('/api/nft/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to report NFT');
    }

    return await response.json();
  } catch (error) {
    console.error('Error reporting NFT:', error);
    throw error;
  }
};

// 保存gas记录
export const saveGasRecord = async (data: {
  tx_hash: string;
  method_name: string;
  gas_used: bigint;
  gas_price: bigint;
  total_cost: bigint;
  user_address: string;
  block_number: bigint;
  created_at?: string;
  status?: string;
}) => {
  try {
    // 格式化日期时间为MySQL可接受的格式 (UTC+8)
    const date = new Date();
    date.setHours(date.getHours() + 8);
    const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');

    const response = await fetch('/api/gas/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        created_at: formattedDate,
        // 将 bigint 转换为字符串
        gas_used: data.gas_used.toString(),
        gas_price: data.gas_price.toString(),
        total_cost: data.total_cost.toString(),
        block_number: data.block_number.toString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save gas record');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving gas record:', error);
    throw error;
  }
};

// 获取gas记录
export const getGasRecords = async (params?: {
  method_name?: string;
  user_address?: string;
}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.method_name) {
      searchParams.append('method_name', params.method_name);
    }
    if (params?.user_address) {
      searchParams.append('user_address', params.user_address);
    }

    const response = await fetch(`/api/gas/save?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch gas records');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching gas records:', error);
    throw error;
  }
};
  
